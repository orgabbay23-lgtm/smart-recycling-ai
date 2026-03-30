import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import RecycleScan from './pages/RecycleScan'
import FreshnessScan from './pages/FreshnessScan'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/recycle" element={<RecycleScan />} />
        <Route path="/freshness" element={<FreshnessScan />} />
      </Route>
    </Routes>
  )
}

export default App
