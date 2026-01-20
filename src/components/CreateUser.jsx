import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { userService } from '../services/api';
import '../styles/CreateUser.css';

export default function CreateUser() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    identifiant: '',
    password: '',
    confirmPassword: '',
    profil: 2 // Utilisateur par défaut
  });

  const profils = [
    { id: 1, label: 'Administrateur' },
    { id: 2, label: 'Utilisateur' },
    { id: 3, label: 'Modérateur' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.identifiant.trim()) {
      setErrorMessage('L\'identifiant est requis');
      return false;
    }

    if (formData.identifiant.trim().length < 3) {
      setErrorMessage('L\'identifiant doit contenir au moins 3 caractères');
      return false;
    }

    if (!formData.password) {
      setErrorMessage('Le mot de passe est requis');
      return false;
    }

    if (formData.password.length < 4) {
      setErrorMessage('Le mot de passe doit contenir au moins 4 caractères');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formatLocalDateTime = (date) => {
        const pad = (n) => String(n).padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      };

      const newUser = {
        identifiant: formData.identifiant.trim(),
        password: formData.password,
        dateCreation: formatLocalDateTime(new Date()),   // now
        dateDerniereConnexion: null,                     // null as requested
        profil: {
          idProfil: Number(formData.profil)              // ensure numeric
        }
      };

      await userService.createUser(newUser);

      setSuccessMessage('Compte utilisateur créé avec succès');
      setFormData({
        identifiant: '',
        password: '',
        confirmPassword: '',
        profil: 2
      });

      setTimeout(() => {
        navigate('/manager');
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      setErrorMessage('Erreur lors de la création du compte. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-user-container">
      {/* En-tête */}
      <header className="create-user-header">
        <div className="header-content">
          <div className="header-title">
            <button 
              className="back-button"
              onClick={() => navigate('/manager')}
              title="Retour au Manager"
            >
              <ChevronLeft size={24} />
            </button>
            <h1>Créer un compte utilisateur</h1>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <div className="create-user-content">
        <div className="form-container">
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

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="create-user-form">
            <div className="form-group">
              <label htmlFor="identifiant">Identifiant (email ou username)</label>
              <input
                type="text"
                id="identifiant"
                name="identifiant"
                value={formData.identifiant}
                onChange={handleChange}
                placeholder="Ex: john.doe@example.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrez un mot de passe sécurisé"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirmez le mot de passe"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="profil">Rôle de l'utilisateur</label>
              <select
                id="profil"
                name="profil"
                value={formData.profil}
                onChange={handleChange}
                disabled={loading}
              >
                {profils.map(profil => (
                  <option key={profil.id} value={profil.id}>
                    {profil.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Création en cours...' : 'Créer le compte'}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate('/manager')}
                disabled={loading}
              >
                Annuler
              </button>
            </div>
          </form>

          {/* Info */}
          <div className="form-info">
            <p className="info-title">Informations:</p>
            <ul>
              <li>L'identifiant doit être unique et contenir au moins 3 caractères</li>
              <li>Le mot de passe doit contenir au moins 4 caractères</li>
              <li>La date de création est enregistrée automatiquement</li>
              <li>L'utilisateur pourra se connecter immédiatement après la création</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
