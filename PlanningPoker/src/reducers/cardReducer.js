import * as types from '../actions/actionTypes';
import initialState from './initialState';

function findMySelectionIndex(state, id){
    return state.findIndex((item) => {
        return item.UserId === id;
    });
}

function addSelection(state, action){
    const index = findMySelectionIndex(state, action.UserId);
    let cards = [];
    if (index >= 0){
        cards = [...state];
        cards.splice(index, 1,  action);
    } else {
        cards = [...state, action];
    }

    return cards;
}

function removeCard(state, action) {
    const index = findMySelectionIndex(state, action.UserId);
    let cards = [...state];
    if (index >= 0) {
        cards.splice(index, 1);
    }

    return cards;
}

function clearCardArray(state, action) {
    return [];
}

export function cardReducer(state = initialState.cards, action){
    switch (action.type){
        case types.SELECT_CARD:           
            return addSelection(state, action);
        case types.REMOVE_CARD:
            return removeCard(state, action);
        case types.RESET_TABLE:
            return clearCardArray(state, action);
        default:
            return state;
    }
}

export default cardReducer;