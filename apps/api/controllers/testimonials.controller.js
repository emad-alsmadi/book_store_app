const asyncHandler = require('express-async-handler');

/** Stub testimonials aligned with website fallback copy */
const DEFAULT_TESTIMONIALS = [
  {
    id: 'sara',
    name: 'Sara Alami',
    role: 'Beauty enthusiast',
    quote:
      'TrendVaulta makes finding skincare and everyday glam so much easier. Clear prices, fast browsing, and products that feel curated.',
    rating: 5,
  },
  {
    id: 'omar',
    name: 'Omar Nasser',
    role: 'Style shopper',
    quote:
      'I love how clean the shopping flow feels. From discovery to checkout, it is polished without being overwhelming.',
    rating: 5,
  },
  {
    id: 'layla',
    name: 'Layla Habib',
    role: 'Gift buyer',
    quote:
      'Great for thoughtful gifts and lifestyle pieces. Support was helpful when I needed a quick order update.',
    rating: 5,
  },
];

/**
 * @route GET /api/storefront/testimonials
 * @access Public
 */
const getTestimonials = asyncHandler(async (_req, res) => {
  res.status(200).json({
    message: 'ok',
    results: DEFAULT_TESTIMONIALS,
  });
});

module.exports = { getTestimonials };
