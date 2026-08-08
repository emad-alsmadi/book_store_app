const express = require('express');
const router = express.Router();

const { verfiyToken } = require('../middlewares/verfiyToken');
const { checkRolePermission } = require('../middlewares/checkRolePermission');
const { getAdminStats } = require('../controllers/adminStats.controller');

/**
 * @route GET /api/admin/stats
 * @access Private (orders:read)
 */
router.get(
  '/admin/stats',
  verfiyToken,
  checkRolePermission('orders:read'),
  getAdminStats,
);

module.exports = router;
