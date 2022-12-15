function MyCard({ cardNumber, selectedCard }: { cardNumber: Number, selectedCard: Number }) {
    const selectedClass = () => {
        return selectedCard === cardNumber ? 'card selectable cardSelected' : 'card selectable';
    }

    return (
        <div className={selectedClass()}>
            <div>{cardNumber.toString()}</div>
        </div>
    )
}

export default MyCard