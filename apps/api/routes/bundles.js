const express = require('express');
const router = express.Router();

const { getProductBundles } = require('../controllers/bundle.controller');

router.get('/products/:id/bundles', getProductBundles);

module.exports = router;
