import * as types from './actionTypes';

export function revealCards(selection) {
    return { type: types.REVEAL_CARDS, ShowCards: selection.ShowCards };
}