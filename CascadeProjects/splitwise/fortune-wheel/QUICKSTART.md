# 🚀 Guide de Démarrage Rapide

Lancez votre Roue de la Fortune en 5 minutes !

## ⚡ Installation Express

```bash
# 1. Aller dans le dossier du projet
cd fortune-wheel

# 2. Installer les dépendances (si pas déjà fait)
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 🎯 Première Configuration (3 minutes)

### Étape 1 : Accéder à l'Admin
1. Cliquez sur **"🔧 Interface d'Administration"**
2. Vous arrivez sur `/admin`

### Étape 2 : Configurer les Segments
1. Allez dans l'onglet **"🎯 Segments"**
2. Modifiez les segments existants ou ajoutez-en :
   - **Segment 1** : "iPhone 15" (couleur rouge, gagnant ✓)
   - **Segment 2** : "AirPods" (couleur bleu, gagnant ✓)
   - **Segment 3** : "Perdu" (couleur gris, perdant ✗)
   - **Segment 4** : "10€ de réduction" (couleur vert, gagnant ✓)

### Étape 3 : Personnaliser l'Apparence
1. Allez dans l'onglet **"🎨 Apparence"**
2. Ajustez :
   - Taille de la roue : **400px**
   - Style de bordure : **Classic**
   - Couleur primaire : **Votre couleur de marque**
   - Texte du bouton : **"Tentez votre chance !"**

### Étape 4 : Configurer le Comportement
1. Allez dans l'onglet **"⚙️ Comportement"**
2. Choisissez :
   - Mode de rotation : **Probabilités** (pour contrôler les chances)
   - Vitesse : **Moyenne**

### Étape 5 : Tester
1. Regardez la **prévisualisation en temps réel** à droite
2. Cliquez sur le bouton pour tester la rotation
3. Ajustez si nécessaire

## 🎮 Utilisation Live (1 minute)

### Option 1 : Lien Direct
1. Dans l'interface admin, copiez le **lien live**
2. Partagez-le : `http://localhost:3000/live`
3. Les participants peuvent jouer directement

### Option 2 : Intégration Iframe
1. Copiez le **code iframe** généré
2. Collez-le sur votre site :
```html
<iframe 
  src="http://localhost:3000/live" 
  width="100%" 
  height="900" 
  frameborder="0">
</iframe>
```

## 🧪 Tester l'Iframe

1. Allez sur [http://localhost:3000/test-iframe](http://localhost:3000/test-iframe)
2. Vous verrez une simulation d'intégration
3. Testez le jeu complet dans l'iframe

## 📱 Test sur Mobile

1. Trouvez votre IP locale :
   ```bash
   # Sur Mac/Linux
   ifconfig | grep "inet "
   
   # Sur Windows
   ipconfig
   ```

2. Sur votre mobile, accédez à :
   ```
   http://VOTRE_IP:3000/live
   ```

## 🎨 Personnalisation Rapide

### Changer les Couleurs
```
Admin > Apparence > Couleur primaire
```

### Ajouter un Segment
```
Admin > Segments > + Ajouter
```

### Modifier le Formulaire
```
Admin > Formulaire > Modifier les champs
```

## 🔄 Workflow Recommandé

1. **Configuration** : Configurez tout dans `/admin`
2. **Test** : Testez dans `/test-iframe`
3. **Validation** : Vérifiez sur mobile
4. **Intégration** : Intégrez l'iframe sur votre site
5. **Publication** : Partagez le lien live

## 📊 Exemples de Configuration

### Jeu Concours Simple
```
Segments :
- Prix 1 (20%) - Gagnant
- Prix 2 (20%) - Gagnant
- Prix 3 (10%) - Gagnant
- Perdu (50%) - Perdant

Mode : Probabilités
Vitesse : Moyenne
```

### Promotion 100% Gagnant
```
Segments :
- 50% de réduction (10%)
- 30% de réduction (20%)
- 20% de réduction (30%)
- 10% de réduction (40%)

Mode : Probabilités
Vitesse : Rapide
```

### Loterie Équitable
```
Segments :
- Grand Prix (tous égaux)
- Prix 2
- Prix 3
- Prix 4

Mode : Aléatoire
Vitesse : Lente
```

## 🎯 Checklist de Lancement

Avant de publier :

- [ ] Segments configurés avec lots attractifs
- [ ] Couleurs cohérentes avec votre marque
- [ ] Probabilités équilibrées (total = 100%)
- [ ] Formulaire configuré (champs pertinents)
- [ ] Test de rotation effectué
- [ ] Test sur mobile effectué
- [ ] Test iframe effectué
- [ ] Règlement du jeu rédigé
- [ ] Conditions générales acceptées

## 🚨 Problèmes Courants

### La roue ne s'affiche pas
```bash
# Vérifier que le serveur tourne
npm run dev

# Vérifier l'URL
http://localhost:3000
```

### Erreur de build
```bash
# Nettoyer et réinstaller
rm -rf node_modules .next
npm install
npm run dev
```

### L'iframe ne fonctionne pas
- Vérifiez l'URL dans le code iframe
- Vérifiez que le serveur est accessible
- Testez d'abord sur `/test-iframe`

## 📚 Documentation Complète

Pour aller plus loin :

- **README.md** : Vue d'ensemble du projet
- **FEATURES.md** : Toutes les fonctionnalités détaillées
- **INTEGRATION.md** : Guide d'intégration iframe complet
- **DEPLOYMENT.md** : Guide de déploiement en production

## 🎉 C'est Parti !

Votre Roue de la Fortune est prête ! 

**Prochaines étapes :**
1. Personnalisez selon vos besoins
2. Testez avec de vrais utilisateurs
3. Déployez en production (voir DEPLOYMENT.md)
4. Partagez et engagez votre audience !

## 💡 Conseils Pro

- **Testez toujours** avant de publier
- **Sauvegardez** votre configuration régulièrement
- **Analysez** les résultats pour optimiser
- **Variez** les lots pour maintenir l'intérêt
- **Communiquez** clairement les règles

## 🆘 Besoin d'Aide ?

1. Consultez la documentation complète
2. Testez sur `/test-iframe`
3. Vérifiez la console du navigateur (F12)
4. Relisez ce guide

## 🎊 Bon Jeu !

Amusez-vous bien avec votre Roue de la Fortune ! 🎡✨
