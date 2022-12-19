const PlayerStatus = ({users}:{users:string[]}) => {
    const usersAtTable = users.map((i) => {
        return(<div key={i}>{i}</div>);
    });

    return <div className="player-status-container">{usersAtTable}</div>;
};

export default PlayerStatus;