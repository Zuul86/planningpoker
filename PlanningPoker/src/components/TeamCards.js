import React, {PropTypes} from 'react';

const TeamCards = (props) => {
    return <div>{props.effort}</div>;
};

TeamCards.propTypes = {
    effort: PropTypes.number
};

export default TeamCards;