// routes/swipe.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/requireAuth'); // Your auth middleware
const {
    saveRecipe,
    getSavedRecipes,
    deleteSavedRecipe
} = require('../controllers/swipeController');

// Save/Update a recipe (like or bookmark)
// POST /api/recipes/save
router.post('/save', auth, saveRecipe);

// Get all saved recipes for current user with filtering and sorting
// GET /api/recipes?action=liked&alphabetical=true&page=1&limit=20
router.get('/', auth, getSavedRecipes);

// Delete a saved recipe
// DELETE /api/recipes/:recipeId
router.delete('/:recipeId', auth, deleteSavedRecipe);

module.exports = router;