import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VisitorMap from './components/VisitorMap';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil - Vue Visiteur */}
        <Route path="/" element={<VisitorMap />} />
        
        {/* Page de connexion */}
        <Route path="/login" element={<Login />} />
        
        {/* Futures routes */}
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        {/* <Route path="/manager" element={<ManagerDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App; 