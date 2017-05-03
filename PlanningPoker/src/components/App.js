import "babel-polyfill";
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MyCards from './MyCards';
import TeamCards from './TeamCards';
import PokerWebSocket from '../utils/PokerWebSocket';
import * as actionCreators from '../actions/cardActions';

class Main extends React.Component {   

    componentWillMount(){
        this.socket = this.socket || new PokerWebSocket(this.props);
        this.send = (x) => this.socket.sendMessage(x);
    }

    render(){
        return(
            <div>
                <TeamCards cards={this.props.cards} />
                <MyCards onCardClick={this.send} />
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