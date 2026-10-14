import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireProfile = true }) => {
  const { isAuthenticated, hasProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center min-vh-100"
        style={{ backgroundColor: '#f8fafc' }}
      >
        <div
          className="spinner-border text-primary"
          style={{ width: '3rem', height: '3rem' }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted fw-semibold">Loading SkillGap-to-Action...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If student has not completed profile, force redirection to /profile first (unless already there)
  if (requireProfile && !hasProfile && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
