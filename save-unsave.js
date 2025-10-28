// Save a recipe to user's saved recipes
const saveRecipe = async (req, res) => {
    try {
        const { userId } = req.params;
        const { recipeId, recipeType = 'spoonacular' } = req.body;

        if (!recipeId) {
            return res.status(400).json({ error: 'Recipe ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if recipe is already saved
        const existingRecipe = await SavedRecipes.findOne({
            userId,
            recipeId,
            recipeType
        });

        if (existingRecipe) {
            return res.status(400).json({ error: 'Recipe already saved' });
        }

        // Validate the recipe exists
        if (recipeType === 'spoonacular') {
            await spoonacularService.getRecipeById(parseInt(recipeId));
        } else if (recipeType === 'userMade') {
            const userRecipe = await UserRecipes.findById(recipeId);
            if (!userRecipe) {
                return res.status(404).json({ error: 'User-made recipe not found' });
            }
        }

        // Create new saved recipe document
        const savedRecipe = new SavedRecipes({
            userId,
            recipeId,
            recipeType,
            savedAt: new Date()
        });

        await savedRecipe.save();

        // Also add reference to user's savedRecipes array
        await User.findByIdAndUpdate(userId, { 
            $push: { savedRecipes: savedRecipe._id } 
        });

        res.json({ 
            message: 'Recipe saved successfully',
            savedRecipe: {
                recipeType,
                recipeId,
                savedAt: savedRecipe.savedAt
            }
        });
    } catch (error) {
        console.error('Error saving recipe:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Remove a recipe from user's saved recipes
const unsaveRecipe = async (req, res) => {
    try {
        const { userId } = req.params;
        const { recipeId, recipeType = 'spoonacular' } = req.body;

        if (!recipeId) {
            return res.status(400).json({ error: 'Recipe ID is required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find and remove the recipe from SavedRecipes collection
        const savedRecipe = await SavedRecipes.findOne({
            userId,
            recipeId,
            recipeType
        });

        if (!savedRecipe) {
            return res.status(404).json({ error: 'Recipe not found in saved recipes' });
        }

        // Remove from SavedRecipes collection
        await SavedRecipes.findByIdAndDelete(savedRecipe._id);

        // Also remove reference from user's savedRecipes array
        await User.findByIdAndUpdate(userId, { 
            $pull: { savedRecipes: savedRecipe._id } 
        });

        res.json({ message: 'Recipe removed from saved recipes' });
    } catch (error) {
        console.error('Error removing saved recipe:', error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get user's saved recipes with full details
const getUserSavedRecipes = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get all saved recipes for this user
        const userSavedRecipes = await SavedRecipes.find({ userId });
        const savedRecipes = [];

        for (const savedRecipe of userSavedRecipes) {
            try {
                let recipeDetails;

                if (savedRecipe.recipeType === 'spoonacular') {
                    recipeDetails = await spoonacularService.getRecipeById(savedRecipe.recipeId);
                    recipeDetails.recipeType = 'spoonacular';
                } else if (savedRecipe.recipeType === 'userMade') {
                    const userRecipe = await UserRecipes.findById(savedRecipe.recipeId);
                    if (userRecipe) {
                        recipeDetails = {
                            ...userRecipe.toObject(),
                            recipeType: 'userMade'
                        };
                    }
                }

                if (recipeDetails) {
                    savedRecipes.push({
                        ...recipeDetails,
                        savedAt: savedRecipe.savedAt
                    });
                }
            } catch (error) {
                console.error(`Error fetching details for recipe ${savedRecipe.recipeId}:`, error.message);
                // Continue with other recipes even if one fails
            }
        }

        res.json(savedRecipes);
    } catch (error) {
        console.error('Error getting user saved recipes:', error.message);
        res.status(500).json({ error: error.message });
    }
};