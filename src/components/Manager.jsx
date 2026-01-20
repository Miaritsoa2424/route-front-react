import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, UserPlus, Users, Unlock, CheckCircle, AlertCircle } from 'lucide-react';
import { signalementService, signalementStatutService, API_BASE_URL } from '../services/api';
import '../styles/Manager.css';

export default function Manager() {
  const navigate = useNavigate();
  const [signalements, setSignalements] = useState([]);
  const [originalSignalements, setOriginalSignalements] = useState([]);
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

  // Charger les signalements depuis l'API
  const loadSignalements = async () => {
    setLoading(true);
    try {
      // Récupérer les derniers statuts avec les signalements associés
      const statutsResponse = await fetch(`${API_BASE_URL}/signalement-statuts/latest`);
      const statuts = await statutsResponse.json();
      
      // Mapper les IDs de statut aux labels internes
      const statusIdMap = {
        1: 'en_attente',
        2: 'en_cours',
        3: 'resolu',
        4: 'rejete'
      };
      
      // Créer la liste des signalements mappés depuis les statuts
      const mappedData = statuts.map(statut => ({
        id: statut.signalement.idSignalement,
        type: 'Signalement routier', // Valeur par défaut
        date: new Date().toISOString().split('T')[0], // Date actuelle par défaut
        status: statusIdMap[statut.statutSignalement.idStatut] || 'en_attente',
        surface: statut.signalement.surface,
        budget: statut.signalement.budget,
        entreprise: statut.signalement.entreprise.nom,
        localisation: `${statut.signalement.latitude}, ${statut.signalement.longitude}`,
        description: `Signalement par ${statut.signalement.user.identifiant}`
      }));
      
      setSignalements(mappedData);
      setOriginalSignalements(statuts.map(statut => statut.signalement));
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setSuccessMessage('Erreur lors du chargement des signalements');
      setTimeout(() => setSuccessMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Synchroniser avec l'API
  const handleSync = async () => {
    setSyncing(true);
    try {
      await loadSignalements();
      setSuccessMessage('Données rechargées depuis l\'API');
      setTimeout(() => setSuccessMessage(''), 3000);
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

  // Sauvegarder les modifications (insère un nouveau signalement statut)
  const handleSaveEdit = async () => {
    try {
      // Mapper le statut à l'id
      const statusMap = {
        'en_attente': 1,
        'en_cours': 2,
        'resolu': 3,
        'rejete': 4
      };
      const idStatut = statusMap[editFormData.status] || 1;
      
      const newSignalementStatut = {
        dateStatut: new Date().toISOString(),
        user: { idUser: 1 }, // Utilisateur connecté, à adapter
        statutSignalement: { idStatut: idStatut },
        signalement: { idSignalement: editingId }
      };
      
      // Insérer un nouveau signalement statut via l'API
      await signalementStatutService.createSignalementStatut(newSignalementStatut);
      
      // Recharger les données
      await loadSignalements();
      
      setEditingId(null);
      setEditFormData({});
      setSuccessMessage('Nouveau statut créé avec succès');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      setSuccessMessage('Erreur lors de la création');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Changer le statut d'un signalement
  const handleStatusChange = (newStatus) => {
    setEditFormData({ ...editFormData, status: newStatus });
  };

  // Obtenir la classe CSS pour le badge de statut
  const getStatusClass = (status) => {
    const statusMap = {
      'en_attente': 'status-nouveau',
      'en_cours': 'status-en-cours',
      'resolu': 'status-complete',
      'rejete': 'status-planifie'
    };
    return statusMap[status] || 'status-en-attente';
  };

  // Obtenir le label du statut
  const getStatusLabel = (status) => {
    const labelMap = {
      'en_attente': 'En attente',
      'en_cours': 'En cours',
      'resolu': 'Résolu',
      'rejete': 'Rejeté'
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
          <RefreshCw size={18} />
          {syncing ? 'Rechargement en cours...' : 'Recharger les données'}
        </button>
        <button 
          className="create-user-button"
          onClick={() => navigate('/manager/create-user')}
        >
          <UserPlus size={18} />
          Créer un compte
        </button>
        <button 
          className="users-list-button"
          onClick={() => navigate('/manager/users-list')}
        >
          <Users size={18} />
          Liste des utilisateurs
        </button>
        <button 
          className="unblock-users-button"
          onClick={() => navigate('/manager/unblock-users')}
        >
          <Unlock size={18} />
          Débloquer des utilisateurs
        </button>
      </div>

      {/* Message de succès */}
      {successMessage && (
        <div className="success-message">
          <CheckCircle size={18} />
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
                            {['en_attente', 'en_cours', 'resolu', 'rejete'].map(status => (
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
