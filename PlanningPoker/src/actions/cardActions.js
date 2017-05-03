import * as types from './actionTypes';

export function selectCard(selection){
    return { type: types.SELECT_CARD, effort: selection.effort, UserId: selection.userId };
}