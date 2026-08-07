const asyncHandler = require('express-async-handler');
const { Product } = require('../models/Product');

const BUNDLE_COMPANION_LIMIT = 3;
const BUNDLE_DISCOUNT_RATE = 0.1;

/**
 * Get frequently-bought-together / complete-the-look companions for a product.
 * Stub: other active products in the same category (excludes self), limit 2–3.
 *
 * @route GET /api/products/:id/bundles
 * @access Public
 */
const getProductBundles = asyncHandler(async (req, res) => {
  const primary = await Product.findById(req.params.id);

  if (!primary || primary.isActive === false) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const items = await Product.find({
    _id: { $ne: primary._id },
    category: primary.category,
    isActive: true,
  })
    .populate('brand', ['name', 'slug', 'logo', 'website', 'country'])
    .sort({ featured: -1, averageRating: -1, createdAt: -1 })
    .limit(BUNDLE_COMPANION_LIMIT);

  const total =
    Number(primary.price || 0) +
    items.reduce((sum, p) => sum + Number(p.price || 0), 0);
  const savings =
    items.length > 0
      ? Math.round(total * BUNDLE_DISCOUNT_RATE * 100) / 100
      : 0;
  const bundlePrice = Math.round((total - savings) * 100) / 100;

  res.status(200).json({
    message: 'ok',
    primaryProductId: String(primary._id),
    items,
    bundlePrice,
    savings,
  });
});

module.exports = {
  getProductBundles,
};
