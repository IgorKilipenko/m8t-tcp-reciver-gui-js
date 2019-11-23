import {
    DEBUG_MESSAGE,
    OTA_MESSAGE,
    UBX_NAV_MESSAGE,
    RECEIVER_DATA,
    UBX_PVT_MESSAGE,
    UBX_HPPOSLLH_MESSAGE
} from './actionTypes';

import { events } from '../../components/server-events';
import { ClassIds, NavMessageIds } from '../../model/ublox';

export const initialState = {
    id: -1,
    status: null,
    message: null,
    event: null,
    time: null
};

const _parseEvent = event => {
    if (event === events.debug) {
        return DEBUG_MESSAGE; //dispatch(setDebugMsg(msg));
    } else if (event === events.ota) {
        return OTA_MESSAGE; //dispatch(setOtaMsg(msg));
    } else if (event === events.ubxNav) {
        //return  UBX_NAV_MESSAGE //dispatch(setUbxNavMsg(msg));
        if (msg.class !== ClassIds.NAV) {
            return null;
        }
        if (msg.type === NavMessageIds.PVT) {
            return UBX_PVT_MESSAGE; //dispatch(setUbxPvtMsg(msg));
        } else if (msg.type === NavMessageIds.HPPOSLLH) {
            return UBX_HPPOSLLH_MESSAGE; //dispatch(setUbxHpposllhMsg(msg));
        }
    }

    return null;
};

const reducer = (state = initialState, { event, data } = {}) => {
    const type = _parseEvent(event);
    if (!type){
        return;
    }

    const time = new Date();

    switch (type) {
        case DEBUG_MESSAGE:
            return { ...state, status: DEBUG_MESSAGE, message: data, event, time, id: state.id + 1 };
        case OTA_MESSAGE:
            return { ...state, status: OTA_MESSAGE, message: data, event, time, id: state.id + 1 };
        case UBX_NAV_MESSAGE:
            return { ...state, status: UBX_NAV_MESSAGE, message: data, event, time, id: state.id + 1 };
        case RECEIVER_DATA:
            return { ...state, status: RECEIVER_DATA, message: data, event, time, id: state.id + 1 };
        case UBX_PVT_MESSAGE:
            return { ...state, status: UBX_PVT_MESSAGE, message: data, event, time, id: state.id + 1 };
        case UBX_HPPOSLLH_MESSAGE:
            return { ...state, status: UBX_HPPOSLLH_MESSAGE, message: data, event, time, id: state.id + 1 };
        default:
            return state;
    }
};

export default reducer;
