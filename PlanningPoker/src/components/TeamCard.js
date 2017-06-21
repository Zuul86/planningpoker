import React, { PropTypes } from 'react';
import '../styles/card.css';

const TeamCard = ({ card, showEffort }) => {
    return (<div className="card large">
        {showEffort ? card.Effort : <div className="glyphicon glyphicon-ok-circle" />}
        {showEffort && 
            <span className="badge">
                {card.Count}
            </span>
        }
    </div>);
};

TeamCard.propTypes = {
    card: PropTypes.object.isRequired,
    showEffort: PropTypes.bool.isRequired
};

export default TeamCard;