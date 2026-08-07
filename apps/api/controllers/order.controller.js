const asyncHandler = require('express-async-handler');
const Joi = require('joi');
const { Order, validateCreateOrder } = require('../models/Order');
const { Product } = require('../models/Product');
const { serializeOrder, serializeOrders } = require('../utils/serializeOrder');
const {
  buildNormalizedOrderLines,
  resolveShippingPrice,
  loadValidCouponByCode,
  calculateCouponDiscount,
} = require('../utils/commerce');
const {
  ORDER_STATUSES,
  canTransitionOrderStatus,
  getAllowedNextStatuses,
} = require('../utils/orderTransitions');

const createOrder = asyncHandler(async (req, res) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
  const allowDirectDev =
    process.env.DEV_ALLOW_DIRECT_ORDERS === 'true' ||
    process.env.ALLOW_DIRECT_ORDERS === 'true';

  if (stripeKey && !allowDirectDev) {
    return res.status(400).json({
      message:
        'Direct order creation is disabled when Stripe is configured. Use checkout to pay securely. For local development you may set DEV_ALLOW_DIRECT_ORDERS=true on the backend.',
    });
  }

  const userId = req.user?.id ?? req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: 'Token is not valid!' });
  }

  const { error, value } = validateCreateOrder(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { items, shippingAddress, couponCode, delivery, shippingMethod } =
    value;

  const { normalizedItems, itemsPrice } = await buildNormalizedOrderLines(
    Product,
    items,
  );

  let discountAmount = 0;
  let couponId = null;
  let normalizedCouponCode = '';
  if (couponCode) {
    const coupon = await loadValidCouponByCode(couponCode);
    const result = calculateCouponDiscount(coupon, itemsPrice);
    if (!result.valid) {
      return res.status(400).json({ message: result.message });
    }
    discountAmount = result.discountAmount;
    couponId = coupon._id;
    normalizedCouponCode = coupon.code;
  }

  const shippingPrice = resolveShippingPrice({ delivery, shippingMethod });
  const taxPrice = 0;
  const totalPrice = Math.max(
    0,
    itemsPrice - discountAmount + shippingPrice + taxPrice,
  );

  const order = await Order.create({
    user: userId,
    items: normalizedItems,
    shippingAddress: {
      ...shippingAddress,
      notes: shippingAddress.notes || '',
    },
    status: 'pending',
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    couponCode: normalizedCouponCode,
    couponId,
    totalPrice,
    paymentStatus: 'unpaid',
  });

  res.status(201).json(serializeOrder(order));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user?.id ?? req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: 'Token is not valid!' });
  }

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(serializeOrders(orders));
});

const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user?.id ?? req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: 'Token is not valid!' });
  }

  const isStaff =
    Array.isArray(req.user?.roles) &&
    req.user.roles.some((r) => r === 'admin' || r === 'moderator');

  const query = isStaff
    ? { _id: req.params.id }
    : { _id: req.params.id, user: userId };

  const order = await Order.findOne(query).lean();
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const serialized = serializeOrder(order);
  res.status(200).json({
    ...serialized,
    allowedNextStatuses: isStaff
      ? getAllowedNextStatuses(serialized.status)
      : undefined,
  });
});

/**
 * Admin/moderator: paginated order list.
 * @route GET /api/orders
 * @access Private (orders:read)
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    paymentStatus,
    q,
  } = req.query;

  const query = {};
  if (status && ORDER_STATUSES.includes(String(status))) {
    query.status = String(status);
  }
  if (
    paymentStatus &&
    ['unpaid', 'pending', 'paid', 'failed', 'refunded'].includes(
      String(paymentStatus),
    )
  ) {
    query.paymentStatus = String(paymentStatus);
  }
  if (q && String(q).trim()) {
    const term = String(q).trim();
    if (/^[a-f\d]{24}$/i.test(term)) {
      query._id = term;
    }
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Order.countDocuments(query),
  ]);

  const data = serializeOrders(orders).map((o) => ({
    ...o,
    allowedNextStatuses: getAllowedNextStatuses(o.status),
  }));

  res.status(200).json({
    data,
    meta: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
    },
  });
});

/**
 * Admin: transition fulfillment status within the allowed state machine.
 * Does not mark orders paid (Stripe webhook / verify-payment only).
 * @route PATCH /api/orders/:id/status
 * @access Private (orders:write)
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid(...ORDER_STATUSES)
      .required(),
  });
  const { error, value } = schema.validate(req.body || {});
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  const transition = canTransitionOrderStatus(order.status, value.status);
  if (!transition.ok) {
    return res.status(400).json({ message: transition.message });
  }

  // Cancel unpaid pending only; canceling paid/shipped does not restock in V1
  if (value.status === 'canceled' && order.status === 'pending') {
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        message: 'Cannot cancel a paid order from pending state',
      });
    }
  }

  order.status = value.status;
  await order.save();

  const serialized = serializeOrder(order);
  res.status(200).json({
    ...serialized,
    allowedNextStatuses: getAllowedNextStatuses(serialized.status),
    message: `Order status updated to ${value.status}`,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
