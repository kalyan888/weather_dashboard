const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        // console.log(`MongoDB connected to database ${mongoose.connection.host}`)
        // const dbName = mongoose.connection.name || 'No specific database selected';
        // console.log(`MongoDB connected to database ${dbName}`);
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

module.exports = connectDB