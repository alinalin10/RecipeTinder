const express = require('express')

//controller functions
const { signupUser, loginUser, updateUserPreferences, getUserPreferences } = require('../controllers/userController')

//makes an instance of the express router
const router = express.Router()

//login route
router.post('/login', loginUser)

//signup route
router.post('/signup', signupUser)

// update user preferences
router.patch('/:userId/preferences', updateUserPreferences)

// get user preferences
router.get('/:userId/preferences', getUserPreferences)

// debug ping route to verify routing and server reachability
router.get('/ping', (req, res) => {
	res.json({ ok: true, path: req.path, method: req.method })
})

module.exports = router
