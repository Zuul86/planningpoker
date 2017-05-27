import React, { PropTypes } from 'react';
import TeamCard from './TeamCard';
import '../styles/teamcards.css';

class TeamCards extends React.Component {
    constructor() {
        super();
        
        this.state = { showEffort: false };
        this.toggleShowEffort = this.toggleShowEffort.bind(this);
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

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-4">Number of team members: {this.props.numberOfClients}</div>
                    <div className="col-md-4 col-md-offset-4 text-right"><input type="button" value="Reveal" onClick={this.toggleShowEffort} /></div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        {this.groupCards(this.props.cards).map(item => {
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
    showCards: PropTypes.bool
};

export default TeamCards;