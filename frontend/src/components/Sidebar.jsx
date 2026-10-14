import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    <aside className="app-sidebar shadow-sm">
      {/* Brand Header */}
      <div className="p-3 border-bottom d-flex align-items-center gap-2">
        <div
          className="d-flex align-items-center justify-content-center bg-primary text-white rounded-3"
          style={{ width: '38px', height: '38px', fontSize: '1.2rem' }}
        >
          <i className="bi bi-mortarboard-fill"></i>
        </div>
        <div>
          <div className="fw-bold text-dark lh-1" style={{ fontSize: '1rem' }}>
            SkillGap<span className="text-primary">-to-Action</span>
          </div>
          <small className="text-muted" style={{ fontSize: '0.72rem' }}>
            Internship Prep MVP
          </small>
        </div>
      </div>

      {/* Navigation links */}
      <div className="py-3 flex-grow-1 overflow-auto">
        <div className="px-3 pb-2 text-uppercase text-muted fw-bold" style={{ fontSize: '0.68rem', letterSpacing: '0.05em' }}>
          Preparation Workflow
        </div>
        <nav className="nav flex-column">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link-saas ${isActive ? 'active' : ''}`
              }
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="p-3 border-top bg-light">
        <div className="d-flex align-items-center justify-content-between">
          <div className="overflow-hidden me-2">
            <div className="fw-semibold text-dark text-truncate" style={{ fontSize: '0.875rem' }}>
              {user?.name || 'Student'}
            </div>
            <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
              {user?.preferredRole || user?.username || 'Candidate'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm p-1 px-2 border-0"
            title="Log out"
          >
            <i className="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
