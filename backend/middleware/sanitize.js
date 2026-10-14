/**
 * Deep NoSQL Injection and XSS Sanitization Middleware.
 * Strips dangerous MongoDB query operator keys ($where, $gt, $regex, etc.)
 * and sanitizes script tags from request payloads.
 */
function sanitizeValue(value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (typeof value === 'object') {
    const cleanObj = {};
    for (const key of Object.keys(value)) {
      // Disallow keys beginning with $ (MongoDB query operators) or containing .
      if (!key.startsWith('$') && !key.includes('.')) {
        cleanObj[key] = sanitizeValue(value[key]);
      }
    }
    return cleanObj;
  }

  if (typeof value === 'string') {
    // Basic XSS tag defense: remove explicit <script> tags
    return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
  }

  return value;
}

const sanitizeMiddleware = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }
  next();
};

module.exports = {
  sanitizeMiddleware,
  sanitizeValue,
};
