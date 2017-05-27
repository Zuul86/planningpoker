import * as types from './actionTypes';

export function clientConnected(connection) {
    return { type: types.CLIENT_CONNECTED, NumberOfClients: connection.NumberOfClients, UserId: connection.UserId};
}

export function clientDisconnected(connection) {
    return { type: types.CLIENT_DISCONNECTED, NumberOfClients: connection.NumberOfClients, UserId: connection.UserId };
}