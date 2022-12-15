function MyCard({ cardNumber, selectedCard, onCardClick }: { cardNumber: Number, selectedCard: Number, onCardClick:Function }) {
    const selectedClass = () => {
        return selectedCard === cardNumber ? 'card selectable cardSelected' : 'card selectable';
    }

    return (
        <div className={selectedClass()} onClick={() => onCardClick(cardNumber)}>
            <div>{cardNumber.toString()}</div>
        </div>
    )
}

export default MyCard