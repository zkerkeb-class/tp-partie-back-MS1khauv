# 🎮 Pokédex TCG — Backend API

API REST construite avec **Express.js** et **MongoDB** pour gérer la base de données des 151 Pokémon de la Génération I.

---

## 📋 Prérequis

- **Node.js** v20+ ([télécharger](https://nodejs.org))
- **MongoDB** en local sur le port `27017` ([télécharger](https://www.mongodb.com/try/download/community))
- **npm** v10+

---

## ⚙️ Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/zkerkeb-class/tp-partie-back-MS1khauv.git
cd tp-partie-back-MS1khauv

# 2. Installer les dépendances
npm install

# 3. S'assurer que MongoDB est lancé
# macOS (Homebrew) :
brew services start mongodb-community
# Linux :
sudo systemctl start mongod

# 4. Lancer le serveur en mode développement
npm run dev
```

Le serveur démarre sur **http://localhost:3000**

---

## 🗄️ Base de données

La connexion MongoDB est configurée dans `connect.js` :

```
mongodb://localhost:27017/pokemon-db-2
```

### Importer les données initiales

Un fichier `data/pokemons.json` contient les 151 Pokémon de la Génération I. Pour les importer dans MongoDB :

```bash
mongoimport --db pokemon-db-2 --collection pokemons --file data/pokemons.json --jsonArray
```

---

## 📁 Structure du projet

```
tp-partie-back-MS1khauv/
├── index.js          # Point d'entrée — serveur Express + toutes les routes
├── connect.js        # Connexion MongoDB via Mongoose
├── schema/
│   └── pokemon.js    # Modèle Mongoose (schéma Pokémon)
├── data/
│   ├── pokemons.json     # Dataset 151 Pokémon
│   ├── pokemonsList.js   # Script utilitaire
│   └── generatePokemonsJson.js
├── assets/           # Ressources statiques
└── package.json
```

---

## 🔌 Endpoints de l'API

### Base URL : `http://localhost:3000`

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/pokemons?page=1` | Liste paginée (20 par page) |
| `GET` | `/pokemons/search?name=pikachu` | Recherche par nom (insensible à la casse) |
| `GET` | `/pokemons/:id` | Détail d'un Pokémon par ID |
| `POST` | `/pokemons` | Créer un nouveau Pokémon |
| `PUT` | `/pokemons/:id` | Modifier un Pokémon existant |
| `DELETE` | `/pokemons/:id` | Supprimer un Pokémon |

---

### 📥 GET `/pokemons?page=1`

Retourne 20 Pokémon par page avec les métadonnées de pagination.

**Réponse :**
```json
{
  "page": 1,
  "totalPages": 8,
  "totalPokemons": 151,
  "pokemons": [ ... ]
}
```

---

### 📥 GET `/pokemons/search?name=bulbasaur`

Recherche par nom en anglais (regex insensible à la casse).

**Réponse :** objet Pokémon ou `404` si non trouvé.

---

### 📥 GET `/pokemons/:id`

Retourne un Pokémon par son numéro de Pokédex.

**Exemple :** `GET /pokemons/25` → Pikachu

---

### 📤 POST `/pokemons`

Crée un Pokémon personnalisé.

**Body JSON requis :**
```json
{
  "id": 152,
  "name": {
    "english": "Chikorita",
    "japanese": "チコリータ",
    "chinese": "菊草叶",
    "french": "Germignon"
  },
  "type": ["Grass"],
  "base": {
    "HP": 45,
    "Attack": 49,
    "Defense": 65,
    "SpecialAttack": 49,
    "SpecialDefense": 65,
    "Speed": 45
  },
  "image": "https://..."
}
```

**Réponse :** `201 Created` + objet créé.

---

### ✏️ PUT `/pokemons/:id`

Modifie un Pokémon existant (même body partiel accepté).

**Réponse :** objet mis à jour ou `404`.

---

### 🗑️ DELETE `/pokemons/:id`

Supprime un Pokémon par ID.

**Réponse :**
```json
{ "message": "Pokemon \"Pikachu\" supprimé avec succès" }
```

---

## 🗂️ Schéma Mongoose

```js
{
  id: Number (unique, requis),
  name: {
    english: String,
    japanese: String,
    chinese: String,
    french: String,
  },
  type: [String],
  base: {
    HP: Number,
    Attack: Number,
    Defense: Number,
    SpecialAttack: Number,
    SpecialDefense: Number,
    Speed: Number,
  },
  image: String,
}
```

---

## 🛠️ Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre le serveur avec **nodemon** (rechargement automatique) |

---

## 📦 Dépendances

| Package | Version | Rôle |
|---------|---------|------|
| `express` | ^5.2.1 | Framework HTTP |
| `mongoose` | ^9.1.5 | ODM MongoDB |
| `cors` | ^2.8.6 | Autoriser les requêtes cross-origin |
| `nodemon` | ^3.1.11 | Rechargement auto en développement |

---

## 🔗 Dépôt GitHub

[https://github.com/zkerkeb-class/tp-partie-back-MS1khauv](https://github.com/zkerkeb-class/tp-partie-back-MS1khauv)
