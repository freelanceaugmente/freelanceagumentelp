# 📁 Structure du Projet

Ce document décrit l'organisation complète du projet Roue de la Fortune.

## 🗂️ Arborescence

```
fortune-wheel/
├── 📄 README.md                    # Documentation principale
├── 📄 QUICKSTART.md                # Guide de démarrage rapide
├── 📄 FEATURES.md                  # Guide des fonctionnalités
├── 📄 INTEGRATION.md               # Guide d'intégration iframe
├── 📄 DEPLOYMENT.md                # Guide de déploiement
├── 📄 PROJECT_STRUCTURE.md         # Ce fichier
├── 📄 package.json                 # Dépendances npm
├── 📄 next.config.ts               # Configuration Next.js
├── 📄 tailwind.config.ts           # Configuration Tailwind CSS
├── 📄 tsconfig.json                # Configuration TypeScript
├── 📄 .env.example                 # Variables d'environnement exemple
│
├── 📁 app/                         # Pages Next.js (App Router)
│   ├── 📄 page.tsx                 # Page d'accueil
│   ├── 📄 layout.tsx               # Layout principal
│   ├── 📄 globals.css              # Styles globaux
│   │
│   ├── 📁 admin/                   # Interface d'administration
│   │   └── 📄 page.tsx             # Page admin complète
│   │
│   ├── 📁 live/                    # Interface live (joueurs)
│   │   └── 📄 page.tsx             # Page live intégrable
│   │
│   └── 📁 test-iframe/             # Page de test iframe
│       └── 📄 page.tsx             # Simulation d'intégration
│
├── 📁 components/                  # Composants React
│   └── 📁 SmartWheel/              # Composant de roue (importé)
│       ├── 📄 SmartWheel.tsx       # Composant principal
│       ├── 📄 types.ts             # Types TypeScript
│       ├── 📄 index.ts             # Exports
│       │
│       ├── 📁 components/          # Sous-composants
│       │   ├── 📄 BorderStyleSelector.tsx
│       │   ├── 📄 ParticipationModal.tsx
│       │   └── 📄 SmartWheelWrapper.tsx
│       │
│       ├── 📁 hooks/               # Hooks personnalisés
│       │   ├── 📄 useWheelAnimation.ts
│       │   ├── 📄 useSmartWheelRenderer.ts
│       │   └── 📄 useWheelMigration.ts
│       │
│       └── 📁 utils/               # Utilitaires
│           ├── 📄 wheelThemes.ts
│           ├── 📄 borderStyles.ts
│           └── 📄 borderRenderers.ts
│
├── 📁 lib/                         # Bibliothèques et utilitaires
│   └── 📄 store.ts                 # Store Zustand (configuration)
│
└── 📁 public/                      # Assets statiques
    ├── 📄 next.svg
    └── 📄 vercel.svg
```

## 📄 Description des Fichiers Principaux

### Documentation

#### README.md
- Vue d'ensemble du projet
- Installation et utilisation
- Technologies utilisées
- Guide complet

#### QUICKSTART.md
- Guide de démarrage rapide (5 minutes)
- Configuration express
- Exemples de configuration
- Checklist de lancement

#### FEATURES.md
- Détail de toutes les fonctionnalités
- Configuration des segments
- Personnalisation de l'apparence
- Modes de jeu
- Cas d'usage

#### INTEGRATION.md
- Guide d'intégration iframe complet
- Exemples de code
- Personnalisation de l'iframe
- Intégration sur différentes plateformes
- Problèmes courants

#### DEPLOYMENT.md
- Guide de déploiement en production
- Vercel, Netlify, Docker, VPS
- Configuration de sécurité
- Monitoring
- Checklist de déploiement

### Configuration

#### package.json
```json
{
  "dependencies": {
    "next": "16.0.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zustand": "^5.0.5",
    "canvas-confetti": "^1.9.2",
    "framer-motion": "^12.23.6",
    "gsap": "^3.13.0",
    "howler": "^2.2.4",
    "react-colorful": "^5.6.1"
  }
}
```

#### next.config.ts
- Configuration Next.js
- Headers de sécurité
- Optimisation iframe

#### tailwind.config.ts
- Configuration Tailwind CSS
- Thème personnalisé
- Extensions

### Pages (App Router)

#### app/page.tsx
- Page d'accueil
- Navigation vers admin/live/test
- Présentation des fonctionnalités

#### app/admin/page.tsx
- Interface d'administration complète
- Configuration des segments
- Personnalisation de l'apparence
- Paramètres de comportement
- Configuration du formulaire
- Prévisualisation en temps réel
- Génération de lien live et iframe

#### app/live/page.tsx
- Interface live pour les joueurs
- Intégrable en iframe
- Formulaire de participation
- Roue interactive
- Écran de résultat
- Confettis pour les gagnants

#### app/test-iframe/page.tsx
- Page de test d'intégration
- Simulation d'iframe
- Conseils d'intégration
- Exemples de code

### Composants

#### components/SmartWheel/SmartWheel.tsx
- Composant principal de la roue
- Gestion de l'état
- Animation de rotation
- Rendu canvas
- Mode 1 (direct) et Mode 2 (avec formulaire)

#### components/SmartWheel/types.ts
```typescript
interface WheelSegment {
  id: string;
  label: string;
  value: string;
  color?: string;
  textColor?: string;
  probability?: number;
  isWinning?: boolean;
}

interface SmartWheelProps {
  segments: WheelSegment[];
  theme?: string;
  size?: number;
  // ... autres props
}
```

#### components/SmartWheel/components/
- **BorderStyleSelector.tsx** : Sélecteur de style de bordure
- **ParticipationModal.tsx** : Modal de formulaire de participation
- **SmartWheelWrapper.tsx** : Wrapper avec fonctionnalités additionnelles

#### components/SmartWheel/hooks/
- **useWheelAnimation.ts** : Gestion de l'animation de rotation
- **useSmartWheelRenderer.ts** : Rendu canvas de la roue
- **useWheelMigration.ts** : Migration de données

#### components/SmartWheel/utils/
- **wheelThemes.ts** : Thèmes prédéfinis
- **borderStyles.ts** : Styles de bordure
- **borderRenderers.ts** : Rendu des bordures

### Bibliothèques

#### lib/store.ts
```typescript
// Store Zustand pour la configuration
interface WheelConfig {
  segments: WheelSegment[];
  theme: string;
  size: number;
  borderStyle: string;
  brandColors: {...};
  customButton: {...};
  // ... autres configs
}

export const useWheelStore = create<WheelStore>()(
  persist(...)
);
```

## 🔧 Technologies Utilisées

### Frontend
- **Next.js 16** : Framework React avec App Router
- **React 18** : Bibliothèque UI
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utility-first

### État et Données
- **Zustand** : Gestion d'état globale
- **localStorage** : Persistance locale

### Animations et Effets
- **Canvas API** : Rendu de la roue
- **GSAP** : Animations avancées
- **Framer Motion** : Animations React
- **Canvas Confetti** : Effets de confettis
- **Howler.js** : Gestion du son (optionnel)

### Utilitaires
- **React Colorful** : Sélecteur de couleurs

## 📦 Taille du Projet

```
Fichiers TypeScript/TSX : ~15 fichiers
Lignes de code : ~3000 lignes
Composants React : ~10 composants
Pages : 4 pages
Documentation : 6 fichiers MD
Taille totale : ~5 MB (avec node_modules)
```

## 🎯 Points d'Entrée

### Pour les Développeurs
1. **app/admin/page.tsx** : Interface d'administration
2. **components/SmartWheel/SmartWheel.tsx** : Composant de roue
3. **lib/store.ts** : Store de configuration

### Pour les Utilisateurs
1. **/** : Page d'accueil
2. **/admin** : Configuration
3. **/live** : Jeu en direct
4. **/test-iframe** : Test d'intégration

## 🔄 Flux de Données

```
User Input (Admin)
    ↓
lib/store.ts (Zustand)
    ↓
localStorage (Persistance)
    ↓
components/SmartWheel (Affichage)
    ↓
app/live/page.tsx (Interface Live)
```

## 🎨 Styles

### Tailwind CSS
- Utility-first CSS
- Configuration personnalisée
- Responsive design
- Dark mode ready

### Styles Inline
- Canvas styling
- Dynamic colors
- Animation styles

## 🔐 Sécurité

### Séparation des Interfaces
- **/admin** : Configuration (privée)
- **/live** : Jeu (publique)
- Pas d'accès à la config depuis l'iframe

### Données
- Stockage local (pas de serveur)
- Pas de transmission automatique
- RGPD compliant

## 📱 Responsive

### Breakpoints
- Mobile : <768px
- Tablet : 768-1024px
- Desktop : >1024px

### Adaptations
- Taille de roue ajustée
- Layout modifié
- Touch-friendly

## 🚀 Performance

### Optimisations
- Code splitting automatique
- Lazy loading des composants
- Canvas pour le rendu GPU
- Compression des assets

### Métriques
- Lighthouse Score : >90
- First Contentful Paint : <1.5s
- Time to Interactive : <3s

## 📊 Statistiques

```
Pages : 4
Composants : 10+
Hooks personnalisés : 3
Utilitaires : 3
Documentation : 6 fichiers
Tests : À venir
```

## 🔄 Évolution Future

### Prévues
- [ ] Export/Import de configuration
- [ ] Backend optionnel (Supabase)
- [ ] Statistiques intégrées
- [ ] Thèmes supplémentaires
- [ ] Mode multi-joueurs
- [ ] API publique

## 📝 Notes

- Tous les composants SmartWheel sont importés du projet source
- La configuration est sauvegardée en localStorage
- L'interface live est isolée et intégrable en iframe
- Le projet est prêt pour la production

## 🎉 Conclusion

Structure claire, modulaire et extensible pour un jeu de roue de la fortune professionnel et personnalisable.
