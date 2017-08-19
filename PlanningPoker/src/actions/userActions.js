import * as types from './actionTypes';

export function updateName(user) {
    return { type: types.USER_UPDATED, Name: user.Name, UserId: user.UserId };
}

export function userConnected(connection) {
    return { type: types.USER_CONNECTED, Users: connection.Users, UserId: connection.UserId, TableId: connection.TableId };
}

export function userDisconnected(connection) {
    return { type: types.USER_DISCONNECTED, Users: connection.Users, UserId: connection.UserId };
}