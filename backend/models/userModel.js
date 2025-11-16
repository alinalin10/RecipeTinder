const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const model = mongoose.model;
const bcrypt = require('bcrypt');
const validator = require('validator');

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
  
  cuisines: { like: [String]},
  /*
  // this field depends on api we use
  nutritionTargets: { caloriesMax: Number, proteinMin: Number },
  */
  visibility: { publicLists: { type: Boolean, default: false } }
}, { _id: false });



const userSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true, validate: [validator.isEmail, 'Please enter a valid email'], trim: true, lowercase: true },
    //emailNorm:  { type: String, required: true, unique: true, index: true },   // emailNorm = email.toLowerCase().trim(), for case-insensitive search
    
    password: { type: String, required: true, minLength: [6, 'Password must be at least 6 characters'] },
    createdAt: { type: Date, default: Date.now },

    // Direct reference to saved recipes
    savedRecipes: [{ type: Schema.Types.ObjectId, ref: 'SavedRecipe' }],

    //embedded documents: pantry items and preferences below
    preferences: preferences,
    pantry: [pantryItems],

});

    //static signup method
    userSchema.statics.signup = async function(firstname, lastname, username, email, password){

    const emailExists = await this.findOne({email})
    const usernameExists = await this.findOne({username})

      if (!firstname || !lastname || !username || !email || !password)
      {
        throw Error('All fields are required');
      }
      

      if (!validator.isEmail(email))
      {
        throw Error ('Email is not valid');
      }

      if (!validator.isStrongPassword(password))
      {
        throw Error('Password not strong enough');
      }
     
      if (emailExists)
      {
        throw Error('Email already in use')
      }

      if (usernameExists)
      {
        throw Error('Username already in use')
      }

      //hashing password
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)

      const user = await this.create({ 
        firstname,
        lastname,
        username,
        email,
        password: hash
      })
      return user;
    }

// static login metho
userSchema.statics.login = async function(email, password)
{
   if (!email || !password)
      {
        throw Error('All fields must be filled');
      }

    const user = await this.findOne({email})

    if (!user)
      {
        throw Error('Invalid email')
      }

      const match = await bcrypt.compare(password, user.password)

      if (!match)
      {
        throw Error ('Incorrect password')
      }

      return user

      
}

module.exports = model('User', userSchema);
//'users' collection in mongoDB database