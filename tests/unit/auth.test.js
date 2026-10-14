const { describe, it } = require('node:test');
const assert = require('node:assert');
const bcrypt = require('../../backend/node_modules/bcryptjs');
const jwt = require('../../backend/node_modules/jsonwebtoken');
const { validatePasswordStrength } = require('../../backend/utils/passwordValidator');

describe('Unit: Authentication & Credential Security', () => {
  it('should validate strong password complexity requirements', () => {
    const strong = validatePasswordStrength('Password@2026!');
    assert.strictEqual(strong.isValid, true, 'Strong password should pass validation');

    const tooShort = validatePasswordStrength('Pass1!');
    assert.strictEqual(tooShort.isValid, false, 'Password shorter than 8 chars must fail');

    const noUpper = validatePasswordStrength('password123!');
    assert.strictEqual(noUpper.isValid, false, 'Password without uppercase must fail');

    const noDigits = validatePasswordStrength('PasswordOnly');
    assert.strictEqual(noDigits.isValid, false, 'Password without digits/special chars must fail');
  });

  it('should hash passwords with salt rounds and verify bcrypt comparison', async () => {
    const rawPassword = 'SecureInternship#2026';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    assert.notStrictEqual(hash, rawPassword, 'Hashed password must not match plain text');
    assert.ok(hash.startsWith('$2'), 'Must be a valid bcrypt hash');

    const matches = await bcrypt.compare(rawPassword, hash);
    assert.strictEqual(matches, true, 'Correct password must match hash');

    const wrongMatches = await bcrypt.compare('WrongPassword#123', hash);
    assert.strictEqual(wrongMatches, false, 'Wrong password must be rejected');
  });

  it('should generate and verify tamper-proof JWT tokens', () => {
    const secret = 'test_jwt_secret_key_123';
    const payload = { id: 'user_test_id_99', role: 'Frontend Engineer' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    assert.ok(typeof token === 'string', 'Token must be a non-empty string');
    assert.strictEqual(token.split('.').length, 3, 'JWT must contain three segments (header.payload.signature)');

    const decoded = jwt.verify(token, secret);
    assert.strictEqual(decoded.id, 'user_test_id_99', 'Decoded token payload must match input id');
    assert.strictEqual(decoded.role, 'Frontend Engineer', 'Decoded role must match input role');

    assert.throws(() => {
      jwt.verify(token, 'invalid_wrong_secret');
    }, /invalid signature/, 'Tampered token must throw invalid signature error');
  });
});
