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
connectDB();

// Middleware to parse JSON
app.use(cors({ origin: process.env.REACT_APP_API_URL }))

app.use(morgan('dev')); // Dev dependency - status, time
app.use(express.json());

// Use routes
app.use('/personalStories', require('./routes/Stories'));


//Port
const PORT = process.env.PORT || 5000;
// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));