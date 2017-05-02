import "babel-polyfill";
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MyCards from './MyCards';
import TeamCards from './TeamCards';
import PokerWebSocket from '../utils/PokerWebSocket';
import * as actionCreators from '../actions/cardActions';

class Main extends React.Component {
    render(){
        const socket = new PokerWebSocket('ws://'+ window.location.host +'/PlanningPokerWebSocketHandler.ashx', this.props);
        return(
            <div>
                <TeamCards cards={this.props.cards} />
                <MyCards socket={socket} />
            </div>
        );
    }
}

Main.propTypes = {
    cards: PropTypes.array
};

function mapStateToProps(state = {}){
    return {
        cards: state.cards || []
    };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators(actionCreators, dispatch);
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;