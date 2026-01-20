import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import '../styles/UsersList.css';

export default function UsersList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterProfil, setFilterProfil] = useState('');

  const profils = {
    1: 'Administrateur',
    2: 'Utilisateur',
    3: 'Modérateur'
  };

  // Charger les utilisateurs au montage
  useEffect(() => {
    loadUsers();
  }, []);

  // Charger les utilisateurs depuis l'API
  const loadUsers = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setErrorMessage('Erreur lors du chargement des utilisateurs');
      // Données de démo en cas d'erreur
      const demoData = [
        {
          idUser: 1,
          identifiant: 'rakoto@gmail.mg',
          dateCreation: '2026-01-01T10:00:00',
          dateDerniereConnexion: '2026-10-01T15:30:00',
          idProfil: 1,
          failedAttempts: 0,
          blocked: false
        },
        {
          idUser: 2,
          identifiant: 'sarah@gmail.mg',
          dateCreation: '2026-02-15T09:00:00',
          dateDerniereConnexion: null,
          idProfil: 2,
          failedAttempts: 0,
          blocked: false
        },
        {
          idUser: 3,
          identifiant: 'jean@gmail.mg',
          dateCreation: '2026-03-20T14:00:00',
          dateDerniereConnexion: '2026-09-15T12:00:00',
          idProfil: 3,
          failedAttempts: 0,
          blocked: false
        }
      ];
      setUsers(demoData);
    } finally {
      setLoading(false);
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Trier les utilisateurs
  const getSortedUsers = () => {
    let sorted = [...users];

    if (filterProfil) {
      sorted = sorted.filter(u => u.idProfil === parseInt(filterProfil));
    }

    switch (sortBy) {
      case 'date':
        sorted.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
        break;
      case 'identifiant':
        sorted.sort((a, b) => a.identifiant.localeCompare(b.identifiant));
        break;
      case 'profil':
        sorted.sort((a, b) => a.idProfil - b.idProfil);
        break;
      default:
        break;
    }

    return sorted;
  };

  const sortedUsers = getSortedUsers();
  const blockedCount = users.filter(u => u.blocked).length;

  return (
    <div className="users-list-container">
      {/* En-tête */}
      <header className="users-list-header">
        <div className="header-content">
          <div className="header-title">
            <button 
              className="back-button"
              onClick={() => navigate('/manager')}
              title="Retour au Manager"
            >
              ←
            </button>
            <h1>Gestion des utilisateurs</h1>
          </div>
        </div>
      </header>

      {/* Messages */}
      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      {/* Contenu */}
      <div className="users-list-content">
        {loading ? (
          <div className="loading-state">
            <p>Chargement des utilisateurs...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <>
            {/* Barre d'outils */}
            <div className="toolbar">
              <div className="toolbar-stats">
                <div className="stat-item">
                  <span className="stat-label">Total:</span>
                  <span className="stat-value">{users.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Bloqués:</span>
                  <span className="stat-value error">{blockedCount}</span>
                </div>
              </div>

              <div className="toolbar-filters">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="date">Trier par date</option>
                  <option value="identifiant">Trier par identifiant</option>
                  <option value="profil">Trier par profil</option>
                </select>

                <select 
                  value={filterProfil}
                  onChange={(e) => setFilterProfil(e.target.value)}
                  className="filter-select"
                >
                  <option value="">Tous les profils</option>
                  <option value="1">Administrateur</option>
                  <option value="2">Utilisateur</option>
                  <option value="3">Modérateur</option>
                </select>
              </div>
            </div>

            {/* Tableau */}
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Identifiant</th>
                    <th>Profil</th>
                    <th>Date de création</th>
                    <th>Dernière connexion</th>
                    <th>Tentatives échouées</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedUsers.map(user => (
                    <tr key={user.idUser} className={user.blocked ? 'blocked-row' : ''}>
                      <td className="td-identifiant">{user.identifiant}</td>
                      <td>
                        <span className={`profil-badge profil-${user.idProfil}`}>
                          {profils[user.idProfil]}
                        </span>
                      </td>
                      <td>{formatDate(user.dateCreation)}</td>
                      <td>{formatDate(user.dateDerniereConnexion)}</td>
                      <td className="td-center">
                        <span className={`attempts-badge ${user.failedAttempts > 0 ? 'has-attempts' : ''}`}>
                          {user.failedAttempts}
                        </span>
                      </td>
                      <td className="td-center">
                        <span className={`status-badge ${user.blocked ? 'blocked' : 'active'}`}>
                          {user.blocked ? 'Bloqué' : 'Actif'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Info */}
            <div className="table-info">
              <p>{sortedUsers.length} utilisateur(s) affiché(s)</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
