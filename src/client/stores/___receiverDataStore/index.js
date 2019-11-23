import { useReducer, useCallback } from 'react';
import reducer, { initialState } from './reducer';
import {
    setDebugMsg,
    setOtaMsg,
    setUbxNavMsg,
    setReceiverData,
    setUbxPvtMsg,
    setUbxHpposllhMsg
} from './actionCreators';
import { events } from '../../components/server-events';
import { ClassIds, NavMessageIds } from '../../model/ublox';

const useServerEventStore = (event, msg = null) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    if (event === events.debug) {
        dispatch(setDebugMsg(msg));
    } else if (event === events.ota) {
        dispatch(setOtaMsg(msg));
    } else if (event === events.ubxNav) {
        //dispatch(setUbxNavMsg(msg));
        if (msg.class !== ClassIds.NAV) {
            return;
        }
        if (msg.type === NavMessageIds.PVT) {
            dispatch(setUbxPvtMsg(msg));
        } else if (msg.type === NavMessageIds.HPPOSLLH) {
            dispatch(setUbxHpposllhMsg(msg));
        }
    }

    return state;
};

export default useServerEventStore;

import serverEventActionTypes from './actionTypes';
import servrEventsActions from './actionCreators';

export {
    reducer as serverEventReducer,
    serverEventActionTypes,
    servrEventsActions
};
