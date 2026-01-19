// Configuration de l'API
const API_BASE_URL = 'http://localhost:8080/api';

// Users
export const userService = {
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/users`);
    return response.json();
  },

  getUserById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`);
    return response.json();
  },

  createUser: async (user) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },

  updateUser: async (id, user) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    return response.json();
  },

  deleteUser: async (id) => {
    await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
  },
};

// Signalements
export const signalementService = {
  getAllSignalements: async () => {
    const response = await fetch(`${API_BASE_URL}/signalements`);
    return response.json();
  },

  getSignalementById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/signalements/${id}`);
    return response.json();
  },

  createSignalement: async (signalement) => {
    const response = await fetch(`${API_BASE_URL}/signalements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signalement),
    });
    return response.json();
  },

  updateSignalement: async (id, signalement) => {
    const response = await fetch(`${API_BASE_URL}/signalements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signalement),
    });
    return response.json();
  },

  deleteSignalement: async (id) => {
    await fetch(`${API_BASE_URL}/signalements/${id}`, { method: 'DELETE' });
  },
};

// Entreprises
export const entrepriseService = {
  getAllEntreprises: async () => {
    const response = await fetch(`${API_BASE_URL}/entreprises`);
    return response.json();
  },

  getEntrepriseById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/entreprises/${id}`);
    return response.json();
  },

  createEntreprise: async (entreprise) => {
    const response = await fetch(`${API_BASE_URL}/entreprises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entreprise),
    });
    return response.json();
  },

  updateEntreprise: async (id, entreprise) => {
    const response = await fetch(`${API_BASE_URL}/entreprises/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entreprise),
    });
    return response.json();
  },

  deleteEntreprise: async (id) => {
    await fetch(`${API_BASE_URL}/entreprises/${id}`, { method: 'DELETE' });
  },
};

// Tentatives
export const tentativeService = {
  getAllTentatives: async () => {
    const response = await fetch(`${API_BASE_URL}/tentatives`);
    return response.json();
  },

  getTentativeById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tentatives/${id}`);
    return response.json();
  },

  createTentative: async (tentative) => {
    const response = await fetch(`${API_BASE_URL}/tentatives`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tentative),
    });
    return response.json();
  },

  updateTentative: async (id, tentative) => {
    const response = await fetch(`${API_BASE_URL}/tentatives/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tentative),
    });
    return response.json();
  },

  deleteTentative: async (id) => {
    await fetch(`${API_BASE_URL}/tentatives/${id}`, { method: 'DELETE' });
  },
};

// Avancements
export const avancementService = {
  getAllAvancements: async () => {
    const response = await fetch(`${API_BASE_URL}/avancements`);
    return response.json();
  },

  getAvancementById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/avancements/${id}`);
    return response.json();
  },

  createAvancement: async (avancement) => {
    const response = await fetch(`${API_BASE_URL}/avancements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(avancement),
    });
    return response.json();
  },

  updateAvancement: async (id, avancement) => {
    const response = await fetch(`${API_BASE_URL}/avancements/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(avancement),
    });
    return response.json();
  },

  deleteAvancement: async (id) => {
    await fetch(`${API_BASE_URL}/avancements/${id}`, { method: 'DELETE' });
  },
};
