import { useState } from 'react'
import './App.css'
import MyCards from './components/MyCards/MyCards'

function App() {

  const [tableName, setTableName] = useState('');
  const [userName, setUserName] = useState('');

  return (
    <div className='container'>
      <div className='top'>
        <div>
          <label>Table Name:<input name='tableName' type='text' onChange={(e) => setTableName(e.target.value)} /></label>
          <label>Name:<input name='userName' type='text' onChange={(e) => setUserName(e.target.value)} /></label>
          <button type='button'>Join Table</button>
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
