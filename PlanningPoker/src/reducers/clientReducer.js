import * as types from '../actions/actionTypes';
import initialState from './initialState';

export function clientReducer(state = initialState.numberOfClients, action){
    switch (action.type){
        case types.CLIENT_CONNECTED:
        case types.CLIENT_DISCONNECTED:
            return state = action.NumberOfClients;
        default:
            return state;
    }
}

export default clientReducer;