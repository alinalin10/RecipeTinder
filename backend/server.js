require('dotenv').config()


const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoutes = require('./routes/user')

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
app.use(express.json())     // Parse JSON request bodies
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/user', userRoutes)

// Basic test route
app.get('/', (req, res) => {
    res.json({ msg: 'Welcome to RecipeTinder API' })
})

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})
.catch((error) => {
    console.log('MongoDB connection error:', error)
})
