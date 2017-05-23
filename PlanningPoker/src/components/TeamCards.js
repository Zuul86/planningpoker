import React, { PropTypes } from 'react';
import '../styles/teamcards.css';

function groupCards(cards) {
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

const TeamCards = (props) => {
        return (
            <div>
                <div>Number of team members: {props.numberOfClients}</div>
                {groupCards(props.cards).map((item)=> {
                    return (<div className="teamcard" key={item.UserId.toString()}>
                        {item.Effort}
                        <span className="badge">{item.Count}</span>
                    </div>);
                })}
            </div>);
};

TeamCards.propTypes = {
    cards: PropTypes.array,
    numberOfClients: PropTypes.number
};

export default TeamCards;