const asyncHandler = require('express-async-handler');
const { Offer } = require('../models/Offer');

/**
 * List merchandising offers / deals for the storefront.
 *
 * Supported query params:
 * - active: when "true", only active non-expired offers
 * - limit: max results (default 12, max 50)
 *
 * @route GET /api/offers
 * @access Public
 */
const getOffers = asyncHandler(async (req, res) => {
  const { active, limit = 12 } = req.query;

  const query = {};

  if (active === 'true') {
    query.active = true;
    query.$or = [{ endsAt: null }, { endsAt: { $gt: new Date() } }];
  } else if (active === 'false') {
    query.active = false;
  }

  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));

  const results = await Offer.find(query)
    .sort({ sortOrder: 1, createdAt: -1 })
    .limit(limitNum)
    .select('title subtitle badge href imageUrl endsAt active sortOrder')
    .lean();

  res.status(200).json({
    message: 'ok',
    results,
  });
});

module.exports = {
  getOffers,
};
