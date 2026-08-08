const express = require('express');
const router = express.Router();

const { getStorefrontTrust } = require('../controllers/trust.controller');

// Public stub — CMS/settings can replace static defaults later
router.get('/storefront/trust', getStorefrontTrust);

module.exports = router;
