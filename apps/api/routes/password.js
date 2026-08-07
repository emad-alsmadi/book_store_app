const express = require('express');
const router = express.Router();
const { passwordRateLimit } = require('../middlewares/rateLimit');
const {
  sendForgotPasswordLink,
  resetPassword,
} = require('../controllers/password.controller');

router.post(
  '/password/forgot-password',
  passwordRateLimit,
  sendForgotPasswordLink,
);
router.post(
  '/password/reset-password/:userId/:token',
  passwordRateLimit,
  resetPassword,
);

module.exports = router;
