const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;


const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true },
    emailNorm:  { type: String, required: true, unique: true, index: true },   // emailNorm = email.toLowerCase().trim(), for case-insensitive search
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },


    recipes: [{
        spoonacularId: { type: Number, required: true }, // ID from Spoonacular
        title: { type: String, required: true },
        image: { type: String },
        ingredients: { type: [String], required: true }, 
        instructions: { type: String, required: true },
        time: { type: Number },
    }],

    //embedded documents: pantry items and preferences below
    preferences: preferences,
    pantry: [pantryItems],

});

const pantryItems = new Schema({
  name: { type: String, required: true },     // displayed name
  normName: { type: String, required: true },     // normalized name (lowercase/singular)
  qty: { type: Number },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false });

const preferences = new Schema({
  dietary: {
    diets: [String],                      // ex: "vegan","gluten free", "vegetarian"
    allergies: [String],                  // ex: "peanuts","shellfish"
    excludeIngredients: [String],
  },
  time: { type: Number, default: 60 },
  
  cuisines: { like: [String], dislike: [String] },
  /*
  // this field depends on api we use
  nutritionTargets: { caloriesMax: Number, proteinMin: Number },
  */
  visibility: { publicLists: { type: Boolean, default: false } }
}, { _id: false });



module.exports = model('User', userSchema);
//'users' collection in mongoDB database
