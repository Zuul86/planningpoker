import {combineReducers} from 'redux';
import cards from './cardReducer';
import screen from './screenReducer';
import table from './tableReducer';
import users from './userReducer';

const rootReducer = combineReducers({
    cards,
    screen,
    table,
    users
});

export default rootReducer;