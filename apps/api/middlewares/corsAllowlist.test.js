const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const {
  buildAllowedOrigins,
  createCorsOriginDelegate,
} = require('./corsAllowlist');

function invokeOrigin(originFn, origin) {
  return new Promise((resolve, reject) => {
    originFn(origin, (err, ok) => {
      if (err) reject(err);
      else resolve(ok);
    });
  });
}

describe('buildAllowedOrigins', () => {
  const prev = { ...process.env };

  beforeEach(() => {
    process.env = { ...prev };
    delete process.env.FRONTEND_URL;
    delete process.env.DASHBOARD_URL;
    delete process.env.ALLOWED_ORIGINS;
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env = { ...prev };
  });

  it('includes FRONTEND_URL and ALLOWED_ORIGINS', () => {
    process.env.FRONTEND_URL = 'https://shop.example.com/';
    process.env.ALLOWED_ORIGINS = 'https://a.example.com, https://b.example.com';
    const origins = buildAllowedOrigins();
    assert.ok(origins.has('https://shop.example.com'));
    assert.ok(origins.has('https://a.example.com'));
    assert.ok(origins.has('https://b.example.com'));
  });

  it('includes localhost defaults outside production', () => {
    process.env.NODE_ENV = 'development';
    const origins = buildAllowedOrigins();
    assert.ok(origins.has('http://localhost:3001'));
  });
});

describe('createCorsOriginDelegate', () => {
  const prev = { ...process.env };

  beforeEach(() => {
    process.env = { ...prev };
    process.env.NODE_ENV = 'production';
    process.env.FRONTEND_URL = 'https://shop.example.com';
    delete process.env.CORS_RELAXED;
  });

  afterEach(() => {
    process.env = { ...prev };
  });

  it('allows requests with no Origin', async () => {
    const originFn = createCorsOriginDelegate();
    const ok = await invokeOrigin(originFn, undefined);
    assert.equal(ok, true);
  });

  it('allows allowlisted origins', async () => {
    const originFn = createCorsOriginDelegate();
    const ok = await invokeOrigin(originFn, 'https://shop.example.com');
    assert.equal(ok, true);
  });

  it('blocks unknown origins in production', async () => {
    const originFn = createCorsOriginDelegate();
    await assert.rejects(
      () => invokeOrigin(originFn, 'https://evil.example.com'),
      /CORS blocked/,
    );
  });
});
