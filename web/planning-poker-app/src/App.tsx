import { useEffect, useState } from 'react'
import './App.css'
import MyCards from './components/MyCards/MyCards'
import PlayerStatus from './components/PlayerStatus/PlayerStatus';
import ResultsPanel from './components/ResultsPanel/ResultsPanel';

const mySocket = new WebSocket("wss://733l6u90dc.execute-api.us-west-2.amazonaws.com/dev");

function App() {

  const [tableName, setTableName] = useState('');
  const [userName, setUserName] = useState('');
  const [tableUsers, setTableUsers] = useState([]);
  const [userVotes, setUserVotes] = useState([{user: '', effort: 0}] as {user: string, effort: number}[]);

  useEffect(()=>{
    mySocket.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      if(payload.message === 'notifyjoined'){
        setTableUsers(payload.userName)
      } else if(payload.message === 'notify-vote'){
        setUserVotes(payload.votes)
      }
    }
  }, [])
  
  const joinTable = () => {
    const myAction = {
      action: 'jointable',
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

  return (
    <div className='container'>
      <div className='top'>
        <div>
          <label>Table Name:<input name='tableName' type='text' onChange={(e) => setTableName(e.target.value)} /></label>
          <label>Name:<input name='userName' type='text' onChange={(e) => setUserName(e.target.value)} /></label>
          <button type='button' onClick={joinTable}>Join Table</button>
        </div>
        <div>
          <button type='button'>Reveal</button>
          <button type='button'>Reset Votes</button>
        </div>
      </div>
      <div className='player-status-bar'>
        <PlayerStatus users={tableUsers} usersWhoVoted={userVotes.map(u => (u.user))}></PlayerStatus>
      </div>
      <div className='results-panel'>
        <ResultsPanel cards={userVotes} />
      </div>
      <div className='bottom'>
        <MyCards handleVote={handleVote}></MyCards>
      </div>
    </div>
  );
}

export default App
