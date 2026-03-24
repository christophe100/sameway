# Guide d'intégration Backend - Création de Trajets

## 🎯 Résumé des Changes

L'intégration du backend pour la création de trajets est maintenant complète. Voici ce qui a été mis à place:

### 1. **Configuration Frontend**

- ✅ **Fichier `.env.local`** créé pour configurer l'URL de l'API
- ✅ **`src/api.js`** configuré avec axios et intercepteurs pour la gestion des tokens
- ✅ **`src/services/trajetService.js`** créé avec toutes les fonctionnalités CRUD

### 2. **Composant `AjouterForm.jsx`**

Le composant a été amélioré avec:

- Integration avec `trajetService` pour créer des trajets
- Gestion des états de chargement (`loading`)
- Messages d'erreur et de succès affichés à l'utilisateur
- Validation des données avant soumission
- Redirection automatique vers "Mes trajets" après succès
- Désactivation des boutons pendant le chargement

### 3. **Flux de Création de Trajet**

```
Étape 1: Sélection du départ et destination
    ↓
Étape 2: Saisie de la date, heure, places et prix
    ↓
Validation des données
    ↓
Envoi au backend via trajetService.createTrajet()
    ↓
Traitement du serveur (authentification, validation, création)
    ↓
Affichage du message de succès
    ↓
Redirection vers "Mes trajets"
```

## 🚀 Comment Utiliser

### 1. **Démarrer le Backend**

```bash
cd klaus
npm install  # Si nécessaire
npm run dev  # Démarre le serveur sur http://localhost:5000
```

### 2. **Démarrer le Frontend**

```bash
cd ..
npm install  # Si nécessaire
npm run dev  # Démarre sur http://localhost:5173
```

### 3. **Créer un Trajet**

1. Allez sur la page "Ajouter un trajet"
2. Sélectionnez le départ et la destination
3. Cliquez sur "Suivant"
4. Remplissez la date, heure, places et prix
5. Cliquez sur "Ajouter le trajet"

## 📋 Fichiers Modifiés/Créés

### Créés:

- `.env.local` - Configuration de l'API URL
- `src/api.js` - Instance axios avec intercepteurs
- `src/services/trajetService.js` - Service de gestion des trajets

### Modifiés:

- `src/components/AjouterForm.jsx` - Intégration du service de création

## 🔐 Authentification

L'application utilise **JWT (JSON Web Tokens)** pour l'authentification:

- Le token est stocké dans `localStorage` après la connexion
- Il est automatiquement ajouté aux headers de chaque requête
- Si le token est expiré, l'utilisateur est redirigé vers la page de login

## 📊 Structure des Données - Trajet

Le backend s'attend aux données suivantes:

```javascript
{
  ville_depart: "Paris",              // String (requis)
  ville_arrivee: "Lyon",              // String (requis)
  date_depart: "2024-02-22T10:30",    // ISO Date String (requis)
  heure_depart: "10:30",               // String format HH:MM (requis)
  places_totales: 4,                   // Number 1-8 (requis)
  prix_par_place: 25.50                // Number >= 0 (requis)
}
```

**Note:** Le champ `conducteur` est automatiquement rempli par le backend avec l'ID de l'utilisateur connecté.

## ✅ Vérification

Avant d'utiliser, vérifiez:

1. ✅ Vous êtes connecté (token dans localStorage)
2. ✅ Le serveur backend est en cours d'exécution
3. ✅ L'URL de l'API dans `.env.local` est correcte
4. ✅ CORS est correctement configuré côté backend

## 🛠️ Dépannage

### "Erreur 401 - Non autorisé"

→ Vous n'êtes probablement pas connecté. Allez sur la page de login.

### "Erreur 500 - Erreur serveur"

→ Vérifiez les logs du serveur backend et assurez-vous que MongoDB est connecté.

### "Impossible de se connecter à l'API"

→ Vérifiez que le backend est en cours d'exécution sur `http://localhost:5000`

## 📝 Configuration Variables d'Environnement

**Frontend (`.env.local`)**

```
VITE_API_URL=http://localhost:5000/api
```

**Backend (`.env` dans klaus/)**

```
MONGODB_URI=mongodb://...
JWT_SECRET=votre_secret_jwt
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🎨 Améliorations Possibles

- [ ] Ajouter un aperçu de la carte pour le trajet
- [ ] Permettre l'ajout de points de passage intermédiaires
- [ ] Sélection des véhicules disponibles
- [ ] Préférences du conducteur (musique, température, etc.)
- [ ] Photos du trajet et du véhicule

---

**Statut:** ✅ Intégration complète et fonctionnelle
