const express = require('express');
const router = express.Router();
const {
  getStorefrontCategories,
} = require('../controllers/categories.controller');

// Public storefront category shortcuts
router.get('/storefront/categories', getStorefrontCategories);

module.exports = router;
