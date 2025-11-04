const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

//token function
const createToken = (_id) => 
{
    //also ask alina about how to remove emailNorm from MongoDB, i cant do in connection bc i dont have access
    //ask alina about this
    const secret = process.env.SECRET //|| '123recipeswipefood482tind3rleftRight331'
    console.log('SECRET exists:', !!process.env.SECRET);
   return jwt.sign({ _id}, secret, {expiresIn: '3d' })
}


//login user
const loginUser = async (req, res) => {
    const {email, password} = req.body

    try 
    {
        const user = await User.login(email, password)

        //create token
        const token = createToken(user._id)

        res.status(200).json({
            userId: user._id,
            email: user.email,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            token,
            message: 'User logged in successfully'
        })
    }
    catch(error) 
    {
        res.status(400).json({error: error.message})
    }
}

//signup user
const signupUser = async (req, res) => {
    const { firstname, lastname, username, email, password} = req.body;

    try 
    {
        const user = await User.signup(firstname, lastname, username, email, password)

        //create token
        const token = createToken(user._id)

        res.status(200).json({
            userId: user._id,
            email: user.email,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            token,
            message: 'User created successfully'
        })
    }
    catch(error) 
    {
        res.status(400).json({error: error.message})
    }

}


//update user preferences
const updateUserPreferences = async (req, res) => {
    const { userId } = req.params;
    const { dietary, cuisines } = req.body;

    try {
        // Find user and update preferences
        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    'preferences.dietary': dietary,
                    'preferences.cuisines': cuisines
                }
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({
            message: 'Preferences updated successfully',
            preferences: user.preferences
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//get user preferences
const getUserPreferences = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).select('preferences');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.preferences);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {signupUser, loginUser, updateUserPreferences, getUserPreferences }