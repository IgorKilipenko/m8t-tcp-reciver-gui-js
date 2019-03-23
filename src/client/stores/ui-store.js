import { observable, computed, action } from 'mobx';

export default class UiStore{

    @observable _state = {
        logView: {
            activeTab : 0,
        }
    }

    @action 
    setState(state) {
        if (typeof state == 'function') {
            state = state(this._state);
        }
        this._state = {
            ...this._state,
            ...state
        };
    }

    @computed
    get state(){
        return this._state;
    }
}