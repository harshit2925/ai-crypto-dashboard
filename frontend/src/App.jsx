import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import Auth from './pages/Auth/Auth'
import './App.css'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/" element={<Auth />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPlaceholder /></ProtectedRoute>} />
          <Route path="/portfolio" element={<ProtectedRoute><PortfolioPlaceholder /></ProtectedRoute>} />
          <Route path="/ai-chat" element={<ProtectedRoute><AiChatPlaceholder /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}
    </Routes>
  )
}

function DashboardPlaceholder() {
  const { user, logout } = useAuth()
  
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#e2e8f0' }}>
      <h1>Welcome, {user?.name}! 👋</h1>
      <p>Dashboard coming soon...</p>
      <p>Email: {user?.email}</p>
      <button 
        onClick={logout}
        style={{
          padding: '10px 20px',
          background: '#00d9ff',
          border: 'none',
          borderRadius: '8px',
          color: '#0f172a',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Logout
      </button>
    </div>
  )
}

function PortfolioPlaceholder() {
  const { logout } = useAuth()
  
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#e2e8f0' }}>
      <h1>Portfolio Page</h1>
      <p>Portfolio management coming soon...</p>
      <button 
        onClick={logout}
        style={{
          padding: '10px 20px',
          background: '#00d9ff',
          border: 'none',
          borderRadius: '8px',
          color: '#0f172a',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Logout
      </button>
    </div>
  )
}

function AiChatPlaceholder() {
  const { logout } = useAuth()
  
  return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#e2e8f0' }}>
      <h1>AI Chat Page</h1>
      <p>Chat interface coming soon...</p>
      <button 
        onClick={logout}
        style={{
          padding: '10px 20px',
          background: '#00d9ff',
          border: 'none',
          borderRadius: '8px',
          color: '#0f172a',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Logout
      </button>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App