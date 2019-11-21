- creer un fichier gitignore. avec '.' car il est cache
- Creer un repo sur GitHub
  Commandes a executer dans le dossier du projet
  '''bash
  git init
  git add .
  git commit -m "message"
  '''
- publier sur github

- dans packages.json on ajoute dev pour npm run dev
- aussi le start simplement node index.js pour la prod car en prod pas besoin de surveiller les modifs qui prend du temps

- installer nodemon directement avec npm installe nodemon --save-dev pour eviter qu'il le reinstalle a chaque fois. va s'ajouter dans

- comment avoir des informations masquees sur gitHub par exemple l'URL de la base de donnees qui peut contenir notre mot de passe. On utilise une variable d'envrionnement

# Backend Project

## Routes

- Initialiser le projet et ainsi creer un package.json

```bash
npm init -y
```

- Creer un fichier index.js

* Installer les dependances qui vont nous permettre de creer un serveur

```bash
npm install express mongoose body-parser
```

- Exemple de code

```js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Créer le serveur
const app = express();

// Activer bodyParser
app.use(bodyParser.json());

// Créer des routes
// A chaque fois qu'un visiteur ira sur la page d'accueil, cette fonction sera déclenchée
app.get("/", (req, res) => {
  // req = request
  // res = response

  res.json({ message: "Hello World" });
});

// Démarrer le server
app.listen(4000, () => {
  console.log("Server started");
});
```

## GitHub

- Creer un fichier gitignore

- Creer un repo sur GitHub (bouton + en haut à droite)

Commandes à exécuter dans le dossier du projet

```bash
git init
git add . # pour ajouter tous les fichiers du dossier dans la liste des fichiers qui seront pris en compte lors des sauvegardes
git commit -m "Add route Hello World" # sauvegarde locale
git remote add origin # suivi de l'url à utiliser pour faire un lien avec le repo qu'on a créé
git push -u origin master # transmettre les sauvegardes à GitHub
```

- Publier sur GitHub

## Database

```js
mongoose.connect("mongodb://localhost/backend-project", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

Control-C pour arreter le serveur et `node index.js` pour le lancer

## Démarrage du Server

- Pour redemarrer le serveur automatiquement a chaque modification, on peut utiliser `npx nodemon index.js` ou installer `nodemon` grâce à la commande `npm install nodemon --save-dev`

- Ajouter les raccourcis `dev` et `start` dans package.json

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon index.js",
    "start": "node index.js"
  }
}
```

## Variables d'environnement

```bash
npm install dotenv
```

- Dans un fichier `.env` à la racine d'un projet `backend`.

```bash
MONGODB_URI=mongodb://localhost/my-database
```

- Dans le fichier `index.js`

```js
// La ligne suivante ne doit être utilisée qu'une seule fois et au tout début du projet. De préférence dans index.js
require("dotenv").config(); // Permet d'activer les variables d'environnement qui se trouvent dans le fichier `.env`

mongoose.connect(process.env.MONGODB_URI); // Vous pourrez vous connecter à votre base de données, sans pour autant préciser les identifiants dans le fichier index.js
```

- Dans le fichier `.gitignore`

Ajoutez `.env` dans votre `.gitignore` afin de ne pas publier les informations sensibles qui s'y trouvent sur GitHub.

## Mongoose

Créer un model

```js
const User = mongoose.model("User", {
  name: String,
  city: String
});
```

## Recevoir des fichiers

Autoriser les CORS

```bash
npm install cors
```

```js
const cors = require("cors");
app.use(cors());
```

```bash
npm install express-formidable
```

## Cloudinary

```bash
npm install cloudinary
```

```js
const cloudinary = require("cloudinary").v2;

// Configurer Cloudinary

cloudinary.config({
  cloud_name: "sample",
  api_key: "874837483274837",
  api_secret: "a676b67565c6767a6767d6767f676fe1"
});

// Exemple :
cloudinary.uploader.upload(req.files.picture.path, function(error, result) {
  console.log(result.secure_url);
});
```
