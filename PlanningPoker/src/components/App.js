import "babel-polyfill";
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import MyCards from './MyCards';
import TeamCards from './TeamCards';
import PokerWebSocket from '../utils/PokerWebSocket';
import * as cardActions from '../actions/cardActions';
import * as screenActions from '../actions/screenActions';
import * as userActions from '../actions/userActions';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/js/bootstrap';
import '../styles/panel.css';

class Main extends React.Component {   

    componentWillMount() {
        this.socket = this.socket || new PokerWebSocket(this.props);
        this.send = (x) => {
            this.socket.sendMessage(x);
            const message = JSON.parse(x);
            if (message.type === 'effort') {
                this.selectedCard = message.value;
            }
        };
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextProps.cards.length === 0) {
            this.selectedCard = 0;
        }   
    }

    findSelectedCard(selectedCard){
        const result = this.props.cards.find((x) => { return x.Effort === selectedCard.toString(); });
        return result ? Number(result.Effort) : 0;
    }

    render() {
        return(
            <div>
                <TeamCards cards={this.props.cards} showCards={this.props.screen.showCards} table={this.props.table} onRevealClick={this.send} onResetTableClick={this.send} onNameChange={this.send} users={this.props.users} />
                <div className="bottom">
                    <MyCards onCardClick={this.send} selectedCard={this.findSelectedCard(this.selectedCard)} />
                </div>
            </div>
        );
    }
}

Main.propTypes = {
    cards: PropTypes.array,
    screen: PropTypes.object,
    table: PropTypes.string,
    users: PropTypes.array
};

function mapStateToProps(state = { screen: {} }) {
    return {
        cards: state.cards || [],
        screen: state.screen,
        table: state.table,
        users: state.users || []
    };
}

function mapDispatchToProps(dispatch){
    return {
        actions: {
            cardActions: bindActionCreators(cardActions, dispatch),
            screenActions: bindActionCreators(screenActions, dispatch),
            userActions: bindActionCreators(userActions, dispatch)
        }
    };
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;