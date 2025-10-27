const express = require('express')

const router = express.Router()
const UserRecipes = require('../models/User-Recipes')

// GET all usermade recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await UserRecipes.find({}).sort({ createdAt: -1 });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve recipes", error: error.message });
  }
  /*UserRecipes.find({})
    .then(recipes => {
      res.status(200).json({ recipes });
    })
    .catch(error => {
      res.status(500).json({ message: "Failed to retrieve recipes", error });
    });*/
    //res.json({msg: "GET all usermade recipes"})
})

// GET specific usermade recipe
router.get('/:id', async (req, res) => {
  try {
    const recipe = await UserRecipes.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
    //res.json({msg: `GET recipe with ID ${req.params.id}`})
})

// POST usermade recipe
router.post('/', async (req, res) => {
  try {
    const {
      title,
      user,
      course,
      servings,
      description,
      prepTime,
      cookTime,
      calories,
      cuisine,
      difficulty,
      steps,
      ingredients,
      newIngredient,
      image
    } = req.body

    const recipe = await UserRecipes.create({
      title,
      user,
      course,
      servings,
      description,
      prepTime,
      cookTime,
      calories,
      cuisine,
      difficulty,
      steps,
      ingredients,
      newIngredient,
      image
    })

    res.status(201).json(recipe)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// DELETE specific usermade recipe
router.delete('/:id', (req, res) => {
    res.json({msg: "DELETE a specific usermade recipe"})
})

// PATCH specific usermade recipe
router.patch('/:id', (req, res) => {
    res.json({msg: "UPDATE a specific usermade recipe"})
})


module.exports = router