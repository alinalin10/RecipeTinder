const spoonacularService = require('./spoonacularService');
const UserRecipes = require('../models/User-Recipes');

/**
 * Recommendation Service
 *
 * Provides personalized recipe recommendations based on user preferences
 *
 * Weighting System:
 * 1. Excluded Ingredients/Allergies (HIGHEST) - Hard filter, recipes with these are excluded
 * 2. Diet (MEDIUM) - Recipes matching diet get +50 score
 * 3. Cuisine (LOWEST) - Recipes matching cuisine get +20 score
 */

/**
 * Get personalized recommendations for a user
 * @param {Object} userPreferences - User's dietary preferences
 * @param {number} number - Number of recipes to return
 * @returns {Promise<Array>} - Array of recommended recipes with scores
 */
const getPersonalizedRecommendations = async (userPreferences, number = 10) => {
    try {
        console.log('🎯 Getting personalized recommendations for user:', userPreferences);

        // Extract preferences
        const { dietary = {}, cuisines = {} } = userPreferences;
        const { diets = [], allergies = [], excludeIngredients = [] } = dietary;
        const { like: preferredCuisines = [] } = cuisines;

        // Combine allergies and excluded ingredients for filtering user-made recipes
        const excludedItems = [...new Set([...allergies, ...excludeIngredients])];

        // Build Spoonacular API parameters (separate intolerances from excluded ingredients)
        const spoonacularParams = {
            diet: diets.join(',').toLowerCase(),
            cuisine: preferredCuisines.join(','),
            intolerances: allergies.join(','),  // Allergies/intolerances only
            excludeIngredients: excludeIngredients.join(','),  // Excluded ingredients only
            number: Math.ceil(number * 0.5) // Get 50% from Spoonacular, rest from user-made
        };

        console.log('📡 Spoonacular parameters:', spoonacularParams);

        // Fetch Spoonacular recipes with preferences
        let spoonacularRecipes = [];
        try {
            spoonacularRecipes = await spoonacularService.searchRecipes(
                '', // Empty query to get general results
                spoonacularParams.cuisine,
                spoonacularParams.diet,
                spoonacularParams.intolerances,
                spoonacularParams.excludeIngredients,
                spoonacularParams.number
            );
        } catch (error) {
            console.warn('⚠️  Spoonacular API error, using fallback:', error.message);
            // Fallback to random recipes if search fails
            spoonacularRecipes = await spoonacularService.getRandomRecipes(spoonacularParams.number);
        }

        // Score Spoonacular recipes
        const scoredSpoonacularRecipes = spoonacularRecipes.map(recipe => ({
            ...recipe,
            source: 'spoonacular',
            score: scoreSpoonacularRecipe(recipe, userPreferences)
        }));

        // Fetch user-made recipes
        const userMadeRecipes = await UserRecipes.find({});

        // Filter and score user-made recipes
        const scoredUserMadeRecipes = userMadeRecipes
            .filter(recipe => filterUserRecipe(recipe, excludedItems))
            .map(recipe => ({
                ...recipe.toObject(),
                source: 'userMade',
                score: scoreUserRecipe(recipe, userPreferences)
            }));

        console.log(`📊 Scored ${scoredSpoonacularRecipes.length} Spoonacular + ${scoredUserMadeRecipes.length} user-made recipes`);

        // Combine all recipes
        const allRecipes = [...scoredSpoonacularRecipes, ...scoredUserMadeRecipes];

        // Separate recipes into tiers based on score
        const highScore = allRecipes.filter(r => r.score >= 50); // Strong match
        const mediumScore = allRecipes.filter(r => r.score >= 20 && r.score < 50); // Medium match
        const lowScore = allRecipes.filter(r => r.score > 0 && r.score < 20); // Weak match
        const zeroScore = allRecipes.filter(r => r.score === 0); // No match

        // Shuffle each tier using Fisher-Yates algorithm
        const shuffle = (array) => {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        };

        // Weight distribution: 50% high, 30% medium, 15% low, 5% zero
        const recipesToSelect = [];
        const highCount = Math.ceil(number * 0.5);
        const mediumCount = Math.ceil(number * 0.3);
        const lowCount = Math.ceil(number * 0.15);

        // Add shuffled recipes from each tier
        recipesToSelect.push(...shuffle(highScore).slice(0, highCount));

        // Fill remaining slots from lower tiers if high tier doesn't have enough
        const remaining1 = highCount - recipesToSelect.length;
        if (remaining1 > 0) {
            recipesToSelect.push(...shuffle(mediumScore).slice(0, mediumCount + remaining1));
        } else {
            recipesToSelect.push(...shuffle(mediumScore).slice(0, mediumCount));
        }

        const remaining2 = number - recipesToSelect.length;
        if (remaining2 > 0) {
            recipesToSelect.push(...shuffle(lowScore).slice(0, Math.min(lowCount, remaining2)));
        }

        const remaining3 = number - recipesToSelect.length;
        if (remaining3 > 0) {
            recipesToSelect.push(...shuffle(zeroScore).slice(0, remaining3));
        }

        // Final shuffle of selected recipes for complete randomness
        const finalRecipes = shuffle(recipesToSelect).slice(0, number);

        console.log(`✅ Returning ${finalRecipes.length} random personalized recipes:`,
            `High:${highScore.length}, Med:${mediumScore.length}, Low:${lowScore.length}, Zero:${zeroScore.length}`
        );

        return finalRecipes;

    } catch (error) {
        console.error('❌ Error in getPersonalizedRecommendations:', error);
        throw error;
    }
};

/**
 * Score a Spoonacular recipe based on user preferences
 * @param {Object} recipe - Spoonacular recipe object
 * @param {Object} userPreferences - User preferences
 * @returns {number} - Score (higher is better)
 */
function scoreSpoonacularRecipe(recipe, userPreferences) {
    let score = 0;
    const { dietary = {}, cuisines = {} } = userPreferences;
    const { diets = [] } = dietary;
    const { like: preferredCuisines = [] } = cuisines;

    // Diet match (+50 points each)
    if (recipe.diets && Array.isArray(recipe.diets)) {
        const matchingDiets = recipe.diets.filter(diet =>
            diets.some(userDiet => diet.toLowerCase().includes(userDiet.toLowerCase()))
        );
        score += matchingDiets.length * 50;
    }

    // Cuisine match (+20 points each)
    if (recipe.cuisines && Array.isArray(recipe.cuisines)) {
        const matchingCuisines = recipe.cuisines.filter(cuisine =>
            preferredCuisines.some(userCuisine =>
                cuisine.toLowerCase().includes(userCuisine.toLowerCase())
            )
        );
        score += matchingCuisines.length * 20;
    }

    // Bonus for healthScore if available (+0-10 points)
    if (recipe.healthScore) {
        score += Math.floor(recipe.healthScore / 10);
    }

    return score;
}

/**
 * Filter user-made recipe (hard exclusion)
 * @param {Object} recipe - User recipe object
 * @param {Array} excludedItems - Items to exclude
 * @returns {boolean} - True if recipe is safe to show
 */
function filterUserRecipe(recipe, excludedItems) {
    if (!excludedItems || excludedItems.length === 0) return true;
    if (!recipe.ingredients || recipe.ingredients.length === 0) return true;

    // Check if any ingredient contains excluded items
    const recipeIngredients = recipe.ingredients.join(' ').toLowerCase();

    for (const excluded of excludedItems) {
        if (recipeIngredients.includes(excluded.toLowerCase())) {
            return false; // Recipe contains excluded ingredient
        }
    }

    // Check allergens field if it exists
    if (recipe.allergens && recipe.allergens.length > 0) {
        for (const allergen of recipe.allergens) {
            if (excludedItems.some(item => item.toLowerCase().includes(allergen.toLowerCase()))) {
                return false;
            }
        }
    }

    return true; // Safe to show
}

/**
 * Score a user-made recipe based on user preferences
 * @param {Object} recipe - User recipe object
 * @param {Object} userPreferences - User preferences
 * @returns {number} - Score (higher is better)
 */
function scoreUserRecipe(recipe, userPreferences) {
    let score = 0;
    const { dietary = {}, cuisines = {} } = userPreferences;
    const { diets = [] } = dietary;
    const { like: preferredCuisines = [] } = cuisines;

    // Diet match (+50 points each)
    if (recipe.diet && Array.isArray(recipe.diet)) {
        const matchingDiets = recipe.diet.filter(diet =>
            diets.some(userDiet => diet.toLowerCase().includes(userDiet.toLowerCase()))
        );
        score += matchingDiets.length * 50;
    }

    // Cuisine match (+20 points)
    if (recipe.cuisine && preferredCuisines.length > 0) {
        const matchesCuisine = preferredCuisines.some(userCuisine =>
            recipe.cuisine.toLowerCase().includes(userCuisine.toLowerCase())
        );
        if (matchesCuisine) score += 20;
    }

    // Bonus for difficulty (prefer easier recipes, +5-15 points)
    if (recipe.difficulty) {
        score += (5 - recipe.difficulty) * 3; // Lower difficulty = higher score
    }

    return score;
}

/**
 * Get random recipes (fallback when no preferences available)
 * @param {number} number - Number of recipes
 * @returns {Promise<Array>} - Array of recipes
 */
const getRandomRecommendations = async (number = 10) => {
    try {
        // Get mix of Spoonacular and user-made recipes (50/50 split)
        const spoonacularRecipes = await spoonacularService.getRandomRecipes(Math.ceil(number * 0.5));
        const userMadeRecipes = await UserRecipes.find({}).limit(Math.ceil(number * 0.5));

        const allRecipes = [
            ...spoonacularRecipes.map(r => ({ ...r, source: 'spoonacular', score: 0 })),
            ...userMadeRecipes.map(r => ({ ...r.toObject(), source: 'userMade', score: 0 }))
        ];

        // Shuffle array
        for (let i = allRecipes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allRecipes[i], allRecipes[j]] = [allRecipes[j], allRecipes[i]];
        }

        return allRecipes.slice(0, number);
    } catch (error) {
        console.error('Error in getRandomRecommendations:', error);
        throw error;
    }
};

module.exports = {
    getPersonalizedRecommendations,
    getRandomRecommendations
};
