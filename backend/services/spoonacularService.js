const axios = require('axios');

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

// Get random recipes
const getRandomRecipes = async (number = 5, tags = '') => {
    try {
        console.log('Fetching random recipes with API key:', SPOONACULAR_API_KEY);
        const response = await axios.get(`${BASE_URL}/random`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                number: number,
                tags: tags,
                includeNutrition: true  // Include nutrition information (calories, etc.)
            }
        });
        console.log('Successfully fetched recipes:', response.data.recipes.length);
        return response.data.recipes;
    } catch (error) {
        console.error('Error fetching random recipes:',  error.response?.data || error.message);
        throw new Error('Failed to fetch random recipes from Spoonacular');
    }
};

// Search recipes by query
const searchRecipes = async (query, cuisine = '', diet = '', intolerances = '', number = 5) => {
    try {
        const response = await axios.get(`${BASE_URL}/complexSearch`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                query: query,
                cuisine: cuisine,
                diet: diet,
                intolerances: intolerances,
                number: number,
                addRecipeInformation: true,
                fillIngredients: true
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('Error searching recipes:', error.message);
        throw new Error('Failed to search recipes from Spoonacular');
    }
};

// Get recipe details by ID
const getRecipeById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}/information`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                includeNutrition: false
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipe by ID:', error.message);
        throw new Error('Failed to fetch recipe details from Spoonacular');
    }
};

// Get similar recipes
const getSimilarRecipes = async (id, number = 5) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}/similar`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                number: number
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching similar recipes:', error.message);
        throw new Error('Failed to fetch similar recipes from Spoonacular');
    }
};

// Get recipes by ingredients
const getRecipesByIngredients = async (ingredients, number = 5) => {
    try {
        const response = await axios.get(`${BASE_URL}/findByIngredients`, {
            params: {
                apiKey: SPOONACULAR_API_KEY,
                ingredients: ingredients,
                number: number,
                ranking: 2, // Maximize used ingredients
                ignorePantry: true
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipes by ingredients:', error.message);
        throw new Error('Failed to fetch recipes by ingredients from Spoonacular');
    }
};

module.exports = {
    getRandomRecipes,
    searchRecipes,
    getRecipeById,
    getSimilarRecipes,
    getRecipesByIngredients
};
