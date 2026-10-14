import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginIdentifier.trim() || !password) {
      setError('Please provide your email/username and password');
      return;
    }

    try {
      setLoading(true);
      const res = await login(loginIdentifier.trim(), password);
      if (res.user?.hasProfile) {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to sign in. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoginIdentifier('demo.student@college.edu');
    setPassword('password123');
    try {
      setLoading(true);
      const res = await login('demo.student@college.edu', 'password123');
      if (res.user?.hasProfile) {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch {
      setError('Demo student account not seeded yet. You can register a new account in 10 seconds.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 py-5 px-3"
      style={{
        background:
          'radial-gradient(circle at top right, #eef2ff 0%, #f8fafc 60%, #f1f5f9 100%)',
      }}
    >
      <div style={{ maxWidth: '440px', width: '100%' }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-4 shadow-sm mb-3"
            style={{ width: '56px', height: '56px', fontSize: '1.75rem' }}
          >
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <h1 className="h3 fw-bold mb-1">SkillGap-to-Action</h1>
          <p className="text-muted small">
            Internship Preparation MVP for College Students
          </p>
        </div>

        {/* Login Card */}
        <div className="card-saas p-4 p-sm-5">
          <div className="mb-4">
            <h2 className="h4 fw-bold mb-1">Student Sign In</h2>
            <p className="text-muted small mb-0">
              Enter your credentials to continue your internship preparation.
            </p>
          </div>

          {error && (
            <div
              className="alert alert-danger d-flex align-items-center py-2 px-3 small rounded-3 mb-4"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label
                htmlFor="loginIdentifier"
                className="form-label small fw-semibold text-secondary"
              >
                Email or Username
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  id="loginIdentifier"
                  className="form-control border-start-0"
                  placeholder="student@college.edu or username"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <label
                  htmlFor="password"
                  className="form-label small fw-semibold text-secondary"
                >
                  Password
                </label>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-muted">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="form-control border-start-0 border-end-0"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-group-text bg-white border-start-0 text-muted"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i
                    className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                  ></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-saas w-100 py-2 mb-3"
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>

            {/* Quick Demo Student Fill Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="btn btn-outline-secondary w-100 btn-sm py-2 mb-3 rounded-3"
            >
              <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
              Try Demo Student Account
            </button>
          </form>

          <div className="text-center pt-3 border-top">
            <span className="text-muted small">Don't have an account? </span>
            <Link
              to="/register"
              className="fw-semibold text-primary text-decoration-none small"
            >
              Register here
            </Link>
          </div>
        </div>

        {/* Hackathon MVP Disclaimer */}
        <p className="text-center text-muted small mt-4 mb-0" style={{ fontSize: '0.78rem' }}>
          College Hackathon MVP &bull; Genuine Backend Authentication &bull; JWT
        </p>
      </div>
    </div>
  );
};

export default Login;
