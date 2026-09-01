import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Import pages (we'll create these)
// import Home from './pages/Home/Home'
// import Dashboard from './pages/Dashboard/Dashboard'
// import Portfolio from './pages/Portfolio/Portfolio'
// import AiChat from './pages/AiChat/AiChat'

function App() {
  return (
    <Router>
      <div className="app">
        {/* Header will go here */}
        
        <Routes>
          {/* Routes will go here */}
          <Route path="/" element={<div>Home Page (Coming Soon)</div>} />
          <Route path="/dashboard" element={<div>Dashboard (Coming Soon)</div>} />
          <Route path="/portfolio" element={<div>Portfolio (Coming Soon)</div>} />
          <Route path="/ai-chat" element={<div>AI Chat (Coming Soon)</div>} />
        </Routes>

        {/* Footer will go here */}
      </div>
    </Router>
  )
}

export default App
