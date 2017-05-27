import React, { PropTypes } from 'react';
import '../styles/teamcards.css';

const TeamCard = ({ card, showEffort }) => {
    return (<div className="teamcard">
        {showEffort ? (card.Effort) : (<div className="glyphicon glyphicon-ok-circle" />)}
        <span className="badge">{card.Count}</span>
    </div>);
};

TeamCard.propTypes = {
    card: PropTypes.object.isRequired,
    showEffort: PropTypes.bool.isRequired
};

export default TeamCard;