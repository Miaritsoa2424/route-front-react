import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
import { signalementService, statsService } from '../services/api';
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
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState({
    nbSignalement: 0,
    budgetTotal: 0,
    surfaceTotal: 0,
    avancementGlobal: 0
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'
  const [tileUrl, setTileUrl] = useState("http://localhost:8090/tile/{z}/{x}/{y}.png");
  const [usingOnlineMap, setUsingOnlineMap] = useState(false);

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Récupérer les stats (optionnel pour visiteurs)
      try {
        const statsData = await statsService.getStats();
        setStats(statsData);
      } catch (statsError) {
        console.warn('Impossible de récupérer les stats:', statsError);
        // Utiliser des valeurs par défaut
        setStats({
          nbSignalement: 0,
          budgetTotal: 0,
          surfaceTotal: 0,
          avancementGlobal: 0
        });
      }

      // Récupérer les derniers statuts avec les signalements associés
      const statutsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/signalement-statuts/latest`);
      const statuts = await statutsResponse.json();
      
      // Mapper les IDs de statut aux labels internes
      const statusIdMap = {
        1: 'nouveau',
        2: 'en cours',
        3: 'terminé',
        4: 'rejete'
      };
      
      // Mapper les signalements avec leurs vrais statuts
      const mappedProblems = statuts.map(statut => ({
        id: statut.signalement.idSignalement,  // ID PostgreSQL pour la navigation
        lat: statut.signalement.latitude,
        lng: statut.signalement.longitude,
        type: 'Signalement routier',
        date: statut.dateStatut || new Date().toISOString().split('T')[0],
        status: statusIdMap[statut.statutSignalement.idStatut] || 'nouveau',
        surface: statut.signalement.surface,
        budget: statut.signalement.budget,
        entreprise: statut.signalement.entreprise?.nom || 'N/A'
      }));
      
      console.log('Problèmes mappés avec statuts:', mappedProblems);
      setProblems(mappedProblems);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction de synchronisation
  const handleSync = async () => {
    setSyncing(true);
    setMessage('');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/signalements/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        let errorMessage = `Erreur serveur (${response.status})`;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.message || errorMessage;
        } catch (e) {
          // Si le body n'est pas du JSON
        }
        throw new Error(errorMessage);
      }

      // Succès - recharger les données
      await loadData();
      setMessage('✓ Données rechargées avec succès');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      console.error("Erreur de synchronisation:", error);
      setMessage(`✗ ${error.message}`);
      setMessageType('error');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSyncing(false);
    }
  };

  // Calculs statistiques (utiliser les stats de l'API)
  const totalProblems = stats.nbSignalement;
  const totalSurface = stats.surfaceTotal;
  const totalBudget = stats.budgetTotal;
  const avancement = stats.avancementGlobal;

  // Icônes personnalisées pour les marqueurs
  const createCustomIcon = (status) => {
    const colors = {
      'nouveau': '#ef4444',      // Rouge
      'en_cours': '#f59e0b',     // Jaune/Orange
      'en cours': '#f59e0b',     // Jaune/Orange (fallback)
      'termine': '#10b981',      // Vert
      'terminé': '#10b981',      // Vert (fallback)
      'resolu': '#10b981'        // Vert
    };
    
    const color = colors[status] || colors['nouveau']; // Par défaut rouge
    
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Composant pour ajuster automatiquement la vue de la carte
  const AutoFitBounds = ({ problems }) => {
    const map = useMap();
    
    useEffect(() => {
      if (problems.length > 0) {
        const validProblems = problems.filter(p => p.lat && p.lng);
        if (validProblems.length > 0) {
          const bounds = L.latLngBounds(validProblems.map(p => [p.lat, p.lng]));
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
      }
    }, [problems, map]);
    
    return null;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'nouveau': 'Nouveau',
      'en cours': 'En cours',
      'en_cours': 'En cours',
      'terminé': 'Terminé',
      'termine': 'Terminé',
      'resolu': 'Résolu'
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
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Fonction pour gérer l'erreur de chargement des tuiles
  const handleTileError = () => {
    if (!usingOnlineMap) {
      console.log('Serveur de carte offline indisponible, bascule vers le serveur online...');
      setTileUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
      setUsingOnlineMap(true);
    }
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
          <button 
            className="sync-button"
            onClick={handleSync}
            disabled={syncing}
            style={{
              marginLeft: '10px',
              padding: '8px 16px',
              backgroundColor: syncing ? '#94a3b8' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: syncing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            {syncing ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid white',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <span>Chargement...</span>
              </>
            ) : (
              <>
                <TrendingUp size={18} />
                <span>Rafraîchir les données</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="main-content">
        {/* Message de synchronisation */}
        {message && (
          <div style={{
            position: 'fixed',
            top: '90px',
            right: '20px',
            zIndex: 1000,
            padding: '12px 20px',
            backgroundColor: messageType === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            animation: 'slideIn 0.3s ease-out'
          }}>
            {message}
          </div>
        )}
        {/* Tableau de récapitulation */}
        <div className="stats-panel">
          <div className="stats-header">
            <h2 className="stats-title">Statistiques en temps réel</h2>
            <span className="stats-subtitle">Vue d'ensemble des signalements</span>
          </div>
          {loading ? (
            <div className="loading-state">
              <p>Chargement des statistiques...</p>
            </div>
          ) : (
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
            )}
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
          
          {loading ? (
            <div className="loading-state">
              <p>Chargement de la carte...</p>
            </div>
          ) : (
            <div className="map-container-wrapper">
              <MapContainer 
                center={[-18.9100, 47.5225]} 
                zoom={13} 
                className="leaflet-map"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url={tileUrl}
                  eventHandlers={{
                    tileerror: handleTileError
                  }}
                />
                <AutoFitBounds problems={problems} />
                {problems.map((problem) => (
                  <Marker 
                    key={problem.id}
                    position={[problem.lat, problem.lng]}
                    icon={createCustomIcon(problem.status)}
                    eventHandlers={{
                      mouseover: (e) => {
                        e.target.openPopup();
                      },
                      click: (e) => {
                        e.target.openPopup();
                      }
                    }}
                  >
                    <Popup className="custom-popup">
                      <div className="popup-content">
                        <div className="popup-header">
                          <h3 className="popup-title">{problem.type}</h3>
                          {/* Normalize status into a safe CSS class name */}
                          {(() => {
                            const map = {
                              'nouveau': 'nouveau',
                              'en cours': 'en-cours',
                              'terminé': 'termine'
                            };
                            const statusClass = map[problem.status] || problem.status.replace(/\s+/g, '-');
                            return (
                              <span className={`popup-status status-${statusClass}`}>
                                {getStatusIcon(problem.status)}
                                {getStatusLabel(problem.status)}
                              </span>
                            );
                          })()}
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
                          <div className="popup-actions">
                            <a 
                              href={`#photos-${problem.id}`} 
                              className="popup-link"
                              onClick={(e) => {
                                e.preventDefault();
                                console.log('Navigation vers signalement ID:', problem.id);
                                navigate(`/signalement/${problem.id}`);
                              }}
                            >
                              📷 Voir les photos
                            </a>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}