import { useState } from 'react';
import '../styles/MapView.css';

export default function MapView({ problems }) {
  const [hoveredProblem, setHoveredProblem] = useState(null);

  const getStatusColor = (status) => {
    switch(status) {
      case 'nouveau': return '#e74c3c';
      case 'en cours': return '#f39c12';
      case 'terminé': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'nouveau': return 'Nouveau';
      case 'en cours': return 'En cours';
      case 'terminé': return 'Terminé';
      default: return status;
    }
  };

  return (
    <div className="map-container">
      <div className="map-wrapper">
        {/* Note temporaire pour carte simplifiée */}
        <div className="map-placeholder-notice">
          🗺️ Carte interactive - Survolez les points pour voir les détails
        </div>
        
        {/* Carte simplifiée - remplacer par Leaflet/Google Maps plus tard */}
        <div className="simple-map">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="map-marker"
              style={{
                left: `${(problem.lng - 2.3) * 1000}px`,
                top: `${(48.87 - problem.lat) * 1000}px`,
                backgroundColor: getStatusColor(problem.status)
              }}
              onMouseEnter={() => setHoveredProblem(problem)}
              onMouseLeave={() => setHoveredProblem(null)}
            >
              <div className="marker-dot"></div>
              
              {hoveredProblem?.id === problem.id && (
                <div className="marker-popup">
                  <h4>Problème #{problem.id}</h4>
                  <div className="popup-info">
                    <p><strong>Date:</strong> {new Date(problem.date).toLocaleDateString('fr-FR')}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span className={`status-badge status-${problem.status}`}>
                        {getStatusLabel(problem.status)}
                      </span>
                    </p>
                    <p><strong>Surface:</strong> {problem.surface} m²</p>
                    <p><strong>Budget:</strong> {problem.budget.toLocaleString('fr-FR')} €</p>
                    <p><strong>Entreprise:</strong> {problem.entreprise}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Légende */}
        <div className="map-legend">
          <h4>Légende</h4>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#e74c3c' }}></span>
            Nouveau
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#f39c12' }}></span>
            En cours
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#27ae60' }}></span>
            Terminé
          </div>
        </div>
      </div>
    </div>
  );
}
