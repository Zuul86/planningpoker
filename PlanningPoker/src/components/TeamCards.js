import React, { PropTypes } from 'react';
import TeamCard from './TeamCard';
import '../styles/card.css';

class TeamCards extends React.Component {
    constructor() {
        super();
        
        this.state = { showEffort: false };
        this.toggleShowEffort = this.toggleShowEffort.bind(this);
        this.resetTable = this.resetTable.bind(this);
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


    toggleShowEffort() {
        this.props.onRevealClick(JSON.stringify({ type: 'reveal', value: true }));
    }

    resetTable(){
        this.props.onResetTableClick(JSON.stringify({ type: 'reset', value: true }));
    }
    
    render() {
        const groupedCards = this.groupCards(this.props.cards);
        const revealEnabled = this.props.numberOfClients === this.props.cards.length;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6">Number of team members: {this.props.numberOfClients}</div>
                    <div className="col-md-6 text-right">
                        <input type="button" className="btn btn-danger" value="Reset" onClick={this.resetTable} />&nbsp; 
                        <input type="button" className="btn btn-success" value="Reveal" onClick={this.toggleShowEffort} disabled={!revealEnabled} />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        {groupedCards.map(item => {
                            return (<TeamCard key={item.UserId.toString()} card={item} showEffort={this.props.showCards} />);
                        })}</div>
                </div>
                {/*<div className="row">
                    <div className="col-md-12 text-center">
                        <span className="glyphicon glyphicon-menu-up" style={shareDisplayButton} />
                    </div>
                </div>*/}
            </div>);
    }
}

const shareDisplayButton = {
    border: 'solid black thin',
    width: '5em'
};

TeamCards.propTypes = {
    cards: PropTypes.array,
    numberOfClients: PropTypes.number,
    onRevealClick: PropTypes.func,
    onResetTableClick: PropTypes.func,
    showCards: PropTypes.bool
};

export default TeamCards;