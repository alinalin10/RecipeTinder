const express = require('express')

const router = express.Router()

// GET all usermade recipes
router.get('/', (req, res) => {
    res.json({msg: "GET all usermade recipes"})
})

// GET specific usermade recipe
router.get('/:id', (req, res) => {
    res.json({msg: `GET recipe with ID ${req.params.id}`})
})

// POST usermade recipe
router.post('/', (req, res) => {
    res.json({msg: "POST a new usermade recipe"})
})

// DELETE specific usermade recipe
router.delete('/:id', (req, res) => {
    res.json({msg: "DELETE a specific usermade recipe"})
})

// PATCH specific usermade recipe
router.patch('/:id', (req, res) => {
    res.json({msg: "UPDATE a specific usermade recipe"})
})


module.exports = router