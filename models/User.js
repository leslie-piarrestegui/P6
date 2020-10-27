// SCHEMA POUR STOCKER LES DONNÉ UTILISATEUR DANS LA BASE DE DONNÉE
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

const userSchema = mongoose.Schema ({
    email : { 
        type: String,
        require: true,
        unique: true,
        validator: validator.isEmail,
        message: '{VALUE} is not a valid email',
        isAsync: false},
    password : {type: String, require: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);