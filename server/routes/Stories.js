const express = require('express');
const router = express.Router();
const { storiesGetController, storiesPostController } = require('../controllers/storiesController');

// Route to get all stories
router.get('/api/stories', storiesGetController);

// Route to add a new story
router.post('/api/stories', storiesPostController);

module.exports = router;
