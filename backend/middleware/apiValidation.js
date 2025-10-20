// validate Spoonacular API key
const validateApiKey = (req, res, next) => {
    if (!process.env.SPOONACULAR_API_KEY || process.env.SPOONACULAR_API_KEY === 'your_spoonacular_api_key_here') {
        return res.status(500).json({ 
            error: 'Spoonacular API key not configured. Please set SPOONACULAR_API_KEY in your .env file.' 
        });
    }
    next();
};

module.exports = { validateApiKey };