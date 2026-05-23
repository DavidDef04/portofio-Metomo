# 🚀 Configuration GitHub automatique

## 📁 Fichier de configuration
Modifiez `src/config/github.js` pour personnaliser vos comptes :

```javascript
export const GITHUB_CONFIG = {
  // 👇 Ajoutez vos comptes GitHub ici
  usernames: ['DavidDef04', 'deuxieme-compte'], 
  
  // 📊 Nombre de projets par compte
  maxProjectsPerAccount: 10,
  
  // ⚙️ Options
  autoSync: true,
  showLoadingIndicator: true
};
```

## 🔄 Comment ça fonctionne ?

1. **Automatique** : Au chargement du portfolio, les projets sont récupérés depuis GitHub
2. **Invisible** : L'utilisateur ne voit aucune interface de synchronisation
3. **Intégré** : Les projets GitHub s'ajoutent après vos projets par défaut
4. **Intelligent** : Filtrage automatique (pas de forks, pas de repos privés, avec description)

## 📋 Ordre d'affichage

1. **Projets par défaut** (votre fichier `data/projects.js`)
2. **Projets GitHub** (automatiquement récupérés)
3. **Filtrage** par tags (All, Web, Mobile, Cybersecurity, AI)

## 🎯 Pour ajouter votre deuxième compte :

1. Allez dans `src/config/github.js`
2. Modifiez la ligne :
   ```javascript
   usernames: ['DavidDef04'], // ← Ajoutez votre deuxième compte ici
   ```
3. Devenez :
   ```javascript
   usernames: ['DavidDef04', 'votre-deuxieme-compte'],
   ```

## ✅ C'est tout !

- Rechargez votre portfolio
- Les projets des deux comptes apparaissent automatiquement
- Aucune action manuelle requise

## 🔧 Si un projet n'apparaît pas :

- Le repository est-il **public** ?
- A-t-il une **description** ?
- Est-ce un **fork** (exclu automatiquement) ?
- Est-il **privé** (exclu automatiquement) ?
