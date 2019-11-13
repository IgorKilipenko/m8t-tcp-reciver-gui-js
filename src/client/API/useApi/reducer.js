import { ACTION, QUERY, SUCCESS, ERROR } from './actionTypes';

export const initialState = {
    status: null,
    response: null,
};

const reducer = (state = initialState, { type, response } = {}) => {
    switch (type) {
        case ACTION:
            return { ...initialState, status: ACTION };
        case QUERY:
            return { ...initialState, status: QUERY };
        case SUCCESS:
            return { ...state, status: SUCCESS, response };
        case ERROR:
            return { ...state, status: ERROR, response };
        default:
            return state;
    }
};

export default reducer;