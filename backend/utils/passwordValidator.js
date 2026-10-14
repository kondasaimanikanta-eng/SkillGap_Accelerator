/**
 * Password Strength & Complexity Validator.
 * Enforces enterprise-grade password security policies.
 */
function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      message: 'Password is required and must be a string.',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters long.',
    };
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!hasUpper || !hasLower || (!hasDigit && !hasSpecial)) {
    return {
      isValid: false,
      message:
        'Password must contain an uppercase letter, a lowercase letter, and at least one number or special character.',
    };
  }

  return {
    isValid: true,
  };
}

module.exports = {
  validatePasswordStrength,
};
