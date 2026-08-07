const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { rateLimit } = require('./rateLimit');

function mockRes() {
  const headers = {};
  return {
    headers,
    setHeader(k, v) {
      headers[k] = v;
    },
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('rateLimit', () => {
  it('allows under the max and blocks after', () => {
    const mw = rateLimit({ windowMs: 60_000, max: 2, keyPrefix: 't' });
    const req = { ip: '1.2.3.4', headers: {} };

    let nextCount = 0;
    const next = () => {
      nextCount += 1;
    };

    const r1 = mockRes();
    mw(req, r1, next);
    const r2 = mockRes();
    mw(req, r2, next);
    assert.equal(nextCount, 2);

    const r3 = mockRes();
    mw(req, r3, next);
    assert.equal(nextCount, 2);
    assert.equal(r3.statusCode, 429);
    assert.equal(r3.body.code, 'RATE_LIMITED');
  });
});
