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
import { object } from 'prop-types';

const initialVal = {
    id: -1,
    status: null,
    message: null,
    event: null,
    time: null
};

export const sections = {
    debug: 'debug',
    ota: 'ota',
    ubxNav: 'ubxNav',
    ubxData: 'ubxData',
    ubxPvt: 'ubxPvt',
    ubxHpposllh: 'ubxHpposllh'
};

export const initialState = {
    [sections.debug]: initialVal,
    [sections.ota]: initialVal,
    [sections.ubxNav]: initialVal,
    [sections.ubxData]: initialVal,
    [sections.ubxPvt]: initialVal,
    [sections.ubxHpposllh]: initialVal
};

/*export const _____________initialState = object
    .values(sections)
    .reduce((obj, key) => (obj[key] = initialVal), {});*/

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
    if (!type) {
        return;
    }

    const incId = section => {
        return state && state[section] ? state[section] + 1 : 0;
    };

    const time = new Date();

    const setData = section => ({
        [section]: {
            status: type,
            message: data,
            event,
            time,
            id: incId(section)
        }
    });

    switch (type) {
        case DEBUG_MESSAGE:
            return {
                ...state,
                ...setData(sections.debug)
            };
        case OTA_MESSAGE:
            return {
                ...state,
                ...setData(sections.ota)
            };
        case UBX_NAV_MESSAGE:
            return {
                ...state,
                ...setData(sections.ubxNav)
            };
        case RECEIVER_DATA:
            return {
                ...state,
                ...setData(sections.ubxData)
            };
        case UBX_PVT_MESSAGE:
            return {
                ...state,
                ...setData(sections.ubxPvt)
            };
        case UBX_HPPOSLLH_MESSAGE:
            return {
                ...state,
                ...setData(sections.ubxHpposllh)
            };
        default:
            return state;
    }
};

export default reducer;
