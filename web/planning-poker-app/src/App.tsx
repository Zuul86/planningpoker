import './App.css'
import MyCards from './components/MyCards/MyCards'

function App() {
  return (
    <div>
      <div></div>
      <div className='bottom'>
        <MyCards selectedCard={1}></MyCards>
      </div>
    </div>
  )
}

export default App
