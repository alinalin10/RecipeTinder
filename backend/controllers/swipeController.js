// controllers/recipeController.js
const SavedRecipe = require('../models/savedRecipes');

// Save/Update a recipe
const saveRecipe = async (req, res) => {
    try {
        const { recipeId, recipeType, action, recipeTitle } = req.body;
        const userId = req.user.id;
        
        // Validate enum values (schema doesn't enforce these)
        if (recipeType && !['spoonacular', 'userMade'].includes(recipeType)) {
            return res.status(400).json({ 
                error: 'recipeType must be either "spoonacular" or "userMade"' 
            });
        }

        if (action && !['liked', 'bookmarked'].includes(action)) {
            return res.status(400).json({ 
                error: 'action must be either "liked" or "bookmarked"' 
            });
        }

        // Use findOneAndUpdate with upsert to avoid duplicates
        const savedRecipe = await SavedRecipe.findOneAndUpdate(
            { 
                UserId: userId, 
                recipeId: recipeId 
            },
            { 
                UserId: userId,
                recipeId,
                recipeType,
                action,
                recipeTitle,
                savedAt: new Date()
            },
            { 
                upsert: true, 
                new: true,
                setDefaultsOnInsert: true
            }
        );
        
        res.json({ success: true, savedRecipe });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({ 
                error: 'Recipe already saved by this user' 
            });
        }
        res.status(500).json({ error: error.message });
    }
};

// Get all saved recipes for current user with filtering and sorting
const getSavedRecipes = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            action,           // Filter: 'liked' or 'bookmarked'
            alphabetical,     // Sort: 'true' for alphabetical, 'false' or undefined for newest first
            page = 1, 
            limit = 20 
        } = req.query;
        
        // Build query
        const query = { UserId: userId };
        
        // Filter by action if specified
        if (action) {
            if (!['liked', 'bookmarked'].includes(action)) {
                return res.status(400).json({ 
                    error: 'action must be "liked" or "bookmarked"' 
                });
            }
            query.action = action;
        }
        
        // Determine sort order - alphabetical or newest first (default)
        const sortOptions = alphabetical === 'true' 
            ? { recipeTitle: 1 } 
            : { savedAt: -1 }
        
        // Execute query with pagination
        const savedRecipes = await SavedRecipe.find(query)
            .sort(sortOptions)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .lean(); // Use lean() for better performance when not modifying documents
        
        // Get total count for pagination
        const total = await SavedRecipe.countDocuments(query);
        
        res.json({
            success: true,
            recipes: savedRecipes,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            },
            filters: {
                action: action || 'none',
                alphabetical: alphabetical === 'true'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Delete a saved recipe
const deleteSavedRecipe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { recipeId } = req.params;
        
        const deletedRecipe = await SavedRecipe.findOneAndDelete({
            UserId: userId,
            recipeId
        });
        
        if (!deletedRecipe) {
            return res.status(404).json({ 
                error: 'Recipe not found in saved recipes' 
            });
        }
        
        res.json({ 
            success: true, 
            message: 'Recipe removed from saved recipes',
            deletedRecipe 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    saveRecipe,
    getSavedRecipes,
    deleteSavedRecipe
};