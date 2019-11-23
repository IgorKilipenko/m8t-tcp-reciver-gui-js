import {
    DEBUG_MESSAGE,
    OTA_MESSAGE,
    UBX_NAV_MESSAGE,
    RECEIVER_DATA,
    UBX_PVT_MESSAGE,
    UBX_HPPOSLLH_MESSAGE
} from './actionTypes';

export const setDebugMsg = state => ({ type: DEBUG_MESSAGE, state });
export const setOtaMsg = state => ({ type: OTA_MESSAGE, state });
export const setUbxNavMsg = state => ({ type: UBX_NAV_MESSAGE, state });
export const setReceiverData = state => ({ type: RECEIVER_DATA, state });
export const setUbxPvtMsg = state => ({ type: UBX_PVT_MESSAGE, state });
export const setUbxHpposllhMsg = state => ({ type: UBX_HPPOSLLH_MESSAGE, state });


export default {
    setReceiverData,
    setUbxPvtMsg,
    setUbxHpposllhMsg
}