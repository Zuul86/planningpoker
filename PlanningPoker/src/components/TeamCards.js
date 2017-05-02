import React, {PropTypes} from 'react';

const TeamCards = (props) => {
    return (
        <div>
            <div><input type="button" value="Join Table" /></div>
            {props.cards.map((item)=> {
                return <div key={item.effort.toString()}>{item.effort}</div>;
            })}
        </div>);
};

TeamCards.propTypes = {
    cards: PropTypes.array
};

export default TeamCards;