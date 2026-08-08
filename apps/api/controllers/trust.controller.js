const asyncHandler = require('express-async-handler');

/**
 * Default trust / service strip items.
 * Aligned with DEMO_TRUST_ITEMS in apps/website/src/data/demoStorefront.ts
 * (icon keys: truck | refresh | shield | headset).
 * Stub only — replace with CMS/settings later; no model required.
 */
const DEFAULT_TRUST_ITEMS = [
  {
    icon: 'truck',
    title: 'Fast shipping',
    description: 'Tracked delivery on every order',
  },
  {
    icon: 'refresh',
    title: 'Easy returns',
    description: 'Hassle-free returns within policy window',
  },
  {
    icon: 'shield',
    title: 'Secure checkout',
    description: 'Encrypted payments you can trust',
  },
  {
    icon: 'headset',
    title: 'Care support',
    description: 'Real people ready to help',
  },
];

/**
 * Public storefront trust / service strip content.
 *
 * @route GET /api/storefront/trust
 * @access Public
 */
const getStorefrontTrust = asyncHandler(async (_req, res) => {
  res.status(200).json({
    message: 'ok',
    items: DEFAULT_TRUST_ITEMS,
  });
});

module.exports = {
  getStorefrontTrust,
  DEFAULT_TRUST_ITEMS,
};
