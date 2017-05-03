import * as types from '../actions/actionTypes';
import initialState from './initialState';

function findMySelectionIndex(state, id){
    return state.findIndex((item) => {
        return item.UserId = id;
    });
}

function addSelection(state, action){
    const index = findMySelectionIndex(state, action.UserId);
    if (index >= 0){
        const newState = [...state];
        newState.splice(index, 1,  action);
        return newState;
    } else {
        return [...state, action];
    }
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