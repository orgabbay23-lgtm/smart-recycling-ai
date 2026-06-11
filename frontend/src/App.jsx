import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import RecycleScan from './pages/RecycleScan'
import FreshnessScan from './pages/FreshnessScan'
import Statistics from './pages/Statistics'
import History from './pages/History'
import Quiz from './pages/Quiz'
import About from './pages/About'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/recycle" element={<RecycleScan />} />
        <Route path="/freshness" element={<FreshnessScan />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/history" element={<History />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/about" element={<About />} />
        {/* Redirect the old route and any unknown path so the app never blanks out */}
        <Route path="/dashboard" element={<Navigate to="/statistics" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
