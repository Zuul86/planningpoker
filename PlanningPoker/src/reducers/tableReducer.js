import * as types from '../actions/actionTypes';
import initialState from './initialState';

function tableReducer(state = initialState.table, action) {
    switch (action.type) {
        case types.CLIENT_CONNECTED:
            return action.TableId;
        default:
            return state;
    }
}

export default tableReducer;