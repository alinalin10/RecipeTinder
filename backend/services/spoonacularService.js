// Fetches data from spoonacular API
const axios = require('axios');

class SpoonacularService {
    constructor() {
        this.baseURL = 'https://api.spoonacular.com/recipes';
        this.apiKey = process.env.SPOONACULAR_API_KEY;
        
        if (!this.apiKey) {
            console.warn('Warning: SPOONACULAR_API_KEY not found in environment variables');
        }
    }

    // Get recipe by ID
    async getRecipeById(id) {
        try {
            const response = await axios.get(`${this.baseURL}/${id}/information`, {
                params: {
                    apiKey: this.apiKey,
                    includeNutrition: true
                }
            });
            return this.formatRecipeData(response.data);
        } catch (error) {
            console.error('Error fetching recipe by ID:', error.response?.data || error.message);
            throw new Error(`Failed to fetch recipe with ID ${id}`);
        }
    }

    // Get recipes by ingredients
    async getRecipesByIngredients(ingredients, filters = {}) {
        try {
            const params = {
                apiKey: this.apiKey,
                ingredients: Array.isArray(ingredients) ? ingredients.join(',') : ingredients,
                number: filters.number || 5,
                ranking: filters.ranking || 1,
                ignorePantry: filters.ignorePantry || true
            };

            const response = await axios.get(`${this.baseURL}/findByIngredients`, { params });
            
            // Get detailed information for each recipe
            const detailedRecipes = await Promise.all(
                response.data.map(async (recipe) => {
                    try {
                        return await this.getRecipeById(recipe.id);
                    } catch (error) {
                        console.error(`Error fetching details for recipe ${recipe.id}:`, error.message);
                        return this.formatRecipeData(recipe);
                    }
                })
            );

            return detailedRecipes;
        } catch (error) {
            console.error('Error finding recipes by ingredients:', error.response?.data || error.message);
            throw new Error('Failed to find recipes by ingredients');
        }
    }

    // Get recipes that match user preferences
    async getRecipesUserPref(userPreferences, filters = {}) {
        try {
            const params = {
                apiKey: this.apiKey,
                number: filters.number || 12,
                offset: filters.offset || 0,
                addRecipeInformation: true,
                fillIngredients: true
            };

            // Add dietary restrictions
            if (userPreferences.dietary?.diets?.length > 0) {
                params.diet = userPreferences.dietary.diets.join(',');
            }

            // Add allergies/intolerances
            if (userPreferences.dietary?.allergies?.length > 0) {
                params.intolerances = userPreferences.dietary.allergies.join(',');
            }

            // Add excluded ingredients
            if (userPreferences.dietary?.excludeIngredients?.length > 0) {
                params.excludeIngredients = userPreferences.dietary.excludeIngredients.join(',');
            }

            // Add cuisine preferences
            if (userPreferences.cuisines?.like?.length > 0) {
                params.cuisine = userPreferences.cuisines.like.join(',');
            }

            // Add max ready time
            if (userPreferences.time) {
                params.maxReadyTime = userPreferences.time;
            }

            const response = await axios.get(`${this.baseURL}/complexSearch`, { params });
            
            return {
                results: response.data.results.map(recipe => this.formatRecipeData(recipe)),
                totalResults: response.data.totalResults,
                offset: response.data.offset,
                number: response.data.number
            };
        } catch (error) {
            console.error('Error fetching recipes for user preferences:', error.response?.data || error.message);
            throw new Error('Failed to fetch personalized recipes');
        }
    }

    // Get 3 recipes similar to recipe id taken from User's saved recipes
    async getSimilarRecipes(id, number = 3) {
        // https://api.spoonacular.com/recipes/{id}/similar
        try {
            const response = await axios.get(`${this.baseURL}/${id}/similar`, {
                params: {
                    apiKey: this.apiKey,
                    number
                }
            });
            console.log('Similar recipes fetched successfully:', response.data);

            return response.data.map(recipe => this.formatRecipeData(recipe));
        } catch (error) {
            console.error('Error fetching similar recipes:', error.response?.data || error.message);
            throw new Error('Failed to fetch similar recipes');
        }
    }
    
    
    // Format recipe data/clean data for storing and sending to frontend
    formatRecipeData(recipe) {
        const formattedRecipe = {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes,
            servings: recipe.servings,
        };

        // Add ingredients if they exist
        if (recipe.extendedIngredients) {
            formattedRecipe.ingredients = recipe.extendedIngredients.map(ingredient => {
                return {
                    name: ingredient.name,
                    amount: ingredient.amount,
                    unit: ingredient.unit
                };
            });
        }

        // Add instructions if they exist
        if (recipe.analyzedInstructions && recipe.analyzedInstructions[0]) {
            formattedRecipe.instructions = recipe.analyzedInstructions[0].steps.map(step => {
                return step.step;
            });
        }

        return formattedRecipe;
    }

}

module.exports = new SpoonacularService();

    /*
    // Get random recipes
    async getRandomRecipes(filters = {}) {
        try {
            const params = {
                apiKey: this.apiKey,
                number: filters.number || 10,
                tags: filters.tags || '',
                includeNutrition: true
            };

            const response = await axios.get(`${this.baseURL}/random`, { params });
            
            return response.data.recipes.map(recipe => this.formatRecipeData(recipe));
        } catch (error) {
            console.error('Error fetching random recipes:', error.response?.data || error.message);
            throw new Error('Failed to fetch random recipes');
        }
    }
    */