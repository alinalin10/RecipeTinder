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

//signup user
const signupUser = async (req, res) => {
    const { firstname, lastname, username, email, password} = req.body;

    try 
    {
        const user = await User.signup(firstname, lastname, username, email, password)

        //create token
        const token = createToken(user._id)

        res.status(200).json({
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


module.exports = {signupUser, loginUser }