import * as types from './actionTypes';

export function updateName(user) {
    return { type: types.USER_UPDATED, Name: user.Name, UserId: user.UserId };
}