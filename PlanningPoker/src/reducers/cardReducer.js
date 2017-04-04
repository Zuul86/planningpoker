import * as types from '../actions/actionTypes';

export function cardReducer(state = {}, action){
    switch (action.type){
        case types.SELECT_CARD:
            return Object.assign({}, state, {effort: action.effort});
        default:
            return state;
    }
}

export default cardReducer;