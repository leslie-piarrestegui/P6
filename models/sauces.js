const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');
const sauceValidation = require('../middleware/sauceValidation');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, unique: true, validate : sauceValidation.nameValidator },
  manufacturer: { type: String, required: true, validate : sauceValidation.manufacturerValidator },
  description: { type: String, required: true, validate : sauceValidation.descriptionValidator },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true, min: [1, 'Minimun 1'], max: 10 },
  likes: { type: Number, required: false, default: 0 },
  dislikes: { type: Number, required: false, default: 0 },
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false }
})

sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model("sauce", sauceSchema)