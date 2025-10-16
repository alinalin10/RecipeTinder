// User's saved recipes
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const savedRecipesSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipeId: { type: mongoose.Schema.Types.Mixed, required: true }, // ID Number for Spoonacular, ObjectId for user-made
    recipeType: { type: String, enum: ['spoonacular', 'userMade'], required: true }, // tells where recipe comes from (spoonacular API or user-created)
    savedAt: { type: Date, default: Date.now }
});

module.exports = model('SavedRecipes', savedRecipesSchema);