import React, { PropTypes } from 'react';
import '../styles/status.css';

function highlightStatus(currentUserId, cards) {
    const userSelected = cards.some((item) => { return item.UserId === currentUserId; });
    return userSelected ? 'highlight': '';
}

const PlayerStatus = ({users, cards}) => {
    const indicators = [];
    for (let i = 0; i < users.length; i++) {
        indicators.push(
            <div className={highlightStatus(users[i].UserId, cards)} key={i}>
                <div className="userName">{users[i].Name}</div>
            </div>);
    }
    return (
        <div className="status">{indicators}</div>
    );
};

PlayerStatus.propTypes = {
    users: PropTypes.array,
    cards: PropTypes.array
};

export default PlayerStatus;