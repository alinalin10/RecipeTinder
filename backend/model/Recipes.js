const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const recipeSchema = new Schema({
    spoonacularId: { type: Number, required: true, unique: true }, // ID from Spoonacular
    title: { type: String, required: true },
    image: { type: String },
    ingredients: { type: [String], required: true },
    instructions: { type: String, required: true },
    time: { type: Number, },
});

module.exports = model('Recipe', recipeSchema);
