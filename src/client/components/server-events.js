import { EventEmitter } from 'events';
import { UbxDecoder, ClassIds, NavMessageIds } from '../model/ublox';

const events = {
    debug: 'logger',
    ota: 'ota',
    ubxNav: 'ubxnav',
    ubxMsg: 'ubxmsg',
    receiverData: 'gpsraw',
    wsMsg: 'wsmsg'
};

class ServerEvents extends EventEmitter {
    constructor() {
        super();
        this.ws = new WebSocket(
            `ws://${DEVELOPMENT ? REMOTE_HOST : document.location.host}/ws`,
            ['arduino']
        );
        this.ws.binaryType = 'arraybuffer';
        this.es = new EventSource(
            DEVELOPMENT ? `http://${REMOTE_EVENTS_URL}` : EVENTS_URL
        );
        this.ws.onmessage = e => {
            this.emit(events.wsMsg, e);
        };
        this.decoder = new UbxDecoder();
    }

    onWsOpen = callback => {
        this.ws.onopen = e => {
            callback(e);
        };
    };

    onWsClose = callback => {
        this.ws.onclose = e => {
            callback(e);
        };
    };

    onWsError = callback => {
        this.ws.onerror = err => {
            console.error('ws error', err);
            callback(err);
        };
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

        this.decoder.on(UbxDecoder.EMITS.pvtMsg, msg => callback(msg));
        this.decoder.on(UbxDecoder.EMITS.hpposllh, msg => callback(msg));

        this.addWsEventListener(events.wsMsg, e => {
            if (e.data && e.data instanceof ArrayBuffer) {
                const buf = new Uint8Array(e.data);
                buf.forEach(b => {
                    this.decoder.inputData(b);
                })
            }
        });
    }

    onReceiverData = callback => {
        this.ws.onmessage = e => {
            if (e.data instanceof ArrayBuffer) {
                const buf = new Uint8Array(e.data);
                buf.forEach( b => {
                    const res = this.decoder.inputData(b);
                    if (res && res.classId == ClassIds.NAV){
                        callback(res);
                    }
                })
                
            }
        };
    };

    addWsEventListener = (event, callback) => {
        this.on(event, callback);
    };
}

const serverEvents = new ServerEvents();

export { serverEvents, events };
