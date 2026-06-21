import { HashRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { NewEntry } from './pages/NewEntry'
import { History } from './pages/History'
import { EntryDetail } from './pages/EntryDetail'
import { SubtleSystem } from './pages/SubtleSystem'
import { Trends } from './pages/Trends'
import { Calendar } from './pages/Calendar'
import { Affirmations } from './pages/Affirmations'
import { Settings } from './pages/Settings'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewEntry />} />
          <Route path="/history" element={<History />} />
          <Route path="/history/:id" element={<EntryDetail />} />
          <Route path="/subtle-system" element={<SubtleSystem />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/affirmations" element={<Affirmations />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
