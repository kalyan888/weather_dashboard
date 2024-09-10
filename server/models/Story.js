// models/Story.js
const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  },
  location: {
    type: String,
    required: [true, 'location is required']
  },
  description: {
    type: String,
    required: [true, 'description is required']
  },
  date: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('Story', storySchema, 'personal-stories');