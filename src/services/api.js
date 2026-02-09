// Configuration de l'API
export const API_BASE_URL = 'http://localhost:8080/api';

// Helper function pour ajouter automatiquement le token d'authentification
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

// Helper function pour les requêtes sans authentification (endpoints publics)
const fetchWithoutAuth = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};

// Users
export const userService = {
  getAllUsers: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users`);
    return response.json();
  },

  getUserById: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/${id}`);
    return response.json();
  },

  createUser: async (user) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return response.json();
  },

  updateUser: async (id, user) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    });
    return response.json();
  },

  deleteUser: async (id) => {
    await fetchWithAuth(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
  },

  // Utilisateurs bloqués
  getBlockedUsers: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/blocked`);
    return response.json();
  },

  unblockUser: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/${id}/unblock`, {
      method: 'POST',
    });
    return response.json();
  },

  unblockMultipleUsers: async (userIds) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/unblock-multiple`, {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
    return response.json();
  },
};


// Signalements
export const signalementService = {
  getAllSignalements: async () => {
    const response = await fetchWithoutAuth(`${API_BASE_URL}/signalements`);
    return response.json();
  },

  getSignalementById: async (id) => {
    const response = await fetchWithoutAuth(`${API_BASE_URL}/signalements/${id}`);
    return response.json();
  },

  createSignalement: async (signalement) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/signalements`, {
      method: 'POST',
      body: JSON.stringify(signalement),
    });
    return response.json();
  },

  updateSignalement: async (id, signalement) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/signalements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(signalement),
    });
    return response.json();
  },

  deleteSignalement: async (id) => {
    await fetchWithAuth(`${API_BASE_URL}/signalements/${id}`, { method: 'DELETE' });
  },
};

// Images
export const imageService = {
  getImagesBySignalement: async (signalementId) => {
    const response = await fetchWithoutAuth(`${API_BASE_URL}/signalements/${signalementId}/images`);
    return response.json();
  },
};

// SignalementStatut
export const signalementStatutService = {
  getAllSignalementStatuts: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/signalement-statuts`);
    return response.json();
  },

  getSignalementStatutById: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/signalement-statuts/${id}`);
    return response.json();
  },

  createSignalementStatut: async (signalementStatut) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/signalement-statuts`, {
      method: 'POST',
      body: JSON.stringify(signalementStatut),
    });
    return response.json();
  },

  updateSignalementStatut: async (id, signalementStatut) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/signalement-statuts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(signalementStatut),
    });
    return response.json();
  },

  deleteSignalementStatut: async (id) => {
    await fetchWithAuth(`${API_BASE_URL}/signalement-statuts/${id}`, { method: 'DELETE' });
  },
};

// Stats
export const statsService = {
  getStats: async () => {
    const response = await fetchWithoutAuth(`${API_BASE_URL}/stats`);
    return response.json();
  },
};

// Entreprises
export const entrepriseService = {
  getAllEntreprises: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/entreprises`);
    return response.json();
  },

  getEntrepriseById: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/entreprises/${id}`);
    return response.json();
  },

  createEntreprise: async (entreprise) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/entreprises`, {
      method: 'POST',
      body: JSON.stringify(entreprise),
    });
    return response.json();
  },

  updateEntreprise: async (id, entreprise) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/entreprises/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entreprise),
    });
    return response.json();
  },

  deleteEntreprise: async (id) => {
    await fetchWithAuth(`${API_BASE_URL}/entreprises/${id}`, { method: 'DELETE' });
  },
};

// Tentatives
export const tentativeService = {
  getAllTentatives: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/tentatives`);
    return response.json();
  },

  getTentativeById: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/tentatives/${id}`);
    return response.json();
  },

  createTentative: async (tentative) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/tentatives`, {
      method: 'POST',
      body: JSON.stringify(tentative),
    });
    return response.json();
  },

  updateTentative: async (id, tentative) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/tentatives/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tentative),
    });
    return response.json();
  },

  deleteTentative: async (id) => {
    await fetchWithAuth(`${API_BASE_URL}/tentatives/${id}`, { method: 'DELETE' });
  },
};

// Avancements
export const avancementService = {
  getAllAvancements: async () => {
    const response = await fetchWithAuth(`${API_BASE_URL}/avancements`);
    return response.json();
  },

  getAvancementById: async (id) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/avancements/${id}`);
    return response.json();
  },

  createAvancement: async (avancement) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/avancements`, {
      method: 'POST',
      body: JSON.stringify(avancement),
    });
    return response.json();
  },

  updateAvancement: async (id, avancement) => {
    const response = await fetchWithAuth(`${API_BASE_URL}/avancements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(avancement),
    });
    return response.json();
  },

  deleteAvancement: async (id) => {
    await fetchWithAuth(`${API_BASE_URL}/avancements/${id}`, { method: 'DELETE' });
  },
};

// Authentification
export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifiant: email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
     if (data.token) {
      localStorage.setItem('token', data.token);
      // ou sessionStorage.setItem('token', data.token);
    }
    return data;
  },
};
