import { useEffect, useState } from 'react'
import './App.css'
import MyCards from './components/MyCards/MyCards'
import PlayerStatus from './components/PlayerStatus/PlayerStatus';
import ResultsPanel from './components/ResultsPanel/ResultsPanel';

const mySocket = new WebSocket("wss://o9w0z89o6f.execute-api.us-west-2.amazonaws.com/production/");

function App() {

  const [tableName, setTableName] = useState('');
  const [userName, setUserName] = useState('');
  const [tableUsers, setTableUsers] = useState([]);
  const [userVotes, setUserVotes] = useState([] as {user: string, effort: number}[]);
  const [revealEfforts, setRevealEfforts] = useState(false);

  useEffect(()=>{
    mySocket.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      if(payload.message === 'notifyjoined'){
        setTableUsers(payload.userName)
      } else if(payload.message === 'notify-vote'){
        setUserVotes(payload.votes)
      } else if(payload.message === 'reveal-efforts'){
        const revealToggle = !revealEfforts;
        setRevealEfforts(revealToggle);
      }
    }
  }, [])
  
  const joinTable = () => {
    const myAction = {
      action: 'join-table',
      tableName: tableName,
      userName: userName
    }
    mySocket.send(JSON.stringify(myAction));
  }

  const handleVote = (effort: Number) => {
    const myAction = {
      action: 'vote-effort',
      tableName: tableName,
      effort: effort
    }
    mySocket.send(JSON.stringify(myAction));
  };

  const handleReveal = () => {
    const myAction = {
      action: 'reveal-efforts',
      tableName: tableName
    }
    mySocket.send(JSON.stringify(myAction));
  };

  function handleResetVotes(): void {
    const myAction = {
      action: 'reset-vote',
      tableName: tableName
    }
    mySocket.send(JSON.stringify(myAction));
  }

  return (
    <div className='container'>
      <div className='top'>
        <div>
          <label>Table Name:<input name='tableName' type='text' onChange={(e) => setTableName(e.target.value)} /></label>
          <label>Name:<input name='userName' type='text' onChange={(e) => setUserName(e.target.value)} /></label>
          <button type='button' onClick={joinTable}>Join Table</button>
        </div>
        <div>
          <button type='button' onClick={handleReveal}>Reveal</button>
          <button type='button'onClick={handleResetVotes}>Reset Votes</button>
        </div>
      </div>
      <div className='player-status-bar'>
        <PlayerStatus users={tableUsers} usersWhoVoted={userVotes.map(u => (u.user))}></PlayerStatus>
      </div>
      <div className={revealEfforts ? 'results-panel reveal': 'results-panel'}>
        <ResultsPanel efforts={userVotes.map(u => (u.effort))} />
      </div>
      <div className='bottom'>
        <MyCards handleVote={handleVote}></MyCards>
      </div>
    </div>
  );
}

export default App
