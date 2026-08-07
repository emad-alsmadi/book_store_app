function serializeOrderItem(it) {
  const productRef = it.productId ?? it.product ?? it.template;
  const productId =
    productRef && typeof productRef === 'object' && productRef._id
      ? String(productRef._id)
      : String(productRef ?? '');

  const {
    template: _legacyTemplate,
    templateId: _legacyTemplateId,
    product: _legacyProduct,
    ...rest
  } = it;

  return {
    ...rest,
    productId,
  };
}

function serializeOrder(order) {
  const plain =
    order && typeof order.toObject === 'function'
      ? order.toObject({ virtuals: false })
      : { ...(order || {}) };

  const items = (plain.items || []).map((it) => serializeOrderItem(it));

  return {
    ...plain,
    _id: plain._id != null ? String(plain._id) : plain._id,
    user:
      plain.user && typeof plain.user === 'object' && plain.user._id
        ? String(plain.user._id)
        : plain.user != null
          ? String(plain.user)
          : plain.user,
    items,
    discountAmount: plain.discountAmount ?? 0,
    couponCode: plain.couponCode ?? '',
    paymentStatus: plain.paymentStatus ?? 'pending',
    stripeSessionId: plain.stripeSessionId ?? '',
    paymentIntentId: plain.paymentIntentId ?? '',
  };
}

function serializeOrders(list) {
  return (list || []).map((o) => serializeOrder(o));
}

module.exports = {
  serializeOrder,
  serializeOrders,
};
