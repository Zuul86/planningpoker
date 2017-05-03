import * as types from './actionTypes';

export function selectCard(selection){
    return { type: types.SELECT_CARD, Effort: selection.Effort, UserId: selection.UserId };
}