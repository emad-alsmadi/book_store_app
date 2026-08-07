const asyncHandler = require('express-async-handler');
const { Product } = require('../models/Product');

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 24;

/**
 * Stub recommendations — no ML / personalization yet.
 *
 * Strategies:
 * - similar_category: when `category` is provided, return active products in that category
 * - recent_active: fallback — newest active products (e.g. context=home)
 *
 * @route GET /api/recommendations
 * @access Public (optional JWT personalization later)
 * @query context — hint only (e.g. home); does not change ranking yet
 * @query limit — default 8, max 24
 * @query category — optional; enables similar_category strategy
 */
const getRecommendations = asyncHandler(async (req, res) => {
  const { category } = req.query;
  // req.query.context reserved for future personalization (home, pdp, cart, …)

  const parsed = parseInt(req.query.limit, 10);
  const limitNum = Number.isFinite(parsed)
    ? Math.min(MAX_LIMIT, Math.max(1, parsed))
    : DEFAULT_LIMIT;

  const query = { isActive: true };
  let strategy = 'recent_active';

  if (typeof category === 'string' && category.trim()) {
    query.category = category.trim();
    strategy = 'similar_category';
  }

  const results = await Product.find(query)
    .populate('brand', ['name', 'slug', 'logo'])
    .sort({ createdAt: -1 })
    .limit(limitNum)
    .lean();

  res.status(200).json({
    message: 'ok',
    results,
    strategy,
  });
});

module.exports = {
  getRecommendations,
};
