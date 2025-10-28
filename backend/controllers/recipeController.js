// Handles requests
const spoonacularService = require('../services/spoonacularService');
const User = require('../models/userModel');
const UserRecipes = require('../models/User-Recipes');
const SavedRecipes = require('../models/savedRecipes');

// Get recipe by ID both Spoonacular and user-made recipes
const getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.query; // type 'spoonacular' or 'userMade'

        let recipe;

        if (type === 'userMade') {
            recipe = await UserRecipes.findById(id);
            if (!recipe) {
                return res.status(404).json({ error: 'User-made recipe not found' });
            }
            recipe = { ...recipe.toObject(), recipeType: 'userMade' };
        } else {
            // Spoonacular recipe
            recipe = await spoonacularService.getRecipeById(parseInt(id));
            recipe.recipeType = 'spoonacular';
        }

        res.json(recipe);
    } catch (error) {
        console.error('Error getting recipe by ID:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get recipes by ingredients
const getRecipesByIngredients = async (req, res) => {
    try {
        const { ingredients } = req.body;
        const filters = req.query;

        if (!ingredients || ingredients.length === 0) {
            return res.status(400).json({ error: 'Ingredients are required' });
        }

        const recipes = await spoonacularService.getRecipesByIngredients(ingredients, filters);
        res.json(recipes);
    } catch (error) {
        console.error('Error getting recipes by ingredients:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get personalized recipes based on user preferences
const getPersonalizedRecipes = async (req, res) => {
    try {
        const { userId } = req.params;
        const filters = req.query;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const recipes = await spoonacularService.getRecipesUserPref(user.preferences, filters);
        res.json(recipes);
    } catch (error) {
        console.error('Error getting personalized recipes:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get recipes from user's pantry ingredients
const getRecipesFromPantry = async (req, res) => {
    try {
        const { userId } = req.params;
        const filters = req.query;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.pantry || user.pantry.length === 0) {
            return res.json({ message: 'No pantry items found', recipes: [] });
        }

        const ingredients = user.pantry.map(item => item.name);
        const recipes = await spoonacularService.getRecipesByIngredients(ingredients, filters);
        
        res.json({
            pantryIngredients: ingredients,
            recipes
        });
    } catch (error) {
        console.error('Error getting recipes from pantry:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// save recipe, unsave recipe, get user saved recipes


module.exports = {
    getRecipeById,
    getRecipesByIngredients,
    getPersonalizedRecipes,
    getRecipesFromPantry
};

/* // Get random recipes
const getRandomRecipes = async (req, res) => {
    try {
        const filters = req.query;
        const recipes = await spoonacularService.getRandomRecipes(filters);
        res.json(recipes);
    } catch (error) {
        console.error('Error getting random recipes:', error.message);
        res.status(500).json({ error: error.message });
    }
};
*/