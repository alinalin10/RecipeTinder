// Recipes the user has added themselves (not from Spoonacular)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userRecipes = new Schema({
    title: { type: String, required: true },
    course: { type: String },
    servings: { type: String },
    description: { type: String },
    prepTime: { type: Number, required: true },
    cookTime: { type: Number, required: true },
    calories: { type: String, required: true },
    difficulty: { type: String, required: true },
    steps: { type: [String], required: true },
    image: { type: String },
    ingredients: { type: [String], required: true },
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