const express = require('express');
const router = express.Router();
const { getTestimonials } = require('../controllers/testimonials.controller');

router.get('/storefront/testimonials', getTestimonials);

module.exports = router;
