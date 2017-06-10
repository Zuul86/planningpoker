import React, {PropTypes} from 'react';
import MyCard from './MyCard';
import '../styles/panel.css';

const MyCards = ({onCardClick, selectedCard}) => {
    return (
        <div className="bottom-panel">
            {[.5, 1, 2, 3, 5, 8, 13, 20 ].map(item=>{
                return <MyCard key={item.toString()} cardNumber={item} onCardClick={onCardClick} selectedCard={selectedCard} />;
            })}
        </div>
    );
};

MyCards.propTypes = {
    cards: PropTypes.array,
    onCardClick: PropTypes.func,
    selectedCard: PropTypes.number
};

export default MyCards;