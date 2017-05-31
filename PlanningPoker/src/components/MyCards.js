import React, {PropTypes} from 'react';
import MyCard from './MyCard';
import '../styles/mycards.css';

const MyCards = ({onCardClick}) => {
    return (
        <div className="bottom-panel">
            {[.5, 1, 2, 3, 5, 8, 13, 20 ].map(item=>{
                return <MyCard key={item.toString()} cardNumber={item} onCardClick={onCardClick} />;
            })}
        </div>
    );
};

MyCards.propTypes = {
    cards: PropTypes.array,
    onCardClick: PropTypes.func
};

export default MyCards;