const { Coupon } = require('../models/Coupon');

const FLAT_SHIPPING_USD = () => {
  const n = Number(process.env.SHIPPING_FLAT_USD);
  return Number.isFinite(n) && n >= 0 ? n : 5;
};

function matchVariant(product, variant) {
  if (!variant || !Array.isArray(product.variants) || product.variants.length === 0) {
    return null;
  }
  return (
    product.variants.find((v) => {
      const sizeOk =
        variant.size == null || String(v.size || '') === String(variant.size);
      const colorOk =
        variant.color == null || String(v.color || '') === String(variant.color);
      const skuOk =
        !variant.sku || String(v.sku || '') === String(variant.sku);
      return sizeOk && colorOk && skuOk;
    }) || null
  );
}

function resolveUnitPrice(product, matchedVariant) {
  if (
    matchedVariant &&
    matchedVariant.price != null &&
    Number.isFinite(Number(matchedVariant.price))
  ) {
    return Number(matchedVariant.price);
  }
  return Number(product.price);
}

function resolveAvailableStock(product, matchedVariant) {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    if (!matchedVariant) return 0;
    return Number(matchedVariant.stock ?? 0);
  }
  return Number(product.stock ?? 0);
}

function resolveShippingPrice({ delivery, shippingMethod } = {}) {
  if (shippingMethod === 'standard' || shippingMethod === 'express' || delivery === true) {
    return FLAT_SHIPPING_USD();
  }
  if (shippingMethod === 'none' || delivery === false) {
    return 0;
  }
  // Default: no physical shipping charge unless explicitly requested
  return 0;
}

function calculateCouponDiscount(coupon, orderAmount) {
  const amount = Math.max(0, Number(orderAmount) || 0);
  if (!coupon) {
    return { discountAmount: 0, valid: false, message: 'Coupon not found' };
  }
  if (!coupon.isActive) {
    return { discountAmount: 0, valid: false, message: 'Coupon is inactive' };
  }
  if (new Date(coupon.expirationDate) < new Date()) {
    return { discountAmount: 0, valid: false, message: 'Coupon has expired' };
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return {
      discountAmount: 0,
      valid: false,
      message: 'Coupon usage limit has been reached',
    };
  }
  if (amount < Number(coupon.minimumOrderAmount || 0)) {
    return {
      discountAmount: 0,
      valid: false,
      message: `Minimum order amount of $${coupon.minimumOrderAmount} required`,
    };
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (amount * Number(coupon.discountValue)) / 100;
  } else {
    discountAmount = Number(coupon.discountValue);
  }
  discountAmount = Math.min(Math.max(0, discountAmount), amount);

  return { discountAmount, valid: true };
}

async function loadValidCouponByCode(code) {
  if (!code || typeof code !== 'string') return null;
  return Coupon.findOne({ code: code.trim().toUpperCase() });
}

/**
 * Build authoritative order lines from client productId/qty/variant hints.
 * Never trusts client price/title/cover.
 */
async function buildNormalizedOrderLines(Product, items) {
  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  if (products.length !== productIds.length) {
    const err = new Error('One or more products not found');
    err.statusCode = 400;
    throw err;
  }

  const productsById = new Map(products.map((p) => [String(p._id), p]));
  const normalizedItems = [];

  for (const i of items) {
    const p = productsById.get(String(i.productId));
    if (!p) {
      const err = new Error('One or more products not found');
      err.statusCode = 404;
      throw err;
    }
    if (p.isActive === false) {
      const err = new Error(`Product is not available: ${p.title}`);
      err.statusCode = 400;
      throw err;
    }

    const hasVariants = Array.isArray(p.variants) && p.variants.length > 0;
    const matchedVariant = matchVariant(p, i.variant);
    if (hasVariants) {
      if (!i.variant || !matchedVariant) {
        const err = new Error(`Variant selection required for ${p.title}`);
        err.statusCode = 400;
        throw err;
      }
    }

    const qty = Number(i.qty);
    if (!Number.isInteger(qty) || qty < 1) {
      const err = new Error('Quantity must be a positive integer');
      err.statusCode = 400;
      throw err;
    }

    const available = resolveAvailableStock(p, matchedVariant);
    if (qty > available) {
      const err = new Error(`Insufficient stock for ${p.title}`);
      err.statusCode = 400;
      throw err;
    }

    const price = resolveUnitPrice(p, matchedVariant);
    normalizedItems.push({
      productId: p._id,
      title: p.title,
      price,
      qty,
      cover: p.cover,
      variant: matchedVariant
        ? {
            size: matchedVariant.size,
            color: matchedVariant.color,
            colorCode: matchedVariant.colorCode,
            sku: matchedVariant.sku,
          }
        : i.variant || undefined,
    });
  }

  const itemsPrice = normalizedItems.reduce(
    (sum, it) => sum + it.price * it.qty,
    0,
  );

  return { normalizedItems, itemsPrice };
}

async function decrementStockForPaidOrder(Product, order) {
  for (const it of order.items || []) {
    const productId = it.productId;
    const qty = Number(it.qty);
    if (!productId || !(qty > 0)) continue;

    const product = await Product.findById(productId);
    if (!product) continue;

    const hasVariants =
      Array.isArray(product.variants) && product.variants.length > 0;

    if (hasVariants && it.variant) {
      const matched = matchVariant(product, it.variant);
      if (!matched || Number(matched.stock ?? 0) < qty) {
        const err = new Error(`Insufficient stock to fulfill ${product.title}`);
        err.statusCode = 409;
        throw err;
      }
      matched.stock = Number(matched.stock) - qty;
      // Keep product.stock roughly in sync as sum of variants when present
      product.stock = product.variants.reduce(
        (s, v) => s + Number(v.stock || 0),
        0,
      );
      await product.save();
    } else {
      const updated = await Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true },
      );
      if (!updated) {
        const err = new Error(`Insufficient stock to fulfill order item`);
        err.statusCode = 409;
        throw err;
      }
    }
  }
}

async function incrementCouponUsedCount(couponId) {
  if (!couponId) return null;
  return Coupon.findByIdAndUpdate(
    couponId,
    { $inc: { usedCount: 1 } },
    { new: true },
  );
}

module.exports = {
  matchVariant,
  resolveUnitPrice,
  resolveAvailableStock,
  resolveShippingPrice,
  calculateCouponDiscount,
  loadValidCouponByCode,
  buildNormalizedOrderLines,
  decrementStockForPaidOrder,
  incrementCouponUsedCount,
  FLAT_SHIPPING_USD,
};
