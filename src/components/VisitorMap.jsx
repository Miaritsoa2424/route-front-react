import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  LogIn, 
  MapPin, 
  TrendingUp, 
  DollarSign, 
  Maximize, 
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/VisitorMap.css';

// Fix pour les icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function VisitorMap() {
  const navigate = useNavigate();

  // Données factices pour la démo (à remplacer par l'API)
  const problems = [
    {
      id: 1,
      lat: -18.9100,
      lng: 47.5225,
      type: 'Nid de poule',
      date: '2024-01-15',
      status: 'nouveau',
      surface: 25,
      budget: 5000000,
      entreprise: 'RoadFix Mada'
    },
    {
      id: 2,
      lat: -18.9050,
      lng: 47.5280,
      type: 'Fissure importante',
      date: '2024-01-10',
      status: 'en cours',
      surface: 15,
      budget: 3000000,
      entreprise: 'Batiment Plus'
    },
    {
      id: 3,
      lat: -18.9150,
      lng: 47.5200,
      type: 'Réparation complète',
      date: '2024-01-05',
      status: 'terminé',
      surface: 40,
      budget: 8000000,
      entreprise: 'RoadFix Mada'
    },
    {
      id: 4,
      lat: -18.9120,
      lng: 47.5300,
      type: 'Affaissement de chaussée',
      date: '2024-01-18',
      status: 'nouveau',
      surface: 60,
      budget: 12000000,
      entreprise: 'Construction Pro'
    },
    {
      id: 5,
      lat: -18.9080,
      lng: 47.5250,
      type: 'Égout bouché',
      date: '2024-01-12',
      status: 'en cours',
      surface: 10,
      budget: 2000000,
      entreprise: 'Batiment Plus'
    }
  ];

  // Calculs statistiques
  const totalProblems = problems.length;
  const totalSurface = problems.reduce((sum, p) => sum + p.surface, 0);
  const totalBudget = problems.reduce((sum, p) => sum + p.budget, 0);
  const completedProblems = problems.filter(p => p.status === 'terminé').length;
  const avancement = ((completedProblems / totalProblems) * 100).toFixed(1);

  // Icônes personnalisées pour les marqueurs
  const createCustomIcon = (status) => {
    const colors = {
      'nouveau': '#ef4444',
      'en cours': '#f59e0b',
      'terminé': '#10b981'
    };
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${colors[status]}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      'nouveau': 'Nouveau',
      'en cours': 'En cours',
      'terminé': 'Terminé'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'nouveau': <AlertCircle size={16} />,
      'en cours': <Clock size={16} />,
      'terminé': <CheckCircle size={16} />
    };
    return icons[status];
  };

  const formatCurrency = (amount) => {
    return `${(amount / 1000000).toFixed(1)}M Ar`;
  };

  return (
    <div className="visitor-container">
      {/* Navbar améliorée */}
      <nav className="navbar">
        <div className="navbar-background"></div>
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="brand-icon-container">
              <MapPin className="brand-icon" />
            </div>
            <div className="brand-text-container">
              <span className="brand-text">Signalement Routier</span>
              <span className="brand-location">Antananarivo, Madagascar</span>
            </div>
          </div>
          <button 
            className="login-nav-button"
            onClick={() => navigate('/login')}
          >
            <LogIn size={18} />
            <span>Se connecter</span>
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="main-content">
        {/* Tableau de récapitulation */}
        <div className="stats-panel">
          <div className="stats-header">
            <h2 className="stats-title">Statistiques en temps réel</h2>
            <span className="stats-subtitle">Vue d'ensemble des signalements</span>
          </div>
          <div className="stats-grid">
            <div className="stat-card stat-card-primary">
              <div className="stat-icon-wrapper">
                <MapPin size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{totalProblems}</div>
                <div className="stat-label">Points signalés</div>
              </div>
            </div>
            <div className="stat-card stat-card-secondary">
              <div className="stat-icon-wrapper">
                <Maximize size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{totalSurface} m²</div>
                <div className="stat-label">Surface totale</div>
              </div>
            </div>
            <div className="stat-card stat-card-accent">
              <div className="stat-icon-wrapper">
                <DollarSign size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{formatCurrency(totalBudget)}</div>
                <div className="stat-label">Budget total</div>
              </div>
            </div>
            <div className="stat-card stat-card-success">
              <div className="stat-icon-wrapper">
                <TrendingUp size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-value">{avancement}%</div>
                <div className="stat-label">Avancement global</div>
              </div>
            </div>
          </div>
        </div>

        {/* Carte */}
        <div className="map-section">
          <div className="map-header">
            <div>
              <h2 className="map-title">Carte interactive des problèmes</h2>
              <p className="map-subtitle">Cliquez sur un marqueur pour plus de détails</p>
            </div>
            <div className="map-legend">
              <div className="legend-item">
                <span className="legend-dot legend-dot-new"></span>
                <span>Nouveau</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot legend-dot-progress"></span>
                <span>En cours</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot legend-dot-done"></span>
                <span>Terminé</span>
              </div>
            </div>
          </div>
          
          <div className="map-container-wrapper">
            <MapContainer 
              center={[-18.9100, 47.5225]} 
              zoom={13} 
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {problems.map((problem) => (
                <Marker 
                  key={problem.id}
                  position={[problem.lat, problem.lng]}
                  icon={createCustomIcon(problem.status)}
                >
                  <Popup className="custom-popup">
                    <div className="popup-content">
                      <div className="popup-header">
                        <h3 className="popup-title">{problem.type}</h3>
                        <span className={`popup-status status-${problem.status}`}>
                          {getStatusIcon(problem.status)}
                          {getStatusLabel(problem.status)}
                        </span>
                      </div>
                      <div className="popup-body">
                        <div className="popup-row">
                          <span className="popup-label">Date de signalement</span>
                          <span className="popup-value">
                            {new Date(problem.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="popup-row">
                          <span className="popup-label">Surface affectée</span>
                          <span className="popup-value">{problem.surface} m²</span>
                        </div>
                        <div className="popup-row">
                          <span className="popup-label">Budget estimé</span>
                          <span className="popup-value">{formatCurrency(problem.budget)}</span>
                        </div>
                        <div className="popup-row">
                          <span className="popup-label">Entreprise</span>
                          <span className="popup-value">{problem.entreprise}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}