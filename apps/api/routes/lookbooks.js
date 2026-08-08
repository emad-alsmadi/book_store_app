const express = require('express');
const router = express.Router();
const { getLookbooks } = require('../controllers/lookbook.controller');

// Public storefront editorial modules — CMS-backed later
router.get('/storefront/lookbooks', getLookbooks);

module.exports = router;
