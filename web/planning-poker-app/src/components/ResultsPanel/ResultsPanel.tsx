import TeamCard from "../TeamCard/TeamCard";

function ResultsPanel({cards}:{cards:{user: string, effort: number}[]}) {

    function groupCards(cards:{user: string, effort: number}[]) : {Effort: Number, Count: Number}[] {
       return [
        {Effort: 3, Count: 2},
        {Effort: 1, Count: 3},
       ].sort((a, b) => { return b.Count - a.Count; })
    }
    
    const groupedCards = groupCards(cards);
    return <div>{groupedCards.map(item => {
        return (<TeamCard key={item.Effort.toString()} card={item} showEffort={true} />);
    })}</div>
}

export default ResultsPanel;