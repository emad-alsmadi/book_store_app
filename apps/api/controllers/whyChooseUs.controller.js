const asyncHandler = require('express-async-handler');

/** Stub items aligned with WhyChooseUs frontend fallback */
const DEFAULT_ITEMS = [
  {
    id: 'delivery',
    icon: 'truck',
    title: 'Reliable delivery',
    description: 'Clear shipping options and tracking on every order',
  },
  {
    id: 'returns',
    icon: 'refresh',
    title: 'Easy returns',
    description: 'Straightforward returns within our store policy window',
  },
  {
    id: 'payments',
    icon: 'shield',
    title: 'Secure payments',
    description: 'Checkout protected with industry-standard encryption',
  },
  {
    id: 'support',
    icon: 'headset',
    title: 'Care support',
    description: 'Friendly help when you need sizing, gifts, or order care',
  },
];

/**
 * @route GET /api/storefront/why-choose-us
 * @access Public
 */
const getWhyChooseUs = asyncHandler(async (_req, res) => {
  res.status(200).json({
    message: 'ok',
    items: DEFAULT_ITEMS,
  });
});

module.exports = { getWhyChooseUs };
