/**
 * Firebase Integration Service
 * 
 * Cette service gère la synchronisation des signalements avec Firebase.
 * 
 * CONFIGURATION REQUISE:
 * 1. Créez un projet Firebase sur console.firebase.google.com
 * 2. Installez Firebase: npm install firebase
 * 3. Remplacez la config ci-dessous par vos identifiants
 */

// Configuration Firebase - À remplacer par vos identifiants réels
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Pour la démo, nous utilisons un service simulé
// En production, remplacer par l'initialisation Firebase réelle:
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

/**
 * Service Firebase avec fallback simulé pour développement
 */
export const firebaseService = {
  /**
   * Récupère tous les signalements depuis Firebase
   * @returns {Promise<Array>} Liste des signalements
   */
  fetchReports: async () => {
    try {
      // En production, remplacer par:
      // const querySnapshot = await getDocs(collection(db, 'reports'));
      // return querySnapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data()
      // }));

      // Mode développement - simuler le délai réseau
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
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
            }
          ]);
        }, 500);
      });
    } catch (error) {
      console.error('Erreur Firebase - fetchReports:', error);
      throw new Error('Impossible de récupérer les signalements');
    }
  },

  /**
   * Synchronise un signalement vers Firebase
   * @param {Object} report - Le signalement à synchroniser
   * @returns {Promise<void>}
   */
  pushReport: async (report) => {
    try {
      // En production, remplacer par:
      // await setDoc(doc(db, 'reports', report.id.toString()), {
      //   ...report,
      //   updatedAt: new Date().toISOString()
      // });

      // Mode développement
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Report synchronized:', report);
          resolve();
        }, 300);
      });
    } catch (error) {
      console.error('Erreur Firebase - pushReport:', error);
      throw new Error('Impossible de synchroniser le signalement');
    }
  },

  /**
   * Synchronise tous les signalements vers Firebase
   * @param {Array} reports - Liste des signalements à synchroniser
   * @returns {Promise<void>}
   */
  syncAll: async (reports) => {
    try {
      // En production, utiliser batch operations:
      // const batch = writeBatch(db);
      // reports.forEach(report => {
      //   batch.set(doc(db, 'reports', report.id.toString()), {
      //     ...report,
      //     updatedAt: new Date().toISOString()
      //   });
      // });
      // await batch.commit();

      // Mode développement - simuler la synchronisation
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('All reports synchronized:', reports);
          localStorage.setItem('firebaseSyncTime', new Date().toISOString());
          localStorage.setItem('reportsData', JSON.stringify(reports));
          resolve();
        }, 1500);
      });
    } catch (error) {
      console.error('Erreur Firebase - syncAll:', error);
      throw new Error('Impossible de synchroniser les signalements');
    }
  },

  /**
   * Supprime un signalement de Firebase
   * @param {string|number} reportId - ID du signalement
   * @returns {Promise<void>}
   */
  deleteReport: async (reportId) => {
    try {
      // En production:
      // await deleteDoc(doc(db, 'reports', reportId.toString()));

      // Mode développement
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('Report deleted:', reportId);
          resolve();
        }, 300);
      });
    } catch (error) {
      console.error('Erreur Firebase - deleteReport:', error);
      throw new Error('Impossible de supprimer le signalement');
    }
  },

  /**
   * Récupère les statistiques des signalements depuis Firebase
   * @returns {Promise<Object>} Statistiques (total, par statut, etc.)
   */
  fetchStats: async () => {
    try {
      // Mode développement
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            total: 5,
            nouveau: 2,
            'en cours': 2,
            terminé: 1,
            totalSurface: 150,
            totalBudget: 30000000,
            lastSync: new Date().toISOString()
          });
        }, 400);
      });
    } catch (error) {
      console.error('Erreur Firebase - fetchStats:', error);
      throw new Error('Impossible de récupérer les statistiques');
    }
  }
};

/**
 * Helper pour formater les données avant envoi à Firebase
 */
export const formatReportForFirebase = (report) => {
  return {
    ...report,
    createdAt: report.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    syncedToMobile: false
  };
};

/**
 * Helper pour valider un signalement avant synchronisation
 */
export const validateReport = (report) => {
  const errors = [];

  if (!report.type || report.type.trim() === '') {
    errors.push('Type de problème requis');
  }
  if (!report.date) {
    errors.push('Date requise');
  }
  if (!report.status) {
    errors.push('Statut requis');
  }
  if (report.surface <= 0) {
    errors.push('Surface doit être positive');
  }
  if (report.budget <= 0) {
    errors.push('Budget doit être positif');
  }
  if (!report.entreprise || report.entreprise.trim() === '') {
    errors.push('Entreprise requise');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
