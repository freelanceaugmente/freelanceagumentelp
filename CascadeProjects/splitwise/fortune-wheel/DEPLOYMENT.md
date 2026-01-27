# 🚀 Guide de Déploiement

Ce guide vous explique comment déployer votre application Roue de la Fortune en production.

## 📋 Prérequis

- Node.js 18+ installé
- Compte sur une plateforme de déploiement (Vercel, Netlify, etc.)
- Domaine personnalisé (optionnel)

## 🌐 Déploiement sur Vercel (Recommandé)

Vercel est la plateforme recommandée car elle est créée par l'équipe Next.js.

### Méthode 1 : Via l'interface Vercel

1. **Créer un compte** sur [vercel.com](https://vercel.com)

2. **Importer le projet**
   - Cliquez sur "New Project"
   - Importez votre repository Git (GitHub, GitLab, Bitbucket)
   - Ou uploadez le dossier du projet

3. **Configuration**
   - Framework Preset : Next.js (détecté automatiquement)
   - Build Command : `npm run build`
   - Output Directory : `.next`
   - Install Command : `npm install`

4. **Variables d'environnement** (optionnel)
   ```
   NEXT_PUBLIC_APP_URL=https://votre-domaine.vercel.app
   ```

5. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez la fin du build (2-3 minutes)
   - Votre site est en ligne ! 🎉

### Méthode 2 : Via CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
cd fortune-wheel
vercel

# Pour déployer en production
vercel --prod
```

### Configuration du domaine personnalisé

1. Dans le dashboard Vercel, allez dans "Settings" > "Domains"
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions

## 🔵 Déploiement sur Netlify

### Via l'interface Netlify

1. **Créer un compte** sur [netlify.com](https://netlify.com)

2. **Nouveau site**
   - Cliquez sur "Add new site" > "Import an existing project"
   - Connectez votre repository Git

3. **Configuration du build**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Variables d'environnement**
   - Allez dans "Site settings" > "Environment variables"
   - Ajoutez : `NEXT_PUBLIC_APP_URL=https://votre-site.netlify.app`

5. **Déployer**
   - Cliquez sur "Deploy site"

### Via CLI

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Initialiser
netlify init

# Déployer
netlify deploy --prod
```

## 🐳 Déploiement avec Docker

### Créer un Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Construire et lancer

```bash
# Construire l'image
docker build -t fortune-wheel .

# Lancer le conteneur
docker run -p 3000:3000 fortune-wheel
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://votre-domaine.com
    restart: unless-stopped
```

```bash
# Lancer avec Docker Compose
docker-compose up -d
```

## ☁️ Déploiement sur un VPS

### Prérequis
- Serveur Linux (Ubuntu 22.04 recommandé)
- Accès SSH
- Nom de domaine pointant vers le serveur

### Installation

```bash
# Se connecter au serveur
ssh user@votre-serveur.com

# Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Installer PM2 (gestionnaire de processus)
sudo npm install -g pm2

# Cloner le projet
git clone https://github.com/votre-repo/fortune-wheel.git
cd fortune-wheel

# Installer les dépendances
npm install

# Build
npm run build

# Lancer avec PM2
pm2 start npm --name "fortune-wheel" -- start
pm2 save
pm2 startup
```

### Configuration Nginx

```nginx
# /etc/nginx/sites-available/fortune-wheel
server {
    listen 80;
    server_name votre-domaine.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/fortune-wheel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Installer SSL avec Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

## 🔐 Configuration de Production

### Variables d'environnement

Créez un fichier `.env.production` :

```env
NEXT_PUBLIC_APP_URL=https://votre-domaine.com
NODE_ENV=production
```

### Optimisations

1. **Compression**
   - Activée automatiquement par Next.js

2. **Cache**
   - Les assets statiques sont cachés automatiquement

3. **Images**
   - Utilisez `next/image` pour l'optimisation automatique

### Sécurité

1. **Headers de sécurité**
   
   Ajoutez dans `next.config.ts` :
   ```typescript
   async headers() {
     return [
       {
         source: '/:path*',
         headers: [
           {
             key: 'X-DNS-Prefetch-Control',
             value: 'on'
           },
           {
             key: 'Strict-Transport-Security',
             value: 'max-age=63072000; includeSubDomains; preload'
           },
           {
             key: 'X-Content-Type-Options',
             value: 'nosniff'
           },
           {
             key: 'X-Frame-Options',
             value: 'SAMEORIGIN'
           },
           {
             key: 'Referrer-Policy',
             value: 'origin-when-cross-origin'
           }
         ]
       }
     ]
   }
   ```

2. **Protection de l'interface admin**
   
   Ajoutez une authentification basique :
   ```typescript
   // middleware.ts
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';

   export function middleware(request: NextRequest) {
     if (request.nextUrl.pathname.startsWith('/admin')) {
       const basicAuth = request.headers.get('authorization');
       
       if (!basicAuth) {
         return new NextResponse('Authentication required', {
           status: 401,
           headers: {
             'WWW-Authenticate': 'Basic realm="Admin Area"'
           }
         });
       }
       
       const auth = basicAuth.split(' ')[1];
       const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':');
       
       if (user !== 'admin' || pwd !== 'votre-mot-de-passe-securise') {
         return new NextResponse('Invalid credentials', {
           status: 401,
           headers: {
             'WWW-Authenticate': 'Basic realm="Admin Area"'
           }
         });
       }
     }
     
     return NextResponse.next();
   }
   ```

## 📊 Monitoring

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## 🔄 Mises à jour

### Déploiement continu

Configurez le déploiement automatique :
- Vercel/Netlify : Automatique via Git
- VPS : Utilisez GitHub Actions

Exemple GitHub Actions :

```yaml
# .github/workflows/deploy.yml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd fortune-wheel
            git pull
            npm install
            npm run build
            pm2 restart fortune-wheel
```

## ✅ Checklist de Déploiement

Avant de déployer en production :

- [ ] Tests complets en local
- [ ] Configuration des variables d'environnement
- [ ] Build de production réussi (`npm run build`)
- [ ] Configuration du domaine
- [ ] SSL/HTTPS activé
- [ ] Headers de sécurité configurés
- [ ] Protection de l'interface admin
- [ ] Monitoring configuré
- [ ] Sauvegarde de la configuration
- [ ] Documentation à jour
- [ ] Test de l'iframe sur un site externe
- [ ] Test sur différents navigateurs
- [ ] Test sur mobile

## 🆘 Dépannage

### Erreur de build
```bash
# Nettoyer le cache
rm -rf .next node_modules
npm install
npm run build
```

### Problème de mémoire
```bash
# Augmenter la mémoire Node.js
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Erreur 404 après déploiement
- Vérifiez la configuration du routage
- Vérifiez que tous les fichiers sont bien uploadés

## 📞 Support

Pour toute question sur le déploiement :
1. Consultez la documentation de votre plateforme
2. Vérifiez les logs d'erreur
3. Testez en local d'abord

## 🎉 Félicitations !

Votre Roue de la Fortune est maintenant en production ! 🚀
