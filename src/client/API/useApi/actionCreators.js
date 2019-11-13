import { ACTION, QUERY, SUCCESS, ERROR } from './actionTypes';

export const action = () => ({ type: ACTION });
export const query = () => ({ type: QUERY });
export const success = response => ({ type: SUCCESS, response });
export const error = response => ({ type: ERROR, response });