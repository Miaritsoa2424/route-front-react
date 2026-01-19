import { useState } from 'react'
import './App.css'
import UserList from './components/UserList'
import SignalementList from './components/SignalementList'
import Login from './components/Login'
import VisitorDashboard from './components/VisitorDashboard'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [activeTab, setActiveTab] = useState('users')

  // Afficher le login si demandé
  if (showLogin && !isLoggedIn) {
    return <Login onBack={() => setShowLogin(false)} onLoginSuccess={() => { setIsLoggedIn(true); setShowLogin(false); }} />
  }

  // Afficher le dashboard visiteur si pas connecté
  if (!isLoggedIn) {
    return <VisitorDashboard onLoginClick={() => setShowLogin(true)} />
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{
        backgroundColor: '#333',
        padding: '20px',
        color: 'white',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: '0 0 20px 0' }}>Route Application</h1>
          <button
            onClick={() => setIsLoggedIn(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Déconnexion
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'users' ? '#4CAF50' : '#555',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Utilisateurs
          </button>
          <button
            onClick={() => setActiveTab('signalements')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'signalements' ? '#4CAF50' : '#555',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Signalements
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'users' && <UserList />}
        {activeTab === 'signalements' && <SignalementList />}
      </div>
    </div>
  )
}

export default App
