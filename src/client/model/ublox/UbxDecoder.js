import { EventEmitter } from 'events';
import { ClassIds, NavMessageIds } from './ClassIds';

const MAX_MSG_LEN = 8192;
const HEADER_BYTES = [181, 98];

export default class UbxDecoder extends EventEmitter {
    _nbyte = 0;
    _buffer = new ArrayBuffer(MAX_MSG_LEN);
    _length = 0;
    _allowedClasses = [];
    static _emits = {
        message: 'msg',
        checksumOk: 'checksumOk',
        navMsg: 'navMsg'
    };

    _payloadOffset = 6;

    inputData = data => {
        //console.log("input");
        const buffer = new Uint8Array(this._buffer);
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
            //const lenView = new DataView(this._buffer, 4, 2);
            //this._length = lenView.getUint16(0) + 8;

            this._length = new Uint16Array(this._buffer, 4, 2)[0] + 8;
            console.log(`Length = ${this._length}`);
            if (this._length > MAX_MSG_LEN) {
                this._nbyte = 0;
                return 0;
            }
        }

        if (this._nbyte == this._length) {
            console.log('Msg complite');
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
                console.log({res});
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
        //console.log("Start sync header", new Uint8Array(this._buffer, 0, 1)[0], buffer[0]);
        buffer[0] = buffer[1];
        buffer[1] = data;
        //console.log("",new Uint8Array(this._buffer, 0, 1)[0], buffer[0]);

        return buffer[0] === HEADER_BYTES[0] && buffer[1] === HEADER_BYTES[1];
    };

    testChecksum = (buffer, length) => {
        const ck = new Uint8Array([0,0]);
        const offset = 2;
        const len = length - 2;

        let i = offset;
        for (; i < len; i++) {
            ck[0] += buffer[i];
            ck[1] += ck[0];
        }
        //console.log('checksum', i, ck[0], buffer[length - 2], ck[1], buffer[length - 1]);
        return ck[0] === buffer[length - 2] && ck[1] === buffer[length - 1];
    };

    decode = (buffer, length) => {
        const classId = buffer[2];
        const msgId = buffer[3];
        //     const payload = buffer.subarray(6, length - 3);
        if (
            classId === ClassIds.NAV &&
            msgId === NavMessageIds.POSLLH
        ) {
            return this.decodeNavPOSLLHMsg(length - 8);
        } else {
            return null;
        }

        //     return {
        //         classId,
        //         msgId,
        //         payload
        //     };
    };

    decodeNavPOSLLHMsg = length => {
        if (length < 28) {
            console.error(`Payload length < 28, length == ${length}`);
            return null;
        }

        const payload = new DataView(this._buffer, 0,  length+8);

        return {
            classId: ClassIds.NAV,
            msgId: NavMessageIds.POSLLH,
            iTOW: payload.getUint32(6+0),
            longitude: payload.getInt32(6+4),
            latitude: payload.getInt32(6+8),
            height: payload.getInt32(6+12) / 1000,
            heightMSL: payload.getInt32(6+16) / 1000,
            horizontalAcc: payload.getUint32(6+20) / 1000,
            verticalAcc: payload.getUint32(6+24) / 1000,
        };
    };
}
