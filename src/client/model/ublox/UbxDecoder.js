import { EventEmitter } from 'events';
import { ClassIds, NavMessageIds, GNSSfixTypes } from './ClassIds';

const MAX_MSG_LEN = 8192;
const HEADER_BYTES = [181, 98];

const UBX_SYNCH_1 = 0xb5;
const UBX_SYNCH_2 = 0x62;

const PAYLOAD_OFFSET = 6;
const CHECKSUM_LEN = 2;

/**
 * Ublox binary packet
 * @typedef {Object} UbxPacket
 * @property {number} sync_1 Header first byte
 * @property {number} sync_2 Header second byte
 * @property {number} classId Class ID
 * @property {number} msgId Message ID
 * @property {number} payloadLength Payload length
 * @property {number} packetLength Total packet length
 * @property {DataView} payload Payload
 * @property {number} checkSum CheckSum
 */

const _getDeg = (deg, e) => {
    return deg / Math.pow(10, e);
};

const _getDistM = val => {
    return val / 1000;
};

export default class UbxDecoder extends EventEmitter {
    constructor(socket) {
        super();
        this._socket = socket;
    }
    _socket = null;
    _nbyte = 0;
    _buffer = new ArrayBuffer(MAX_MSG_LEN);
    _uintBuffer = new Uint8Array(this._buffer);
    _length = 0;
    _allowedClasses = [];
    static _emits = {
        message: 'msg',
        checksumOk: 'checksumOk',
        navMsg: 'navMsg',
        pvtMsg: 'pvtMsg',
        ubxPacket: 'ubxpacket',
        pvtMsg: 'pvtMsg',
        hpposllh: 'hpposllh'
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

        if (this._nbyte === PAYLOAD_OFFSET) {
            this._length = new Uint16Array(this._buffer, 4, 2)[0] + 8;
            if (this._length > MAX_MSG_LEN) {
                this._nbyte = 0;
                return 0;
            }
        }

        if (this._nbyte == this._length) {
            this._nbyte = 0;
            if (!this.checkHeader(buffer)) {
                return 0;
            }
            if (this.testChecksum(buffer, this._length)) {
                const ubxPacket = this.decodePacket(
                    new DataView(buffer.buffer.slice(0, this._length))
                );
                if (ubxPacket) {
                    this.emit(UbxDecoder._emits.ubxPacket, ubxPacket);
                    switch (ubxPacket.classId) {
                        case ClassIds.NAV:
                            switch (ubxPacket.msgId) {
                                case NavMessageIds.PVT:
                                    const pvtMsg = this.decodePvtMsg(ubxPacket);
                                    if (pvtMsg) {
                                        this.emit(
                                            UbxDecoder._emits.pvtMsg,
                                            pvtMsg
                                        );
                                        return pvtMsg;
                                    }
                                    break;
                                case NavMessageIds.HPPOSLLH:
                                    const hpposllhMsg = this.decodeNavHPPOSLLHMsg(
                                        ubxPacket
                                    );
                                    if (hpposllhMsg) {
                                        this.emit(
                                            UbxDecoder._emits.hpposllh,
                                            hpposllhMsg
                                        );
                                        return hpposllhMsg;
                                    }
                            }

                            break;
                        default:
                            this.emit(UbxDecoder._emits.message, ubxPacket);
                    }
                }

                return ubxPacket;
            }
        }
    };

    get length() {
        return this._length;
    }

    static get EMITS() {
        return UbxDecoder._emits;
    }

    syncHeader = (data, buffer) => {
        buffer[0] = buffer[1];
        buffer[1] = data;

        return this.checkHeader(buffer);
    };

    checkHeader = buffer => {
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

    /**
     * @returns {?UbxPacket} Decoded ublox packet
     * @param {!DataView} view Ublox packet buffer
     * @memberof UbxDecoder
     */
    decodePacket = view => {
        const sync_1 = view.getUint8(0);
        const sync_2 = view.getUint8(1);
        const classId = view.getUint8(2);
        const msgId = view.getUint8(3);
        const payloadLength = view.getUint16(4, true);
        const packetLength = PAYLOAD_OFFSET + payloadLength + CHECKSUM_LEN;
        if (!packetLength || view.byteLength < packetLength) {
            console.error(
                'Error decode ubxPacket. Buffer length !== packetLength',
                { packetLength, bufferLength: view.byteLength, view }
            );
            return null;
        }
        const payload = new DataView(
            view.buffer.slice(PAYLOAD_OFFSET, packetLength - CHECKSUM_LEN)
        );

        const checkSum = view.getInt16(packetLength - CHECKSUM_LEN, true);

        const ubxPacket = {
            sync_1,
            sync_2,
            classId,
            msgId,
            payloadLength,
            packetLength,
            payload,
            checkSum
        };

        return ubxPacket;
    };

    /**
     *
     * @deprecated Since next version. Use decodePvtMsg
     * @param {!Uint8Array} payload Payload buffer
     * @param {!number} length Payload length
     * @memberof UbxDecoder
     */
    decodeNavPOSLLHMsg = (payload, length) => {
        console.debug(
            `Decode POSLLH messgae: -> payload length: ${[payload.length]}`,
            { length, payload, payloadBuffer: payload.buffer }
        );
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
            class: ClassIds.NAV,
            type: NavMessageIds.POSLLH,
            iTOW,
            longitude,
            latitude,
            height,
            heightMSL,
            horizontalAcc,
            verticalAcc
        };
    };

    /**
     *
     * @param {UbxPacket} ubxPacket Decoded binary ublox packet
     * @memberof UbxDecoder
     */
    decodePvtMsg = ubxPacket => {
        if (ubxPacket.payloadLength < 92) {
            console.warn('Warn decode PVT message, payload length < 92', {
                ubxPacket
            });
            return null;
        }

        const { payload } = ubxPacket;

        let pvtMsg = {};
        pvtMsg.class = ClassIds.NAV;
        pvtMsg.type = NavMessageIds.PVT;
        pvtMsg.iTow = payload.getUint32(0, true);
        pvtMsg.year = payload.getUint16(4, true);
        pvtMsg.month = payload.getUint8(6, true);
        pvtMsg.day = payload.getUint8(7, true);
        pvtMsg.hour = payload.getUint8(8, true);
        pvtMsg.min = payload.getUint8(9, true);
        pvtMsg.sec = payload.getUint8(10, true);
        //  ..............
        pvtMsg.fixType = payload.getUint8(20, true);
        pvtMsg.carrierSolution = payload.getUint8(21, true) >> 6;
        pvtMsg.numSatInSolution = payload.getUint8(23, true);
        pvtMsg.longitude = _getDeg(payload.getInt32(24, true), 7);
        pvtMsg.latitude = _getDeg(payload.getInt32(28, true), 7);
        pvtMsg.height = _getDistM(payload.getInt32(32, true));
        pvtMsg.heightMSL = _getDistM(payload.getInt32(36, true));
        pvtMsg.horizontalAcc = _getDistM(payload.getUint32(40, true));
        pvtMsg.verticalAcc = _getDistM(payload.getUint32(44, true));
        pvtMsg.groundSpeed = _getDistM(payload.getInt32(60, true));
        pvtMsg.headMotion = _getDeg(payload.getInt32(64, true), 5);
        pvtMsg.speedAcc = _getDistM(payload.getUint32(68, true));
        pvtMsg.headAcc = _getDeg(payload.getUint32(72, true), 5);
        pvtMsg.pDOP = payload.getUint16(76, true);
        pvtMsg.headVeh = _getDeg(payload.getInt32(84, true), 5);
        // ...............

        return pvtMsg;
    };

    decodeNavHPPOSLLHMsg = ubxPacket => {
        const minPayloadLen = 36;
        if (ubxPacket.payloadLength < minPayloadLen) {
            console.warn(
                `Warn decode HPPOSLLH message, payload length < [${minPayloadLen}]`,
                {
                    ubxPacket
                }
            );
            return null;
        }

        const { payload } = ubxPacket;

        let hpposllhMsg = {};
        hpposllhMsg.class = ClassIds.NAV;
        hpposllhMsg.type = NavMessageIds.HPPOSLLH;
        hpposllhMsg.version = payload.getUint8(0);
        hpposllhMsg.iTow = payload.getInt32(4, true);
        hpposllhMsg.longitudeLow = _getDeg(payload.getInt32(8, true), 7);
        hpposllhMsg.latitudeLow = _getDeg(payload.getInt32(12, true), 7);
        hpposllhMsg.heightLow = _getDistM(payload.getInt32(16, true));
        hpposllhMsg.heightMSLLow = _getDistM(payload.getInt32(20, true));

        hpposllhMsg.lonHp = _getDeg(payload.getInt8(24, true), 9);
        hpposllhMsg.latHp = _getDeg(payload.getInt8(25, true), 9);
        hpposllhMsg.hHp = _getDistM(payload.getInt8(26, true)) * 0.1;
        hpposllhMsg.hMSLHp = _getDistM(payload.getInt8(27, true)) * 0.1;

        hpposllhMsg.longitude = hpposllhMsg.longitudeLow + hpposllhMsg.lonHp;
        hpposllhMsg.latitude = hpposllhMsg.latitudeLow + hpposllhMsg.latHp;
        hpposllhMsg.height = hpposllhMsg.heightLow + hpposllhMsg.hHp;
        hpposllhMsg.heightMSL = hpposllhMsg.heightMSLLow + hpposllhMsg.hMSLHp;
        hpposllhMsg.hAcc = _getDistM(payload.getUint32(28, true)) * 0.1;
        hpposllhMsg.vAcc = _getDistM(payload.getUint32(32, true)) * 0.1;

        return hpposllhMsg;
    };

    sendCommand = async (ubxPacket, waitResponseTime = 200) => {
        if (!this._socket) {
            return null;
        }

        const buffer = this.ubxPacketToBinary(ubxPacket);
        this._socket.write(buffer);
        if (waitResponseTime > 0) {
            const respPacket = await this.waitResponse(
                ubxPacket.class,
                ubxPacket.type,
                waitResponseTime
            );
            return respPacket;
        }

        return null;
    };

    ubxPacketToBinary = ubxPacket => {
        const payLen = ubxPacket.payload.byteLength;
        const packetLen = payLen + PAYLOAD_OFFSET + 2;
        const buffer = new Uint8Array(new ArrayBuffer(packetLen));
        buffer[0] = UBX_SYNCH_1;
        buffer[1] = UBX_SYNCH_2;
        buffer[2] = ubxPacket.class;
        buffer[3] = ubxPacket.type;
        const len = new DataView(new ArrayBuffer(2));
        //len.setUint16(0, ubxPacket.payload.byteLength, true);
        //buffer[4] = len.getUint8(0);
        //buffer[5] = len.getUint8(1);
        buffer[4] = ubxPacket.payload.byteLength & 0xff;
        buffer[5] = ubxPacket.payload.byteLength >> 8;
        const payload = new Uint8Array(buffer.buffer);
        for (const i = 0; i < payLen; i++) {
            payload[i] = ubxPacket.payload.getUint8(i);
        }
        ubxPacket = this.calcChecksum(ubxPacket);
        buffer[packetLen - 2] = ubxPacket.checksumA;
        buffer[packetLen - 1] = ubxPacket.checksumB;

        return buffer;
    };

    calcChecksum = ubxPacket => {
        ubxPacket.checksumA = 0;
        ubxPacket.checksumB = 0;

        ubxPacket.checksumA += ubxPacket.class;
        ubxPacket.checksumB += ubxPacket.checksumA;

        ubxPacket.checksumA += ubxPacket.type;
        ubxPacket.checksumB += ubxPacket.checksumA;

        ubxPacket.checksumA += ubxPacket.payload.byteLength & 0xff;
        ubxPacket.checksumB += ubxPacket.checksumA;

        ubxPacket.checksumA += ubxPacket.payload.byteLength >> 8;
        ubxPacket.checksumB += ubxPacket.checksumA;

        for (const i = 0; i < ubxPacket.payload.byteLength; i++) {
            ubxPacket.checksumA += ubxPacket.payload.getUint8(i);
            ubxPacket.checksumB += ubxPacket.checksumA;
        }

        return ubxPacket;
    };

    waitResponse = (classId, msgId, maxWait = 250) => {
        return new Promise((reslove, reject) => {
            const event = UbxDecoder._emits.ubxPacket;
            let timeStart = new Date();
            let packet = null;
            const callback = ubxPacket => {
                if (!ubxPacket) {
                    return;
                }
                if (ubxPacket.class == classId && ubxPacket.type == msgId) {
                    packet = ubxPacket;
                }
            };

            this.on(event, callback);

            while (packet == null) {
                if (new Date() - timeStart >= maxWait) {
                    break;
                }
            }
            this.off(event, callback);
            if (packet != null) {
                this.emit('ubxresp', packet);
            }
            reslove(packet);
        });
    };
}
