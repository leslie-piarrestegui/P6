const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mailValidator = require('email-validator'); // Little email validation plugin that acts as a regex
const passwordValidator = require('password-validator');

const User = require('../models/User');




var schema = new passwordValidator(); // And here we declare our password validation in the form of a schema

schema
.is().min(8)  // Minimum 8 characters long
.is().max(30) // Maximum 30 characters long
.has().not().spaces();  // Password cannot have spaces

exports.signup = (req, res, next) => {  // Function that allows users to register an account
    if (!mailValidator.validate(req.body.email) || (!schema.validate(req.body.password))) {  // We check email && password validity
        throw { error: "Merci de bien vouloir entrer une adresse email et un mot de passe valide !" }  // Fails if invalid
    } else if (mailValidator.validate(req.body.email) && (schema.validate(req.body.password))) {  // If both are valid
    bcrypt.hash(req.body.password, 10)  // We hash and salt the password
        .then(hash => {  // We then create an object containing the user information
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()  // And we push this information to the DB
                .then(() => res.status(201).json({ message: 'User created !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error: 'Votre mot de passe doit faire entre 8 et 30 caractères et ne peut pas contenir un espace' }));
    }
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
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                        
                    });
                })
                .catch(error => res.status(500).json({ error }));

        })
        .catch(error => res.status(500).json({ error }));
};