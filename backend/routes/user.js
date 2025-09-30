const express = require('express')

//controller function
const {signupUser, loginUser} = require('../controllers/userController')

//makes an instance of the express router
const router = express.Router()

module.exports = router

//login route
router.post('/login', loginUser)

//signup route
router.post('/signup', signupUser)

module.exports = router
