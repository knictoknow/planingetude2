# StudyTrack 📚

**Application de gestion d'études avec répétition espacée pour les étudiants en droit**

StudyTrack est une application web moderne qui utilise la technique de répétition espacée pour optimiser l'apprentissage et la mémorisation. Spécialement conçue pour les étudiants en droit, elle programme automatiquement les révisions selon les intervalles scientifiquement prouvés : J+1, J+3, et J+7.

## ✨ Fonctionnalités

### 🧩 Partie 1 : To-Do List
- **Interface claire** avec liste des tâches du jour
- **Affichage détaillé** pour chaque tâche :
  - Matière (Droit civil, pénal, administratif, etc.)
  - Titre descriptif
  - Niveau de difficulté (facile, moyen, difficile)
  - Date prévue
- **Bouton "✓ Révisée"** pour marquer les tâches terminées
- **Reprogrammation automatique** : quand une tâche est cochée, elle est automatiquement reprogrammée à J+1, J+3, et J+7

### 🗓 Partie 2 : Calendrier
- **Vue calendrier mensuel** complète
- **Affichage des tâches** par jour avec couleurs par matière
- **Navigation** intuitive entre les mois
- **Clic sur un jour** pour voir le détail des tâches
- **Indicateur "+X de plus"** quand il y a beaucoup de tâches
- **Double-clic** sur un jour pour ajouter une tâche rapidement

### ⚙️ Fonctionnalités avancées
- **Système de filtrage** par matière et difficulté
- **Tri** par date, matière, difficulté ou titre
- **Recherche textuelle** dans les tâches
- **Thème sombre** activable d'un clic
- **Statistiques** en temps réel (tâches du jour, terminées, taux de réussite)
- **Interface responsive** pour mobile et desktop
- **Sauvegarde automatique** dans le navigateur (localStorage)

## 🎨 Design et UX

- **Design moderne** avec animations fluides
- **Couleurs par matière** pour une identification rapide
- **Interface intuitive** avec feedback visuel
- **Thème sombre/clair** avec transition douce
- **Composants réutilisables** et modulaires
- **Accessibilité** optimisée (navigation clavier, contrastes)

## 🚀 Installation et lancement

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd studytrack

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Builder pour la production
npm run build
```

L'application sera accessible sur `http://localhost:3000`

## 🏗️ Architecture technique

### Technologies utilisées
- **React 18** - Framework frontend
- **Vite** - Bundler et serveur de développement
- **Lucide React** - Icônes modernes
- **CSS moderne** - Variables CSS, Grid, Flexbox
- **LocalStorage** - Persistance des données côté client

### Structure du projet
```
src/
├── components/          # Composants React réutilisables
│   ├── TaskItem.jsx     # Affichage d'une tâche individuelle
│   ├── TodoList.jsx     # Liste des tâches avec filtres
│   ├── Calendar.jsx     # Vue calendrier mensuel
│   ├── AddTaskModal.jsx # Modal d'ajout de tâche
│   └── *.css           # Styles des composants
├── utils/
│   └── storage.js      # Gestion localStorage et logique métier
├── App.jsx             # Composant principal
├── main.jsx           # Point d'entrée
└── index.css          # Styles globaux et thèmes
```

### Fonctionnalités du système de stockage
- **Gestion des tâches** (CRUD complet)
- **Reprogrammation automatique** avec algorithme de répétition espacée
- **Paramètres utilisateur** (thème, tri, filtres)
- **Statistiques** calculées en temps réel
- **Import/Export** des données pour sauvegarde

## 📖 Guide d'utilisation

### Ajouter une tâche
1. Cliquer sur "Ajouter" dans l'onglet "Aujourd'hui" ou "Calendrier"
2. Remplir le titre, sélectionner la matière et la difficulté
3. Choisir la date (avec suggestions rapides)
4. Valider pour créer la tâche

### Marquer une tâche comme terminée
1. Cliquer sur "✓ Révisée" sur une tâche
2. La tâche disparaît de la liste
3. Elle est automatiquement reprogrammée à J+1, J+3, et J+7

### Naviguer dans le calendrier
1. Utiliser les flèches pour changer de mois
2. Cliquer sur un jour pour voir ses tâches
3. Double-cliquer sur un jour pour ajouter une tâche
4. Les tâches sont colorées selon leur matière

### Filtrer et trier
1. Cliquer sur l'icône filtre dans l'onglet "Aujourd'hui"
2. Utiliser la recherche, les filtres par matière/difficulté
3. Changer l'ordre de tri (date, matière, difficulté, titre)
4. Réinitialiser les filtres si besoin

### Changer de thème
- Cliquer sur l'icône lune/soleil dans l'en-tête pour basculer entre thème clair et sombre

## 📊 Système de répétition espacée

StudyTrack utilise un algorithme basé sur la courbe d'oubli d'Ebbinghaus :

1. **J+1** : Première révision le lendemain (consolidation immédiate)
2. **J+3** : Deuxième révision 3 jours après (renforcement)
3. **J+7** : Troisième révision 1 semaine après (mémorisation long terme)

Ce système optimise la rétention à long terme tout en minimisant le temps d'étude.

## 🎯 Matières supportées

- **Droit civil** (bleu) - Contrats, responsabilité, biens
- **Droit pénal** (vert) - Infractions, procédure pénale
- **Droit administratif** (violet) - Actes administratifs, contentieux
- **Droit constitutionnel** (orange) - Institutions, libertés publiques
- **Droit commercial** (rouge) - Sociétés, concurrence
- **Autres** (gris) - Autres matières juridiques

## 🔧 Personnalisation

L'application peut être facilement étendue :
- Ajouter de nouvelles matières dans `src/utils/storage.js`
- Modifier les intervalles de répétition
- Customiser les couleurs dans `src/index.css`
- Ajouter de nouveaux types de tri/filtrage

## 🚦 Démo

L'application inclut des données d'exemple au premier lancement pour découvrir toutes les fonctionnalités immédiatement.

## 📱 Compatibilité

- **Navigateurs** : Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Responsive** : Desktop, tablette, mobile
- **PWA ready** : Peut être installée comme app native

## 🔒 Données et confidentialité

- Toutes les données sont stockées localement dans votre navigateur
- Aucune donnée n'est envoyée sur internet
- Sauvegarde/restauration possible via export/import JSON

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**StudyTrack** - Optimisez vos révisions de droit avec la science de la mémorisation ! 🎓