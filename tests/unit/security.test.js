const { describe, it } = require('node:test');
const assert = require('node:assert');
const { sanitizeValue } = require('../../backend/middleware/sanitize');
const { RateLimiter } = require('../../backend/middleware/rateLimiter');
const securityHeaders = require('../../backend/middleware/securityHeaders');

describe('Unit: Security Hardening & Attack Defense', () => {
  it('should deeply sanitize and strip malicious NoSQL injection operators ($where, $gt)', () => {
    const maliciousPayload = {
      username: 'admin',
      password: { $gt: '' },
      nested: {
        filter: { $where: 'sleep(5000)' },
        validKey: 'safe_text',
      },
      'bad.key': 'should_be_stripped',
    };

    const clean = sanitizeValue(maliciousPayload);

    assert.strictEqual(clean.username, 'admin', 'Safe keys must remain');
    assert.strictEqual(clean.password.$gt, undefined, '$gt operator must be stripped');
    assert.strictEqual(clean.nested.filter.$where, undefined, '$where operator must be stripped');
    assert.strictEqual(clean.nested.validKey, 'safe_text', 'Nested safe key must remain');
    assert.strictEqual(clean['bad.key'], undefined, 'Key with dot notation must be stripped');
  });

  it('should strip script tags from user inputs to prevent stored XSS attacks', () => {
    const xssPayload = {
      name: 'John <script>alert("hacked")</script> Doe',
      bio: '<script src="http://evil.com/payload.js"></script>Clean Bio',
    };

    const clean = sanitizeValue(xssPayload);

    assert.strictEqual(clean.name, 'John  Doe', 'Inline script tag must be removed');
    assert.strictEqual(clean.bio, 'Clean Bio', 'Remote script tag must be removed');
  });

  it('should enforce sliding-window rate limits and block excess calls with 429', () => {
    const limiter = new RateLimiter(60000, 3, 'Rate limit reached');
    const middleware = limiter.middleware();

    const mockRes = {
      headers: {},
      statusCode: 200,
      jsonBody: null,
      setHeader(k, v) {
        this.headers[k] = v;
      },
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(body) {
        this.jsonBody = body;
      },
    };

    const mockReq = { ip: '192.168.1.100', headers: {}, connection: {} };
    let nextCalled = 0;
    const next = () => {
      nextCalled++;
    };

    // First 3 requests must pass
    middleware(mockReq, mockRes, next);
    middleware(mockReq, mockRes, next);
    middleware(mockReq, mockRes, next);
    assert.strictEqual(nextCalled, 3, 'First 3 requests must be accepted');

    // 4th request must be blocked with HTTP 429
    middleware(mockReq, mockRes, next);
    assert.strictEqual(nextCalled, 3, '4th request must not invoke next()');
    assert.strictEqual(mockRes.statusCode, 429, '4th request must receive 429 status');
    assert.strictEqual(mockRes.jsonBody.error, 'Too Many Requests');
  });

  it('should inject comprehensive security headers into HTTP responses', () => {
    const mockRes = {
      headers: {},
      setHeader(k, v) {
        this.headers[k] = v;
      },
      removeHeader(k) {
        delete this.headers[k];
      },
    };

    let nextCalled = false;
    securityHeaders({}, mockRes, () => {
      nextCalled = true;
    });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(mockRes.headers['X-Frame-Options'], 'DENY');
    assert.strictEqual(mockRes.headers['X-Content-Type-Options'], 'nosniff');
    assert.strictEqual(mockRes.headers['X-XSS-Protection'], '1; mode=block');
    assert.ok(mockRes.headers['Strict-Transport-Security'].includes('max-age=31536000'));
    assert.ok(mockRes.headers['Content-Security-Policy'].includes("default-src 'self'"));
  });
});
