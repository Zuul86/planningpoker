import React, {PropTypes} from 'react';

const TeamCards = (props) => {
        return (
            <div>
                <div>Number of team members: {props.numberOfClients}</div>
                {props.cards.map((item)=> {
                    return <div key={item.UserId.toString()}>{item.Effort}</div>;
                })}
            </div>);
};

TeamCards.propTypes = {
    cards: PropTypes.array,
    numberOfClients: PropTypes.number
};

export default TeamCards;