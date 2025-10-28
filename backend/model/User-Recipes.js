//stores recipes user has saved, referencing user by userId and recipes by spoonacularId

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;

const userRecipesSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true, unique: true },
    recipes: [{
        spoonacularId: { type: Number, required: true }, // ID from Spoonacular
        title: { type: String, required: true },
        image: { type: String },

        /*
        ingredients: { type: [String], required: true }, 
        instructions: { type: String, required: true },
        time: { type: Number },
        */
    }]
}, { timestamps: true });


const UserRecipes = model('UserRecipes', userRecipesSchema);

module.exports = UserRecipes;