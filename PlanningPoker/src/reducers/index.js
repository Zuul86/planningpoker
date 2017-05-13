import {combineReducers} from 'redux';
import cards from './cardReducer';
import clients from './clientReducer.js';

const rootReducer = combineReducers({
    cards,
    clients
});

export default rootReducer;