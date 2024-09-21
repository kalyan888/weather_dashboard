const express = require('express');
const router = express.Router();
const { homePath, storiesGetController, storiesPostController } = require('../controllers/storiesController');

//Route to check server running
router.get('/api', homePath);

// Route to get all stories
router.get('/api/stories', storiesGetController);

// Route to add a new story
router.post('/api/stories', storiesPostController);

module.exports = router;
