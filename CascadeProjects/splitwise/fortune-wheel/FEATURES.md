# ✨ Guide des Fonctionnalités

Ce document détaille toutes les fonctionnalités de la Roue de la Fortune.

## 🎯 Configuration des Segments

### Ajout de Segments
- Cliquez sur "+ Ajouter" dans l'onglet Segments
- Chaque segment peut être personnalisé individuellement

### Propriétés d'un Segment
- **Label** : Nom affiché sur la roue (ex: "iPhone 15", "Perdu", "10% de réduction")
- **Couleur** : Couleur de fond du segment (sélecteur de couleur ou code HEX)
- **Couleur du texte** : Couleur du texte sur le segment
- **Probabilité** : Pourcentage de chance d'obtenir ce segment (0-100%)
- **Segment gagnant** : Cochez si c'est un lot à gagner

### Bonnes Pratiques
- Utilisez des couleurs contrastées pour une meilleure lisibilité
- Équilibrez les probabilités (total = 100%)
- Alternez les couleurs pour un effet visuel optimal
- Limitez le texte à 2-3 mots pour une meilleure lisibilité

## 🎨 Personnalisation de l'Apparence

### Taille de la Roue
- **Minimum** : 300px (mobile)
- **Maximum** : 600px (desktop)
- **Recommandé** : 400-450px pour un équilibre optimal

### Styles de Bordure

#### Classic
- Bordure dorée traditionnelle
- Ampoules décoratives optionnelles
- Style casino/fête foraine
- **Idéal pour** : Jeux concours festifs

#### Neon
- Effet lumineux néon
- Couleurs vives
- Style moderne et dynamique
- **Idéal pour** : Événements nocturnes, gaming

#### Minimal
- Design épuré
- Bordure fine
- Style contemporain
- **Idéal pour** : Sites corporate, design minimaliste

#### Luxury
- Style premium
- Effets dorés/argentés
- Élégant et raffiné
- **Idéal pour** : Marques de luxe, événements VIP

### Couleurs de Marque

#### Couleur Primaire
- Utilisée pour les éléments principaux
- Boutons d'action
- Accents visuels

#### Couleur Secondaire
- Éléments secondaires
- Bordures
- Hover states

#### Couleur d'Accent
- Highlights
- Animations
- Call-to-action

### Position du Bouton

#### Bottom (Bas) - Recommandé
- Position classique
- Meilleure ergonomie
- Centrage optimal

#### Top (Haut)
- Design inversé
- Original
- Bon pour les intégrations spécifiques

#### Left/Right (Gauche/Droite)
- Layout horizontal
- Pour les designs larges
- Moins courant

#### Center (Centre)
- Bouton au centre de la roue
- Compact
- Style moderne
- **Note** : Texte réduit ("GO")

## ⚙️ Modes de Jeu

### Mode Aléatoire
- Sélection 100% aléatoire
- Chaque segment a une chance égale
- Ignore les probabilités configurées
- **Utilisation** : Jeu équitable, loterie pure

### Mode Probabilités
- Respecte les probabilités configurées
- Contrôle précis des chances de gain
- Somme des probabilités = 100%
- **Utilisation** : Contrôle du taux de gain, promotions ciblées

### Mode Gagnant Instantané
- Définit un taux de gain global
- Sélectionne automatiquement gagnant/perdant
- Puis choisit aléatoirement parmi les segments correspondants
- **Utilisation** : Contrôle strict du budget, jeux régulés

#### Configuration du Taux de Gain
- 0% : Aucun gagnant (test)
- 25% : 1 gagnant sur 4
- 50% : 1 gagnant sur 2
- 75% : 3 gagnants sur 4
- 100% : Tous gagnants (promotion)

## 🎮 Vitesse de Rotation

### Lente
- Durée : ~8-10 secondes
- Suspense maximum
- Idéal pour : Événements en direct, grands prix

### Moyenne (Recommandée)
- Durée : ~5-6 secondes
- Équilibre parfait
- Idéal pour : Usage général

### Rapide
- Durée : ~3-4 secondes
- Dynamique
- Idéal pour : Jeux répétitifs, mobile

## 📝 Formulaire de Participation

### Champs Disponibles

#### Text (Texte)
- Champ texte simple
- Ex: Prénom, Nom, Ville

#### Email
- Validation automatique du format
- Obligatoire pour les communications

#### Tel (Téléphone)
- Format téléphone
- Validation optionnelle

#### Textarea (Zone de texte)
- Texte multiligne
- Ex: Commentaire, Message

#### Checkbox (Case à cocher)
- Acceptation de conditions
- Opt-in newsletter

### Configuration des Champs
- **Label** : Texte affiché
- **Type** : Type de champ
- **Obligatoire** : Champ requis ou optionnel
- **Placeholder** : Texte d'aide (optionnel)

### Champs Recommandés
```
Minimum :
- Prénom (text, obligatoire)
- Email (email, obligatoire)

Standard :
- Prénom (text, obligatoire)
- Nom (text, obligatoire)
- Email (email, obligatoire)
- Téléphone (tel, optionnel)

Complet :
- Prénom (text, obligatoire)
- Nom (text, obligatoire)
- Email (email, obligatoire)
- Téléphone (tel, optionnel)
- Ville (text, optionnel)
- Acceptation CGU (checkbox, obligatoire)
- Newsletter (checkbox, optionnel)
```

## 🎭 Animations et Effets

### Animation de Rotation
- Accélération progressive
- Décélération réaliste
- Effet de rebond final
- Son de rotation (optionnel)

### Effets Visuels
- **Pendant la rotation** :
  - Brightness augmenté
  - Saturation augmentée
  - Flou de mouvement

- **Au résultat** :
  - Confettis (segments gagnants)
  - Animation de célébration
  - Highlight du segment

### Animations du Pointeur
- Oscillation légère
- Effet de clic
- Désactivable via `disablePointerAnimation`

## 🔄 Flux Utilisateur

### Mode 1 (Direct)
1. Utilisateur arrive sur la page
2. Voit la roue immédiatement
3. Clique sur "Faire tourner"
4. La roue tourne
5. Résultat affiché
6. Peut rejouer

### Mode 2 (Avec Formulaire)
1. Utilisateur arrive sur la page
2. Voit la roue et un bouton
3. Clique sur le bouton
4. **Formulaire de participation s'affiche**
5. Remplit et valide le formulaire
6. La roue devient active
7. Clique pour faire tourner
8. Résultat affiché
9. Peut rejouer (nouveau formulaire)

## 📱 Responsive Design

### Adaptations Automatiques

#### Desktop (>1024px)
- Roue à taille maximale
- Layout horizontal possible
- Tous les éléments visibles

#### Tablet (768-1024px)
- Roue à taille moyenne
- Layout vertical
- Interface optimisée

#### Mobile (<768px)
- Roue réduite automatiquement
- Boutons plus grands
- Formulaire simplifié
- Touch-friendly

### Optimisations Mobile
- Taille de police augmentée
- Espacement adapté
- Boutons tactiles (min 44x44px)
- Scroll optimisé

## 🎨 Thèmes Prédéfinis

### Modern (Par défaut)
- Design contemporain
- Couleurs vives
- Animations fluides

### Classic
- Style traditionnel
- Couleurs chaudes
- Effet rétro

### Neon
- Couleurs fluorescentes
- Effets lumineux
- Style cyberpunk

### Luxury
- Or et argent
- Élégant
- Premium

## 🔧 Options Avancées

### Désactivation de l'Animation du Pointeur
```typescript
<SmartWheel
  disablePointerAnimation={true}
  // ... autres props
/>
```

### Taille Maximum
```typescript
<SmartWheel
  size={600}
  maxSize={500} // Limite à 500px
  // ... autres props
/>
```

### Callback Personnalisés
```typescript
<SmartWheel
  onSpin={() => console.log('Rotation démarrée')}
  onResult={(segment) => console.log('Résultat:', segment)}
  // ... autres props
/>
```

## 📊 Gestion des Données

### Stockage Local
- Configuration sauvegardée dans localStorage
- Persistance entre les sessions
- Pas de serveur requis

### Export/Import (À venir)
- Export de la configuration en JSON
- Import de configurations sauvegardées
- Partage de configurations

### Backend (Optionnel)
Pour une utilisation multi-utilisateurs :
- Supabase
- Firebase
- API personnalisée

## 🎯 Cas d'Usage

### Jeu Concours
- Mode probabilités
- Formulaire complet
- Segments gagnants variés

### Promotion Flash
- Mode gagnant instantané
- Taux de gain contrôlé
- Formulaire minimal

### Événement Live
- Mode aléatoire
- Vitesse lente
- Grands prix

### Site E-commerce
- Réduction sur commande
- Mode probabilités
- Intégration iframe

### Événement Corporate
- Team building
- Mode aléatoire
- Style luxury

## 🔐 Sécurité et Confidentialité

### Données Utilisateur
- Stockées localement (localStorage)
- Pas de transmission automatique
- RGPD compliant (avec consentement)

### Interface Admin
- Séparée de l'interface live
- Protégeable par authentification
- Pas accessible via iframe

### Iframe
- Sandbox automatique
- Isolation du contenu
- Pas d'accès à la configuration

## 🚀 Performance

### Optimisations
- Canvas pour le rendu (GPU)
- Lazy loading des images
- Code splitting automatique
- Compression des assets

### Métriques Cibles
- First Contentful Paint : <1.5s
- Time to Interactive : <3s
- Lighthouse Score : >90

## 📈 Analytics (Optionnel)

### Événements à Tracker
- `wheel_view` : Affichage de la roue
- `wheel_spin` : Rotation lancée
- `wheel_result` : Résultat obtenu
- `form_submit` : Formulaire validé
- `form_error` : Erreur de formulaire

### Intégration Google Analytics
```javascript
gtag('event', 'wheel_spin', {
  'event_category': 'engagement',
  'event_label': 'fortune_wheel'
});
```

## 🎨 Personnalisation CSS (Avancé)

### Classes Personnalisées
```css
/* Personnaliser le bouton */
.wheel-button {
  /* Vos styles */
}

/* Personnaliser le formulaire */
.participation-modal {
  /* Vos styles */
}
```

## 🔄 Mises à Jour Futures

### Prévues
- [ ] Export/Import de configuration
- [ ] Thèmes supplémentaires
- [ ] Sons personnalisables
- [ ] Backend optionnel
- [ ] Statistiques intégrées
- [ ] Mode multi-joueurs
- [ ] API publique

## 💡 Conseils d'Utilisation

### Pour un Taux de Conversion Optimal
1. Formulaire court (2-3 champs max)
2. Lots attractifs et variés
3. Design cohérent avec votre marque
4. Call-to-action clair
5. Test A/B des probabilités

### Pour une Expérience Utilisateur Optimale
1. Vitesse moyenne recommandée
2. Couleurs contrastées
3. Textes courts et lisibles
4. Test sur tous les appareils
5. Feedback immédiat

### Pour un Jeu Équitable
1. Probabilités transparentes
2. Conditions claires
3. Respect du RGPD
4. Pas de manipulation des résultats
5. Règlement accessible

## 🆘 Support

Pour toute question sur les fonctionnalités :
1. Consultez cette documentation
2. Testez dans l'interface admin
3. Utilisez la page `/test-iframe`

## 🎉 Conclusion

La Roue de la Fortune offre une flexibilité totale pour créer des jeux concours engageants et personnalisés. Expérimentez avec les différentes options pour trouver la configuration parfaite pour votre audience !
