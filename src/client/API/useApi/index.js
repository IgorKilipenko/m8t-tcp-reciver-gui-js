import { useReducer, useCallback } from 'react';
import axios from 'axios';
import reducer, { initialState } from './reducer';
import { action, query, success, error } from './actionCreators';
import useApiRequest from '../useApiRequest';
import { FETCHING, SUCCESS, ERROR } as reqActionTypes from '../useApiRequest/actionTypes';
import apiInstance, {headers, types, components} from './apiInstance';

const useApiQuery = (options = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    

    
    const [{ reqStatus, response }, makeRequest] = useApiRequest(apiInstance, options)
    if (reqStatus === reqActionTypes.SUCCESS){

    }

    return [state, makeRequest];
};

export default useApiRequest;