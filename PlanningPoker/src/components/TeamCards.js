import React, {PropTypes} from 'react';

const TeamCards = (props) => {
    return (
        <div>
            <div><input type="button" value="Join Table" /></div>
            {props.cards.map((item)=> {
                return <div key={item.UserId.toString()}>{item.Effort}</div>;
            })}
        </div>);
};

TeamCards.propTypes = {
    cards: PropTypes.array
};

export default TeamCards;