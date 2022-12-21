const PlayerStatus = ({users, usersWhoVoted}:{users:string[], usersWhoVoted:string[]}) => {
    const usersAtTable = users.map((i) => {
        return(<div key={i} className={usersWhoVoted.includes(i) ? 'highlighted' : ''}>{i}</div>);
    });

    return <div className="player-status-container">{usersAtTable}</div>;
};

export default PlayerStatus;