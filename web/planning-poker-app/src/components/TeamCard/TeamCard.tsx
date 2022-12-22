function TeamCard({ card, showEffort }:{card:{Effort:Number, Count:Number}, showEffort:boolean}){
    return (
        <div className="card large">
            {card.Effort.toString()}
            <span className="badge">
                {card.Count.toString()}
            </span>
        </div>);
};

export default TeamCard;