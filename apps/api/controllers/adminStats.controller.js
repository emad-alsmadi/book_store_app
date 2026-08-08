const asyncHandler = require('express-async-handler');
const { User } = require('../models/User');
const { Product } = require('../models/Product');
const { Brand } = require('../models/Brand');
const { Order } = require('../models/Order');

const PAID_LIKE_STATUSES = ['paid', 'shipped', 'delivered'];
const STATUS_KEYS = ['pending', 'paid', 'shipped', 'delivered', 'canceled'];

/**
 * Aggregate admin dashboard counts and paid-like revenue.
 *
 * @route GET /api/admin/stats
 * @access Private (orders:read)
 */
const getAdminStats = asyncHandler(async (req, res) => {
  const [users, products, brands, orders, revenueAgg, statusAgg] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Brand.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        {
          $match: {
            $or: [
              { paymentStatus: 'paid' },
              { status: { $in: PAID_LIKE_STATUSES } },
            ],
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' },
          },
        },
      ]),
      Order.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

  const paidRevenue = Number(revenueAgg[0]?.total || 0);

  const statusCounts = STATUS_KEYS.reduce((acc, key) => {
    acc[key] = 0;
    return acc;
  }, {});
  for (const row of statusAgg) {
    if (row?._id && Object.prototype.hasOwnProperty.call(statusCounts, row._id)) {
      statusCounts[row._id] = row.count;
    }
  }

  res.status(200).json({
    message: 'Admin stats fetched successfully',
    data: {
      users,
      products,
      brands,
      orders,
      paidRevenue,
      statusCounts,
    },
  });
});

module.exports = {
  getAdminStats,
};
