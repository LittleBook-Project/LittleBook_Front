# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    # LittleBook — Frontend

    Ce dossier contient l'application frontend de LittleBook, basée sur React + Vite + TypeScript et stylée avec Tailwind CSS.

    Résumé rapide

    - Vite (dev server, build, preview)
    - React 18 + TypeScript
    - Tailwind CSS + utilitaires shadcn/ui et primitives Radix
    - React Router pour le routage
    - TanStack Query pour la gestion des requêtes

    ## Prérequis

    - Node.js (version LTS recommandée, ex. 18 ou 20)
    - npm (ou pnpm si vous préférez)

    Vérifiez vos versions :

    ```bash
    node -v
    npm -v
    ```

    ## Installation

    1. Clonez le dépôt (ou placez-vous dans le dossier `LittleBook_Front` si déjà présent) :

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

    ## Scripts disponibles

    Les scripts définis dans `package.json` sont :

    - `npm run dev` — démarre le serveur de développement Vite avec HMR.
    - `npm run build` — construit l'application pour la production (dossier `dist`).
    - `npm run build:dev` — construit en mode `development` (optionnel).
    - `npm run preview` — prévisualise localement le build de production (après `build`).
    - `npm run lint` — lance ESLint sur l'ensemble du projet.

    Exemples d'utilisation :

    ```bash
    npm run dev
    npm run build
    npm run preview
    npm run lint
    ```

    ## Variables d'environnement

    Si le projet communique avec une API ou utilise des services (Firebase, etc.), créez un fichier `.env` à la racine de `LittleBook_Front/` et ajoutez vos variables. Les variables destinées au code client doivent commencer par `VITE_` (ex. `VITE_API_BASE_URL`, `VITE_FIREBASE_API_KEY`).

    Exemple minimal :

    ```
    VITE_API_BASE_URL=https://api.example.com
    VITE_FIREBASE_API_KEY=clef_de_test
    ```

    ## Structure du projet

    - `src/`
      # LittleBook — Frontend

      Ce dossier contient le frontend de LittleBook : une application React + TypeScript construite avec Vite, stylée avec Tailwind CSS et utilisant des primitives Radix / shadcn/ui.

      Table des matières

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

      - Vercel : liez le repo, commande de build `npm run build`, dossier de sortie `dist`. Ajoutez vos variables `VITE_` via l'interface Vercel.
      - Netlify : configurez la commande de build `npm run build` et le dossier `dist` comme répertoire de publication.
      - Autres (Surge, S3 + CloudFront, Docker) : servez le contenu du dossier `dist`.

      Notes pour Vercel :

      - Framework preset : choisissez "Other" (Vite) si nécessaire
      - Configurez les variables d'environnement dans le dashboard Vercel (ex : `VITE_API_BASE_URL`)

      ## CI (exemple GitHub Actions)

      Voici un exemple minimal pour builder et vérifier le linter sur chaque push :

      ```yaml
      name: CI

      on: [push, pull_request]

      jobs:
        build:
          runs-on: ubuntu-latest
          steps:
            - uses: actions/checkout@v4
            - name: Setup Node
              uses: actions/setup-node@v4
              with:
                node-version: '18'
            - run: npm ci
            - run: npm run lint
            - run: npm run build
      ```

      Ajoutez des étapes de test si vous intégrez Vitest/Jest.

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

      ---

      Si vous souhaitez, je peux :
      - lancer `npm run dev` pour vérifier que le projet démarre (à votre demande),
      - ajouter un workflow GitHub Actions complet (`.github/workflows/ci.yml`),
      - ajouter un guide spécifique pour Firebase (exemples d'initialisation dans `src/lib`).

      Merci — le README a été complété.
