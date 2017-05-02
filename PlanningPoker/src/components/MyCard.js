import React from 'react';
import '../styles/mycard.css';

const MyCard = ({cardNumber, socket}) =>  {
    const _handleClick = () => {
        socket.sendMessage(cardNumber);
    };

    return <div className="card" onClick={_handleClick}><div>{cardNumber}</div></div>;  
};

MyCard.propTypes = {
    cardNumber: React.PropTypes.number,
    socket: React.PropTypes.object
};

export default (MyCard);