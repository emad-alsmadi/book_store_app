const asyncHandler = require('express-async-handler');

/**
 * V1 stub — static gift-finder facet config (no CMS yet).
 * Mirrors website DEMO_GIFT_FINDER so FE can swap to this endpoint.
 *
 * Optional fields (category, minPrice) are included for PLP query building;
 * core shape matches backlog #11: id, label, q / maxPrice.
 */
const DEFAULT_GIFT_FINDER = {
  occasions: [
    { id: 'birthday', label: 'Birthday', q: 'gift' },
    { id: 'thank-you', label: 'Thank you', q: 'gift' },
    { id: 'self-care', label: 'Self-care', category: 'beauty', q: 'skincare' },
    { id: 'housewarming', label: 'Housewarming', category: 'home', q: 'home' },
    { id: 'just-because', label: 'Just because', q: 'gift' },
  ],
  recipients: [
    { id: 'for-her', label: 'For her', q: 'beauty' },
    { id: 'for-him', label: 'For him', q: 'grooming' },
    { id: 'for-home', label: 'For home', category: 'home' },
    { id: 'for-anyone', label: 'For anyone', q: 'gift' },
  ],
  budgets: [
    { id: 'under-25', label: 'Under $25', maxPrice: 25 },
    { id: '25-50', label: '$25–$50', minPrice: 25, maxPrice: 50 },
    { id: '50-plus', label: '$50+', minPrice: 50 },
    { id: 'any', label: 'Any budget' },
  ],
};

/**
 * @route GET /api/storefront/gift-finder
 * @access Public
 */
const getGiftFinderConfig = asyncHandler(async (_req, res) => {
  res.status(200).json({
    message: 'ok',
    occasions: DEFAULT_GIFT_FINDER.occasions,
    recipients: DEFAULT_GIFT_FINDER.recipients,
    budgets: DEFAULT_GIFT_FINDER.budgets,
  });
});

module.exports = {
  getGiftFinderConfig,
  DEFAULT_GIFT_FINDER,
};
