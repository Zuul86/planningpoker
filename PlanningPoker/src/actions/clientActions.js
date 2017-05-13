import * as types from './actionTypes';

export function clientConnected(connection){
    return {type: types.CLIENT_CONNECTED, NumberOfClients: connection.NumberOfClients};
}