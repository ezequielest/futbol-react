import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from './components/sidebar/sidebar'
import BuildTeam from './components/build-teams/buildTeams'
import './App.scss'

function App() {
  const [count, setCount] = useState(0)

  const addPlayers = () => {
    console.log('addplayer')
  }

  const refresh = () => {
    console.log('refresh')
  }

  return (
    <>
    <div className='layout-container'>
      <div className='sidebar-container'>
        <Sidebar/>
      </div>
      <div className='pages-container'>
        <BuildTeam/>
      </div>
    </div>
    </>
  )
}

export default App
