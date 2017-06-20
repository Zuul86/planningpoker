import "babel-polyfill";
import React, {PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import MyCards from './MyCards';
import TeamCards from './TeamCards';
import ShareTable from './ShareTable';
import PokerWebSocket from '../utils/PokerWebSocket';
import * as cardActions from '../actions/cardActions';
import * as clientActions from '../actions/clientActions';
import * as screenActions from '../actions/screenActions';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/js/bootstrap';
import '../styles/panel.css';

class Main extends React.Component {   

    componentWillMount(){
        this.socket = this.socket || new PokerWebSocket(this.props);
        this.send = (x) => {
            this.socket.sendMessage(x);
            const message = JSON.parse(x);
            if (message.type === 'effort') {
                this.selectedCard = message.value;
            }
        };
    }

    render(){
        return(
            <div>
                <TeamCards cards={this.props.cards} numberOfClients={this.props.numberOfClients} showCards={this.props.screen.showCards} table={this.props.table} onRevealClick={this.send} onResetTableClick={this.send} />
                <div className="bottom">
                    <ShareTable />
                    <MyCards onCardClick={this.send} selectedCard={this.selectedCard} />
                </div>
            </div>
        );
    }
}

Main.propTypes = {
    cards: PropTypes.array,
    numberOfClients: PropTypes.number,
    screen: PropTypes.object
};

function mapStateToProps(state = { screen: {} }) {
    return {
        cards: state.cards || [],
        numberOfClients: state.clients,
        screen: state.screen,
        table: state.table
    };
}

function mapDispatchToProps(dispatch){
    return {
        actions: {
            cardActions: bindActionCreators(cardActions, dispatch),
            clientActions: bindActionCreators(clientActions, dispatch),
            screenActions: bindActionCreators(screenActions, dispatch)
        }
    };
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;