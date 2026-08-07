const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  canTransitionOrderStatus,
  getAllowedNextStatuses,
} = require('./orderTransitions');

describe('orderTransitions', () => {
  it('allows pending → canceled', () => {
    const r = canTransitionOrderStatus('pending', 'canceled');
    assert.equal(r.ok, true);
  });

  it('allows paid → shipped and paid → canceled', () => {
    assert.equal(canTransitionOrderStatus('paid', 'shipped').ok, true);
    assert.equal(canTransitionOrderStatus('paid', 'canceled').ok, true);
  });

  it('allows shipped → delivered', () => {
    assert.equal(canTransitionOrderStatus('shipped', 'delivered').ok, true);
  });

  it('blocks pending → paid (webhook-only)', () => {
    const r = canTransitionOrderStatus('pending', 'paid');
    assert.equal(r.ok, false);
  });

  it('blocks delivered → anything', () => {
    assert.equal(canTransitionOrderStatus('delivered', 'shipped').ok, false);
    assert.deepEqual(getAllowedNextStatuses('delivered'), []);
  });

  it('rejects unknown target status', () => {
    const r = canTransitionOrderStatus('paid', 'processing');
    assert.equal(r.ok, false);
  });
});
