// Recipes the user has added themselves (not from Spoonacular)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userRecipes = new Schema({
    title: { type: String, required: true },
    user: { type: String, required: true },
    course: { type: String, required: true },
    servings: { type: Number, required: true },
    description: { type: String },
    prepTime: { type: Number },
    cookTime: { type: Number },
    calories: { type: Number },
    cuisine: { type: String },
    difficulty: { type: Number },
    steps: { type: [String] },
    image: { type: String },
    ingredients: { type: [String] },

    // New fields for recommendation system
    diet: { type: [String] }, // e.g., ["vegan", "gluten free"]
    allergens: { type: [String] }, // e.g., ["dairy", "nuts"]
    tags: { type: [String] }, // e.g., ["quick", "easy", "spicy"]
}, {
  timestamps: true
});

userRecipes.set('toJSON', {
  virtuals: true,          // include any virtual fields you define
  versionKey: false,       // remove the "__v" field (used by MongoDB for versioning)
  transform: function (doc, ret) {
    ret.id = ret._id;      // copy the _id value into a new field "id"
    //delete ret._id;        // remove the original _id so frontend doesn’t see it
  }
});

module.exports = model('UserRecipes', userRecipes);