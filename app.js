const express = require('express'); // installation d'express
const app = express(); // création de l'application express
const mongoose = require('mongoose')
const bodyParser = require('body-parser'); // installation de bodyParser et require pour pouvoir lire les requetes du body
const userRoutes = require('./routes/user') // est utilisé ici donc on le require 
const saucesRoutes = require('./routes/sauces')
const path = require('path')
// cree un fichier environnement pour stocker le mot de passe en dehors du code 
require('dotenv').config()
const helmet = require('helmet')

mongoose.connect('mongodb+srv://leslie:nellynewenmaeliah07@cluster0.nwpkd.mongodb.net/leslie?retryWrites=true&w=majority',

  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(helmet());

app.use(bodyParser.json()) // indique à l'app d'utiliser la méthode json de bodyParser pour lire les requêtes du body
app.use('/api/auth', userRoutes)
app.use('/api/sauces', saucesRoutes)
app.use('/images', express.static(path.join(__dirname, '/images')));



module.exports = app; // pour pouvoir importer mon app dans mon server.js 