import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { to: '/profile', label: 'Student Profile', icon: 'bi-person-badge-fill' },
    { to: '/assessment', label: 'Skill Assessment', icon: 'bi-clipboard-check-fill' },
    { to: '/results', label: 'Assessment Results', icon: 'bi-graph-up-arrow' },
    { to: '/plan', label: '7-Day Action Plan', icon: 'bi-calendar-check-fill' },
    { to: '/retest', label: 'Progress & Retest', icon: 'bi-award-fill' },
  ];

  return (
    <nav className="top-navbar d-lg-none shadow-sm">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center bg-primary text-white rounded-3"
            style={{ width: '32px', height: '32px' }}
          >
            <i className="bi bi-mortarboard-fill"></i>
          </div>
          <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
            SkillGap<span className="text-primary">-to-Action</span>
          </span>
        </div>

        <button
          className="btn btn-light border btn-sm"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-list'} fs-5`}></i>
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="pt-3 pb-2 border-top mt-3">
          <div className="nav flex-column mb-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `nav-link-saas ${isActive ? 'active' : ''}`
                }
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="pt-2 border-top px-3 d-flex align-items-center justify-content-between">
            <span className="text-muted small">
              Signed in as <strong>{user?.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm"
            >
              <i className="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
