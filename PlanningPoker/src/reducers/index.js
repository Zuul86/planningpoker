import {combineReducers} from 'redux';
import cards from './cardReducer';
import clients from './clientReducer';
import screen from './screenReducer';

const rootReducer = combineReducers({
    cards,
    clients,
    screen
});

export default rootReducer;