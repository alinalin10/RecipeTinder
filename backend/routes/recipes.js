const express = require('express');
const router = express.Router();
const {
    getRandomRecipes,
    searchRecipes,
    getRecipeById,
    getSimilarRecipes,
    getRecipesByIngredients
} = require('../services/spoonacularService');
const mongoose = require('mongoose');
const UserRecipes = mongoose.model('UserRecipes');

// GET /api/recipes/random - Get random recipes
// Query params: number (default 10), tags (optional, comma-separated)
router.get('/random', async (req, res) => {
    try {
        const { number = 10, tags = '' } = req.query;
        const recipes = await getRandomRecipes(number, tags);
        res.status(200).json({ success: true, data: recipes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/recipes/search - Search recipes
// Query params: query, cuisine, diet, intolerances, number
router.get('/search', async (req, res) => {
    try {
        const { query, cuisine = '', diet = '', intolerances = '', number = 10 } = req.query;

        if (!query) {
            return res.status(400).json({ success: false, error: 'Query parameter is required' });
        }

        const recipes = await searchRecipes(query, cuisine, diet, intolerances, number);
        res.status(200).json({ success: true, data: recipes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/recipes/:id - Get recipe details by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // First, try to find in local database (user-made recipes)
        try {
            const userRecipe = await UserRecipes.findById(id);
            if (userRecipe) {
                return res.status(200).json({ success: true, data: userRecipe });
            }
        } catch (err) {
            // If it's not a valid MongoDB ObjectId, it might be a Spoonacular ID
            console.log('Not a MongoDB ID, trying Spoonacular...');
        }
        
        // If not found locally, try Spoonacular
        const recipe = await getRecipeById(id);
        res.status(200).json({ success: true, data: recipe });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/recipes/:id/similar - Get similar recipes
router.get('/:id/similar', async (req, res) => {
    try {
        const { id } = req.params;
        const { number = 5 } = req.query;
        const recipes = await getSimilarRecipes(id, number);
        res.status(200).json({ success: true, data: recipes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET /api/recipes/ingredients/find - Find recipes by ingredients
// Query params: ingredients (comma-separated), number
router.get('/ingredients/find', async (req, res) => {
    try {
        const { ingredients, number = 10 } = req.query;

        if (!ingredients) {
            return res.status(400).json({ success: false, error: 'Ingredients parameter is required' });
        }

        const recipes = await getRecipesByIngredients(ingredients, number);
        res.status(200).json({ success: true, data: recipes });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
