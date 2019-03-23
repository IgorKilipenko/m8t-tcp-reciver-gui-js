import { observable, computed, action } from 'mobx';
import {events} from '../components/server-events';


export default class ServerEventStore {
    @observable _debugMessage = [];
    @observable _otaMessage = [];
    @observable _ubxNavMessage = [];

    @action setDebugMessage(msg) {
        this._debugMessage = [...this._debugMessage, msg];
    }

    @action setOtaMessage(msg) {
        this._otaMessage = [...this._otaMessage, msg];
    }

    @action setUbxNavMessage(msg) {
        this._ubxNavMessage = [...this._ubxNavMessage, msg];
    }

    @action setMessage(event, msg) {
        if (event === events.debug) {
            this.setDebugMessage(msg);
        } else if (event === events.ota) {
            this.setOtaMessage(msg);
        }else if (event === events.ubxNav){
            this.setUbxNavMessage(msg);
        }
    }

    @action clearMessages(event){
        if (event === events.debug){
            this._debugMessage = [];
        }else if (event === events.ota){
            this._otaMessage = [];
        }else if (event === events.ubxNav){
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

