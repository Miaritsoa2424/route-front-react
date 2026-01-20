import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/api';
import '../styles/UnblockUsers.css';

export default function UnblockUsers() {
  const navigate = useNavigate();
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [unblockedUsers, setUnblockedUsers] = useState(new Set());

  // Charger les utilisateurs bloqués au montage
  useEffect(() => {
    loadBlockedUsers();
  }, []);

  // Charger les utilisateurs bloqués depuis l'API
  const loadBlockedUsers = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // À remplacer par votre appel API réel
      // const response = await fetch('/api/users/blocked');
      // const data = await response.json();
      
      // Données factices pour la démo
      const demoData = [
        {
          id: 1,
          email: 'john.doe@example.com',
          nom: 'John Doe',
          failedAttempts: 3,
          blockedAt: '2024-01-18T14:30:00',
          lastAttempt: '2024-01-18T14:45:00',
          raison: 'Mot de passe incorrect saisi 3 fois'
        },
        {
          id: 2,
          email: 'marie.sophie@example.com',
          nom: 'Marie Sophie',
          failedAttempts: 5,
          blockedAt: '2024-01-17T09:15:00',
          lastAttempt: '2024-01-17T10:20:00',
          raison: 'Mot de passe incorrect saisi 5 fois'
        },
        {
          id: 3,
          email: 'alex.martin@example.com',
          nom: 'Alex Martin',
          failedAttempts: 3,
          blockedAt: '2024-01-16T16:45:00',
          lastAttempt: '2024-01-16T17:00:00',
          raison: 'Mot de passe incorrect saisi 3 fois'
        }
      ];
      
      setBlockedUsers(demoData);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs bloqués:', error);
      setErrorMessage('Erreur lors du chargement des utilisateurs bloqués');
    } finally {
      setLoading(false);
    }
  };

  // Débloquer un utilisateur
  const handleUnblockUser = async (userId) => {
    try {
      // À remplacer par votre appel API réel
      // const response = await fetch(`/api/users/${userId}/unblock`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Simulation du déblocage
      setBlockedUsers(blockedUsers.filter(u => u.id !== userId));
      setUnblockedUsers(prev => new Set([...prev, userId]));
      setSuccessMessage(`Utilisateur débloqué avec succès`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors du déblocage:', error);
      setErrorMessage('Erreur lors du déblocage de l\'utilisateur');
    }
  };

  // Débloquer tous les utilisateurs sélectionnés
  const handleUnblockSelected = async () => {
    if (unblockedUsers.size === 0) {
      setErrorMessage('Aucun utilisateur sélectionné');
      return;
    }

    try {
      // À remplacer par votre appel API réel pour débloquer plusieurs utilisateurs
      // await Promise.all(Array.from(unblockedUsers).map(id =>
      //   fetch(`/api/users/${id}/unblock`, { method: 'POST' })
      // ));

      setBlockedUsers(blockedUsers.filter(u => !unblockedUsers.has(u.id)));
      setUnblockedUsers(new Set());
      setSuccessMessage(`${unblockedUsers.size} utilisateur(s) débloqué(s) avec succès`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors du déblocage multiple:', error);
      setErrorMessage('Erreur lors du déblocage des utilisateurs');
    }
  };

  // Formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="unblock-container">
      {/* En-tête */}
      <header className="unblock-header">
        <div className="header-content">
          <div className="header-title">
            <button 
              className="back-button"
              onClick={() => navigate('/manager')}
              title="Retour au Manager"
            >
              ←
            </button>
            <h1>Débloquer des utilisateurs</h1>
          </div>
        </div>
      </header>

      {/* Messages */}
      {successMessage && (
        <div className="success-message">
          ✓ {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          ✕ {errorMessage}
        </div>
      )}

      {/* Contenu */}
      <div className="unblock-content">
        {loading ? (
          <div className="loading-state">
            <p>Chargement des utilisateurs bloqués...</p>
          </div>
        ) : blockedUsers.length === 0 ? (
          <div className="empty-state">
            <p>Aucun utilisateur bloqué</p>
            <p className="empty-subtitle">Tous les utilisateurs peuvent accéder à l'application</p>
          </div>
        ) : (
          <>
            {/* Barre d'actions */}
            <div className="actions-bar">
              <div className="info">
                <span className="badge">{blockedUsers.length}</span>
                <span>utilisateur(s) bloqué(s)</span>
              </div>
              {unblockedUsers.size > 0 && (
                <button 
                  className="unblock-all-button"
                  onClick={handleUnblockSelected}
                >
                  Débloquer les utilisateurs sélectionnés
                </button>
              )}
            </div>

            {/* Liste des utilisateurs bloqués */}
            <div className="blocked-users-list">
              {blockedUsers.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-card-header">
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.nom.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="user-details">
                        <h3>{user.nom}</h3>
                        <p className="user-email">{user.email}</p>
                      </div>
                    </div>
                    <div className="blocked-indicator">
                      <span className="blocked-text">Bloqué</span>
                    </div>
                  </div>

                  <div className="user-card-content">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Tentatives échouées:</span>
                        <span className="info-value">{user.failedAttempts}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Bloqué le:</span>
                        <span className="info-value">{formatDate(user.blockedAt)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Dernière tentative:</span>
                        <span className="info-value">{formatDate(user.lastAttempt)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Raison:</span>
                        <span className="info-value">{user.raison}</span>
                      </div>
                    </div>
                  </div>

                  <div className="user-card-footer">
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={unblockedUsers.has(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setUnblockedUsers(prev => new Set([...prev, user.id]));
                          } else {
                            setUnblockedUsers(prev => {
                              const newSet = new Set(prev);
                              newSet.delete(user.id);
                              return newSet;
                            });
                          }
                        }}
                      />
                      <span>Sélectionner</span>
                    </label>
                    <button
                      className="unblock-button"
                      onClick={() => handleUnblockUser(user.id)}
                    >
                      Débloquer cet utilisateur
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
