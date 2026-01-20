import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, AlertCircle, Lock } from 'lucide-react';
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
      const data = await userService.getBlockedUsers();
      setBlockedUsers(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs bloqués:', error);
      setErrorMessage('Erreur lors du chargement des utilisateurs bloqués');
      // Charger les données de démo en cas d'erreur
 
      // setBlockedUsers(demoData);
    } finally {
      setLoading(false);
    }
  };

  // Débloquer un utilisateur
  const handleUnblockUser = async (userId) => {
    try {
      await userService.unblockUser(userId);
      setBlockedUsers(blockedUsers.filter(u => u.id !== userId));
      setUnblockedUsers(prev => new Set([...prev, userId]));
      setSuccessMessage(`Utilisateur débloqué avec succès`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors du déblocage:', error);
      setErrorMessage('Erreur lors du déblocage de l\'utilisateur');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  // Débloquer tous les utilisateurs sélectionnés
  const handleUnblockSelected = async () => {
    if (unblockedUsers.size === 0) {
      setErrorMessage('Aucun utilisateur sélectionné');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    try {
      await userService.unblockMultipleUsers(Array.from(unblockedUsers));
      setBlockedUsers(blockedUsers.filter(u => !unblockedUsers.has(u.id)));
      setUnblockedUsers(new Set());
      setSuccessMessage(`${unblockedUsers.size} utilisateur(s) débloqué(s) avec succès`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Erreur lors du déblocage multiple:', error);
      setErrorMessage('Erreur lors du déblocage des utilisateurs');
      setTimeout(() => setErrorMessage(''), 3000);
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
              <ChevronLeft size={24} />
            </button>
            <h1>Débloquer des utilisateurs</h1>
          </div>
        </div>
      </header>

      {/* Messages */}
      {successMessage && (
        <div className="success-message">
          <CheckCircle size={18} />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          <AlertCircle size={18} />
          {errorMessage}
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
                        {/* {user.nom} */}
                        {user.identifiant.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="user-details">
                        <h3>{user.identifiant}</h3>
                        <p className="user-email">{user.email}</p>
                      </div>
                    </div>
                    <div className="blocked-indicator">
                      <Lock size={14} />
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
                        <span className="info-label">Dernière connexion:</span>
                        <span className="info-value">{formatDate(user.dateDerniereConnexion)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="user-card-footer">
                    <label className="checkbox-wrapper">
                      <input
                        type="checkbox"
                        checked={unblockedUsers.has(user.idUser)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setUnblockedUsers(prev => new Set([...prev, user.idUser]));
                          } else {
                            setUnblockedUsers(prev => {
                              const newSet = new Set(prev);
                              newSet.delete(user.idUser);
                              return newSet;
                            });
                          }
                        }}
                      />
                      <span>Sélectionner</span>
                    </label>
                    <button
                      className="unblock-button"
                      onClick={() => handleUnblockUser(user.idUser)}
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
