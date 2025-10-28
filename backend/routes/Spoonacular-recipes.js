// recipe routes
const express = require('express');
const router = express.Router();
const { validateApiKey } = require('../middleware/apiValidation');

const {
    getRecipeById,
    getRecipesByIngredients,
    getPersonalizedRecipes,
    getRecipesFromPantry
} = require('../controllers/recipeController');

// API key validation to all routes that use Spoonacular
router.use(validateApiKey);

// GET /api/recipes/by-ingredients
router.post('/by-ingredients', getRecipesByIngredients);

// GET /api/recipes/:id?type=spoonacular
router.get('/:id', getRecipeById);

// GET /api/recipes/users/:userId/personalized?number=12
router.get('/users/:userId/personalized', getPersonalizedRecipes);

// GET /api/recipes/users/:userId/from-pantry
router.get('/users/:userId/from-pantry', getRecipesFromPantry);

module.exports = router;

/* // GET /api/recipes/random?number=10
router.get('/random', getRandomRecipes);
*/