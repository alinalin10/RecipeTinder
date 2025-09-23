require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express();

const userRecipeRoutes = require("./routes/User-Recipe-Routes")

// middleware
app.use(express.json())

app.use((req, res, next)=> {
    console.log(req.path, req.method)
    next()
})

app.get('/', (req, res) => {
    res.json({msg: 'Welcome to RecipeTinder API'})
})

// routes
app.use('/api/user-recipes', userRecipeRoutes)

// connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for reqs
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })