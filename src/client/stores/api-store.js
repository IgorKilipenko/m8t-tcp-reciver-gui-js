import { observable, computed, action } from 'mobx';
import { Server } from 'https';
import ApiSocket from '../components/api-socket';

const api = new ApiSocket();

export default class ApiStore{
    @observable _receiverState = {
        enabled:false,
        timeStart:0,
    }
    @observable _serverState = {
        serverStart: 0
    }

    @action
    setReceiverState(state) {
        if (typeof state == 'function') {
            state = state(this._receiverState);
        }
        this._receiverState = {
            ...this._receiverState,
            ...state
        };
    }

    @action
    setServerState(state) {
        this.setState(state, this._serverState);
    }

    setState(state, component) {
        if (typeof state == 'function') {
            state = state(component);
        }
        component = {
            ...component,
            ...state
        };
    }

    @computed
    get receiverState() {
        return this._receiverState;
    }

    @computed
    get serverState() {
        return this._serverState;
    }

    @computed
    get timeReceive(){
        const {enabled, timeStart } = this._receiverState;
        const {serverStart} = this.serverState;
        //console.log({enabled, timeStart, serverStart})
        if (!enabled || !timeStart){
            return 0;
        }
        return Date.now() - timeStart - serverStart;
    }

    @action
    async updateServerState(){
        try{
            const res = await api.getServerInfo();
            this._serverState.serverStart = Date.now() - res.data.server_time;
        }catch (err){
            console.error("Error {ApiStore} get server state", {err, res, sender:this});
        }
    }
}