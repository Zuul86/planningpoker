import { useEffect, useState } from 'react'
import './App.css'
import MyCards from './components/MyCards/MyCards'

const mySocket = new WebSocket("wss://733l6u90dc.execute-api.us-west-2.amazonaws.com/dev");

function App() {

  const [tableName, setTableName] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(()=>{


    mySocket.onmessage = (e) => {
      console.log('MESSAGE: ');
      console.log(e);
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
      <div></div>
      <div className='bottom'>
        <MyCards></MyCards>
      </div>
    </div>
  );
}

export default App
