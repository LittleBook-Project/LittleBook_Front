# LittleBook Front (README proposé)

Version proposée du `README.md` pour `LittleBook_Front` — instructions pour lancer le frontend avec ou sans Docker.

## Pré-requis
- Node.js (LTS recommandé, ex. 18+)
- npm ou pnpm
- Docker & Docker Compose (optionnel)

## Démarrage développement (sans Docker)
PowerShell :

```powershell
cd LittleBook_Front
npm install
npm run dev
```

Le serveur Vite sera disponible par défaut sur `http://localhost:5173`.

## Build production

```powershell
cd LittleBook_Front
npm run build
npm run preview
```

## Démarrage avec Docker
Le `Dockerfile` construit un build statique (multi-stage) servi par `nginx` sur le port `80`.

Construire et lancer via Docker Compose (recommandé) :

```powershell
cd LittleBook_Front
docker compose build
docker compose up -d
```

Construire et lancer l'image manuellement :

```powershell
cd LittleBook_Front
docker build -t littlebook-frontend:local .
# Expose le port 80 du conteneur sur le port 80 de la machine
docker run --rm -p 80:80 littlebook-frontend:local
```

Remarques:
- Le conteneur sert les fichiers statiques via `nginx` sur `:80` (donc l'URL locale est `http://localhost`).
- Pour le développement avec HMR (Hot Module Replacement), utilisez `npm run dev` localement; la version Docker est destinée aux builds statiques/production.

## Configuration
- Variables d'environnement client (exemples) :

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=littlebook-b2d2d
```

Placez les variables dans un fichier `.env` à la racine de `LittleBook_Front`.

## Vérification
- Vérifiez que le backend (gateway) est accessible (par défaut `http://localhost:8080`).
- Si le frontend ne trouve pas l'API, ajustez `VITE_API_BASE_URL`.

