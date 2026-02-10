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
  const [messageType, setMessageType] = useState('success'); // 'success' ou 'error'
  const [editFormData, setEditFormData] = useState({});
  const [statistiques, setStatistiques] = useState([]);
  const [statistiquesMoyennes, setStatistiquesMoyennes] = useState(null);
  const [historiqueStatuts, setHistoriqueStatuts] = useState({});
  const [niveaux, setNiveaux] = useState({});
  const [niveauModalOpen, setNiveauModalOpen] = useState(false);
  const [niveauValue, setNiveauValue] = useState('');
  const [currentNiveauSignalementId, setCurrentNiveauSignalementId] = useState(null);

  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Si non autorisé, supprimer le token et rediriger vers login
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }

    return response;
  };

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

      // Récupérer l'historique complet des statuts pour tous les signalements
      const historyMap = {};
      try {
        const allStatuts = await signalementStatutService.getAllSignalementStatuts();

        console.log('Historique des statuts récupéré:', allStatuts);

        // Grouper par signalement
        allStatuts.forEach(statut => {
          const sigId = statut.signalement.idSignalement;
          if (!historyMap[sigId]) {
            historyMap[sigId] = [];
          }
          historyMap[sigId].push({
            statut: statusIdMap[statut.statutSignalement.idStatut],
            date: new Date(statut.dateStatut)
          });
        });

        // Trier par date croissante
        Object.keys(historyMap).forEach(key => {
          historyMap[key].sort((a, b) => a.date - b.date);
        });
        console.log('Historique mappé par signalement:', historyMap);
      } catch (error) {
        console.warn('Impossible de récupérer l\'historique complet des statuts:', error);
        console.log('Utilisation des données actuelles pour les statistiques');
      }
      setHistoriqueStatuts(historyMap);

      // Créer la liste des signalements mappés depuis les statuts
      const mappedData = statuts.map(statut => ({
        id: statut.signalement.idSignalement,
        type: 'Signalement routier', // Valeur par défaut
        date: new Date(statut.dateStatut).toISOString().split('T')[0],
        status: statusIdMap[statut.statutSignalement.idStatut] || 'en_attente',
        //surface: statut.signalement.surface,
        //budget: statut.signalement.budget,
        //entreprise: statut.signalement.entreprise.nom,
        localisation: `${statut.signalement.latitude}, ${statut.signalement.longitude}`,
        //description: `Signalement par ${statut.signalement.user.identifiant}`
        description: statut.signalement.description || `Signalement par ${statut.signalement.user.identifiant}`
      }));

      setSignalements(mappedData);
      setOriginalSignalements(statuts.map(statut => statut.signalement));

      // Calculer les statistiques
      const stats = calculerStatistiques(mappedData, historyMap);
      console.log('Statistiques calculées:', stats);
      setStatistiques(stats);

      // Calculer les statistiques moyennes
      const statsMoyennes = calculerStatistiquesMoyennes(stats);
      console.log('Statistiques moyennes:', statsMoyennes);
      setStatistiquesMoyennes(statsMoyennes);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      showMessage('Erreur lors du chargement des signalements', 'error');
    } finally {
      setLoading(false);
    }
  };
  // Synchroniser avec l'API
  const handleSync = async () => {
    setSyncing(true);

    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/signalements/sync`,
        { method: 'POST' }
      );

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

      // ✅ Succès
      await loadSignalements();
      showMessage("✓ Données rechargées avec succès depuis l'API", 'success');

    } catch (error) {
      console.error("Erreur de synchronisation:", error);

      if (error.message === "Failed to fetch") {
        showMessage("⚠ Serveur inaccessible. Vérifiez votre connexion.", 'error');
      } else {
        showMessage(`✗ ${error.message}`, 'error');
      }

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
      // Trouver le signalement original pour récupérer l'utilisateur créateur
      const originalSignalement = originalSignalements.find(sig => sig.idSignalement === editingId);

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
        // Mbola tsy vita ny authentification
        user: { idUser: originalSignalement.user.idUser }, // Utilisateur qui a créé le signalement
        statutSignalement: { idStatut: idStatut },
        signalement: { idSignalement: editingId }
      };

      // Insérer un nouveau signalement statut via l'API
      await signalementStatutService.createSignalementStatut(newSignalementStatut);

      // Recharger les données
      await loadSignalements();

      setEditingId(null);
      setEditFormData({});
      showMessage('✓ Nouveau statut créé avec succès', 'success');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      showMessage('✗ Erreur lors de la création du statut', 'error');
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
      'en_attente': 'Nouveau',
      'en_cours': 'En cours',
      'resolu': 'Terminé',
      'rejete': 'Rejeté'
    };
    return labelMap[status] || status;
  };

  // Obtenir le pourcentage d'avancement basé sur le statut
  const getProgressPercentage = (status) => {
    const progressMap = {
      'en_attente': 0,
      'en_cours': 50,
      'resolu': 100,
      'rejete': 0
    };
    return progressMap[status] || 0;
  };

  // Obtenir la couleur de la barre de progression basée sur le pourcentage
  const getProgressColor = (percentage) => {
    if (percentage === 100) {
      return '#22c55e'; // Vert
    } else if (percentage === 50) {
      return '#eab308'; // Jaune
    } else {
      return '#3b82f6'; // Bleu (par défaut)
    }
  };

  // Formater une date au format français
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir les dates de chaque étape pour un signalement
  const getEtapesDates = (signalementId) => {
    const histoire = historiqueStatuts[signalementId] || [];
    return {
      nouveau: histoire.find(h => h.statut === 'en_attente')?.date,
      encours: histoire.find(h => h.statut === 'en_cours')?.date,
      resolu: histoire.find(h => h.statut === 'resolu')?.date,
      rejete: histoire.find(h => h.statut === 'rejete')?.date
    };
  };

  // Calculer les statistiques de jours entre les transitions
  const calculerStatistiques = (signalements, historiqueMap) => {
    console.log('Calcul statistiques avec:', { signalements: signalements.length, historiqueMap });

    return signalements.map(sig => {
      const histoire = historiqueMap[sig.id] || [];
      let joursNouveauEncours = '-';
      let joursEncourTermine = '-';
      let joursTotaux = '-';
      let detailNouveauEncours = '';
      let detailEncourTermine = '';
      let detailTotaux = '';

      console.log(`Statistiques pour ${sig.id}:`, histoire);

      if (histoire.length >= 1) {
        // Chercher les dates de transition
        const dateNouveau = histoire.find(h => h.statut === 'en_attente')?.date;
        const dateEncours = histoire.find(h => h.statut === 'en_cours')?.date;
        const dateTermine = histoire.find(h => h.statut === 'resolu')?.date;

        console.log(`  Dates pour ${sig.id}:`, { dateNouveau, dateEncours, dateTermine });

        // Fonction utilitaire pour formater la durée
        const formatDuration = (ms) => {
          const totalSeconds = Math.floor(ms / 1000);
          const days = Math.floor(totalSeconds / (24 * 3600));
          const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
          const minutes = Math.floor((totalSeconds % 3600) / 60);

          if (days === 0 && hours === 0 && minutes === 0) {
            return '< 1 min';
          }

          const parts = [];
          if (days > 0) parts.push(`${days}j`);
          if (hours > 0) parts.push(`${hours}h`);
          if (minutes > 0) parts.push(`${minutes}min`);

          return parts.join(' ');
        };

        // Calculer les différences
        if (dateNouveau && dateEncours) {
          const diffMs = dateEncours - dateNouveau;
          joursNouveauEncours = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          detailNouveauEncours = formatDuration(diffMs);
        }
        if (dateEncours && dateTermine) {
          const diffMs = dateTermine - dateEncours;
          joursEncourTermine = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          detailEncourTermine = formatDuration(diffMs);
        }
        if (dateNouveau && dateTermine) {
          const diffMs = dateTermine - dateNouveau;
          joursTotaux = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          detailTotaux = formatDuration(diffMs);
        } else if (dateNouveau) {
          // Si pas encore terminé, calculer jusqu'à maintenant
          const diffMs = new Date() - dateNouveau;
          joursTotaux = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          detailTotaux = formatDuration(diffMs);
        }
      }

      return {
        id: sig.id,
        type: sig.type,
        joursNouveauEncours,
        joursEncourTermine,
        joursTotaux,
        detailNouveauEncours,
        detailEncourTermine,
        detailTotaux
      };
    });
  };

  // Calculer les statistiques moyennes globales
  const calculerStatistiquesMoyennes = (stats) => {
    // Filtrer les valeurs valides (non "-")
    const validNouveauEncours = stats.filter(s => s.joursNouveauEncours !== '-');
    const validEncourTermine = stats.filter(s => s.joursEncourTermine !== '-');
    const validTotaux = stats.filter(s => s.joursTotaux !== '-');

    const formatDuration = (ms) => {
      if (!ms || ms === 0) return '-';
      const totalSeconds = Math.floor(ms / 1000);
      const days = Math.floor(totalSeconds / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);

      if (days === 0 && hours === 0 && minutes === 0) {
        return '< 1 min';
      }

      const parts = [];
      if (days > 0) parts.push(`${days}j`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}min`);

      return parts.join(' ');
    };

    // Calculer les moyennes en millisecondes
    let moyenneNouveauEncours = 0;
    let moyenneEncourTermine = 0;
    let moyenneTotaux = 0;

    if (validNouveauEncours.length > 0) {
      const somme = validNouveauEncours.reduce((acc, s) => acc + (s.joursNouveauEncours * 24 * 3600 * 1000), 0);
      moyenneNouveauEncours = somme / validNouveauEncours.length;
    }

    if (validEncourTermine.length > 0) {
      const somme = validEncourTermine.reduce((acc, s) => acc + (s.joursEncourTermine * 24 * 3600 * 1000), 0);
      moyenneEncourTermine = somme / validEncourTermine.length;
    }

    if (validTotaux.length > 0) {
      const somme = validTotaux.reduce((acc, s) => acc + (s.joursTotaux * 24 * 3600 * 1000), 0);
      moyenneTotaux = somme / validTotaux.length;
    }

    return {
      nouveauEncours: {
        jours: Math.floor(moyenneNouveauEncours / (24 * 3600 * 1000)),
        detail: formatDuration(moyenneNouveauEncours)
      },
      encourTermine: {
        jours: Math.floor(moyenneEncourTermine / (24 * 3600 * 1000)),
        detail: formatDuration(moyenneEncourTermine)
      },
      nouveauTermine: {
        jours: Math.floor(moyenneTotaux / (24 * 3600 * 1000)),
        detail: formatDuration(moyenneTotaux)
      }
    };
  };

  const handleLogout = () => {
    // À remplacer par votre logique de déconnexion
    navigate('/');
  };

  // Ouvrir modal de détermination de niveau
  const openNiveauModal = (signalementId) => {
    setCurrentNiveauSignalementId(signalementId);
    setNiveauValue(niveaux[signalementId] != null ? String(niveaux[signalementId]) : '');
    setNiveauModalOpen(true);
  };

  const closeNiveauModal = () => {
    setCurrentNiveauSignalementId(null);
    setNiveauValue('');
    setNiveauModalOpen(false);
  };

  const saveNiveau = () => {
    if (currentNiveauSignalementId == null) return;
    const numeric = niveauValue === '' ? null : Number(niveauValue);
    setNiveaux(prev => ({ ...prev, [currentNiveauSignalementId]: numeric }));
    closeNiveauModal();
    showMessage('✓ Niveau enregistré avec succès', 'success');
  };

  // Fonction utilitaire pour afficher un message
  const showMessage = (message, type = 'success') => {
    setSuccessMessage(message);
    setMessageType(type);
    setTimeout(() => setSuccessMessage(''), 5000);
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

      {/* Message de notification */}
      {successMessage && (
        <div className={`message-notification ${messageType === 'error' ? 'error' : 'success'}`}>
          <div>
            {messageType === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span>{successMessage}</span>
          </div>
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
                            {['signale', 'en_cours', 'termine', 'rejete'].map(status => (
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
                        <div className="detail-full progress-section">
                          <span className="label">Avancement</span>
                          <div className="progress-container">
                            <div className="progress-bar-wrapper">
                              <div
                                className="progress-bar"
                                style={{
                                  width: `${getProgressPercentage(signalement.status)}%`,
                                  background: getProgressColor(getProgressPercentage(signalement.status))
                                }}
                              ></div>
                            </div>
                            <span className="progress-percentage">{getProgressPercentage(signalement.status)}%</span>
                          </div>

                          {/* Dates des étapes */}
                          <div className="etapes-dates">
                            {getEtapesDates(signalement.id).nouveau && (
                              <div className="etape-date">
                                <span className="etape-label">Nouveau</span>
                                <span className="etape-datetime">{formatDate(getEtapesDates(signalement.id).nouveau)}</span>
                              </div>
                            )}
                            {getEtapesDates(signalement.id).encours && (
                              <div className="etape-date">
                                <span className="etape-label">En cours</span>
                                <span className="etape-datetime">{formatDate(getEtapesDates(signalement.id).encours)}</span>
                              </div>
                            )}
                            {getEtapesDates(signalement.id).resolu && (
                              <div className="etape-date">
                                <span className="etape-label">Résolu</span>
                                <span className="etape-datetime">{formatDate(getEtapesDates(signalement.id).resolu)}</span>
                              </div>
                            )}
                            {getEtapesDates(signalement.id).rejete && (
                              <div className="etape-date">
                                <span className="etape-label">Rejeté</span>
                                <span className="etape-datetime">{formatDate(getEtapesDates(signalement.id).rejete)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="detail-row">
                          <div className="detail-item">
                            <span className="label">Surface</span>
                              <span className="value">{signalement.surface != null ? `${signalement.surface} m²` : 'A définir'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Budget</span>
                              <span className="value">{signalement.budget != null ? `${signalement.budget.toLocaleString('fr-FR')} Ar` : 'A définir'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="label">Entreprise</span>
                              <span className="value">{signalement.entreprise ? signalement.entreprise : 'A définir'}</span>
                          </div>
                        </div>

                        <div className="detail-row">
                          <div className="detail-item">
                            <span className="label">Niveau</span>
                            <span className="value">{niveaux[signalement.id] != null ? niveaux[signalement.id] : 'A définir'}</span>
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
                          {niveaux[signalement.id] == null && (
                            <button
                              className="action-button level"
                              onClick={() => openNiveauModal(signalement.id)}
                              style={{
                                background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                                color: '#fff',
                                border: 'none',
                                fontWeight: '600',
                                boxShadow: '0 2px 8px rgba(108, 117, 125, 0.3)'
                              }}
                            >
                              Déterminer le niveau
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tableau de statistiques */}
        {signalements.length > 0 && (
          <div className="statistics-section">
            <h2>Données réelles de traitement</h2>
            {statistiques.length > 0 ? (
              <div className="statistics-table">
                <table>
                  <thead>
                    <tr>
                      <th>Type de signalement</th>
                      <th>Jours (Nouveau → En cours)</th>
                      <th>Jours (En cours → Terminé)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statistiques.map(stat => (
                      <tr key={stat.id}>
                        <td>{stat.type}</td>
                        <td className="center">
                          <div className="duration-value">{stat.joursNouveauEncours}</div>
                          <div className="duration-detail">{stat.detailNouveauEncours}</div>
                        </td>
                        <td className="center">
                          <div className="duration-value">{stat.joursEncourTermine}</div>
                          <div className="duration-detail">{stat.detailEncourTermine}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="statistics-placeholder">
                <p>Données de statistiques indisponibles. Vérifiez la console pour plus de détails.</p>
              </div>
            )}
          </div>
        )}

        {/* Statistiques moyennes */}
        {statistiquesMoyennes && (
          <div className="statistics-section moyennes-section">
            <h2>Statistiques moyennes</h2>
            <div className="moyennes-grid">
              <div className="moyenne-card">
                <div className="moyenne-label">Nouveau → En cours</div>
                <div className="moyenne-value">{statistiquesMoyennes.nouveauEncours.jours} jours</div>
                <div className="moyenne-detail">{statistiquesMoyennes.nouveauEncours.detail}</div>
              </div>
              <div className="moyenne-card">
                <div className="moyenne-label">En cours → Terminé</div>
                <div className="moyenne-value">{statistiquesMoyennes.encourTermine.jours} jours</div>
                <div className="moyenne-detail">{statistiquesMoyennes.encourTermine.detail}</div>
              </div>
              <div className="moyenne-card highlight">
                <div className="moyenne-label">Nouveau → Terminé</div>
                <div className="moyenne-value">{statistiquesMoyennes.nouveauTermine.jours} jours</div>
                <div className="moyenne-detail">{statistiquesMoyennes.nouveauTermine.detail}</div>
              </div>
            </div>
          </div>
        )}
        {/* Modal pour déterminer le niveau */}
        {niveauModalOpen && (
          <div
            className="modal-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              backdropFilter: 'blur(3px)'
            }}
            onClick={closeNiveauModal}
          >
            <div
              className="modal"
              style={{
                background: 'linear-gradient(to bottom, #fff 0%, #f8f9fa 100%)',
                padding: '24px',
                borderRadius: '12px',
                width: '90%',
                maxWidth: '420px',
                boxShadow: '0 8px 32px rgba(108, 117, 125, 0.3)',
                zIndex: 10000,
                border: '3px solid #6c757d'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{
                color: '#495057',
                marginTop: 0,
                marginBottom: '20px',
                fontSize: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>Déterminer le niveau</h3>
              <div className="modal-body">
                
                <input
                  type="number"
                  value={niveauValue}
                  onChange={(e) => setNiveauValue(e.target.value)}
                  placeholder="Saisir un niveau (1 jusqu'à 10)"
                  style={{
                    width: '100%',
                    padding: '12px',
                    marginTop: '6px',
                    boxSizing: 'border-box',
                    border: '2px solid #adb5bd',
                    borderRadius: '6px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                    background: '#fff',
                    color: '#000'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6c757d'}
                  onBlur={(e) => e.target.style.borderColor = '#adb5bd'}
                />
              </div>
              <div className="modal-actions" style={{
                marginTop: '20px',
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  className="action-button save"
                  onClick={saveNiveau}
                  style={{
                    background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(108, 117, 125, 0.4)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
Enregistrer le niveau</button>
                <button
                  className="action-button cancel"
                  onClick={closeNiveauModal}
                  style={{
                    background: '#f5f5f5',
                    color: '#666',
                    border: '1px solid #ddd',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#e0e0e0'}
                  onMouseLeave={(e) => e.target.style.background = '#f5f5f5'}
                >❌ Annuler</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
