const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
    getRandomRecipes,
    searchRecipes,
    getRecipeById,
    getSimilarRecipes,
    getRecipesByIngredients
} = require('../services/spoonacularService');
const {
    getPersonalizedRecommendations,
    getRandomRecommendations
} = require('../services/recommendationService');
const User = require('../models/userModel');

// GET /api/recipes/random - Get random recipes (personalized if user is authenticated)
// Query params: number (default 10), tags (optional, comma-separated)
router.get('/random', async (req, res) => {
    try {
        const { number = 10 } = req.query;

        // Check if user is authenticated (optional)
        const { authorization } = req.headers;
        let userId = null;

        if (authorization) {
            try {
                const token = authorization.split(' ')[1];
                const { _id } = jwt.verify(token, process.env.SECRET);
                userId = _id;
            } catch (err) {
                // Token invalid or expired, continue with random recipes
                console.log('⚠️  Invalid token, using random recipes');
            }
        }

        // If user is authenticated, get personalized recommendations
        if (userId) {
            const user = await User.findById(userId).select('preferences');

            if (user && user.preferences) {
                console.log('🎯 Fetching personalized random recipes for user:', userId);
                const recipes = await getPersonalizedRecommendations(user.preferences, number);
                return res.status(200).json({ success: true, data: recipes });
            }
        }

        // Fallback to random recommendations (no auth or no preferences)
        console.log('🎲 Fetching truly random recipes');
        const recipes = await getRandomRecommendations(number);
        res.status(200).json({ success: true, data: recipes });
    } catch (error) {
        console.error('❌ Error in /random:', error);
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
