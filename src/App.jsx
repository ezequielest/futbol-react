import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/layout/layout'
import BuildTeam from './components/build-teams/buildTeams'
import AdminPlayers from './components/admin-players/admin-players';
import NextTeam from './components/next-team/next-team';
import './App.scss'

function App() {

  return (
    <>
    <BrowserRouter basename="/lacancha2">
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<NextTeam/>} />
          <Route path="admin-players" element={<AdminPlayers />} />
          <Route path="build-team" element={<BuildTeam />} />
          <Route path="next-team" element={<NextTeam />} />
          <Route path="*" element={<NextTeam />} />
        </Route>
      </Routes>
    </BrowserRouter>
      </>
  )
}

export default App
