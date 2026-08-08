const express = require('express');
const router = express.Router();
const { getWhyChooseUs } = require('../controllers/whyChooseUs.controller');

router.get('/storefront/why-choose-us', getWhyChooseUs);

module.exports = router;