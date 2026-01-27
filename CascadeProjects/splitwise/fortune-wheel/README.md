# 🎡 Roue de la Fortune - Jeu Concours Configurable

Un jeu de roue de la fortune entièrement configurable avec double interface : administration et live intégrable en iframe.

## ✨ Fonctionnalités

### Interface d'Administration (`/admin`)
- **Configuration des segments** : Ajout, modification et suppression de segments
- **Personnalisation des lots** : Nom, couleur, probabilité, statut gagnant/perdant
- **Apparence personnalisable** :
  - Taille de la roue (300-600px)
  - Style de bordure (classique, néon, minimal, luxe)
  - Couleurs personnalisées (bordure, segments, boutons)
  - Ampoules décoratives
  - Position du bouton (haut, bas, gauche, droite, centre)
- **Comportement du jeu** :
  - Mode de rotation (aléatoire, probabilités, gagnant instantané)
  - Vitesse de rotation (lente, moyenne, rapide)
  - Probabilité de gagner (pour mode gagnant instantané)
- **Formulaire de participation** : Configuration des champs personnalisés
- **Prévisualisation en temps réel**
- **Génération de lien live et code iframe**

### Interface Live (`/live`)
- **Interface épurée** pour les participants
- **Formulaire de participation** avant de jouer
- **Animation de la roue** avec effets visuels
- **Écran de résultat** avec confettis pour les gagnants
- **Responsive** et optimisé mobile
- **Intégrable en iframe** sur n'importe quel site

## 🚀 Installation

```bash
# Cloner le projet
cd fortune-wheel

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du Projet

```
fortune-wheel/
├── app/
│   ├── page.tsx              # Page d'accueil
│   ├── admin/
│   │   └── page.tsx          # Interface d'administration
│   └── live/
│       └── page.tsx          # Interface live (joueurs)
├── components/
│   └── SmartWheel/           # Composant de roue importé
│       ├── SmartWheel.tsx    # Composant principal
│       ├── components/       # Sous-composants
│       ├── hooks/            # Hooks personnalisés
│       ├── utils/            # Utilitaires
│       └── types.ts          # Types TypeScript
└── lib/
    └── store.ts              # Store Zustand pour la configuration
```

## 🎮 Utilisation

### 1. Configuration (Interface Admin)

1. Accédez à `/admin`
2. Configurez vos segments dans l'onglet **Segments** :
   - Ajoutez des segments
   - Définissez les lots et leurs couleurs
   - Configurez les probabilités
   - Marquez les segments gagnants
3. Personnalisez l'apparence dans l'onglet **Apparence**
4. Réglez le comportement dans l'onglet **Comportement**
5. Configurez le formulaire dans l'onglet **Formulaire**
6. Visualisez en temps réel dans le panneau de prévisualisation

### 2. Intégration (Interface Live)

#### Option 1 : Lien direct
Copiez le lien live généré et partagez-le avec vos participants :
```
https://votre-domaine.com/live
```

#### Option 2 : Intégration iframe
Copiez le code iframe généré et intégrez-le sur votre site :
```html
<iframe 
  src="https://votre-domaine.com/live" 
  width="100%" 
  height="800" 
  frameborder="0" 
  allowfullscreen>
</iframe>
```

## 🛠️ Technologies Utilisées

- **Next.js 16** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Zustand** - Gestion d'état
- **Canvas API** - Rendu de la roue
- **GSAP** - Animations
- **Canvas Confetti** - Effets de confettis
- **React Colorful** - Sélecteur de couleurs

## 📦 Dépendances Principales

```json
{
  "canvas-confetti": "^1.9.2",
  "framer-motion": "^12.23.6",
  "gsap": "^3.13.0",
  "howler": "^2.2.4",
  "react-colorful": "^5.6.1",
  "zustand": "^5.0.5"
}
```

## 🎨 Personnalisation Avancée

### Thèmes de Bordure
- **Classic** : Bordure dorée avec ampoules
- **Neon** : Effet néon lumineux
- **Minimal** : Design épuré
- **Luxury** : Style premium

### Modes de Jeu
- **Aléatoire** : Sélection complètement aléatoire
- **Probabilités** : Basé sur les probabilités configurées
- **Gagnant Instantané** : Contrôle du taux de gain global

## 🔒 Sécurité

- L'interface d'administration (`/admin`) est séparée de l'interface live
- L'iframe n'affiche que l'interface live, jamais la configuration
- Les données de configuration sont stockées localement (localStorage)
- Pour une utilisation en production, ajoutez une authentification sur `/admin`

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm run build
vercel deploy
```

### Autres plateformes
```bash
npm run build
npm start
```

## 📝 Notes Importantes

- La configuration est sauvegardée dans le localStorage du navigateur
- Pour une utilisation multi-utilisateurs, implémentez un backend (Supabase, Firebase, etc.)
- L'interface live est optimisée pour l'intégration iframe
- Les participants ne voient jamais l'interface d'administration

## 🤝 Support

Pour toute question ou problème, créez une issue sur le repository.

## 📄 Licence

Ce projet utilise le composant SmartWheel du projet [pilmedia-lp-wizardry-forge](https://github.com/Niakdashit/pilmedia-lp-wizardry-forge).
