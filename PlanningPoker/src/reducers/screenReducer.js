import * as types from '../actions/actionTypes';
import initialState from './initialState';

export function screenReducer(state = initialState.screen, action) {
    switch (action.type) {
        case types.REVEAL_CARDS:
            return Object.assign({}, state, { showCards: action.ShowCards });
        default:
            return state;
    }

}

export default screenReducer;