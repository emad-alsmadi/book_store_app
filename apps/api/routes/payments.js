const express = require('express');
const router = express.Router();

const { verfiyToken } = require('../middlewares/verfiyToken');
const { checkoutRateLimit } = require('../middlewares/rateLimit');
const {
  getPaymentsSetupStatus,
  createCheckoutSession,
  verifyPaymentStatus,
} = require('../controllers/payment.controller');

router.get('/payments/setup-status', getPaymentsSetupStatus);

router.post(
  '/payments/checkout-session',
  checkoutRateLimit,
  verfiyToken,
  createCheckoutSession,
);

router.post(
  '/payments/verify-payment',
  checkoutRateLimit,
  verfiyToken,
  verifyPaymentStatus,
);

module.exports = router;
