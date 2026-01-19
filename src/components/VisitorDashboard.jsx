import { useState } from 'react';
import MapView from './MapView';
import StatsPanel from './StatsPanel';
import '../styles/VisitorDashboard.css';

export default function VisitorDashboard({ onLoginClick }) {
  // Données d'exemple - à remplacer par votre API
  const [problems, setProblems] = useState([
    {
      id: 1,
      lat: 48.8566,
      lng: 2.3522,
      date: '2026-01-15',
      status: 'nouveau',
      surface: 150,
      budget: 25000,
      entreprise: 'RoutesPro SA'
    },
    {
      id: 2,
      lat: 48.8606,
      lng: 2.3376,
      date: '2026-01-10',
      status: 'en cours',
      surface: 300,
      budget: 45000,
      entreprise: 'TravPub Inc'
    },
    {
      id: 3,
      lat: 48.8529,
      lng: 2.3499,
      date: '2025-12-20',
      status: 'terminé',
      surface: 200,
      budget: 32000,
      entreprise: 'RoutesPro SA'
    },
    {
      id: 4,
      lat: 48.8584,
      lng: 2.3450,
      date: '2026-01-12',
      status: 'en cours',
      surface: 180,
      budget: 28000,
      entreprise: 'VoirieExpert'
    },
    {
      id: 5,
      lat: 48.8620,
      lng: 2.3550,
      date: '2026-01-18',
      status: 'nouveau',
      surface: 95,
      budget: 15000,
      entreprise: 'RoutesPro SA'
    }
  ]);

  const stats = {
    totalPoints: problems.length,
    totalSurface: problems.reduce((sum, p) => sum + p.surface, 0),
    totalBudget: problems.reduce((sum, p) => sum + p.budget, 0),
    avancement: Math.round((problems.filter(p => p.status === 'terminé').length / problems.length) * 100)
  };

  return (
    <div className="visitor-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🛣️ Signalements Routiers</h1>
          <button className="login-btn" onClick={onLoginClick}>
            Se connecter
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="map-section">
          <MapView problems={problems} />
        </div>
        
        <div className="stats-section">
          <StatsPanel stats={stats} problems={problems} />
        </div>
      </div>
    </div>
  );
}
