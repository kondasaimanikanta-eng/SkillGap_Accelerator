import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/assessment', label: 'Diagnostic Test', icon: 'bi-clipboard-check-fill' },
    { to: '/plan', label: '7-Day Action Plan', icon: 'bi-calendar-check-fill' },
    { to: '/retest', label: 'Growth & Retest', icon: 'bi-graph-up-arrow' },
    {
      to: '/internship',
      label: 'Internship Module',
      icon: 'bi-mortarboard-fill',
      isSpecial: true,
      badge: 'College Track',
    },
    { to: '/profile', label: 'Career Track', icon: 'bi-person-badge-fill' },
  ];

  return (
    <header className="site-header sticky-top">
      {/* Top Banner Bar with Branding and Navigation */}
      <nav className="navbar navbar-expand-xl navbar-light bg-white border-bottom py-2 px-3 px-lg-4">
        <div className="container-fluid px-0">
          {/* Logo & Brand */}
          <NavLink to="/dashboard" className="navbar-brand d-flex align-items-center gap-2 me-4 text-decoration-none">
            <div className="brand-logo-box">
              <i className="bi bi-lightning-charge-fill text-white fs-5"></i>
            </div>
            <div>
              <div className="fw-bold fs-5 lh-1 text-dark">
                SkillGap<span className="brand-gradient-text">to Action</span>
              </div>
              <small className="text-muted fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                TECHNICAL SKILL GAP ACCELERATOR
              </small>
            </div>
          </NavLink>

          {/* Mobile Toggle Button */}
          <button
            className="navbar-toggler border-0 shadow-none d-xl-none p-1"
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <i className={`bi ${mobileMenuOpen ? 'bi-x-lg text-danger' : 'bi-list text-dark'} fs-3`}></i>
          </button>

          {/* Desktop Navigation Links */}
          <div className="collapse navbar-collapse d-none d-xl-flex justify-content-between align-items-center">
            <ul className="navbar-nav me-auto mb-2 mb-xl-0 gap-1">
              {navLinks.map((item) => {
                const isActive = location.pathname.startsWith(item.to);
                return (
                  <li key={item.to} className="nav-item">
                    <NavLink
                      to={item.to}
                      className={`top-nav-link ${isActive ? 'active' : ''} ${item.isSpecial ? 'special-internship-link' : ''}`}
                    >
                      <i className={`bi ${item.icon} me-1`}></i>
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="badge rounded-pill ms-1 bg-warning text-dark px-2 py-1" style={{ fontSize: '0.65rem' }}>
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            {/* User Profile & Actions on Right */}
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2 px-3 py-1 bg-light rounded-pill border">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                  style={{
                    width: '30px',
                    height: '30px',
                    background: 'linear-gradient(135deg, #4f46e5, #06b6d4)',
                    fontSize: '0.8rem',
                  }}
                >
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="text-start pe-1" style={{ lineHeight: '1.2' }}>
                  <div className="fw-semibold text-dark text-truncate" style={{ maxWidth: '140px', fontSize: '0.8rem' }}>
                    {user?.name || 'Candidate'}
                  </div>
                  <div className="text-muted text-truncate" style={{ maxWidth: '140px', fontSize: '0.68rem' }}>
                    {user?.preferredRole || 'Track Selected'}
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 fw-semibold d-flex align-items-center gap-1"
                title="Log out of session"
              >
                <i className="bi bi-box-arrow-right"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="d-xl-none w-100 pt-3 pb-2 border-top mt-2">
            <ul className="navbar-nav gap-1 mb-3">
              {navLinks.map((item) => {
                const isActive = location.pathname.startsWith(item.to);
                return (
                  <li key={item.to} className="nav-item">
                    <NavLink
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`top-nav-link d-flex align-items-center justify-content-between ${
                        isActive ? 'active' : ''
                      } ${item.isSpecial ? 'special-internship-link' : ''}`}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <i className={`bi ${item.icon}`}></i>
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="badge bg-warning text-dark small">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>

            <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between border">
              <div>
                <div className="fw-semibold text-dark small">{user?.name}</div>
                <div className="text-muted small">{user?.preferredRole}</div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm rounded-pill px-3"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
