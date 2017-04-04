import {connect} from 'react-redux';
import TeamCards from './TeamCards';

const mapStateToProps = (state) => {
    return {
        effort: state.card.effort
    };
};

const TeamCardsContainer = connect(mapStateToProps)(TeamCards);

export default TeamCardsContainer;