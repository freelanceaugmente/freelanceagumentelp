# LinkedIn Post Generator

Application web minimaliste qui génère des posts LinkedIn à partir d'un screenshot.

## Fonctionnalités
- Upload d'une image (drag & drop, bouton, copier-coller)
- Analyse de l'image (Vision via OpenAI gpt-4o-mini) et génération d'un post
- Choix du style d'écriture (professionnel, inspirant, humoristique, storytelling)
- Paraphrase: s'inspire du contenu sans copier mot à mot

## Stack
- Frontend/Backend: Next.js (App Router, API Routes)
- UI: TailwindCSS
- IA: OpenAI gpt-4o-mini (Vision)
- Conteneurisation: Dockerfile

## Démarrage local
1. Prérequis: Node.js 18+
2. Variables d'environnement: créez le fichier `.env` (déjà créé) et renseignez:
   ```env
   OPENAI_API_KEY=your_key_here
   ```
3. Installer les dépendances:
   ```bash
   npm install
   ```
4. Lancer en dev:
   ```bash
   npm run dev
   ```
5. Build & start:
   ```bash
   npm run build && npm start
   ```

## Usage
- Ouvrez l'URL http://localhost:3000
- Déposez/choisissez/collez un screenshot
- Choisissez un style
- Cliquez sur "Générer" pour obtenir le post

## Docker
Build:
```bash
docker build -t linkedin-post-generator .
```
Run (en fournissant la clé OpenAI):
```bash
docker run -e OPENAI_API_KEY=your_key_here -p 3000:3000 linkedin-post-generator
```

## Notes d'implémentation
- Porté sur la simplicité et un socle fonctionnel minimal
- Pas de base de données pour l'instant (optionnelle)
- L'API route `app/api/generate/route.js` utilise `gpt-4o-mini` en mode vision
- L'UI est responsive et centrée sur l'action principale
