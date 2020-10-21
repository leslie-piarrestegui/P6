const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'utilisateur créé!' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => {
            res.status(500).json({ error })
        });
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // recupère l'utilisateur qui correspond à l'adresse mail entrée
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé!' }); // si l'email n'est pas bon, une erreur est renvoyé
            }
            bcrypt.compare(req.body.password, user.password) // le hash et le mot de passe entrée sont comparé
                .then(valide => {
                    if (!valide) {
                        return res.status(401).json({ message: 'Mot de passe incorrect!' }) // si la comparaison n'est pas bonne, une erreur est renvoyé
                    }
                    res.status(200).json({  // si la comparaison est bonne , l'utilisateur à entrée des identifiants valable
                        user_id: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            
                        )
                        
                    });
                })
                .catch(error => res.status(500).json({ error }));

        })
        .catch(error => res.status(500).json({ error }));
};