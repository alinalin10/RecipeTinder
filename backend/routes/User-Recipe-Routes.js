const express = require('express')

const router = express.Router()
const UserRecipes = require('../models/User-Recipes')

// GET all usermade recipes
router.get('/', (req, res) => {
    res.json({msg: "GET all usermade recipes"})
})

// GET specific usermade recipe
router.get('/:id', (req, res) => {
    res.json({msg: `GET recipe with ID ${req.params.id}`})
})

// POST usermade recipe
router.post('/', async (req, res) => {
  try {
    const {
      title,
      course,
      servings,
      description,
      prepTime,
      cookTime,
      calories,
      difficulty,
      steps,
      ingredients,
      newIngredient,
      image
    } = req.body

    const recipe = await UserRecipes.create({
      title,
      course,
      servings,
      description,
      prepTime,
      cookTime,
      calories,
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