const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const savedRecipesSchema = new Schema({
    UserId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    recipeId: { type: mongoose.Schema.Types.Mixed, required: true }, // ID Number for Spoonacular, ObjectId for user-made
    recipeType: { type: String, enum: ['spoonacular', 'userMade'], required: true }, // tells where recipe comes from (spoonacular API or user-created)
    action: {type: String, enum: ['liked', 'bookmarked'], required: true},
    savedAt: {type: Date, default: Date.now},
    
    // Store title here for easy sorting (denormalization for performance)
    recipeTitle: {type: String, required: true}
}, {
    timestamps: true  // Adds createdAt and updatedAt automatically
});

// Compound index used to prevent duplication
savedRecipesSchema.index({ UserId: 1, recipeId: 1 }, { unique: true });

// Index for efficient queries by action type
savedRecipesSchema.index({ UserId: 1, action: 1 });

// Index for alphabetical sorting
savedRecipesSchema.index({ UserId: 1, recipeTitle: 1 });

module.exports = mongoose.model('SavedRecipe', savedRecipesSchema);