const express = require('express')

//controller function
const { signupUser, loginUser } = require('../controllers/userController')

//makes an instance of the express router
const router = express.Router()

//login route
router.post('/login', loginUser)

//signup route
router.post('/signup', signupUser)

// debug ping route to verify routing and server reachability
router.get('/ping', (req, res) => {
	res.json({ ok: true, path: req.path, method: req.method })
})

module.exports = router
