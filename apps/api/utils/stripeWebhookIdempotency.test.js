const { describe, it, mock } = require('node:test');
const assert = require('node:assert/strict');
const {
  claimWebhookEvent,
  releaseWebhookEvent,
} = require('./stripeWebhookIdempotency');

describe('claimWebhookEvent', () => {
  it('returns duplicate:false on first claim', async () => {
    const model = {
      create: mock.fn(async () => ({ eventId: 'evt_1' })),
    };
    const result = await claimWebhookEvent(model, 'evt_1');
    assert.equal(result.duplicate, false);
    assert.equal(model.create.mock.callCount(), 1);
  });

  it('returns duplicate:true on Mongo duplicate key', async () => {
    const err = new Error('dup');
    err.code = 11000;
    const model = {
      create: mock.fn(async () => {
        throw err;
      }),
    };
    const result = await claimWebhookEvent(model, 'evt_1');
    assert.equal(result.duplicate, true);
  });

  it('rethrows unexpected errors', async () => {
    const model = {
      create: mock.fn(async () => {
        throw new Error('db down');
      }),
    };
    await assert.rejects(() => claimWebhookEvent(model, 'evt_1'), /db down/);
  });

  it('rejects missing event id', async () => {
    await assert.rejects(() => claimWebhookEvent({ create: async () => {} }, ''), /Missing/);
  });
});

describe('releaseWebhookEvent', () => {
  it('deletes claimed event id', async () => {
    const model = {
      deleteOne: mock.fn(async () => ({ deletedCount: 1 })),
    };
    await releaseWebhookEvent(model, 'evt_1');
    assert.equal(model.deleteOne.mock.callCount(), 1);
    assert.deepEqual(model.deleteOne.mock.calls[0].arguments[0], {
      eventId: 'evt_1',
    });
  });
});
