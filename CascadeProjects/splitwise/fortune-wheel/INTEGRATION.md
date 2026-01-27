# 📋 Guide d'Intégration Iframe

Ce guide vous explique comment intégrer la Roue de la Fortune sur votre site web via iframe.

## 🎯 Objectif

L'interface live (`/live`) est conçue pour être intégrée sur n'importe quel site web via une iframe. Elle affiche uniquement le jeu, sans aucune interface d'administration.

## 🚀 Intégration Rapide

### Étape 1 : Configuration
1. Accédez à l'interface d'administration : `http://votre-domaine.com/admin`
2. Configurez votre roue (segments, couleurs, probabilités, etc.)
3. Copiez le code iframe généré

### Étape 2 : Intégration
Collez le code iframe sur votre site :

```html
<iframe 
  src="http://votre-domaine.com/live" 
  width="100%" 
  height="900" 
  frameborder="0" 
  allowfullscreen
  style="border: none; border-radius: 8px;">
</iframe>
```

## 🎨 Personnalisation de l'iframe

### Taille Responsive
```html
<div style="position: relative; width: 100%; padding-bottom: 100%; max-width: 800px; margin: 0 auto;">
  <iframe 
    src="http://votre-domaine.com/live" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    allowfullscreen>
  </iframe>
</div>
```

### Hauteur Fixe
```html
<iframe 
  src="http://votre-domaine.com/live" 
  width="100%" 
  height="900" 
  style="border: none; max-width: 1200px; margin: 0 auto; display: block;">
</iframe>
```

### Avec Bordure Décorative
```html
<div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px;">
  <iframe 
    src="http://votre-domaine.com/live" 
    width="100%" 
    height="900" 
    style="border: none; border-radius: 8px; display: block;">
  </iframe>
</div>
```

## 📱 Responsive Design

L'iframe s'adapte automatiquement aux différentes tailles d'écran. Recommandations :

- **Desktop** : hauteur 900-1000px
- **Tablet** : hauteur 800-900px
- **Mobile** : hauteur 700-800px

### Exemple Responsive
```html
<style>
  .wheel-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .wheel-iframe {
    width: 100%;
    height: 900px;
    border: none;
    border-radius: 8px;
  }
  
  @media (max-width: 768px) {
    .wheel-iframe {
      height: 800px;
    }
  }
  
  @media (max-width: 480px) {
    .wheel-iframe {
      height: 700px;
    }
  }
</style>

<div class="wheel-container">
  <iframe 
    class="wheel-iframe"
    src="http://votre-domaine.com/live" 
    allowfullscreen>
  </iframe>
</div>
```

## 🔒 Sécurité

### Ce qui est visible dans l'iframe
- ✅ La roue de la fortune
- ✅ Le formulaire de participation
- ✅ L'écran de résultat
- ✅ Les animations et effets

### Ce qui n'est PAS visible dans l'iframe
- ❌ L'interface d'administration
- ❌ Les paramètres de configuration
- ❌ Les statistiques
- ❌ Les contrôles d'édition

## 🎮 Flux Utilisateur

1. **Arrivée** : L'utilisateur voit la roue et un bouton
2. **Formulaire** : Clic sur le bouton → formulaire de participation
3. **Validation** : Après validation → la roue devient active
4. **Rotation** : L'utilisateur fait tourner la roue
5. **Résultat** : Affichage du résultat avec animation
6. **Rejouer** : Bouton pour recommencer

## 🌐 Intégration sur Différentes Plateformes

### WordPress
```php
<!-- Dans un article ou une page -->
[iframe src="http://votre-domaine.com/live" width="100%" height="900"]

<!-- Ou en HTML direct -->
<iframe src="http://votre-domaine.com/live" width="100%" height="900" frameborder="0"></iframe>
```

### Wix
1. Ajoutez un élément "HTML"
2. Collez le code iframe
3. Ajustez la taille

### Shopify
```liquid
<!-- Dans une page ou un template -->
<div class="wheel-container">
  <iframe src="http://votre-domaine.com/live" width="100%" height="900" frameborder="0"></iframe>
</div>
```

### Webflow
1. Ajoutez un élément "Embed"
2. Collez le code iframe
3. Publiez

## 🧪 Test de l'Intégration

Avant de publier, testez votre intégration :

1. **Page de test** : Accédez à `http://votre-domaine.com/test-iframe`
2. **Vérifications** :
   - ✅ La roue s'affiche correctement
   - ✅ Le formulaire fonctionne
   - ✅ La rotation est fluide
   - ✅ Le résultat s'affiche
   - ✅ Le bouton "Rejouer" fonctionne
3. **Tests multi-navigateurs** :
   - Chrome
   - Firefox
   - Safari
   - Edge
4. **Tests multi-appareils** :
   - Desktop
   - Tablet
   - Mobile

## 🎨 Personnalisation Avancée

### Synchronisation avec votre Charte Graphique

Configurez dans l'interface admin :
- Couleurs de la roue → couleurs de votre marque
- Couleur du bouton → couleur principale de votre site
- Police et style → cohérent avec votre design

### Communication Parent-Iframe (Avancé)

Si vous souhaitez communiquer entre votre site et l'iframe :

```javascript
// Sur votre site parent
window.addEventListener('message', function(event) {
  if (event.origin !== 'http://votre-domaine.com') return;
  
  // Traiter les messages de l'iframe
  console.log('Message reçu:', event.data);
});

// Envoyer un message à l'iframe
const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage({ type: 'config' }, 'http://votre-domaine.com');
```

## 📊 Suivi et Analytics

Pour suivre les interactions avec la roue, ajoutez des événements analytics :

```javascript
// Exemple avec Google Analytics
window.addEventListener('message', function(event) {
  if (event.data.type === 'wheel_spin') {
    gtag('event', 'wheel_spin', {
      'event_category': 'engagement',
      'event_label': 'fortune_wheel'
    });
  }
  
  if (event.data.type === 'wheel_result') {
    gtag('event', 'wheel_result', {
      'event_category': 'engagement',
      'event_label': event.data.result
    });
  }
});
```

## ⚠️ Problèmes Courants

### L'iframe ne s'affiche pas
- Vérifiez que l'URL est correcte
- Vérifiez les paramètres de sécurité (CORS)
- Vérifiez que le serveur est en ligne

### La roue est coupée
- Augmentez la hauteur de l'iframe
- Vérifiez les styles CSS parents

### Le formulaire ne fonctionne pas
- Vérifiez la configuration dans l'interface admin
- Vérifiez la console du navigateur pour les erreurs

### Les animations sont saccadées
- Vérifiez la performance du serveur
- Réduisez la taille de la roue dans la configuration

## 🆘 Support

Pour toute question ou problème d'intégration :
1. Consultez la documentation complète dans `README.md`
2. Testez sur la page `/test-iframe`
3. Vérifiez la console du navigateur pour les erreurs

## 📝 Checklist de Déploiement

Avant de publier votre intégration :

- [ ] Configuration complète dans l'interface admin
- [ ] Test sur la page `/test-iframe`
- [ ] Test sur différents navigateurs
- [ ] Test sur mobile et desktop
- [ ] Vérification de la hauteur de l'iframe
- [ ] Test du formulaire de participation
- [ ] Test de la rotation de la roue
- [ ] Test de l'affichage du résultat
- [ ] Vérification de la cohérence visuelle avec votre site
- [ ] Configuration des analytics (optionnel)
- [ ] Sauvegarde de la configuration

## 🎉 Félicitations !

Votre Roue de la Fortune est maintenant intégrée sur votre site. Bonne chance à vos participants !
