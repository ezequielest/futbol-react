import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/layout/layout'
import BuildTeam from './components/build-teams/buildTeams'
import AdminPlayers from './components/admin-players/admin-players';
import NextTeam from './components/next-team/next-team';
import SeePlayersPoints from './components/see-players-points/see-players-points'
import Login from './components/login/login'
import './App.scss'

function App() {
  sessionStorage.setItem('isLoggedIn', false);
  return (
    <>
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<NextTeam />} />
          <Route path="login" element={<Login />} />
          <Route path="admin-players" element={<AdminPlayers />} />
          <Route path="build-team" element={<BuildTeam />} />
          <Route path="next-team" element={<NextTeam />} />
          <Route path="see-players-points" element={<SeePlayersPoints />} />
          <Route path="*" element={<NextTeam />} />
        </Route>
      </Routes>
    </BrowserRouter>
      </>
  )
}

export default App
