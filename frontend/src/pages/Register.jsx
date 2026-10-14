import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, username, email, password, confirmPassword } = formData;

    if (!name.trim() || !username.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), username.trim(), email.trim(), password);
      // Requirement: "After registration, ask the student to complete a short profile."
      navigate('/profile');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed. Please check your information and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 py-5 px-3"
      style={{
        background:
          'radial-gradient(circle at top left, #eef2ff 0%, #f8fafc 60%, #f1f5f9 100%)',
      }}
    >
      <div style={{ maxWidth: '480px', width: '100%' }}>
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
            Start your personalized 7-day internship roadmap
          </p>
        </div>

        {/* Registration Card */}
        <div className="card-saas p-4 p-sm-5">
          <div className="mb-4">
            <h2 className="h4 fw-bold mb-1">Create Student Account</h2>
            <p className="text-muted small mb-0">
              Register now to assess your technical readiness and bridge gaps.
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
            <div className="row g-3 mb-3">
              <div className="col-12">
                <label
                  htmlFor="name"
                  className="form-label small fw-semibold text-secondary"
                >
                  Full Name
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control border-start-0"
                    placeholder="e.g. Rahul Verma"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12">
                <label
                  htmlFor="username"
                  className="form-label small fw-semibold text-secondary"
                >
                  Username
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <i className="bi bi-at"></i>
                  </span>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="form-control border-start-0"
                    placeholder="rahul_dev"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12">
                <label
                  htmlFor="email"
                  className="form-label small fw-semibold text-secondary"
                >
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0 text-muted">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control border-start-0"
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <label
                  htmlFor="password"
                  className="form-label small fw-semibold text-secondary"
                >
                  Password
                </label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-control border-end-0"
                    placeholder="Min 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="input-group-text bg-white border-start-0 text-muted"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password view"
                  >
                    <i
                      className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                    ></i>
                  </button>
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <label
                  htmlFor="confirmPassword"
                  className="form-label small fw-semibold text-secondary"
                >
                  Confirm Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-saas w-100 py-2 mb-3 mt-2"
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account & Setup Profile{' '}
                  <i className="bi bi-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-3 border-top">
            <span className="text-muted small">Already have an account? </span>
            <Link
              to="/login"
              className="fw-semibold text-primary text-decoration-none small"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
