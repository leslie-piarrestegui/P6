const express = require('express');
const bodyParser = require('body-parser'); // transforme le corp des requetes en objet JS utilisable
const mongoose = require('mongoose');
const path = require('path'); // nous donne access au chemin des fichiers

const helmet = require('helmet');

const userRoutes = require('./routes/user') 
const saucesRoutes = require('./routes/sauces')

const app = express(); 

// cree un fichier environnement pour stocker le mot de passe en dehors du code 
require('dotenv').config()


mongoose.connect('mongodb+srv://leslie:nellynewenmaeliah07@cluster0.nwpkd.mongodb.net/projet?retryWrites=true&w=majority',

  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// pour eviter les ERRORS de CORS, pourque tout le monde puisse faire des requete depuis son navigateur 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(helmet());

app.use(bodyParser.json()) // indique à l'app d'utiliser la méthode json de bodyParser pour lire les requêtes du body
app.use('/api/auth', userRoutes) // pour l'autentification de l'utilisateur - se refer à ./routes/user.js
app.use('/api/sauces', saucesRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));



module.exports = app; // pour pouvoir importer mon app dans mon server.js 