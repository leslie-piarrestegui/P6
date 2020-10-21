const multer = require('multer');


const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {  //indique à multer de placer les fichiers dans le dossier images
    callback(null, 'images');
  },
  filename: (req, file, callback) => {     // utiliser le nom d'origine, remplacer les espaces par des underscor
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype]; // utilise le dictionnaire MIME pour trouver lla bonne extension
    callback(null, name + Date.now() + '.' + extension);// on def les parametre du call back
  }
});

module.exports = multer({ storage: storage }).single('image');// on exporte multer en lui passant notre constante storage
// .single indique que l'on va gérer uniquement le téléchargement d'image
// il faut maintenant modifier les routes sauces car la structure des fichiers n'est pas JSON