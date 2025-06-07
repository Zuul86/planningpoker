import { useEffect, useState } from 'react'
import './App.css'
import MyCards from './components/MyCards/MyCards'
import PlayerStatus from './components/PlayerStatus/PlayerStatus';
import ResultsPanel from './components/ResultsPanel/ResultsPanel';
import { Message } from './enums/message.enum';

const mySocket = new WebSocket("wss://o9w0z89o6f.execute-api.us-west-2.amazonaws.com/production/");

function App() {

  const [tableName, setTableName] = useState('');
  const [userName, setUserName] = useState('');
  const [tableUsers, setTableUsers] = useState([]);
  const [userVotes, setUserVotes] = useState([] as {user: string, effort: number}[]);
  const [revealEfforts, setRevealEfforts] = useState(false);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      const payload = JSON.parse(e.data);
      if (payload.message === Message.UserJoined) {
        setTableUsers(payload.userName);
      } else if (payload.message === Message.UserVoted) {
        setUserVotes(payload.votes);
      } else if (payload.message === Message.RevealEfforts) {
        setRevealEfforts(prev => !prev);
      }
    };

    mySocket.addEventListener('message', handleMessage);

    return () => {
      mySocket.removeEventListener('message', handleMessage);
    };
  }, [mySocket]);
  
  const sendAction = (action: string, extraData: Record<string, any> = {}) => {
    mySocket.send(JSON.stringify({ action, tableName, ...extraData }));
  };

  const joinTable = () => {
    sendAction(Message.JoinTable, { userName });
  };

  const handleVote = (effort: number) => {
    sendAction(Message.VoteEffort, { effort });
  };

  const handleReveal = () => {
    sendAction(Message.RevealEfforts);
  };

  const handleResetVotes = () => {
    sendAction(Message.ResetVote);
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
