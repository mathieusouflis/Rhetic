# Rhetic

Rhetic est une plateforme de discussion communautaire inspirée par Reddit, permettant aux utilisateurs de créer des communautés thématiques (subrhetics), partager du contenu, interagir via des votes et des commentaires, et personnaliser leur expérience avec des fonctionnalités en temps réel.

## 🛠️ Architecture

Le projet est divisé en deux parties principales :

- **Frontend** : Application Next.js (dossier `/front`)
- **Backend** : API Strapi (dossier `/strapi`)
- **Base de données** : PostgreSQL serverless via Neon

## 🚀 Fonctionnalités

### Utilisateurs
- Inscription et authentification
- Profils personnalisables avec avatar et biographie
- Système de suivi d'utilisateurs
- Statuts en ligne (👷In Progress)
- Préférences utilisateur (thème, langue, notifications)

### Communautés (Subrhetics)
- Création de communautés thématiques
- Règles personnalisables (👷In Progress)
- Modération par équipe désignée
- Attributs de communauté (icône, description)
- Catégorisation par thèmes

### Publications
- Création de posts texte et multimédia
- Système de vote (upvote/downvote)
- Commentaires hiérarchiques
- Flairs pour catégoriser les posts (👷In Progress)
- Option de publication anonyme (👷In Progress)

### Interactions
- Système de votes sur posts et commentaires
- Commentaires imbriqués
- Réactions avec emojis personnalisés par communauté (👷In Progress)
- Messagerie privée (👷In Progress)
- Notifications pour diverses activités (👷In Progress)

### Expérience temps réel
- Présence utilisateur (👷In Progress)
- Mise à jour en direct des scores (👷In Progress)
- Notifications instantanées (👷In Progress)
- Discussion en temps réel (👷In Progress)
- Collaboration dans les communautés 

### Modération
- Rôles de modérateurs par communauté
- Outils de modération (suppression, bannissement)
- Système de signalement (👷In Progress)
- Journalisation des actions de modération
- Filtrage automatique du contenu sensible via Censorly (👷In Progress)

## 🔧 Installation

### Prérequis
- Node.js (v18.0.0 ou supérieure)
- npm ou yarn ou pnpm ou bun
- Compte Neon (base de données PostgreSQL serverless)
- Compte Liveblocks (fonctionnalités temps réel)

### Backend (Strapi)

```bash
# Se placer dans le répertoire du backend
cd strapi

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Modifier le fichier .env avec vos informations
# Particulièrement les informations de connexion à Neon

# Lancer le développement
npm run develop
```

La première exécution vous permettra de créer un utilisateur administrateur pour accéder au panneau d'administration Strapi sur http://localhost:1337/admin.

### Frontend (Next.js)

```bash
# Se placer dans le répertoire du frontend
cd front

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés, notamment:
# - NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337
# - NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_xxx

# Lancer le développement
npm run dev
```

L'application sera disponible sur http://localhost:3000

## 🌐 Configuration

### Variables d'environnement (Backend)

Principales variables à configurer dans `.env` :

```
HOST=0.0.0.0
PORT=1337
APP_KEYS="clé1,clé2"
API_TOKEN_SALT=valeur_aléatoire
ADMIN_JWT_SECRET=valeur_aléatoire
TRANSFER_TOKEN_SALT=valeur_aléatoire
JWT_SECRET=valeur_aléatoire

# Base de données (Neon PostgreSQL serverless)
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://[user]:[password]@[neon-host]/[dbname]
# OU configuration détaillée
DATABASE_HOST=ep-something.eu-central-1.aws.neon.tech
DATABASE_PORT=5432
DATABASE_NAME=rhetic
DATABASE_USERNAME=username
DATABASE_PASSWORD=password
DATABASE_SSL=true

# Modération de contenu (optionnel)
CENSORLY_API_KEY=key_xxx
CENSORLY_PACKAGE=true
```

### Variables d'environnement (Frontend)

Configurez les variables suivantes dans `.env.local` :

```
# API Strapi
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337

# Liveblocks (temps réel)
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_xxx
LIVEBLOCKS_SECRET_KEY=sk_xxx

# Authentification
NEXTAUTH_SECRET=valeur_aléatoire
NEXTAUTH_URL=http://localhost:3000
```

## 📚 Structure du projet

### Backend

```
strapi/
├── config/             # Configuration Strapi
├── database/           # Migrations et données
├── public/             # Fichiers statiques et médias
├── src/
│   ├── admin/          # Configuration admin
│   ├── api/            # Points d'API (modèles, contrôleurs, routes)
│   ├── components/     # Composants réutilisables
│   └── extensions/     # Extensions plugins
├── types/              # Types TypeScript
└── utils/              # Utilitaires
```

### Frontend

```
front/
├── public/             # Ressources statiques
├── src/
│   ├── app/            # Pages Next.js (App Router)
│   ├── components/     # Composants React
│   ├── lib/            # Bibliothèques et utilitaires
│   │   ├── api/        # Clients API (Strapi)
│   │   ├── auth/       # Authentification
│   │   └── liveblocks/ # Configuration temps réel
│   ├── store/          # État global (Zustand)
│   ├── types/          # Types TypeScript
│   └── utils/          # Fonctions utilitaires
```

## 🧩 API

L'API utilise le framework Strapi avec des points d'entrée REST. Principales ressources :

- `/api/subrhetics` - Communautés
- `/api/posts` - Publications
- `/api/comments` - Commentaires
- `/api/users` - Utilisateurs
- `/api/votes` - Votes

Pour plus de détails, consultez la documentation générée automatiquement sur `/documentation` de l'API Strapi.

## 🔄 Fonctionnalités temps réel avec Liveblocks

Rhetic intègre Liveblocks pour offrir des fonctionnalités en temps réel et une expérience collaborative:

- **Présence utilisateur** - Voyez quels utilisateurs sont actifs dans une discussion
- **Curseurs en temps réel** - Visualisez la position des autres utilisateurs
- **Discussions instantanées** - Communication instantanée sans rechargement de page
- **Notifications en temps réel** - Soyez informé immédiatement des interactions
- **Mise à jour des votes** - Les scores s'actualisent sans rafraîchissement

La configuration de Liveblocks est définie dans `front/liveblocks.config.ts` et inclut:
- Définition des types pour la présence utilisateur
- Métadonnées personnalisées pour les utilisateurs et les salles
- Gestion des événements personnalisés

Pour activer Liveblocks, vous devez:
1. Créer un compte sur [Liveblocks](https://liveblocks.io/)
2. Obtenir une clé API
3. Configurer la variable d'environnement `NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY` dans le frontend

## 🔒 Authentification

Le système utilise JWT (JSON Web Tokens) via le plugin Users-Permissions de Strapi, avec:
- Authentification par email/mot de passe
- Sessions persistantes
- Gestion des rôles et permissions
- Extension possible avec Auth.js (NextAuth) pour le frontend

## 💻 Technologies principales

### Backend
- [Strapi](https://strapi.io/) - CMS headless
- [TypeScript](https://www.typescriptlang.org/)
- [Neon](https://neon.tech/) - PostgreSQL serverless
- [Censorly](https://github.com/OpenWorldBlogger/censorly) - Modération de contenu

### Frontend
- [Next.js](https://nextjs.org/) (v15.3.1)
- [React](https://reactjs.org/) (v19.0.0)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/) (v4)
- [Zustand](https://github.com/pmndrs/zustand) - Gestion d'état
- [TanStack Query](https://tanstack.com/query/latest) - Gestion des requêtes
- [Liveblocks](https://liveblocks.io/) - Fonctionnalités en temps réel
- [Zod](https://zod.dev/) - Validation de schémas

## 📦 Plugins Strapi additionnels

- SEO - Pour optimisation moteurs de recherche
- CKEditor - Éditeur de texte riche
- Documentation - API docs automatisées
- Cloud - Intégration cloud et déploiement

## 🧪 Tests

```bash
# Tests backend
cd strapi
npm run test

# Tests frontend
cd front
npm run test
```

## 🚀 Déploiement

### Base de données Neon

[Neon](https://neon.tech/) est une solution PostgreSQL serverless hautement évolutive utilisée pour le projet:

1. Créez un compte sur Neon
2. Créez un nouveau projet
3. Obtenez la chaîne de connexion
4. Configurez la variable `DATABASE_URL` ou les variables individuelles dans le fichier `.env` du backend

### Strapi (Backend)

Pour le déploiement en production :

```bash
cd strapi
npm run build
npm run start
```

Vous pouvez déployer Strapi sur diverses plateformes comme:
- [Strapi Cloud](https://cloud.strapi.io/)
- [Digital Ocean](https://www.digitalocean.com/)
- [Heroku](https://www.heroku.com/)
- [Railway](https://railway.app/)

### Next.js (Frontend)

Pour le déploiement en production :

```bash
cd front
npm run build
npm run start
```

Pour un déploiement plus simple, vous pouvez utiliser:
- [Vercel](https://vercel.com/) (recommandé pour Next.js)
- [Netlify](https://www.netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre ces étapes :

1. Forker le dépôt
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser la branche
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence Apache 2.0.

## 📧 Contact

Pour toute question ou suggestion, veuillez contacter contact@rhetic.fr .
