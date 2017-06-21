import React, { PropTypes } from 'react';
import '../styles/status.css';

function highlightStatus(currentIndicatorIndex, numberOfSelected){
    return currentIndicatorIndex > numberOfSelected ? 'highlight': '';
}

const PlayerStatus = ({numberOfPlayers, numberOfSelected}) => {
    const indicators = [];
    for (let i = 0; i < numberOfPlayers; i++) {
        indicators.push(<div className={highlightStatus(numberOfSelected, i)} key={i} />);
    }
    return (
        <div className="status">{indicators}</div>
    );
};

PlayerStatus.propTypes = {
    numberOfPlayers: PropTypes.number,
    numberOfSelected: PropTypes.number
};

export default PlayerStatus;