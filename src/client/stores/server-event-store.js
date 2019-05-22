import { observable, computed, action } from 'mobx';
import { events } from '../components/server-events';

const MAX_LEN = 500;

export default class ServerEventStore {
    @observable _debugMessage = [];
    @observable _otaMessage = [];
    @observable _ubxNavMessage = [];
    @observable _receiverData = [];

    

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
        let msgs = [];
        const len = this._ubxNavMessage.length;
        if (len >= MAX_LEN) {
            msgs = [msg, ...msgs.slice(0, len - MAX_LEN - 1)];
        } else {
            msgs = [msg, ...this._ubxNavMessage];
        }
        this._ubxNavMessage = msgs;
    }

    @action setMessage(event, msg) {
        if (event === events.debug) {
            this.setDebugMessage(msg);
        } else if (event === events.ota) {
            this.setOtaMessage(msg);
        } else if (event === events.ubxNav) {
            this.setUbxNavMessage(msg);
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
}