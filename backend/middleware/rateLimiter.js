/**
 * In-Memory Sliding-Window Rate Limiter.
 * Defends against brute-force attacks, credential stuffing, and Denial of Service (DoS).
 */
class RateLimiter {
  constructor(windowMs = 15 * 60 * 1000, maxRequests = 100, message = 'Too many requests, please try again later.') {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
    this.message = message;
    this.hits = new Map(); // Map<ip, Array<timestamp>>

    // Periodic cleanup of stale IP records every 5 minutes to prevent memory leaks
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [ip, timestamps] of this.hits.entries()) {
        const valid = timestamps.filter((t) => now - t < this.windowMs);
        if (valid.length === 0) {
          this.hits.delete(ip);
        } else {
          this.hits.set(ip, valid);
        }
      }
    }, 5 * 60 * 1000);

    // Ensure timer doesn't prevent process exit
    if (this.cleanupTimer.unref) this.cleanupTimer.unref();
  }

  middleware() {
    return (req, res, next) => {
      const ip =
        req.ip ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        '127.0.0.1';
      const now = Date.now();

      let timestamps = this.hits.get(ip) || [];
      // Filter out timestamps outside the active window
      timestamps = timestamps.filter((t) => now - t < this.windowMs);

      if (timestamps.length >= this.maxRequests) {
        const oldest = timestamps[0];
        const resetTime = Math.ceil((oldest + this.windowMs - now) / 1000);

        res.setHeader('Retry-After', resetTime);
        res.setHeader('RateLimit-Limit', this.maxRequests);
        res.setHeader('RateLimit-Remaining', 0);
        res.setHeader('RateLimit-Reset', resetTime);

        return res.status(429).json({
          success: false,
          error: 'Too Many Requests',
          message: this.message,
          retryAfterSeconds: resetTime,
        });
      }

      timestamps.push(now);
      this.hits.set(ip, timestamps);

      res.setHeader('RateLimit-Limit', this.maxRequests);
      res.setHeader('RateLimit-Remaining', Math.max(0, this.maxRequests - timestamps.length));

      next();
    };
  }
}

// Strict limiter for authentication routes (login / register): 30 requests per 15 mins
const authLimiter = new RateLimiter(
  15 * 60 * 1000,
  30,
  'Too many authentication attempts from this IP address. Please wait 15 minutes before trying again.'
);

// General limiter for public API endpoints: 400 requests per 15 mins
const apiLimiter = new RateLimiter(
  15 * 60 * 1000,
  400,
  'API rate limit exceeded. Please throttle your requests.'
);

module.exports = {
  RateLimiter,
  authLimiter: authLimiter.middleware(),
  apiLimiter: apiLimiter.middleware(),
};
