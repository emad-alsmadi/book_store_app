/** Fulfillment status machine (payment → paid is webhook-only). */
const ORDER_STATUSES = [
  'pending',
  'paid',
  'shipped',
  'delivered',
  'canceled',
];

const ALLOWED_TRANSITIONS = {
  pending: ['canceled'],
  paid: ['shipped', 'canceled'],
  shipped: ['delivered'],
  delivered: [],
  canceled: [],
};

function getAllowedNextStatuses(currentStatus) {
  return ALLOWED_TRANSITIONS[currentStatus] || [];
}

/**
 * @returns {{ ok: true, from: string, to: string } | { ok: false, message: string }}
 */
function canTransitionOrderStatus(fromStatus, toStatus) {
  if (!ORDER_STATUSES.includes(toStatus)) {
    return { ok: false, message: `Invalid status: ${toStatus}` };
  }
  if (fromStatus === toStatus) {
    return { ok: false, message: 'Order already has this status' };
  }
  const allowed = getAllowedNextStatuses(fromStatus);
  if (!allowed.includes(toStatus)) {
    return {
      ok: false,
      message: `Cannot transition from '${fromStatus}' to '${toStatus}'`,
    };
  }
  return { ok: true, from: fromStatus, to: toStatus };
}

module.exports = {
  ORDER_STATUSES,
  ALLOWED_TRANSITIONS,
  getAllowedNextStatuses,
  canTransitionOrderStatus,
};
