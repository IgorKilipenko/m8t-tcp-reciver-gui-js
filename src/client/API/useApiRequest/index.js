import { useReducer, useCallback } from 'react';
import axios from 'axios';
import reducer, { initialState } from './reducer';
import { fetching, success, error } from './actionCreators';


const useApiRequest = (instance, params = {}) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const makeRequest = useCallback(async () => {
        dispatch(fetching());
        try {
            const response = await instance(params);
            dispatch(success(response));
        } catch (e) {
            dispatch(error(e));
        }
    }, [params]);

    return [state, makeRequest];
};

export default useApiRequest;