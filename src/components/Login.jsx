import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('profile'); // 'profile' | 'login' | 'signup'
  const [profile, setProfile] = useState(null); // 'visitor' | 'user' | 'manager'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Sélection du profil
  const handleProfileSelect = (selectedProfile) => {
    if (selectedProfile === 'visitor') {
      // Visiteur - accès direct sans connexion
      navigate('/');
    } else {
      setProfile(selectedProfile);
      setMode('login');
      setError('');
      setSuccess('');
    }
  };

  // Basculer vers inscription
  const handleSwitchToSignup = () => {
    setMode('signup');
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  // Basculer vers connexion
  const handleSwitchToLogin = () => {
    setMode('login');
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  };

  // Retour à la sélection de profil
  const handleBackToProfile = () => {
    setMode('profile');
    setProfile(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      // À remplacer par votre appel API Spring Boot
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // const data = await response.json();

      await new Promise(resolve => setTimeout(resolve, 800));

      // Redirection vers Manager après connexion (pour Utilisateur ET Manager)
      navigate('/manager');
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!validateEmail(email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      // À remplacer par votre appel API Spring Boot
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password, profile })
      // });
      // const data = await response.json();

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulation réussite
      setSuccess('Compte créé avec succès ! Veuillez vous connecter.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setMode('login'), 2000);
    } catch (err) {
      setError('Erreur lors de la création du compte. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {mode === 'profile' && (
        <div className="profile-selection">
          <div className="profile-header">
            <h1>Accédez à Signalement Routier</h1>
            <p>Sélectionnez votre profil pour continuer</p>
          </div>

          <div className="profile-cards">
            {/* Visiteur */}
            <div className="profile-card visitor">
              <div className="profile-icon">V</div>
              <h2>Visiteur</h2>
              <p className="profile-description">
                Consultez la carte des signalements et les statistiques en temps réel
              </p>
              <p className="profile-feature">Sans compte</p>
              <button
                className="profile-button"
                onClick={() => handleProfileSelect('visitor')}
              >
                Accès immédiat
              </button>
            </div>

            {/* Utilisateur */}
            <div className="profile-card user">
              <div className="profile-icon">U</div>
              <h2>Utilisateur</h2>
              <p className="profile-description">
                Créez un compte pour signaler les problèmes routiers
              </p>
              <p className="profile-feature">Création de compte requise</p>
              <button
                className="profile-button"
                onClick={() => handleProfileSelect('user')}
              >
                Se connecter
              </button>
            </div>

            {/* Manager */}
            <div className="profile-card manager">
              <div className="profile-icon">M</div>
              <h2>Manager</h2>
              <p className="profile-description">
                Gérez tous les signalements et synchronisez avec Firebase
              </p>
              <p className="profile-feature">Compte créé par défaut</p>
              <button
                className="profile-button"
                onClick={() => handleProfileSelect('manager')}
              >
                Gérer
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'login' && (
        <div className="login-card">
          <button className="back-button" onClick={handleBackToProfile}>
            ← Retour
          </button>

          <div className="login-header">
            <h1>Connexion</h1>
            <p>
              Profil: <strong>{profile === 'user' ? 'Utilisateur' : 'Manager'}</strong>
            </p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Vous n'avez pas de compte ?{' '}
              <button className="link-button" onClick={handleSwitchToSignup}>
                Créer un compte
              </button>
            </p>
          </div>
        </div>
      )}

      {mode === 'signup' && (
        <div className="login-card">
          <button className="back-button" onClick={handleBackToProfile}>
            ← Retour
          </button>

          <div className="login-header">
            <h1>Créer un compte</h1>
            <p>
              Profil: <strong>{profile === 'user' ? 'Utilisateur' : 'Manager'}</strong>
            </p>
          </div>

          <form onSubmit={handleSignup} className="login-form">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className={`login-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Création en cours...' : 'Créer un compte'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Vous avez déjà un compte ?{' '}
              <button className="link-button" onClick={handleSwitchToLogin}>
                Se connecter
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
