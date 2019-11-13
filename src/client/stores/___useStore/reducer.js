import { serverEventReducer } from '../serverEventStore';

const reducer = ({ serverEventState }, action) => {
    return {
        serverEventStore: serverEventReducer(serverEventState, action)
    };
};

export default reducer;
