// EXEMPLES D'INTÉGRATION FIREBASE
// Utilisez ces exemples pour remplacer les sections "À remplacer par votre appel API"

// ============ FIREBASE CONFIG ============
// À créer dans un fichier src/config/firebase.js

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getDatabase } from "firebase/database";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "your-project.firebaseapp.com",
//   projectId: "your-project",
//   storageBucket: "your-project.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "1:123456789:web:abcdef1234567890"
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const database = getDatabase(app);
// export const firestore = getFirestore(app);


// ============ LOGIN.JSX - AUTHENTIFICATION FIREBASE ============

// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../config/firebase';
// import '../styles/Login.css';

// export default function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     if (!email.trim() || !password.trim()) {
//       setError('Veuillez remplir tous les champs');
//       return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       setError('Veuillez entrer une adresse email valide');
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // Firebase Authentication
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
      
//       console.log('Utilisateur connecté:', user.uid);
      
//       // Sauvegarder le token de l'utilisateur (optionnel)
//       const token = await user.getIdToken();
//       localStorage.setItem('userToken', token);
//       localStorage.setItem('userId', user.uid);
      
//       // Rediriger vers le manager
//       navigate('/manager');
//     } catch (err) {
//       if (err.code === 'auth/user-not-found') {
//         setError('Email non trouvé');
//       } else if (err.code === 'auth/wrong-password') {
//         setError('Mot de passe incorrect');
//       } else {
//         setError('Erreur de connexion. Veuillez réessayer.');
//       }
//       console.error('Erreur auth:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ... rest of component


// ============ MANAGER.JSX - FIRESTORE (recommandé) ============

// import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   collection, 
//   getDocs, 
//   updateDoc, 
//   doc,
//   onSnapshot,
//   query,
//   orderBy
// } from 'firebase/firestore';
// import { signOut } from 'firebase/auth';
// import { firestore, auth } from '../config/firebase';
// import '../styles/Manager.css';

// export default function Manager() {
//   const navigate = useNavigate();
//   const [signalements, setSignalements] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [syncing, setSyncing] = useState(false);

//   // Charger les signalements avec Firestore
//   const loadSignalements = async () => {
//     setLoading(true);
//     try {
//       const signalRef = collection(firestore, 'signalements');
//       const q = query(signalRef, orderBy('date', 'desc'));
      
//       // Option 1: Snapshot une fois
//       const querySnapshot = await getDocs(q);
//       const data = [];
//       querySnapshot.forEach((doc) => {
//         data.push({
//           id: doc.id,
//           ...doc.data()
//         });
//       });
//       setSignalements(data);

//       // Option 2: Écouter les changements en temps réel
//       // onSnapshot(q, (snapshot) => {
//       //   const data = [];
//       //   snapshot.forEach((doc) => {
//       //     data.push({
//       //       id: doc.id,
//       //       ...doc.data()
//       //     });
//       //   });
//       //   setSignalements(data);
//       // });
      
//     } catch (error) {
//       console.error('Erreur:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Synchroniser avec Firebase
//   const handleSync = async () => {
//     setSyncing(true);
//     try {
//       // Récupérer les dernières données
//       await loadSignalements();
//       setSuccessMessage('Synchronisation réussie');
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch (error) {
//       console.error('Erreur sync:', error);
//     } finally {
//       setSyncing(false);
//     }
//   };

//   // Sauvegarder les modifications
//   const handleSaveEdit = async () => {
//     try {
//       const signalRef = doc(firestore, 'signalements', editingId);
//       await updateDoc(signalRef, editFormData);
      
//       setSignalements(signalements.map(s => 
//         s.id === editingId ? editFormData : s
//       ));
      
//       setEditingId(null);
//       setEditFormData({});
//       setSuccessMessage('Signalement mis à jour');
//       setTimeout(() => setSuccessMessage(''), 3000);
//     } catch (error) {
//       console.error('Erreur save:', error);
//     }
//   };

//   // Déconnexion
//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       localStorage.removeItem('userToken');
//       localStorage.removeItem('userId');
//       navigate('/');
//     } catch (error) {
//       console.error('Erreur logout:', error);
//     }
//   };

//   useEffect(() => {
//     loadSignalements();
//   }, []);

//   // ... rest of component


// ============ MANAGER.JSX - REALTIME DATABASE ============

// import { useEffect, useState } from 'react';
// import { ref, onValue, update } from 'firebase/database';
// import { database } from '../config/firebase';

// const loadSignalements = async () => {
//   setLoading(true);
//   try {
//     const signalRef = ref(database, 'signalements');
    
//     // Écouter en temps réel
//     onValue(signalRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         const signalements = Object.keys(data).map(id => ({
//           id,
//           ...data[id]
//         }));
//         setSignalements(signalements);
//       }
//     });
//   } catch (error) {
//     console.error('Erreur:', error);
//   } finally {
//     setLoading(false);
//   }
// };

// const handleSaveEdit = async () => {
//   try {
//     const signalRef = ref(database, `signalements/${editingId}`);
//     await update(signalRef, editFormData);
    
//     setEditingId(null);
//     setEditFormData({});
//     setSuccessMessage('Signalement mis à jour');
//   } catch (error) {
//     console.error('Erreur:', error);
//   }
// };


// ============ STRUCTURES FIRESTORE ============

// Collection: signalements
// Documents:
// {
//   id: "signal_001",
//   type: "Nid de poule",
//   date: Timestamp(2024-01-15),
//   status: "nouveau",
//   surface: 25,
//   budget: 5000000,
//   entreprise: "RoadFix Mada",
//   localisation: "Antananarivo",
//   description: "Description...",
//   coordinates: {
//     lat: -18.9100,
//     lng: 47.5225
//   },
//   createdAt: Timestamp(2024-01-15),
//   updatedAt: Timestamp(2024-01-15),
//   createdBy: "userId"
// }


// ============ RÈGLES FIRESTORE DE SÉCURITÉ ============

// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     // Authentification requise pour tous
//     match /signalements/{document=**} {
//       allow read: if request.auth != null;
//       allow create: if request.auth != null && request.resource.data.createdBy == request.auth.uid;
//       allow update: if request.auth != null && resource.data.createdBy == request.auth.uid;
//       allow delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
//     }
//   }
// }


// ============ PACKAGE.JSON - AJOUTER FIREBASE ============

// npm install firebase

// "dependencies": {
//   "firebase": "^10.7.0",
//   "react": "^19.2.0",
//   "react-dom": "^19.2.0",
//   "react-router-dom": "^7.12.0",
//   ...
// }


// ============ VARIABLES D'ENVIRONNEMENT (.env.local) ============

// VITE_FIREBASE_API_KEY=your_api_key
// VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
// VITE_FIREBASE_PROJECT_ID=your_project_id
// VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
// VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
// VITE_FIREBASE_APP_ID=your_app_id


// ============ UTILISER LES VARIABLES D'ENVIRONNEMENT ============

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// };


// ============ PROTÉGER LES ROUTES ============

// Créer src/components/ProtectedRoute.jsx

// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';

// export default function ProtectedRoute({ children }) {
//   const { user, loading } = useAuth();

//   if (loading) return <div>Chargement...</div>;
  
//   return user ? children : <Navigate to="/login" />;
// }


// ============ HOOK CUSTOM useAuth ============

// Créer src/hooks/useAuth.js

// import { useEffect, useState } from 'react';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../config/firebase';

// export function useAuth() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   return { user, loading };
// }


// ============ APP.JSX AVEC PROTECTED ROUTES ============

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import VisitorMap from './components/VisitorMap';
// import Login from './components/Login';
// import Manager from './components/Manager';
// import ProtectedRoute from './components/ProtectedRoute';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<VisitorMap />} />
//         <Route path="/login" element={<Login />} />
//         <Route 
//           path="/manager" 
//           element={
//             <ProtectedRoute>
//               <Manager />
//            </ProtectedRoute>
//           } 
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
