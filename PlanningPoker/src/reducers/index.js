import {combineReducers} from 'redux';
import cards from './cardReducer';
import clients from './clientReducer';
import screen from './screenReducer';
import table from './tableReducer';

const rootReducer = combineReducers({
    cards,
    clients,
    screen,
    table
});

export default rootReducer;