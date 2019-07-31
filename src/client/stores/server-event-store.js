import { observable, computed, action, configure } from 'mobx';
import { events } from '../components/server-events';
import { ClassIds, NavMessageIds } from '../model/ublox';


configure({
    enforceActions: 'observed',
    isolateGlobalState: true,
    disableErrorBoundaries: false
});

const MAX_LEN = 500;

export default class ServerEventStore {
    @observable _debugMessage = [];
    @observable _otaMessage = [];
    @observable _ubxNavMessage = [];
    @observable _receiverData = [];
    @observable _pvtMessage = null; // Last PVT message
    @observable _hpposllhMessage = null; // Last HPPOSLLH message


    @action setDebugMessage(msg) {
        let msgs = [];
        const len = this._debugMessage.length;
        if (len >= MAX_LEN) {
            msgs = [...msgs.slice(len - MAX_LEN + 1, len), msg];
        } else {
            msgs = [...this._debugMessage, msg];
        }
        this._debugMessage = msgs;
    }

    @action setOtaMessage(msg) {
        let msgs = [];
        const len = this._otaMessage.length;
        if (len >= MAX_LEN) {
            msgs = [...msgs.slice(len - MAX_LEN + 1, len), msg];
        } else {
            msgs = [...this._otaMessage, msg];
        }
        this._otaMessage = msgs;
    }

    @action setUbxNavMessage(msg) {
        /*let msgs = [];
        const len = this._ubxNavMessage.length;
        if (len >= MAX_LEN) {
            msgs = [msg, ...msgs.slice(0, len - MAX_LEN - 1)];
        } else {
            msgs = [msg, ...this._ubxNavMessage];
        }
        this._ubxNavMessage = msgs;*/

        const len = this._ubxNavMessage.length;
        if (len >= MAX_LEN) {
            this._ubxNavMessage.shift();
        }
        this._ubxNavMessage.push(msg);
    }

    @action setMessage(event, msg) {
        if (event === events.debug) {
            this.setDebugMessage(msg);
        } else if (event === events.ota) {
            this.setOtaMessage(msg);
        } else if (event === events.ubxNav) {
            //this.setUbxNavMessage(msg);
            if (msg.class !== ClassIds.NAV) {
                return;
            }
            if (msg.type === NavMessageIds.PVT) {
                this.setPvtMessage(msg);
            } else if (msg.type === NavMessageIds.HPPOSLLH) {
                this.setHPPOSLLHMessage(msg);
            }
        }
    }

    @action clearMessages(event) {
        if (event === events.debug) {
            this._debugMessage = [];
        } else if (event === events.ota) {
            this._otaMessage = [];
        } else if (event === events.ubxNav) {
            this._ubxNavMessage = [];
        }
    }

    @computed
    get otaMessage() {
        return this._otaMessage;
    }

    @computed
    get debugMessage() {
        return this._debugMessage;
    }

    @computed
    get ubxNavMessage() {
        return this._ubxNavMessage;
    }

    /**
     * Get Last PVT Message from server
     *
     * @readonly
     * @memberof ServerEventStore
     */
    @computed
    get ubxPvtMessage() {
        return this._pvtMessage;
    }

    /**
     * Set Current PVT Message
     *
     * @memberof ServerEventStore
     */
    @action
    setPvtMessage = msg => {
        this._pvtMessage = msg;
    };

    @computed
    get ubxHPPOSLLHMessage() {
        return this._hpposllhMessage;
    }

    @action
    setHPPOSLLHMessage = msg => {
        this._hpposllhMessage = msg;
    };
}
