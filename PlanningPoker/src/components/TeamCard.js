import React, { PropTypes } from 'react';
import '../styles/card.css';

const TeamCard = ({ card, showEffort }) => {
    return (showEffort &&
        <div className="card large">
            {card.Effort}
            <span className="badge">
                {card.Count}
            </span>

        </div>);
};

TeamCard.propTypes = {
    card: PropTypes.object.isRequired,
    showEffort: PropTypes.bool.isRequired
};

export default TeamCard;