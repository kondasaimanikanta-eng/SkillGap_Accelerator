/**
 * HTTP Security Headers Middleware.
 * Implements strict defense-in-depth security standards without external dependencies.
 * Defends against XSS, clickjacking, MIME-sniffing, and SSL downgrade attacks.
 */
const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME-type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable browser XSS filtering
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Enforce HTTPS transport security (1 year max-age)
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  // Control referrer information exposure
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Disable sensitive hardware/browser APIs
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy for robust XSS prevention
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:5000 http://localhost:3000"
  );

  // Remove Express fingerprinting header
  res.removeHeader('X-Powered-By');

  next();
};

module.exports = securityHeaders;
