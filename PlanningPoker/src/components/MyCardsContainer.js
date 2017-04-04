import {connect} from 'react-redux';
import * as cardActions from '../actions/cardActions';
import MyCards from '../components/MyCards';

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSelectCardClick: (effort) => {
            dispatch(cardActions.selectCard(effort));
        }
    };
};

const MyCardsContainer = connect(mapStateToProps, mapDispatchToProps)(MyCards);

export default MyCardsContainer;