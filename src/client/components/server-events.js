import { EventEmitter } from 'events';
import { UbxDecoder, ClassIds, NavMessageIds } from '../model/ublox';

const events = {
    debug: 'logger',
    ota: 'ota',
    ubxNav: 'ubxnav',
    ubxMsg: 'ubxmsg',
    receiverData: 'gpsraw',
    wsMsg: 'wsmsg',
    ubxWsClose: 'ubxwsclose',
    ubxWsOpen: 'ubxWsOpen'
};

class ServerEvents extends EventEmitter {
    constructor() {
        super();
        this.ws = new WebSocket(
            `ws://${DEVELOPMENT ? REMOTE_HOST : document.location.host}/ubx`,
            ['arduino']
        );
        this.ws.binaryType = 'arraybuffer';
        this.es = new EventSource(
            DEVELOPMENT ? `http://${REMOTE_EVENTS_URL}` : EVENTS_URL
        );

        this.decoder = new UbxDecoder(this.ws);
        this.decoder.on(UbxDecoder.EMITS.ubxPacket, packet => {
            this.emit(events.ubxMsg, packet);
        });
        this.decoder.on(UbxDecoder.EMITS.pvtMsg, msg => {
            this.emit(events.ubxNav, msg);
        });
        this.decoder.on(UbxDecoder.EMITS.hpposllh, msg => {
            this.emit(events.ubxNav, msg);
        });

        this.ws.onmessage = e => {
            this.emit(events.wsMsg, e);
            if (e.data && e.data instanceof ArrayBuffer) {
                const buf = new Uint8Array(e.data);
                buf.forEach(b => {
                    this.decoder.inputData(b);
                });
            }
        };

        this.ws.onclose = e => {
            this._wsClosed = true;
            this.emit(events.ubxWsClose, e);
        };
        this.ws.onopen = e => {
            this._wsClosed = false;
            this.emit(events.ubxWsOpen, e);
        };
        this.ws.onerror = err => {
            this._wsClosed = true;
            console.error(err);
            this.ws.close();
        }
    }

    _wsClosed = true;

    /**
     * Pong to WebSocket
     *
     * @memberof ServerEvents
     */
    pongUbxWs = () => {
        if (!this._wsClosed) {
            try {
                this.ws.send(Int16Array.from('PONG'));
            } catch (err) {
                console.error(err);
            }
        }
    };

    onWsMessage = callback => {
        this.addWsEventListener(events.wsMsg, e => {
            let msg = '';
            if (e.data instanceof ArrayBuffer) {
                const buf = new Uint8Array(e.data);
                msg = String.fromCharCode(buf);
            } else {
                msg = e.data;
            }
            callback(msg);
        });
    };

    onOpen = callback => {
        this.es.onopen = e => {
            callback(e);
        };
    };

    onError = callback => {
        this.es.onerror = e => {
            callback(e);
        };
    };

    onMessage = callback => {
        this.es.onmessage = e => {
            callback(e.data);
        };
    };

    onOtaMessage = callback => {
        this.es.addEventListener(events.ota, e => {
            callback(e.data);
        });
    };

    onDebugMessage = callback => {
        this.es.addEventListener(events.debug, e => {
            callback(e.data);
        });
    };

    onUbxMessage = callback => {
        this.addWsEventListener(events.ubxMsg, msg => {
            callback(msg);
        });
    };

    onUbxNavMessage = callback => {
        this.addWsEventListener(events.ubxNav, msg => {
            callback(msg);
        });
    };

    //onReceiverData = callback => {
    //    this.ws.onmessage = e => {
    //        if (e.data instanceof ArrayBuffer) {
    //            const buf = new Uint8Array(e.data);
    //            buf.forEach(b => {
    //                const res = this.decoder.inputData(b);
    //                if (res && res.classId == ClassIds.NAV) {
    //                    callback(res);
    //                }
    //            });
    //        }
    //    };
    //};

    addWsEventListener = (event, callback) => {
        this.on(event, callback);
    };
}

const serverEvents = new ServerEvents();

export { serverEvents, events };
