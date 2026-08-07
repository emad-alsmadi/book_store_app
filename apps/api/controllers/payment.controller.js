const asyncHandler = require('express-async-handler');
const { Order, validateCreateOrder } = require('../models/Order');
const { Product } = require('../models/Product');
const StripeWebhookEvent = require('../models/StripeWebhookEvent');
const {
  getStripeOrThrow,
  getFrontendBaseUrl,
} = require('../services/stripe.service');
const {
  buildNormalizedOrderLines,
  resolveShippingPrice,
  loadValidCouponByCode,
  calculateCouponDiscount,
  decrementStockForPaidOrder,
  incrementCouponUsedCount,
} = require('../utils/commerce');
const {
  claimWebhookEvent,
  releaseWebhookEvent,
} = require('../utils/stripeWebhookIdempotency');

function dollarsToCents(amount) {
  return Math.round(Number(amount) * 100);
}

function getPaymentsSetupStatus(_req, res) {
  const ready = Boolean(process.env.STRIPE_SECRET_KEY?.trim());
  res.status(200).json({ ready });
}

const createCheckoutSession = asyncHandler(async (req, res) => {
  let stripe;
  try {
    stripe = getStripeOrThrow();
  } catch (_e) {
    return res.status(503).json({
      code: 'STRIPE_SECRET_MISSING',
      message:
        'Checkout is not available right now. Please try again later or contact support.',
      detail: 'Missing STRIPE_SECRET_KEY in backend/.env.',
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

  let normalizedItems;
  let itemsPrice;
  try {
    ({ normalizedItems, itemsPrice } = await buildNormalizedOrderLines(
      Product,
      items,
    ));
  } catch (lineErr) {
    return res.status(lineErr.statusCode || 400).json({
      message: lineErr.message || 'Unable to build order lines',
    });
  }

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
    paymentStatus: 'pending',
    stripeSessionId: '',
    paymentIntentId: '',
    stockDecremented: false,
  });

  const lineItems = normalizedItems.map((it) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: it.title,
        images:
          it.cover && /^https?:\/\//i.test(it.cover) ? [it.cover] : undefined,
      },
      unit_amount: dollarsToCents(it.price),
    },
    quantity: it.qty,
  }));

  if (shippingPrice > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Shipping' },
        unit_amount: dollarsToCents(shippingPrice),
      },
      quantity: 1,
    });
  }

  if (taxPrice > 0) {
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: { name: 'Tax' },
        unit_amount: dollarsToCents(taxPrice),
      },
      quantity: 1,
    });
  }

  const frontend = getFrontendBaseUrl();

  let session;
  try {
    const sessionParams = {
      mode: 'payment',
      line_items: lineItems,
      success_url: `${frontend}/checkout/success?order_id=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontend}/checkout/cancel?order_id=${order._id}`,
      client_reference_id: String(order._id),
      metadata: {
        orderId: String(order._id),
        userId: String(userId),
        kind: 'order_payment',
        totalPrice: String(totalPrice),
      },
      payment_intent_data: {
        metadata: {
          orderId: String(order._id),
          userId: String(userId),
        },
      },
    };

    // Apply server-calculated discount via a one-time Stripe coupon (unit_amount cannot be negative)
    if (discountAmount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: dollarsToCents(discountAmount),
        currency: 'usd',
        duration: 'once',
        name: normalizedCouponCode || 'Order discount',
      });
      sessionParams.discounts = [{ coupon: stripeCoupon.id }];
    }

    session = await stripe.checkout.sessions.create(sessionParams);
  } catch (stripeErr) {
    await Order.findByIdAndDelete(order._id);
    const raw =
      stripeErr && typeof stripeErr.message === 'string'
        ? stripeErr.message
        : 'Stripe Checkout could not be created';
    return res.status(502).json({
      message:
        'We could not open the secure payment page. Please try again shortly.',
      detail: `${raw} — Verify Stripe keys and test/live mode match.`,
    });
  }

  order.stripeSessionId = session.id;
  await order.save();

  res.status(200).json({
    url: session.url,
    orderId: String(order._id),
    sessionId: session.id,
  });
});

async function markOrderPaidFromSession(session) {
  const orderId = session.metadata?.orderId || session.client_reference_id;
  if (!orderId) return;

  const order = await Order.findById(orderId);
  if (!order) return;

  if (order.paymentStatus === 'paid') return;

  const pi = session.payment_intent;
  const paymentIntentId = typeof pi === 'string' ? pi : pi?.id || '';

  if (!order.stockDecremented) {
    await decrementStockForPaidOrder(Product, order);
    order.stockDecremented = true;
  }

  if (order.couponId && !order.couponIncremented) {
    await incrementCouponUsedCount(order.couponId);
    order.couponIncremented = true;
  }

  order.paymentStatus = 'paid';
  order.status = 'paid';
  order.stripeSessionId = session.id || order.stripeSessionId;
  order.paymentIntentId = paymentIntentId || order.paymentIntentId;
  order.paidAt = new Date();
  await order.save();
}

async function handleCheckoutSessionCompleted(session) {
  if (
    session.metadata?.kind === 'order_payment' ||
    session.mode === 'payment'
  ) {
    await markOrderPaidFromSession(session);
  }
}

const stripeWebhook = asyncHandler(async (req, res) => {
  const stripe = getStripeOrThrow();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ message: 'Stripe webhook secret missing' });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    return res
      .status(400)
      .send(`Webhook signature verification failed: ${err.message}`);
  }

  const claim = await claimWebhookEvent(StripeWebhookEvent, event.id);
  if (claim.duplicate) {
    return res.status(200).json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      default:
        break;
    }
  } catch (procErr) {
    await releaseWebhookEvent(StripeWebhookEvent, event.id);
    console.error('Stripe webhook processing error:', procErr);
    return res.status(500).json({ message: 'Webhook handler failed' });
  }

  res.status(200).json({ received: true });
});

const verifyPaymentStatus = asyncHandler(async (req, res) => {
  const stripe = getStripeOrThrow();
  const userId = req.user?.id ?? req.user?._id;
  if (!userId) {
    return res.status(401).json({ message: 'Token is not valid!' });
  }

  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ message: 'Order ID is required' });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (order.user.toString() !== String(userId)) {
    return res
      .status(403)
      .json({ message: 'Not authorized to access this order' });
  }

  if (order.paymentStatus === 'paid') {
    return res.status(200).json({ paymentStatus: 'paid', alreadyPaid: true });
  }

  if (!order.stripeSessionId) {
    return res
      .status(400)
      .json({ message: 'No Stripe session associated with this order' });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(
      order.stripeSessionId,
    );

    if (session.payment_status === 'paid' && session.status === 'complete') {
      await markOrderPaidFromSession(session);
      return res.status(200).json({ paymentStatus: 'paid', verified: true });
    }

    return res.status(200).json({
      paymentStatus: session.payment_status,
      sessionStatus: session.status,
      verified: false,
    });
  } catch (stripeErr) {
    console.error('Stripe session retrieval error:', stripeErr);
    return res
      .status(500)
      .json({ message: 'Failed to verify payment status with Stripe' });
  }
});

module.exports = {
  getPaymentsSetupStatus,
  createCheckoutSession,
  stripeWebhook,
  verifyPaymentStatus,
};
