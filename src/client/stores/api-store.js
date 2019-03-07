import { observable, computed, action } from 'mobx';
import ApiSocket from '../components/api-socket';

const api = new ApiSocket();

export default class ApiStore {
    @observable _receiverState = {
        enabled: false,
        timeStart: 0,
        timeReceive: 0
    };
    @observable _serverState = {
        serverStart: 0,
        sdSuccess: false
    };

    @observable _wifiState = {
        list: [],
        lastUpdate: null
    };

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
    get timeReceive() {
        const { enabled, timeStart } = this._receiverState;
        const { serverStart } = this.serverState;
        //console.log({enabled, timeStart, serverStart})
        if (!enabled || !timeStart) {
            return 0;
        }
        return Date.now() - timeStart - serverStart;
    }

    @computed
    get serverStartTime() {
        return new Date(Date.now() - this._serverState.serverStart);
    }

    @action
    async updateServerState() {
        try {
            const res = await api.getServerInfo();
            this._serverState.serverStart = Date.now() - res.data.server_time;
            this._serverState.sdSuccess = res.data.sd_success;
            return null;
        } catch (err) {
            return this.sendApiError(err);
        }
    }

    @action
    async updateReceiverState() {
        try {
            const res = await api.getReceiverState();
            const { enabled, timeStart, timeReceive } = res.data;
            this._receiverState = {
                enabled,
                timeStart,
                timeReceive
            };
            return null;
        } catch (err) {
            return this.sendApiError(err);
        }
    }

    @action
    async updateWiFiList() {
        try {
            const res = await api.getWifiList();
            this._wifiState.list = res.data;
            this._wifiState.lastUpdate = new Date();
            return null;
        } catch (err) {
            return this.sendApiError(err);
        }
    }

    sendApiError = err => {
        console.error('Error {ApiStore} get server state', {
            err,
            sender: this
        });

        return err;
    };
}
