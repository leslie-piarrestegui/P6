const Sauce = require('../models/sauces');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const authService = require('../services/auth.service');


// creer une nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const userId = authService.getDecodedToken(req).userId;
    console.log(sauceObject);
    console.log(userId);
    const sauce = new Sauce({ // creation d'une nouvelle instance du model sauce
        ...sauceObject,
        userId,
        // generer l'URL de l'image
        // http://localhost:3000/image/nomdufichier 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistrée!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
};

// recuperer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => { res.status(200).json(sauce); })
        .catch((error) => { res.status(404).json({ error: error }); });
};

// modifier une sauce existante
exports.modifySauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const userId = authService.getDecodedToken(req).userId;

            // Checks if the user ID matches that of the object to modify
            if (sauce.userId === userId) {
                const sauceObject = req.file ?
                    {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    } : { ...req.body };

                if (!req.file) {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => { res.status(201).json({ message: 'Sauce mise à jour!' }); })
                        .catch((error) => { res.status(400).json({ error: error }); });
                } else {
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                            .then(() => { res.status(201).json({ message: 'Sauce mise à jour!' }); })
                            .catch((error) => { res.status(400).json({ error: error }); });
                    });
                }

            } else {
                res.status(403).json({ error: 'Utilisateur non autorisé à modifier cette sauce!' });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
};

// effacer une sauce

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const userId = authService.getDecodedToken(req).userId;

            // Checks if the user ID matches that of the object to delete
            if (sauce.userId === userId) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                        .catch(error => res.status(404).json({ error }));
                })
            } else {
                res.status(403).json({ error: 'Identifiant utilisateur invalide !' });
            }
        })
        .catch(error => res.status(404).json({ error }))
};

// recuperer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => { res.status(200).json(sauces); })
        .catch((error) => { res.status(400).json({ error: error }); });
};

// envoyer like ou dislike
exports.likeSauce = (req, res, next) => {
    switch (req.body.like) {

        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
                            .catch((error) => { res.status(400).json({ error: error }); });

                    } if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId },
                            _id: req.params.id
                        })
                            .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
                            .catch((error) => { res.status(400).json({ error: error }); });
                    }
                })
                .catch((error) => { res.status(404).json({ error: error }); });
            break;

        case 1:
            Sauce.updateOne({ _id: req.params.id }, {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId },
                _id: req.params.id
            })
                .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
                .catch((error) => { res.status(400).json({ error: error }); });
            break;

        case -1:
            Sauce.updateOne({ _id: req.params.id }, {
                $inc: { dislikes: 1 },
                $push: { usersDisliked: req.body.userId },
                _id: req.params.id
            })
                .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
                .catch((error) => { res.status(400).json({ error: error }); });
            break;
        default:
            console.error('not today : mauvaise requête');
    }
};
