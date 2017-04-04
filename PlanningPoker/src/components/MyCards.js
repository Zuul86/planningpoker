import React, {PropTypes} from 'react';
import MyCard from './MyCard';
import '../styles/mycards.css';

const MyCards = ({cards = [.5, 1, 2, 3, 5, 8, 13, 21 ], onSelectCardClick}) => {
    return (
        <div className="bottom-panel">
            {cards.map(item=>{
                return <MyCard key={item.toString()} cardNumber={item} onClick={onSelectCardClick} />;
            })}
        </div>
    );
};

MyCards.propTypes = {
    cards: PropTypes.array,
    onSelectCardClick: PropTypes.func
};

export default MyCards;