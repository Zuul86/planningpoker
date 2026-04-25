import { useEffect, useState, useRef } from 'react'
import './App.css'
import MyCards from './components/MyCards/MyCards'
import PlayerStatus from './components/PlayerStatus/PlayerStatus';
import ResultsPanel from './components/ResultsPanel/ResultsPanel';
import { Message } from './enums/message.enum';

const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;

function App() {

  const [tableName, setTableName] = useState('');
  const [userName, setUserName] = useState('');
  const [tableUsers, setTableUsers] = useState([]);
  const [userVotes, setUserVotes] = useState([] as {user: string, effort: number}[]);
  const [revealEfforts, setRevealEfforts] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let isMounted = true;
    let reconnectTimeout: ReturnType<typeof setTimeout>;

    const connect = () => {
      const socket = new WebSocket(WEBSOCKET_URL);
      socketRef.current = socket;

      socket.onmessage = (e: MessageEvent) => {
        const payload = JSON.parse(e.data);
        switch (payload.message) {
          case Message.UserJoined:
            setTableUsers(payload.userName);
            break;
          case Message.UserVoted:
            setUserVotes(payload.votes);
            if (payload.votes.length === 0) {
              setRevealEfforts(false);
            }
            break;
          case Message.RevealEfforts:
            setRevealEfforts(true);
            break;
        }
      };

      socket.onclose = () => {
        if (isMounted) {
          console.log('WebSocket disconnected. Reconnecting in 3 seconds...');
          reconnectTimeout = setTimeout(connect, 3000);
        }
      };
    };

    connect();

    return () => {
      isMounted = false;
      clearTimeout(reconnectTimeout);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  
  const sendAction = (action: string, extraData: Record<string, any> = {}) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ action, tableName, ...extraData }));
    } else {
      console.warn('WebSocket is not connected. Message not sent.');
    }
  };

  const joinTable = () => {
    sendAction(Message.JoinTable, { userName });
  };

  const handleVote = (effort: number) => {
    sendAction(Message.UserVoted, { effort });
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
          <button type='button' onClick={handleReveal} disabled={revealEfforts}>Reveal</button>
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
        <MyCards handleVote={handleVote} reset={userVotes.length === 0}></MyCards>
      </div>
    </div>
  );
}

export default App
