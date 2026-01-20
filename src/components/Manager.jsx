import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Manager.css';

export default function Manager() {
  const navigate = useNavigate();
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editFormData, setEditFormData] = useState({});

  // Charger les signalements au montage
  useEffect(() => {
    loadSignalements();
  }, []);

  // Charger les signalements depuis l'API/Firebase
  const loadSignalements = async () => {
    setLoading(true);
    try {
      // À remplacer par votre appel API Firebase
      // const response = await fetch('/api/signalements');
      // const data = await response.json();
      
      // Données factices pour la démo
      const demoData = [
        {
          id: 1,
          type: 'Nid de poule',
          date: '2024-01-15',
          status: 'nouveau',
          surface: 25,
          budget: 5000000,
          entreprise: 'RoadFix Mada',
          localisation: 'Antananarivo - Route de l\'Aéroport',
          description: 'Nid de poule dangereux causant des ralentissements'
        },
        {
          id: 2,
          type: 'Fissure importante',
          date: '2024-01-10',
          status: 'en_cours',
          surface: 15,
          budget: 3000000,
          entreprise: 'TechRoad',
          localisation: 'Antsirabe - Route RN1',
          description: 'Fissure s\'élargissant progressivement'
        },
        {
          id: 3,
          type: 'Dégradation massive',
          date: '2024-01-05',
          status: 'planifie',
          surface: 85,
          budget: 12000000,
          entreprise: 'RoadRepair Pro',
          localisation: 'Morondava - Route côtière',
          description: 'Importante dégradation du revêtement routier'
        },
        {
          id: 4,
          type: 'Affaissement',
          date: '2024-01-08',
          status: 'complete',
          surface: 30,
          budget: 4500000,
          entreprise: 'RoadFix Mada',
          localisation: 'Toliara - Route vers Bekily',
          description: 'Affaissement du sol causé par infiltration d\'eau'
        }
      ];
      
      setSignalements(demoData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // Synchroniser avec Firebase
  const handleSync = async () => {
    setSyncing(true);
    try {
      // À remplacer par votre logique Firebase
      // 1. Récupérer les nouveaux signalements
      // const newData = await fetchFromFirebase();
      // 2. Envoyer les données mises à jour
      // await sendToFirebase(signalements);
      
      console.log('Synchronisation en cours...');
      
      // Simulation d'une synchronisation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccessMessage('Synchronisation réussie avec Firebase');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Recharger les données après sync
      await loadSignalements();
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Ouvrir l'édition d'un signalement
  const handleEditClick = (signalement) => {
    setEditingId(signalement.id);
    setEditFormData({ ...signalement });
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData({});
  };

  // Sauvegarder les modifications
  const handleSaveEdit = async () => {
    try {
      // À remplacer par votre appel API
      // await fetch(`/api/signalements/${editingId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editFormData)
      // });
      
      setSignalements(signalements.map(s => 
        s.id === editingId ? editFormData : s
      ));
      
      setEditingId(null);
      setEditFormData({});
      setSuccessMessage('Signalement mis à jour avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Changer le statut d'un signalement
  const handleStatusChange = (newStatus) => {
    setEditFormData({ ...editFormData, status: newStatus });
  };

  // Obtenir la classe CSS pour le badge de statut
  const getStatusClass = (status) => {
    const statusMap = {
      'nouveau': 'status-nouveau',
      'en_cours': 'status-en-cours',
      'planifie': 'status-planifie',
      'complete': 'status-complete'
    };
    return statusMap[status] || 'status-nouveau';
  };

  // Obtenir le label du statut
  const getStatusLabel = (status) => {
    const labelMap = {
      'nouveau': 'Nouveau',
      'en_cours': 'En cours',
      'planifie': 'Planifié',
      'complete': 'Complété'
    };
    return labelMap[status] || status;
  };

  const handleLogout = () => {
    // À remplacer par votre logique de déconnexion
    navigate('/');
  };

  return (
    <div className="manager-container">
      {/* En-tête */}
      <header className="manager-header">
        <div className="header-content">
          <h1>Gestion des signalements</h1>
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Contrôles */}
      <div className="manager-controls">
        <button 
          className={`sync-button ${syncing ? 'syncing' : ''}`}
          onClick={handleSync}
          disabled={syncing || loading}
        >
          {syncing ? 'Synchronisation en cours...' : 'Synchroniser avec Firebase'}
        </button>
        <button 
          className="unblock-users-button"
          onClick={() => navigate('/manager/unblock-users')}
        >
          Débloquer des utilisateurs
        </button>
      </div>

      {/* Message de succès */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* Liste des signalements */}
      <div className="manager-content">
        {loading ? (
          <div className="loading-state">
            <p>Chargement des signalements...</p>
          </div>
        ) : signalements.length === 0 ? (
          <div className="empty-state">
            <p>Aucun signalement trouvé</p>
          </div>
        ) : (
          <div className="signalements-list">
            {signalements.map(signalement => (
              <div key={signalement.id} className="signalement-card">
                {/* En-tête de la carte */}
                <div 
                  className="signalement-header"
                  onClick={() => setExpandedId(expandedId === signalement.id ? null : signalement.id)}
                >
                  <div className="signalement-title">
                    <h3>{signalement.type}</h3>
                    <span className={`status-badge ${getStatusClass(signalement.status)}`}>
                      {getStatusLabel(signalement.status)}
                    </span>
                  </div>
                  <div className="signalement-meta">
                    <span className="date">{new Date(signalement.date).toLocaleDateString('fr-FR')}</span>
                    <span className="toggle-indicator">
                      {expandedId === signalement.id ? '−' : '+'}
                    </span>
                  </div>
                </div>

                {/* Contenu détaillé */}
                {expandedId === signalement.id && (
                  <div className="signalement-details">
                    {editingId === signalement.id ? (
                      // Formulaire d'édition
                      <div className="edit-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Type</label>
                            <input
                              type="text"
                              value={editFormData.type}
                              onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Surface (m²)</label>
                            <input
                              type="number"
                              value={editFormData.surface}
                              onChange={(e) => setEditFormData({ ...editFormData, surface: parseFloat(e.target.value) })}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Budget (Ar)</label>
                            <input
                              type="number"
                              value={editFormData.budget}
                              onChange={(e) => setEditFormData({ ...editFormData, budget: parseFloat(e.target.value) })}
                            />
                          </div>
                          <div className="form-group">
                            <label>Entreprise</label>
                            <input
                              type="text"
                              value={editFormData.entreprise}
                              onChange={(e) => setEditFormData({ ...editFormData, entreprise: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="form-group full-width">
                          <label>Localisation</label>
                          <input
                            type="text"
                            value={editFormData.localisation}
                            onChange={(e) => setEditFormData({ ...editFormData, localisation: e.target.value })}
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Description</label>
                          <textarea
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                            rows="3"
                          ></textarea>
                        </div>

                        <div className="form-group full-width">
                          <label>Statut</label>
                          <div className="status-selector">
                            {['nouveau', 'en_cours', 'planifie', 'complete'].map(status => (
                              <button
                                key={status}
                                className={`status-option ${editFormData.status === status ? 'active' : ''}`}
                                onClick={() => handleStatusChange(status)}
                              >
                                {getStatusLabel(status)}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="form-actions">
                          <button 
                            className="action-button save"
                            onClick={handleSaveEdit}
                          >
                            Sauvegarder
                          </button>
                          <button 
                            className="action-button cancel"
                            onClick={handleCancelEdit}
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Affichage des détails
                      <div className="details-display">
                        <div className="detail-row">
                          <div className="detail-item">
                            <span className="label">Surface</span>
                            <span className="value">{signalement.surface} m²</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Budget</span>
                            <span className="value">{signalement.budget.toLocaleString('fr-FR')} Ar</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Entreprise</span>
                            <span className="value">{signalement.entreprise}</span>
                          </div>
                        </div>

                        <div className="detail-full">
                          <span className="label">Localisation</span>
                          <p className="value">{signalement.localisation}</p>
                        </div>

                        <div className="detail-full">
                          <span className="label">Description</span>
                          <p className="value">{signalement.description}</p>
                        </div>

                        <div className="details-actions">
                          <button 
                            className="action-button edit"
                            onClick={() => handleEditClick(signalement)}
                          >
                            Modifier
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
