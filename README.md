# 🐾 Lisez-Chat — Frontend Mobile React Native

Application mobile React Native (Expo) pour consulter, publier et commenter des articles Lisez-Chat.

---

## 📝 Description technique

**Fonctionnalités principales :**
- Authentification (connexion, inscription, déconnexion, JWT)
- Consultation, création, édition et suppression d’articles
- Gestion des catégories
- Système de commentaires sur les articles
- Espace administration (gestion utilisateurs/articles)
- Navigation multi-écrans, UI responsive

**Stack technique :**
- **Frontend** : React Native (Expo)
- **Navigation** : @react-navigation/native + Stack
- **HTTP** : Axios
- **Picker** : @react-native-picker/picker

---

## 🚀 Installation

### Prérequis
- Node.js v16+
- Expo CLI (`npm install -g expo-cli`)
- Smartphone avec Expo Go ou un émulateur Android/iOS

### Étapes

1. **Clone le repo et place-toi dans le dossier backend :**
   ```bash
   git clone https://github.com/visothyouksim/lisezchat-frontend-v2
   cd lisezchat-frontend

2. **Installe les dépendances :
  ```bash
  npm intall

3. **Configure l’URL de l’API dans /utils/api.js 
   ```bash
   const API_URL = "http://<IP_DE_TA_MACHINE>:4000";

3. **Lance l’application
     ```bash 
     npx expo start
