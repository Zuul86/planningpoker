import React from 'react';
import '../styles/mycard.css';

const MyCard = ({cardNumber, onClick}) =>  {
    const _handleClick = () => {
        onClick(cardNumber);
    };

    return <div className="card" onClick={_handleClick}><div>{cardNumber}</div></div>;  
};

MyCard.propTypes = {
    cardNumber: React.PropTypes.number,
    onClick: React.PropTypes.func.isRequired
};

export default (MyCard);