require('dotenv').config()


const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user')
const userRecipeRoutes = require('./routes/User-Recipe-Routes');
const swipeRoutes = require('./routes/swipe');
const recipeRoutes = require('./routes/recipes')
const spoonacularRoutes = require('./routes/spoonacular');

/*debug for .env secret JWT signature not being held secret

console.log('=== Environment Debug ===');
console.log('SECRET loaded:', !!process.env.SECRET);
console.log('SECRET value:', process.env.SECRET);
console.log('=========================');
*/

const app = express();

const PORT = process.env.PORT;

// Middleware
app.use(cors())             // Allow cross-origin requests
app.use(express.json({ limit: '10mb' }))     // Parse JSON request bodies
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/user', userRoutes)
app.use('/api/userrecipes', userRecipeRoutes);
app.use('/api/swipe', swipeRoutes);
app.use('/api/recipes', recipeRoutes)
app.use('/api/spoonacular', spoonacularRoutes);

// Basic test route
app.get('/', (req, res) => {
    res.json({ msg: 'Welcome to RecipeTinder API' })
})

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
})
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((error) => {
    console.log('MongoDB connection error:', error)
})
