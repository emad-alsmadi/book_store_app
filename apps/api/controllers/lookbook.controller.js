const asyncHandler = require('express-async-handler');

/**
 * V1 stub — static editorial lookbook modules (no CMS yet).
 * Mirrors website DEMO_LOOKBOOK_STORIES; API uses ctaHref (FE demo used href).
 *
 * @route GET /api/storefront/lookbooks
 * @access Public
 */
const DEFAULT_LOOKBOOKS = [
  {
    id: 'look-morning',
    eyebrow: 'Beauty edit',
    title: 'Soft morning ritual',
    body: 'Layer lightweight textures that wake skin without the fuss. Original TrendVaulta styling — demo content only.',
    ctaLabel: 'Shop the ritual',
    ctaHref: '/products?category=beauty',
    imageUrl: '/images/1.webp',
    tone: 'rose',
  },
  {
    id: 'look-wardrobe',
    eyebrow: 'Fashion edit',
    title: 'Quiet wardrobe staples',
    body: 'Clean silhouettes and easy layers for days that move. Curated for polish, not noise.',
    ctaLabel: 'Browse fashion',
    ctaHref: '/products?category=fashion',
    imageUrl: '/images/2.webp',
    tone: 'stone',
  },
  {
    id: 'look-home',
    eyebrow: 'Lifestyle edit',
    title: 'At-home calm corners',
    body: 'Small accents that make everyday spaces feel intentional — candles, linen, soft light.',
    ctaLabel: 'Explore lifestyle',
    ctaHref: '/products?category=lifestyle',
    imageUrl: '/images/3.webp',
    tone: 'teal',
  },
];

const getLookbooks = asyncHandler(async (_req, res) => {
  res.status(200).json({
    message: 'ok',
    results: DEFAULT_LOOKBOOKS,
  });
});

module.exports = {
  getLookbooks,
  DEFAULT_LOOKBOOKS,
};
