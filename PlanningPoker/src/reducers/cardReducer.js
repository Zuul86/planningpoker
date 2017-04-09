import * as types from '../actions/actionTypes';
import initialState from './initialState';

function findMySelectionIndex(state, id){
    return state.findIndex((item) => {
        return item.UserId = id;
    });
}

function addSelection(state, action){
    let newState = [...state];
    newState.splice(findMySelectionIndex(state, action.UserId), 1,  {UserId: action.UserId, effort: action.effort});
    return newState;
}

export function cardReducer(state = initialState.cards, action){
    switch (action.type){
        case types.SELECT_CARD:           
            return addSelection(state, action);
        default:
            return state;
    }
}

export default cardReducer;