import React from 'react';
import '../styles/card.css';

class MyCard extends React.Component {
    constructor() {
        super();
        this.handleClick = this.handleClick.bind(this);
    }

    selectedClass() { return this.props.selectedCard === this.props.cardNumber ? 'card selectable cardSelected': 'card selectable'; }

    handleClick() {
        this.props.onCardClick(JSON.stringify({ type: 'effort', value: this.props.cardNumber }));
    }

    render() {
        return (<div className={this.selectedClass()} onClick={this.handleClick}>
            <div>{this.props.cardNumber}</div>
        </div>); 
    }
 
}

MyCard.propTypes = {
    cardNumber: React.PropTypes.number,
    onCardClick: React.PropTypes.func,
    selectedCard: React.PropTypes.number
};

export default MyCard;