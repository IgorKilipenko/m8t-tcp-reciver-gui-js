import React, { createContext, useContext, useReducer } from 'react';
import initialState from './initialState';
import reducer from './reducer';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const { state, dispatch } = useContext(StoreContext);
    console.debug({ GLOBAL_STORE: state });
    return { state, dispatch };
};

