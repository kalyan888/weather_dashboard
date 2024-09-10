const express = require('express');
const router = express.Router();
const { storiesGetController, storiesPostController } = require('../controllers/storiesController');

// Route to get all stories
router.get('/stories', storiesGetController);

// Route to add a new story
router.post('/stories', storiesPostController);

module.exports = router;
