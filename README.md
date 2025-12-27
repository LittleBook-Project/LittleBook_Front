# 📘 LittleBook — Frontend

Application frontend de LittleBook : une plateforme moderne de partage de livres construite avec React + TypeScript + Vite, stylée avec Tailwind CSS.

## 🎯 Fonctionnalités

- ✅ **Authentification** via Firebase (Google)
- ✅ **Recherche de livres** dans OpenLibrary
- ✅ **Gestion de collection** personnelle
- ✅ **Système d'avis** avec notes et commentaires
- ✅ **Interface responsive** et moderne
- ✅ **Profil utilisateur** personnalisable
- ✅ **Dashboard admin** avec statistiques

## 🚀 Stack Technique

- **React 18** + **TypeScript**
- **Vite** (Build tool & dev server)
- **Tailwind CSS** (Styles)
- **shadcn/ui** + **Radix UI** (Composants)
- **TanStack Query** (Gestion requêtes API)
- **React Router** (Navigation)
- **Lucide React** (Icônes)

## 📦 Installation

### Prérequis

- Node.js >= 18 (LTS recommandé)
- npm ou pnpm

```bash
node -v  # Vérifier la version
npm -v
```

### Installation des dépendances

```bash
cd LittleBook_Front
npm install
```

## 🔧 Configuration

Créez un fichier `.env` à la racine :

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=littlebook-b2d2d.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=littlebook-b2d2d
```

> **Note**: Les variables doivent commencer par `VITE_` pour être accessibles dans le code.

## 🛠️ Scripts disponibles
## 🚀 Démarrage simple (Docker Compose)

Depuis la racine de `LittleBook_Front/` (où se trouve le `docker-compose.yml`) :

```bash
docker compose up -d
```

Arrêter et supprimer les conteneurs :

```bash
docker compose down
```

Rebuild après modifications :

```bash
docker compose build frontend
docker compose up -d frontend
```


```bash
# Démarrage développement (avec HMR)
npm run dev

# Build production
npm run build

# Build développement
npm run build:dev

# Prévisualiser le build
npm run preview

# Linter
npm run lint

# Tests (si configurés)
npm run test
```

## 🏗️ Structure du projet

```
LittleBook_Front/
├── public/              # Assets statiques
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── components/     # Composants React
│   │   ├── ui/        # Composants UI shadcn/ui
│   │   ├── Layout.tsx
│   │   └── ...
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilitaires et configuration
│   │   └── api.ts     # Client API
│   ├── pages/         # Pages de l'application
│   │   ├── UnifiedBooks.tsx  # Page principale (recherche + collection + reviews)
│   │   ├── Admin.tsx
│   │   ├── Profile.tsx
│   │   └── ...
│   ├── types/         # Types TypeScript
│   │   ├── book.ts
│   │   ├── review.ts
│   │   └── ...
│   ├── App.tsx        # Composant racine + routing
│   ├── main.tsx       # Point d'entrée
│   └── index.css      # Styles globaux
├── .env               # Variables d'environnement (ignoré par Git)
├── docker-compose.yml # Configuration Docker
├── Dockerfile         # Image Docker frontend
├── nginx.conf         # Configuration Nginx
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 🐳 Docker

### Build de l'image

```bash
docker compose build frontend
```

### Lancement du conteneur

```bash
docker compose up -d frontend
```

Le frontend sera accessible sur [http://localhost:3000](http://localhost:3000)

### Rebuild après modifications

```bash
docker compose build frontend
docker compose up -d frontend
```

## 🌐 Routes disponibles

| Route | Description | Protection |
|-------|-------------|------------|
| `/` | Page d'accueil (landing ou dashboard) | Public |
| `/auth` | Authentification | Public |
| `/home` | Dashboard principal | Privée |
| `/profile` | Profil utilisateur | Privée |
| `/admin` | Administration | Privée |
| `*` | 404 Not Found | Public |

## 🔌 Intégration API

Le frontend communique avec le backend via le **Gateway** sur le port **8080**.

### Configuration du client API

Voir [src/lib/api.ts](src/lib/api.ts) pour la configuration du client HTTP.

```typescript
// Exemple d'appel API
import { apiFetch } from "@/lib/api";

const books = await apiFetch<Book[]>("/book?page=0&size=20");
```

### Endpoints principaux

- `GET /api/book` - Liste des livres
- `GET /api/book/search-openlibrary` - Recherche OpenLibrary
- `POST /api/book/add-from-openlibrary` - Ajouter un livre
- `GET /api/review/book/{isbn}` - Reviews par ISBN
- `GET /api/review/book-id/{bookId}` - Reviews par ID
- `POST /api/review` - Créer une review
- `POST /api/auth/login` - Connexion
- `GET /api/user/profile` - Profil utilisateur

## 🎨 Personnalisation des styles

### Tailwind CSS

Les couleurs et thèmes sont configurés dans [tailwind.config.ts](tailwind.config.ts).

### Composants UI

Les composants shadcn/ui sont dans `src/components/ui/` et peuvent être personnalisés.

```bash
# Ajouter un nouveau composant shadcn
npx shadcn-ui@latest add [component-name]
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

## 📱 Responsive Design

L'interface est entièrement responsive avec breakpoints Tailwind :

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🐛 Dépannage

### Le dev server ne démarre pas

```bash
# Nettoyer le cache
rm -rf node_modules package-lock.json
npm install
```

### Erreur de connexion API

- Vérifiez que le gateway est démarré : `http://localhost:8080/api/book/health`
- Vérifiez la variable `VITE_API_BASE_URL` dans `.env`
- Consultez la console navigateur (F12)

### Build Docker échoue

```bash
# Build avec logs détaillés
docker compose build --no-cache frontend

# Vérifier les logs
docker compose logs frontend
```

### Erreur TypeScript

```bash
# Vérifier les types
npm run type-check

# Rebuild
npm run build
```

## 📚 Ressources

- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)

## 🤝 Contribution

1. Suivre les conventions de code (ESLint + Prettier)
2. Créer une branche feature
3. Tester localement avant de commit
4. Ouvrir une Pull Request avec description claire

## 📄 Licence

Voir [LICENSE](../LICENSE) à la racine du projet.

---

**Développé avec ❤️ par l'équipe LittleBook**


      - [Prérequis](#prérequis)
      - [Installation](#installation)
      - [Scripts disponibles](#scripts-disponibles)
      - [Variables d'environnement](#variables-denvironnement)
      - [Développement local](#développement-local)
      - [Build & Déploiement](#build--déploiement)
      - [CI (exemple GitHub Actions)](#ci-exemple-github-actions)
      - [Structure du projet](#structure-du-projet)
      - [Linting & Typecheck](#linting--typecheck)
      - [Dépannage](#dépannage)
      - [Contribution](#contribution)
      - [Contacts & support](#contacts--support)

      ## Prérequis

      - Node.js (version LTS recommandée, ex. 18 ou 20)
      - npm (ou pnpm)
      - Git

      Vérifiez vos versions :

      ```bash
      node -v
      npm -v
      ```

      ## Installation

      1. Clonez le dépôt ou rendez-vous dans le dossier `LittleBook_Front` :

      ```bash
      git clone <url-du-repo>
      cd LittleBook_Front
      ```

      2. Installez les dépendances :

      ```bash
      npm install
      # ou
      # pnpm install
      ```

      3. (Optionnel) Créez un fichier `.env` à la racine pour vos variables d'environnement (voir section suivante).

      ## Scripts disponibles

      Les scripts présents dans `package.json` :

      - `npm run dev` — démarrage du serveur de développement Vite (HMR).
      - `npm run build` — build pour la production (dossier `dist`).
      - `npm run build:dev` — build en mode `development` (utile pour tests locaux spécifiques).
      - `npm run preview` — prévisualiser localement le contenu du build (`dist`).
      - `npm run lint` — lance ESLint sur le projet.

      Exemples :

      ```bash
      npm run dev      # développement
      npm run build    # build production
      npm run preview  # preview du build
      npm run lint     # analyse ESLint
      ```

      Si vous utilisez pnpm, remplacez `npm run` par `pnpm` :

      ```bash
      pnpm dev
      pnpm build
      pnpm preview
      pnpm lint
      ```

      ## Variables d'environnement

      Les variables destinées au client doivent commencer par `VITE_`. Exemples courants :

      ```
      VITE_API_BASE_URL=https://api.example.com
      VITE_FIREBASE_API_KEY=your_firebase_api_key
      VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXX
      ```

      Placez les clés réelles dans un fichier `.env` (ne pas committer). Pour la production, configurez les variables dans la plateforme d'hébergement (Vercel, Netlify, etc.).

      ## Développement local

      Démarrer le serveur de développement :

      ```bash
      npm run dev
      ```

      Le site sera disponible par défaut sur http://localhost:5173 (Vite). Si le port est occupé, Vite proposera un autre port.

      Pour prévisualiser le build produit :

      ```bash
      npm run build
      npm run preview
      ```

      ## Build & Déploiement

      1. Build production :

      ```bash
      npm run build
      ```

      2. Déploiement :
      - Netlify : configurez la commande de build `npm run build` et le dossier `dist` comme répertoire de publication.


      ## Structure du projet (aperçu)

      - `index.html` — template HTML
      - `src/`
        - `main.tsx` — point d'entrée
        - `App.tsx` — routeur & layout
        - `pages/` — pages (Auth, Home, Profile, Welcome, NotFound)
        - `components/` — composants réutilisables (dossier `ui/` pour primitives)
        - `hooks/` — hooks personnalisés
        - `lib/` — utilitaires
        - `assets/` — images et ressources

      ## Linting & Typecheck

      - Lint :

      ```bash
      npm run lint
      ```

      - Typecheck (TypeScript) :

      ```bash
      npx tsc --noEmit
      ```

      Pensez à intégrer ces vérifications dans votre pipeline CI.

      ## Dépannage

      - Port déjà utilisé : Vite proposera un port alternatif. Fermez le processus occupant ou changez le port.
      - Variables manquantes : vérifiez votre `.env` et que les variables `VITE_` sont définies en production.
      - Erreurs de build : lancer `npm run build` localement pour voir les messages et corriger les erreurs TS/ESLint.

      ## Contribution

      1. Fork
      2. Branche feature/bugfix
      3. Commit clair et PR

      Conseils : ajoutez des tests et vérifiez `npm run lint` avant d'ouvrir la PR.

      ## Contacts & support

      Ouvrez une issue sur le dépôt principal pour les bugs ou les questions. Mentionnez le contexte (branch, commit, étapes pour reproduire).

 
