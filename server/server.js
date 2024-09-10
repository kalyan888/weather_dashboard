// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv'); // Load environment variables
const connectDB = require('./config/db');
const app = express();

// Load environment variables from .env file
dotenv.config();

//DB Connection
connectDB()

// Middleware to parse JSON
// app.use(cors())
// app.use(cors({ origin: process.env.REACT_APP_API_URL }))
app.use(cors({
    origin: 'https://kalyan-weather-app-server.vercel.app'
}));

app.use(morgan('dev'))
app.use(express.json());

// Use routes
app.use('/personalStories', require('./routes/Stories'));


// app.get('/', (req, res) => {
//   return res.status(200).send('<h1>Welcome to Nodejs</h1>')
// })


//Port
const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));