import React, {PropTypes} from 'react';
import MyCard from './MyCard';
import '../styles/mycards.css';

const MyCards = ({socket}) => {
    return (
        <div className="bottom-panel">
            {[.5, 1, 2, 3, 5, 8, 13, 21 ].map(item=>{
                return <MyCard key={item.toString()} cardNumber={item} socket={socket} />;
            })}
        </div>
    );
};

MyCards.propTypes = {
    cards: PropTypes.array,
    socket: PropTypes.object
};

export default MyCards;