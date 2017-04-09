import * as types from './actionTypes';

export function selectCard(effort){
    return { type: types.SELECT_CARD, effort, UserId: '1234' };
}