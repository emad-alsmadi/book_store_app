const mongoose = require('mongoose');
const Joi = require('joi');

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    qty: {
      type: Number,
      required: true,
      min: 1,
    },
    cover: {
      type: String,
      required: true,
      trim: true,
    },
    variant: {
      size: { type: String, trim: true },
      color: { type: String, trim: true },
      colorCode: { type: String, trim: true },
      sku: { type: String, trim: true },
    },
  },
  { _id: false },
);

const ShippingAddressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 30,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 300,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    zip: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    notes: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      validate: [
        (v) => Array.isArray(v) && v.length > 0,
        'Order items are required',
      ],
      required: true,
    },
    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'delivered', 'canceled'],
      default: 'pending',
    },
    itemsPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    discountAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    couponCode: {
      type: String,
      trim: true,
      uppercase: true,
      default: '',
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    stripeSessionId: {
      type: String,
      trim: true,
      default: '',
    },
    paymentIntentId: {
      type: String,
      trim: true,
      default: '',
    },
    paidAt: {
      type: Date,
    },
    stockDecremented: {
      type: Boolean,
      default: false,
    },
    couponIncremented: {
      type: Boolean,
      default: false,
    },
    salesCountIncremented: {
      type: Boolean,
      default: false,
    },
    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },
    stockRestored: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model('Order', OrderSchema);

const validateCreateOrder = (obj) => {
  const schema = Joi.object({
    items: Joi.array()
      .items(
        Joi.object({
          productId: Joi.string().hex().length(24).required(),
          qty: Joi.number().integer().min(1).required(),
          variant: Joi.object({
            size: Joi.string().trim().allow('', null),
            color: Joi.string().trim().allow('', null),
            colorCode: Joi.string().trim().allow('', null),
            sku: Joi.string().trim().allow('', null),
          }).optional(),
          // Client price/title/cover ignored by server — allowed for backward compat only
          title: Joi.any().strip(),
          price: Joi.any().strip(),
        }),
      )
      .min(1)
      .required(),
    shippingAddress: Joi.object({
      name: Joi.string().trim().min(2).max(200).required(),
      phone: Joi.string().trim().min(6).max(30).required(),
      address: Joi.string().trim().min(5).max(300).required(),
      city: Joi.string().trim().min(2).max(100).required(),
      zip: Joi.string().trim().min(2).max(20).required(),
      notes: Joi.string().trim().max(500).allow('').optional(),
    }).required(),
    // Client shippingPrice/taxPrice ignored — use delivery / shippingMethod
    delivery: Joi.boolean().optional(),
    shippingMethod: Joi.string()
      .valid('none', 'standard', 'express')
      .optional(),
    couponCode: Joi.string().trim().max(50).allow('', null).optional(),
    shippingPrice: Joi.any().strip(),
    taxPrice: Joi.any().strip(),
  });

  return schema.validate(obj, { stripUnknown: true });
};

module.exports = {
  Order,
  validateCreateOrder,
};
