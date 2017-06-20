import * as types from './actionTypes';

export function clientConnected(connection) {
    return { type: types.CLIENT_CONNECTED, NumberOfClients: connection.NumberOfClients, UserId: connection.UserId, TableId: connection.TableId };
}

export function clientDisconnected(connection) {
    return { type: types.CLIENT_DISCONNECTED, NumberOfClients: connection.NumberOfClients, UserId: connection.UserId };
}