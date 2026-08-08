const asyncHandler = require('express-async-handler');
const { Product } = require('../models/Product');

/**
 * Known Product.category enum values with storefront labels.
 * Used as stub when distinct aggregation is empty / unavailable.
 */
const KNOWN_CATEGORIES = [
  {
    id: 'makeup',
    label: 'Makeup',
    href: '/products?category=makeup',
    imageUrl: '/images/1.webp',
  },
  {
    id: 'perfumes',
    label: 'Perfumes',
    href: '/products?category=perfumes',
    imageUrl: '/images/2.webp',
  },
  {
    id: 'clothing',
    label: 'Clothing',
    href: '/products?category=clothing',
    imageUrl: '/images/3.webp',
  },
  {
    id: 'skincare',
    label: 'Skincare',
    href: '/products?category=skincare',
    imageUrl: '/images/4.webp',
  },
  {
    id: 'accessories',
    label: 'Accessories',
    href: '/products?category=accessories',
    imageUrl: '/images/1.webp',
  },
  {
    id: 'home',
    label: 'Home',
    href: '/products?category=home',
    imageUrl: '/images/2.webp',
  },
];

const KNOWN_BY_ID = new Map(KNOWN_CATEGORIES.map((c) => [c.id, c]));

function toCategoryResult(id) {
  const known = KNOWN_BY_ID.get(id);
  if (known) return known;
  return {
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1),
    href: `/products?category=${encodeURIComponent(id)}`,
  };
}

/**
 * Public storefront category shortcuts for homepage tiles.
 * Prefers distinct active product categories; falls back to Product enum stub.
 *
 * @route GET /api/storefront/categories
 * @access Public
 */
const getStorefrontCategories = asyncHandler(async (_req, res) => {
  let results = KNOWN_CATEGORIES;

  try {
    const distinct = await Product.distinct('category', { isActive: true });
    const ids = (distinct || []).filter(
      (id) => typeof id === 'string' && id.trim(),
    );
    if (ids.length > 0) {
      results = ids.map((id) => toCategoryResult(id.trim()));
    }
  } catch {
    // keep stub
  }

  res.status(200).json({
    message: 'ok',
    results,
  });
});

module.exports = {
  getStorefrontCategories,
  KNOWN_CATEGORIES,
};
