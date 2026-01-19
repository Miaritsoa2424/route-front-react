import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, RefreshCw } from 'lucide-react';
import { firebaseService } from '../services/firebase';
import '../styles/Manager.css';

export default function Manager() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  // Données factices pour démo (à remplacer par API)
  const mockReports = [
    {
      id: 1,
      type: 'Nid de poule',
      date: '2024-01-15',
      status: 'nouveau',
      surface: 25,
      budget: 5000000,
      entreprise: 'RoadFix Mada',
      location: '-18.9100, 47.5225'
    },
    {
      id: 2,
      type: 'Fissure importante',
      date: '2024-01-10',
      status: 'en cours',
      surface: 15,
      budget: 3000000,
      entreprise: 'Batiment Plus',
      location: '-18.9050, 47.5280'
    },
    {
      id: 3,
      type: 'Réparation complète',
      date: '2024-01-05',
      status: 'terminé',
      surface: 40,
      budget: 8000000,
      entreprise: 'RoadFix Mada',
      location: '-18.9150, 47.5200'
    },
    {
      id: 4,
      type: 'Affaissement de chaussée',
      date: '2024-01-18',
      status: 'nouveau',
      surface: 60,
      budget: 12000000,
      entreprise: 'Construction Pro',
      location: '-18.9120, 47.5300'
    },
    {
      id: 5,
      type: 'Égout bouché',
      date: '2024-01-12',
      status: 'en cours',
      surface: 10,
      budget: 2000000,
      entreprise: 'Batiment Plus',
      location: '-18.9080, 47.5250'
    }
  ];

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Pour le moment, utiliser les données factices
      // À remplacer par: const data = await firebaseService.fetchReports();
      setReports(mockReports);
      showMessage('Signalements chargés', 'success');
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      showMessage('Erreur lors du chargement des signalements', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncFirebase = async () => {
    setSyncing(true);
    try {
      // À remplacer par: await firebaseService.syncAll(reports);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler le délai
      showMessage('Synchronisation réussie avec Firebase', 'success');
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
      showMessage('Erreur lors de la synchronisation Firebase', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const startEdit = (report) => {
    setEditingId(report.id);
    setEditForm({ ...report });
  };

  const saveEdit = (id) => {
    const updated = reports.map(r => 
      r.id === id ? editForm : r
    );
    setReports(updated);
    setEditingId(null);
    setEditForm({});
    showMessage('Signalement mise à jour', 'success');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const deleteReport = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce signalement ?')) {
      setReports(reports.filter(r => r.id !== id));
      showMessage('Signalement supprimé', 'success');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const formatCurrency = (amount) => {
    return `${(amount / 1000000).toFixed(1)}M Ar`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'nouveau': '#ef4444',
      'en cours': '#f59e0b',
      'terminé': '#10b981'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div className="manager-container">
      {/* Navbar */}
      <nav className="manager-navbar">
        <div className="manager-navbar-content">
          <div className="manager-navbar-brand">
            <div className="manager-brand-icon">
              <span>M</span>
            </div>
            <div className="manager-brand-text">
              <span className="manager-brand-title">Tableau de bord Manager</span>
              <span className="manager-brand-subtitle">Gestion des signalements</span>
            </div>
          </div>
          <button
            className="manager-logout-btn"
            onClick={() => navigate('/login')}
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>

      {/* Messages */}
      {message.text && (
        <div className={`message-alert message-${message.type}`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Contenu principal */}
      <div className="manager-main">
        {/* En-tête avec bouton sync */}
        <div className="manager-header">
          <div>
            <h1 className="manager-title">Gestion des signalements</h1>
            <p className="manager-subtitle">
              Modifiez les informations et synchronisez avec Firebase
            </p>
          </div>
          <button
            className="manager-sync-btn"
            onClick={handleSyncFirebase}
            disabled={syncing || reports.length === 0}
          >
            <RefreshCw
              size={18}
              className={syncing ? 'spin' : ''}
            />
            <span>{syncing ? 'Synchronisation...' : 'Synchroniser Firebase'}</span>
          </button>
        </div>

        {/* Tableau des signalements */}
        <div className="manager-reports-section">
          {loading ? (
            <div className="manager-loading">Chargement des signalements...</div>
          ) : reports.length === 0 ? (
            <div className="manager-empty">
              Aucun signalement disponible
            </div>
          ) : (
            <div className="manager-table-wrapper">
              <table className="manager-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Surface (m²)</th>
                    <th>Budget</th>
                    <th>Entreprise</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className={editingId === report.id ? 'editing' : ''}>
                      {editingId === report.id ? (
                        // Mode édition
                        <>
                          <td>
                            <input
                              type="text"
                              value={editForm.type}
                              onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={editForm.date}
                              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <select
                              value={editForm.status}
                              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                              className="edit-select"
                            >
                              <option value="nouveau">Nouveau</option>
                              <option value="en cours">En cours</option>
                              <option value="terminé">Terminé</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editForm.surface}
                              onChange={(e) => setEditForm({ ...editForm, surface: Number(e.target.value) })}
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editForm.budget}
                              onChange={(e) => setEditForm({ ...editForm, budget: Number(e.target.value) })}
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={editForm.entreprise}
                              onChange={(e) => setEditForm({ ...editForm, entreprise: e.target.value })}
                              className="edit-input"
                            />
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-save"
                                onClick={() => saveEdit(report.id)}
                              >
                                Enregistrer
                              </button>
                              <button
                                className="btn-cancel"
                                onClick={cancelEdit}
                              >
                                Annuler
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // Mode affichage
                        <>
                          <td className="type-cell">{report.type}</td>
                          <td>{formatDate(report.date)}</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{ backgroundColor: getStatusColor(report.status) }}
                            >
                              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                            </span>
                          </td>
                          <td className="numeric">{report.surface}</td>
                          <td className="numeric">{formatCurrency(report.budget)}</td>
                          <td className="company-cell">{report.entreprise}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-edit"
                                onClick={() => startEdit(report)}
                              >
                                Modifier
                              </button>
                              <button
                                className="btn-delete"
                                onClick={() => deleteReport(report.id)}
                              >
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Résumé des statistiques */}
        <div className="manager-stats">
          <div className="stat-item">
            <span className="stat-label">Total signalements</span>
            <span className="stat-value">{reports.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Surface totale</span>
            <span className="stat-value">{reports.reduce((sum, r) => sum + r.surface, 0)} m²</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Budget total</span>
            <span className="stat-value">{formatCurrency(reports.reduce((sum, r) => sum + r.budget, 0))}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Terminés</span>
            <span className="stat-value">{reports.filter(r => r.status === 'terminé').length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
