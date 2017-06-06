import React from 'react';
import '../styles/card.css';

const MyCard = ({cardNumber, onCardClick}) =>  {
    const _handleClick = () => {
        onCardClick(JSON.stringify({ type: 'effort', value: cardNumber }));
    };

    return (<div className="card selectable" onClick={_handleClick}>
        <div>{cardNumber}</div>
    </div>);  
};

MyCard.propTypes = {
    cardNumber: React.PropTypes.number,
    onCardClick: React.PropTypes.func
};

export default (MyCard);