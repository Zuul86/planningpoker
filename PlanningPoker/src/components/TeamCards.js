import React, { PropTypes } from 'react';
import TeamCard from './TeamCard';
import PlayerStatus from './PlayerStatus';
import '../styles/card.css';
import _ from 'underscore';

class TeamCards extends React.Component {
    constructor() {
        super();
        
        this.state = { showEffort: false };
        this.toggleShowEffort = this.toggleShowEffort.bind(this);
        this.resetTable = this.resetTable.bind(this);
        this.nameChanged = this.nameChanged.bind(this);

        this.sendName = _.debounce(this.sendName, 750);
    }

    groupCards(cards) {
        const groupedArray = [];
        cards.forEach((card) => {
            const foundCard = groupedArray.find(item => {
                item = item || {};
                return item.Effort === card.Effort;
            });

            if (foundCard) {
                foundCard.Count++;
            } else {
                const newCard = Object.assign({}, card, { Count: 1 });
                groupedArray.push(newCard);
            }
        });

        return groupedArray.sort((a, b) => { return b.Count - a.Count; });
    }

    sendName(value) {
        this.props.onNameChange(JSON.stringify({ type: 'userName', value }));
    }

    nameChanged(e) {
        this.sendName(e.target.value);
    }

    toggleShowEffort() {
        this.props.onRevealClick(JSON.stringify({ type: 'reveal', value: true }));
    }

    resetTable(){
        this.props.onResetTableClick(JSON.stringify({ type: 'reset', value: true }));
    }
    
    render() {
        const groupedCards = this.groupCards(this.props.cards);

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-3">Number of team members: {this.props.numberOfClients}</div>
                    <div className="col-md-3">Table: {this.props.table}</div>
                    <div className="col-md-3">Name: <input type="textbox" value={this.props.userName} onChange={this.nameChanged} /></div>
                    <div className="col-md-3 text-right">
                        <input type="button" className="btn btn-danger" value="Reset" onClick={this.resetTable} />&nbsp; 
                        <input type="button" className="btn btn-success" value="Reveal" onClick={this.toggleShowEffort} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <PlayerStatus numberOfPlayers={this.props.numberOfClients} numberOfSelected={this.props.cards.length} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        {groupedCards.map(item => {
                            return (<TeamCard key={item.UserId.toString()} card={item} showEffort={this.props.showCards} />);
                        })}</div>
                </div>
            </div>);
    }
}

TeamCards.propTypes = {
    cards: PropTypes.array,
    numberOfClients: PropTypes.number,
    onRevealClick: PropTypes.func,
    onResetTableClick: PropTypes.func,
    onNameChange: PropTypes.func,
    showCards: PropTypes.bool,
    table: PropTypes.string,
    userName: PropTypes.string,
    users: PropTypes.array
};

export default TeamCards;