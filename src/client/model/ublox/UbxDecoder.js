import { EventEmitter } from 'events';
import { ClassIds, NavMessageIds } from './ClassIds';

const MAX_MSG_LEN = 8192;
const HEADER_BYTES = [181, 98];

export default class UbxDecoder extends EventEmitter {
    _nbyte = 0;
    _buffer = new ArrayBuffer(MAX_MSG_LEN);
    _uintBuffer = new Uint8Array(this._buffer);
    _length = 0;
    _allowedClasses = [];
    static _emits = {
        message: 'msg',
        checksumOk: 'checksumOk',
        navMsg: 'navMsg'
    };

    _payloadOffset = 6;

    inputData = data => {
        const buffer = this._uintBuffer;
        if (this._nbyte === 0) {
            this._length = 0;
            if (!this.syncHeader(data, buffer)) {
                return 0;
            } else {
                this._nbyte = 2;
                return 0;
            }
        }

        buffer[this._nbyte++] = data;

        if (this._nbyte === 6) {
            this._length = new Uint16Array(this._buffer, 4, 2)[0] + 8;
            if (this._length > MAX_MSG_LEN) {
                this._nbyte = 0;
                return 0;
            }
        }

        if (this._nbyte == this._length) {
            this._nbyte = 0;
            if (this.testChecksum(buffer, this._length)) {
                const res = this.decode(buffer, this._length);
                if (res) {
                    switch (res.classId) {
                        case ClassIds.NAV:
                            this.emit(UbxDecoder._emits.navMsg, res);
                            break;
                        default:
                            this.emit(UbxDecoder._emits.message, res);
                    }
                }
                return res;
            }
        }
    };

    get length() {
        return this._length;
    }

    static get emits() {
        return this._emits;
    }

    syncHeader = (data, buffer) => {
        buffer[0] = buffer[1];
        buffer[1] = data;

        return buffer[0] === HEADER_BYTES[0] && buffer[1] === HEADER_BYTES[1];
    };

    testChecksum = (buffer, length) => {
        const ck = new Uint8Array([0, 0]);
        const offset = 2;
        const len = length - 2;

        let i = offset;
        for (; i < len; i++) {
            ck[0] += buffer[i];
            ck[1] += ck[0];
        }
        return ck[0] === buffer[length - 2] && ck[1] === buffer[length - 1];
    };

    decode = (buffer, length) => {
        const classId = buffer[2];
        const msgId = buffer[3];
        //     const payload = buffer.subarray(6, length - 3);
        if (classId === ClassIds.NAV && msgId === NavMessageIds.POSLLH) {
            const payload = new Uint8Array(
                buffer.subarray(this._payloadOffset, length - 2)
            );
            return this.decodeNavPOSLLHMsg(payload, length - 8);
        } else {
            return null;
        }
    };

    decodeNavPOSLLHMsg = (payload, length) => {
        if (length < 28) {
            console.error(`Payload length < 28, length == ${length}`);
            return null;
        }

        //console.log(`Payload length == ${payload.length}`, { payload });

        const i4 = new Int32Array(payload.buffer);
        const u4 = new Uint32Array(payload.buffer);

        const iTOW = u4[0];
        const longitude = i4[1] / 10000000;
        const latitude = i4[2] / 10000000;
        const height = i4[3] / 1000;
        const heightMSL = i4[4] / 1000;
        const horizontalAcc = u4[5] / 1000;
        const verticalAcc = u4[6] / 1000;

        return {
            classId: ClassIds.NAV,
            msgId: NavMessageIds.POSLLH,
            iTOW,
            longitude,
            latitude,
            height,
            heightMSL,
            horizontalAcc,
            verticalAcc
        };
    };
}
