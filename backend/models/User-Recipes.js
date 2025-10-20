// Recipes the user has added themselves (not from Spoonacular)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userRecipes = new Schema({
    title: { type: String, required: true },
    course: { type: String, required: true },
    servings: { type: String, required: true },
    description: { type: String, required: true },
    prepTime: { type: Number, required: true },
    cookTime: { type: Number, required: true },
    calories: { type: String, required: true },
    difficulty: { type: String, required: true },
    steps: { type: [String], required: true },
    image: { type: String },
    ingredients: { type: [String], required: true },
    time: { type: Number, },
});

module.exports = model('UserRecipes', userRecipes);