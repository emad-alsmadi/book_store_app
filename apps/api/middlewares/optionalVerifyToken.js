const jwt = require('jsonwebtoken');

/**
 * Attach req.user when a valid Bearer token is present; never fail the request.
 * Used for public catalog routes that unlock staff-only filters when authenticated.
 */
const optionalVerifyToken = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.headers.token;

  if (!token || !process.env.JWT_SECRET_KEY) {
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch {
    // Ignore invalid tokens on optional paths
  }
  return next();
};

module.exports = { optionalVerifyToken };
