/**
 * Claim a Stripe event id for processing. Duplicate eventIds are safe no-ops.
 * @param {{ create: Function, deleteOne: Function }} StripeWebhookEvent
 * @param {string} eventId
 * @returns {Promise<{ duplicate: boolean }>}
 */
async function claimWebhookEvent(StripeWebhookEvent, eventId) {
  if (!eventId) {
    const err = new Error('Missing Stripe event id');
    err.statusCode = 400;
    throw err;
  }

  try {
    await StripeWebhookEvent.create({ eventId });
    return { duplicate: false };
  } catch (e) {
    if (e && e.code === 11000) {
      return { duplicate: true };
    }
    throw e;
  }
}

/**
 * Release claim so Stripe can retry after a handler failure.
 */
async function releaseWebhookEvent(StripeWebhookEvent, eventId) {
  if (!eventId) return;
  await StripeWebhookEvent.deleteOne({ eventId }).catch(() => {});
}

module.exports = {
  claimWebhookEvent,
  releaseWebhookEvent,
};
