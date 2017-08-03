import {combineReducers} from 'redux';
import cards from './cardReducer';
import clients from './clientReducer';
import screen from './screenReducer';
import table from './tableReducer';
import users from './userReducer';

const rootReducer = combineReducers({
    cards,
    clients,
    screen,
    table,
    users
});

export default rootReducer;