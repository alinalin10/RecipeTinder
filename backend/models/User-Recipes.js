// Recipes the user has added themselves (not from Spoonacular)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userRecipes = new Schema({
    title: { type: String, required: true },
    user: { type: String },
    course: { type: String, required: true },
    servings: { type: String, required: true },
    description: { type: String },
    prepTime: { type: Number },
    cookTime: { type: Number },
    calories: { type: String },
    difficulty: { type: String },
    steps: { type: [String] },
    image: { type: String },
    ingredients: { type: [String] },
    time: { type: Number, },
});

userRecipes.set('toJSON', {
  virtuals: true,          // include any virtual fields you define
  versionKey: false,       // remove the "__v" field (used by MongoDB for versioning)
  transform: function (doc, ret) {
    ret.id = ret._id;      // copy the _id value into a new field "id"
    delete ret._id;        // remove the original _id so frontend doesn’t see it
  }
});

module.exports = model('UserRecipes', userRecipes);