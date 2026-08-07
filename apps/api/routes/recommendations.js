const express = require('express');
const router = express.Router();
const {
  getRecommendations,
} = require('../controllers/recommendation.controller');

// Public stub — optional JWT personalization can wrap this later
router.get('/recommendations', getRecommendations);

module.exports = router;
