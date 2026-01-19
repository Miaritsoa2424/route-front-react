# Documentation - Frontend Route Signalement

## Structure Complète

### Pages Implémentées

#### 1. **Page Visiteur (/)** - VisitorMap.jsx
- Affiche une carte interactive avec tous les signalements
- **Bouton "Se connecter"** en haut à droite
- Statistiques en temps réel:
  - Points signalés
  - Surface totale
  - Budget total
  - Avancement global
- Accès direct au formulaire de connexion

#### 2. **Page Login (/login)** - Login.jsx
- Formulaire de connexion professionnel
- Validations:
  - Email valide requis
  - Mot de passe minimum 6 caractères
  - Champs requis
- **Redirection automatique vers /manager** après connexion réussie
- Options: Se souvenir de moi, Mot de passe oublié
- Style glassmorphism avec fond routier

#### 3. **Page Manager (/manager)** - Manager.jsx
- **Gestion complète des signalements**
- Fonctionnalités:
  
  **Synchronisation Firebase:**
  - Bouton "Synchroniser avec Firebase" en haut
  - Récupère les nouveaux signalements
  - Envoie les données mises à jour
  - Message de succès confirmant la sync
  
  **Gestion des Signalements:**
  - Liste de tous les signalements
  - Click sur une carte pour développer les détails
  - Voir toutes les informations:
    - Surface (m²)
    - Budget (Ar)
    - Entreprise assignée
    - Localisation
    - Description détaillée
    - Statut actuel
  
  **Modification des Signalements:**
  - Cliquer sur "Modifier" pour éditer
  - Changer le type, surface, budget, entreprise
  - Modifier la description et la localisation
  - **Changer le statut:**
    - Nouveau
    - En cours
    - Planifié
    - Complété
  - Sauvegarder ou annuler les modifications
  
  **Autres Fonctionnalités:**
  - Bouton "Déconnexion" en haut à droite
  - États de chargement
  - Messages de succès après modifications
  - Responsive design mobile

## Thème et Design

### Couleurs Utilisées
- **Primaire:** Bleu (#3b82f6)
- **Succès:** Vert (#22c55e)
- **Erreur:** Rouge (#dc2626, #ef4444)
- **Neutrals:** Gris clair (#f8fafc), Gris foncé (#1a2332)

### Badges de Statut
- **Nouveau:** Jaune (#fef3c7)
- **En cours:** Bleu clair (#dbeafe)
- **Planifié:** Violet (#e9d5ff)
- **Complété:** Vert (#dcfce7)

### Style Global
- ✅ Professionnel et épuré
- ✅ Pas d'emojis ni d'icônes visuelles (sauf Leaflet pour la carte)
- ✅ Glassmorphism avec blurs
- ✅ Transitions fluides
- ✅ Responsive (Mobile, Tablet, Desktop)

## Flux d'Utilisateur

```
Page Visiteur (/) 
    ↓ [Cliquer "Se connecter"]
Page Login (/login)
    ↓ [Remplir email/mot de passe]
    ↓ [Cliquer "Se connecter"]
Page Manager (/manager)
    ↓ [Synchroniser données]
    ↓ [Voir/Modifier signalements]
    ↓ [Cliquer "Déconnexion"]
Page Visiteur (/)
```

## Intégration Firebase

### À Faire Dans `Manager.jsx`

Les fonctions suivantes ont des commentaires `// À remplacer par votre appel API`:

1. **`loadSignalements()`** - Ligne ~55
   - Remplacer l'appel pour récupérer de Firebase
   - Utiliser Realtime Database ou Firestore

2. **`handleSync()`** - Ligne ~102
   - Récupérer les nouveaux signalements de Firebase
   - Envoyer les données mises à jour

3. **`handleSaveEdit()`** - Ligne ~139
   - Appel PUT pour mettre à jour un signalement
   - Synchroniser avec Firebase

### À Faire Dans `Login.jsx`

- **`handleSubmit()`** - Ligne ~44
  - Intégrer Firebase Authentication
  - Valider les credentials
  - Redirection vers /manager après auth réussie

## Données de Test

Le Manager charge automatiquement 4 signalements de test:

```javascript
{
  id: 1,
  type: 'Nid de poule',
  date: '2024-01-15',
  status: 'nouveau',
  surface: 25,
  budget: 5000000,
  entreprise: 'RoadFix Mada',
  localisation: 'Antananarivo - Route de l\'Aéroport',
  description: 'Nid de poule dangereux causant des ralentissements'
}
```

## Installation et Démarrage

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser la build
npm run preview
```

## Points Personnalisables

1. **Coleurs:** Modifiez les valeurs hex dans les CSS
2. **Textes:** Tous les textes sont en français et modifiables
3. **API Endpoints:** Remplacer les commentaires "À remplacer par..."
4. **Validations:** Adapter les règles de validation selon vos besoins
5. **Statuts:** Ajouter/modifier les statuts possibles

## Fichiers Clés

```
src/
├── components/
│   ├── Manager.jsx          (Gestion des signalements)
│   ├── VisitorMap.jsx       (Carte publique)
│   └── Login.jsx            (Authentification)
├── styles/
│   ├── Manager.css          (Style Manager - professionnel)
│   ├── Login.css            (Style Login - glassmorphism)
│   └── VisitorMap.css       (Style Carte)
└── App.jsx                  (Routing)
```

## Responsive Design

Tous les composants sont optimisés pour:
- 📱 Mobile (< 480px)
- 📱 Tablet (480px - 768px)
- 💻 Desktop (> 768px)

## Notes Importantes

- ✅ Aucun emoji visuel dans l'interface (design professionnel)
- ✅ Cohérence des couleurs avec votre thème existant
- ✅ Tous les boutons ont des états hover/active
- ✅ Animations fluides et subtiles
- ✅ Accessibilité respectée (labels, focus, etc.)

---

Pour questions ou modifications, les commentaires dans le code indiquent les zones à adapter.
