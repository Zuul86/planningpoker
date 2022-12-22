import TeamCard from "../TeamCard/TeamCard";

function ResultsPanel({ efforts }: { efforts: number[] }) {

    function groupCards(efforts: number[]): { Effort: Number, Count: Number }[] {

        const effortCounts = new Map<number, number>();

        efforts.forEach(effort => {
            const currentCount = effortCounts.get(effort)
            effortCounts.set(effort, currentCount ? currentCount + 1: 1)
        })
        
        const results: { Effort: number, Count: number }[] = [];

        effortCounts.forEach((count, effort) => {
            results.push({ Effort: effort, Count: count })
        })
        return results.sort((a, b) => { return b.Count - a.Count; })
    }

    return (<>
        {groupCards(efforts).map(item => {
            return (<TeamCard key={item.Effort.toString()} card={item} showEffort={false} />);
        })}
    </>);
}

export default ResultsPanel;