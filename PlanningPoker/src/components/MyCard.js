import React from 'react';
import '../styles/mycard.css';

const MyCard = ({cardNumber, onCardClick}) =>  {
    const _handleClick = () => {
        onCardClick(cardNumber);
    };

    return <div className="card" onClick={_handleClick}><div>{cardNumber}</div></div>;  
};

MyCard.propTypes = {
    cardNumber: React.PropTypes.number,
    onCardClick: React.PropTypes.func
};

export default (MyCard);