import * as types from '../actions/actionTypes';
import initialState from './initialState';

function userReducer(state = initialState.users, action) {
    switch (action.type) {
        case types.USER_UPDATED: {
            let index = state.findIndex((item) => {
                return item.UserId === action.UserId;
            });
            if (index >= 0) {
                let tempState = [...state];
                tempState.splice(index, 1, { UserId: action.UserId, Name: action.Name });
                return tempState;
            } else {
                return [...state, { UserId: action.UserId, Name: action.Name }];
            }
        }
        case types.USER_CONNECTED:
        case types.USER_DISCONNECTED:
            return action.Users;
        default:
            return state;
    }
}

export default userReducer;