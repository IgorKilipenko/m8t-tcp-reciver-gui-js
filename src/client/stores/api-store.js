import { observable, computed, action } from 'mobx';
import ApiSocket from '../components/api-socket';

const api = new ApiSocket();

export default class ApiStore {
    @observable _receiverState = {
        enabled: false,
        timeStart: 0,
        timeReceive: 0,
        writeToSd: true,
        sendToTcp: true
    };
    @observable _ntripState = {
        enabled: false,
        timeStart: 0,
        timeReceive: 0,
        host: '',
        port: '',
        mountPoint: '',
        lastUpdate: null
    };
    @observable _serverState = {
        serverStart: 0,
        sdSuccess: false
    };

    @observable _wifiState = {
        list: [],
        lastUpdate: null,
        wifiMode: api.WiFiModes.unknown,
        apInfo: null,
        staInfo: null
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
    setNtripState(state) {
        if (typeof state == 'function') {
            state = state(this._ntripState);
        }
        this._ntripState = {
            ...this._ntripState,
            ...state
        };
    }

    @computed
    get ntripState() {
        return this._ntripState;
    }

    @action
    async updateNtripState() {
        if (
            this._ntripState &&
            this._ntripState.lastUpdate &&
            new Date() - this._ntripState.lastUpdate < 1000
        ) {
            return this.sendApiWarn('Small time interval');
        }
        try {
            const res = await api.getNtripState();
            console.debug({ res });
            if (res && res.data) {
                this._ntripState.enabled = res.data.enabled;
                return null;
            }
        } catch (err) {
            return this.sendApiError(err, api.components.ntrip);
        }
    }

    @action
    async ntripAction(enable, options) {
        try {
            const res = await api.setNtripClient(enable, options);
            if (res && res.data) {
                this.setNtripState(res.data);
                return res;
            }
        } catch (err) {
            return this.sendApiError(err, api.components.ntrip);
        }
        return null;
    }

    @action
    setServerState(state) {
        if (typeof state == 'function') {
            state = state(this._serverState);
        }
        this._serverState = {
            ...this._serverState,
            ...state
        };
    }

    @action
    setWiFiState(state) {
        if (typeof state == 'function') {
            state = state(this._wifiState);
        }
        this._wifiState = {
            ...this._wifiState,
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
    get wifiState() {
        return this._wifiState;
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
            this._serverState.serverStart = Date.now() - res.data.serverTime;
            this._serverState.sdSuccess = res.data.sdSuccess;
            return null;
        } catch (err) {
            return this.sendApiError(err, api.components.server);
        }
    }

    @action
    async updateReceiverState() {
        try {
            if (
                this._receiverState &&
                this._receiverState.lastUpdate &&
                new Date() - this._receiverState.lastUpdate < 1000
            ) {
                return this.sendApiWarn('Small time interval');
            }
            const res = await api.getReceiverState();
            const {
                enabled,
                timeStart,
                timeReceive,
                writeToSd,
                sendToTcp
            } = res.data;
            //this._receiverState = {
            //    enabled,
            //    timeStart,
            //    timeReceive
            //};
            this.setReceiverState({
                enabled,
                timeStart,
                timeReceive,
                writeToSd,
                sendToTcp,
                lastUpdate: new Date()
            });
            return null;
        } catch (err) {
            return this.sendApiError(err, api.components.receiver);
        }
    }

    @action
    async updateWiFiList() {
        try {
            if (
                this._wifiState &&
                this._wifiState.lastUpdate &&
                new Date() - this._wifiState.lastUpdate < 1000
            ) {
                return this.sendApiWarn('Small time interval');
            }
            const res = await api.getWifiList();
            //this._wifiState.list = res.data;
            //this._wifiState.lastUpdate = new Date();
            this.setWiFiState({
                list: res.data,
                lastUpdate: new Date()
            });
            return null;
        } catch (err) {
            return this.sendApiError(err, api.components.wifi);
        }
    }

    @action
    async updateWiFiInfo() {
        try {
            const res = await api.getWifiInfo();
            this.setWiFiState({
                wifiMode: res.data.mode || api.WiFiModes.unknown,
                apInfo: res.data.ap || null,
                staInfo: res.data.sta || null
            });

            return null;
        } catch (err) {
            return this.sendApiError(err, api.components.wifi);
        }
    }

    sendApiError = (err, component) => {
        console.error(`Error {ApiStore}, Component: [${component}]`, {
            err,
            sender: this
        });

        return err;
    };

    sendApiWarn = (warn, component) => {
        console.warn('Warn {ApiStore}, Component: [${component}]', {
            warn,
            sender: this
        });

        return err;
    };

    get api() {
        return api;
    }
}
