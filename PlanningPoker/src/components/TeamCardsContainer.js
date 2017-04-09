import {connect} from 'react-redux';
import TeamCards from './TeamCards';

const mapStateToProps = (state) => {
    const effort = state.cards[0] ? state.cards[0].effort : 0;
    return {
        effort
    };
};

const TeamCardsContainer = connect(mapStateToProps)(TeamCards);

export default TeamCardsContainer;