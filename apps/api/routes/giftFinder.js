const express = require('express');
const router = express.Router();
const { getGiftFinderConfig } = require('../controllers/giftFinder.controller');

// Public storefront config stub — CMS-backed later
router.get('/storefront/gift-finder', getGiftFinderConfig);

module.exports = router;
