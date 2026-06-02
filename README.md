##  Aperçu du projet

Application web de gestion des utilisateurs — CRUD complet avec Express.js et React.js.

L'application couvre les quatre opérations fondamentales du CRUD : **Créer**, **Lire**, **Modifier** et **Supprimer** des utilisateurs, avec validation des données, retours visuels en temps réel et filtrage avancé.

---

##  Fonctionnalités

### Interface utilisateur
- **Tableau de bord** avec statistiques en temps réel (total, actifs, inactifs)
- **Recherche dynamique** par nom, prénom ou adresse e-mail
- **Filtres combinables** par rôle et par statut
- **Avatars générés automatiquement** à partir des initiales
- **Badges colorés** pour les rôles et statuts
- **Notifications toast** pour chaque action (succès ou erreur)
- **Dialogue de confirmation** avant toute suppression

### Gestion des utilisateurs
- Création d'un utilisateur avec validation côté client
- Modification des informations d'un utilisateur existant
- Suppression sécurisée avec confirmation
- Contrôle d'unicité de l'adresse e-mail

### Technique
- API REST complète avec gestion des erreurs HTTP
- Communication front-end ↔ back-end via proxy Vite (pas de CORS en développement)
- Données persistées en mémoire (facilement remplaçable par une base de données)
- Identifiants uniques générés avec UUID v4

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     NAVIGATEUR                          │
│                                                         │
│   ┌──────────────────────────────────────────────────┐  │
│   │              React.js (port 3000)                │  │
│   │                                                  │  │
│   │  App.jsx ──► UserModal.jsx                       │  │
│   │         └──► ConfirmDialog.jsx                   │  │
│   │         └──► Toast.jsx                           │  │
│   │         └──► api.js ──────────────────────────┐  │  │
│   └────────────────────────────────────────────── │ ─┘  │
│                                                   │     │
│                     Proxy Vite /api               │     │
└───────────────────────────────────────────────────│─────┘
                                                    │
                                                    ▼
┌─────────────────────────────────────────────────────────┐
│              Express.js (port 3001)                     │
│                                                         │
│   GET    /api/users          → Liste utilisateurs       │
│   GET    /api/users/:id      → Détail utilisateur       │
│   POST   /api/users          → Créer utilisateur        │
│   PUT    /api/users/:id      → Modifier utilisateur     │
│   DELETE /api/users/:id      → Supprimer utilisateur    │
│                                                         │
│   [ Base de données en mémoire — tableau JavaScript ]   │
└─────────────────────────────────────────────────────────┘
```

---

## Technologies utilisées

### Back-end

| Technologie | Version | Rôle |
|-------------|---------|------|
| Node.js | 18+ | Environnement d'exécution JavaScript |
| Express.js | 4.18 | Framework HTTP pour l'API REST |
| cors | 2.8 | Gestion des autorisations cross-origin |


### Front-end

| Technologie | Version | Rôle |
|-------------|---------|------|
| React.js | 18 | Bibliothèque d'interface utilisateur |
| Vite | 5 | Bundler et serveur de développement |
| CSS-in-JS | — | Styles inline avec variables CSS |


---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :

- **Node.js** version 18 ou supérieure — [Télécharger](https://nodejs.org)
- **npm** version 8 ou supérieure (inclus avec Node.js)
- Un terminal (bash, zsh, PowerShell, etc.)

Pour vérifier vos versions :

```bash
node --version   
npm --version   
```

---

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/bahouhoudaifa/ReactJS_ExpressJS_Crud
```

### 2. Installer les dépendances du back-end

```bash
cd backend
npm install
```

### 3. Installer les dépendances du front-end

```bash
cd ../frontend
npm install
```

---

## Lancement

L'application nécessite deux terminaux ouverts simultanément.

### Terminal 1 — Démarrer le serveur back-end

```bash
cd backend
node server.js
```


### Terminal 2 — Démarrer le serveur front-end

```bash
cd frontend
npm run dev
```

---

## API REST — Documentation

### Base URL

```
http://localhost:3001/api
```

### Endpoints

#### Récupérer tous les utilisateurs

```http
GET /api/users
```

Réponse `200 OK` :

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nom": "Bahou",
      "prenom": "Houdaifa",
      "email": "bahouhoudaifa@gmail.ma",
      "role": "Administrateur",
      "statut": "actif",
      "dateCreation": "2024-01-15T00:00:00.000Z"
    }
  ],
  "total": 3
}
```

#### Récupérer un utilisateur par ID

```http
GET /api/users/:id
```

Réponse `200 OK` :

```json
{
  "success": true,
  "data": { ... }
}
```

Réponse `404 Not Found` :

```json
{
  "success": false,
  "message": "Utilisateur non trouvé"
}
```

#### Créer un utilisateur

```http
POST /api/users
Content-Type: application/json
```

Corps de la requête :

```json
{
  "nom": "Bahou",
  "prenom": "Houdaifa",
  "email": "bahouhoudaifa@gmail.ma",
  "role": "Administrateur",
  "statut": "actif"
}
```

Champs obligatoires : `nom`, `prenom`, `email`  
Valeurs acceptées pour `role` : `Administrateur`, `Éditeur`, `Modérateur`, `Lecteur`  
Valeurs acceptées pour `statut` : `actif`, `inactif`

Réponse `201 Created` :

```json
{
  "success": true,
  "data": { ... },
  "message": "Utilisateur créé avec succès"
}
```

#### Modifier un utilisateur

```http
PUT /api/users/:id
Content-Type: application/json
```

Corps de la requête : identique à la création (tous les champs).

Réponse `200 OK` :

```json
{
  "success": true,
  "data": { ... },
  "message": "Utilisateur mis à jour avec succès"
}
```

#### Supprimer un utilisateur

```http
DELETE /api/users/:id
```

Réponse `200 OK` :

```json
{
  "success": true,
  "message": "Utilisateur supprimé avec succès"
}
```

### Codes d'erreur HTTP

| Code | Signification |
|------|---------------|
| `200` | Succès |
| `201` | Ressource créée avec succès |
| `400` | Données invalides ou email déjà utilisé |
| `404` | Utilisateur introuvable |
| `500` | Erreur interne du serveur |

---

## Structure des fichiers

```
user-manager/
│
├── backend/
│   ├── server.js          # Serveur Express — routes, logique métier, données
│   ├── package.json       # Dépendances Node.js
│   └── package-lock.json
│
├── frontend/
│   ├── index.html         # Point d'entrée HTML + polices Google
│   ├── vite.config.js     # Configuration Vite + proxy API
│   ├── package.json       # Dépendances front-end
│   │
│   └── src/
│       ├── assets
│       │    └── logo.png
│       ├── main.jsx       # Point d'entrée React
│       ├── index.css      # Variables CSS globales + animations
│       ├── api.js         # Couche service (appels HTTP)
│       ├── App.jsx        # Composant principal : layout + tableau
│       ├── UserModal.jsx  # Formulaire création / modification
│       ├── ConfirmDialog.jsx  # Dialogue de confirmation de suppression
│       └── Toast.jsx      # Notification flottante (succès / erreur)
│
└── README.md
```

---

## Composants React

### `App.jsx`

Composant racine de l'application. Il gère :

- Le chargement et l'état global de la liste des utilisateurs
- La recherche et les filtres (rôle, statut)
- L'ouverture des modales (création, modification, suppression)
- L'affichage du tableau et des statistiques dans la barre latérale

### `UserModal.jsx`

Formulaire modal pour la **création** et la **modification** d'un utilisateur. Fonctionnalités :

- Pré-remplissage automatique en mode édition
- Validation côté client (champs requis, format e-mail)
- Affichage des erreurs de validation par champ
- Gestion des erreurs renvoyées par l'API (ex. e-mail déjà utilisé)

### `ConfirmDialog.jsx`

Dialogue de confirmation affiché avant toute suppression. Affiche le nom complet de l'utilisateur concerné et attend une confirmation explicite.

### `Toast.jsx`

Notification flottante (en bas à droite) disparaissant automatiquement après 3,5 secondes. Deux variantes : `success` (vert) et `error` (rouge).

### `api.js`

Module de service centralisant tous les appels HTTP vers l'API back-end. Chaque méthode lève une exception en cas d'erreur HTTP avec le message renvoyé par le serveur.

---

## Améliorations futures

Voici des pistes d'évolution pour enrichir le projet :

- **Base de données** — Remplacer le stockage en mémoire par MongoDB, PostgreSQL ou SQLite
- **Authentification** — Ajouter JWT (JSON Web Tokens) et une page de connexion
- **Pagination** — Paginer le tableau pour les grandes listes d'utilisateurs
- **Gestion des droits** — Restreindre les actions selon le rôle de l'utilisateur connecté
- **Export des données** — Générer un export CSV ou Excel de la liste
- **Tests automatisés** — Ajouter des tests unitaires (Jest) et des tests d'intégration (Supertest)
- **Déploiement** — Dockeriser l'application et déployer sur un VPS ou un service cloud (Railway, Render, Vercel)
- **Mode sombre** — Ajouter un thème sombre avec détection automatique des préférences système

---

### Réalisé par : Houdaifa BAHOU