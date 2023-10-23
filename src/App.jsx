import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/layout/layout'
import BuildTeam from './components/build-teams/buildTeams'
import AdminPlayers from './components/admin-players/admin-players';
import './App.scss'

function App() {

  return (
    <>    
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<BuildTeam/>} />
          <Route path="admin-players" element={<AdminPlayers />} />
          <Route path="*" element={<BuildTeam />} />
        </Route>
      </Routes>
    </BrowserRouter>
      </>
  )
}

export default App
