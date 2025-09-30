// Recipes the user has added themselves (not from Spoonacular)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userRecipes = new Schema({
    title: { type: String, required: true },
    image: { type: String },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    time: { type: Number, },
});

module.exports = model('UserRecipes', userRecipes);
