import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VisitorMap from './components/VisitorMap';
import Login from './components/Login';
import Manager from './components/Manager';
import UnblockUsers from './components/UnblockUsers';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil - Vue Visiteur */}
        <Route path="/" element={<VisitorMap />} />
        
        {/* Page de connexion */}
        <Route path="/login" element={<Login />} />
        
        {/* Page Manager */}
        <Route path="/manager" element={<Manager />} />
        
        {/* Page déblocage d'utilisateurs */}
        <Route path="/manager/unblock-users" element={<UnblockUsers />} />
      </Routes>
    </Router>
  );
}

export default App; 