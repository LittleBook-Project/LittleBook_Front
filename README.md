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
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Docker / Docker Compose (build & serve)

Instructions to build and run the production container that serves the built Vite app with nginx:

- Build the Docker image and start the container:

  - Using Docker Compose:

    docker-compose up --build -d

  - Or with Docker alone:

    docker build -t littlebook_frontend:latest .
    docker run -p 80:80 littlebook_frontend:latest

- The app will be available at http://localhost/ (port 80).

Notes:
- The repository uses Vite. The multi-stage `Dockerfile` first runs `npm install` and `npm run build` to produce the `dist` folder, then copies the build into an nginx image and serves it with a SPA fallback.
- If you want to run in development mode (with HMR), run `npm run dev` locally or create a compose override that mounts the source and runs `vite`.

## Fonctionnalités

### 📚 Gestion des Livres

L'application inclut une page de recherche et d'ajout de livres :

1. **Accéder à la page** : Cliquez sur "Livres" dans la navbar ou visitez `/books`

2. **Rechercher un livre** :
   - Tapez un titre, auteur ou ISBN dans la barre de recherche
   - Appuyez sur Entrée ou cliquez sur "Rechercher"

3. **Workflow de recherche** :
   - Le système cherche d'abord dans votre base de données locale
   - Si aucun résultat, il propose des suggestions depuis OpenLibrary API
   - Vous pouvez ajouter un livre suggéré en cliquant sur "Ajouter"

4. **Backends requis** :
   - Book Service doit tourner sur `http://localhost:8084` (ou via Docker backend)
   - Les endpoints utilisés :
     - `GET /books?q=...` - Recherche locale
     - `GET /books/search/openlibrary?q=...` - Recherche OpenLibrary
     - `POST /books/from-openlibrary` - Ajouter un livre

### 🔧 Configuration Backend

Le frontend est configuré pour proxifier les requêtes API via nginx :
- `/api/` → Auth Service (port 8082)
- `/user/` → User Service (port 8083)
- `/books/` → Book Service (port 8084)
- `/api/stats/` → Admin Service (port 8085)

Les URLs sont relatives dans le code frontend, nginx gère le routing vers les backends.
You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
