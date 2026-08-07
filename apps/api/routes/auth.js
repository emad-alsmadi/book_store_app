const express = require('express');
const router = express.Router();
const { authRateLimit } = require('../middlewares/rateLimit');

const {
  registerUser,
  loginUser,
  logoutUser,
} = require('../controllers/auth.controller');

router.post('/auth/register', authRateLimit, registerUser);
router.post('/auth/login', authRateLimit, loginUser);
router.post('/auth/logout', logoutUser);

module.exports = router;
