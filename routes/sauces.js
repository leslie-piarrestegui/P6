const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')


router.get('/', auth, sauceCtrl.getAllSauces) // recuperer toutes les sauces
router.post('/', auth, multer, sauceCtrl.createSauce) // creer une nouvelle sauce
router.get('/:id', auth, sauceCtrl.getOneSauce) // recuperer une sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce) // modifier une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce) // effacer une sauce
router.post('/:id/like', auth, sauceCtrl.likeSauce) // envoyer like ou dislike

module.exports = router;