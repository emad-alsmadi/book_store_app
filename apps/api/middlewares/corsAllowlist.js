/**
 * Build CORS origin allowlist from env.
 * FRONTEND_URL, DASHBOARD_URL, comma-separated ALLOWED_ORIGINS.
 * Non-production also allows common local dev origins.
 */
function buildAllowedOrigins() {
  const origins = new Set();

  const add = (value) => {
    if (!value || typeof value !== 'string') return;
    value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((origin) => origins.add(origin.replace(/\/$/, '')));
  };

  add(process.env.FRONTEND_URL);
  add(process.env.DASHBOARD_URL);
  add(process.env.ALLOWED_ORIGINS);

  if (process.env.NODE_ENV !== 'production') {
    add('http://localhost:3001');
    add('http://localhost:3002');
    add('http://localhost:5173');
    add('http://127.0.0.1:3001');
    add('http://127.0.0.1:3002');
    add('http://127.0.0.1:5173');
  }

  return origins;
}

function createCorsOriginDelegate() {
  const allowed = buildAllowedOrigins();

  return function corsOrigin(origin, callback) {
    // Non-browser clients (curl, Stripe webhooks, server-to-server) send no Origin
    if (!origin) {
      return callback(null, true);
    }

    const normalized = origin.replace(/\/$/, '');
    if (allowed.has(normalized)) {
      return callback(null, true);
    }

    // Fail closed in production; allow with warning only when explicitly opted in
    if (
      process.env.NODE_ENV !== 'production' &&
      process.env.CORS_RELAXED === 'true'
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  };
}

module.exports = {
  buildAllowedOrigins,
  createCorsOriginDelegate,
};
