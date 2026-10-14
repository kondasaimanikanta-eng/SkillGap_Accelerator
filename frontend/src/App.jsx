import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// High-Efficiency Code-Splitting: Lazy-load page components on demand
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Assessment = lazy(() => import('./pages/Assessment'));
const Results = lazy(() => import('./pages/Results'));
const LearningPlan = lazy(() => import('./pages/LearningPlan'));
const RetestProgress = lazy(() => import('./pages/RetestProgress'));
const InternshipHub = lazy(() => import('./pages/InternshipHub'));

// Minimal fallback spinner during chunk hydration
const PageSuspenseFallback = () => (
  <div className="d-flex align-items-center justify-content-center min-vh-50 py-5">
    <div className="text-center">
      <div className="spinner-border text-primary spinner-border-sm" role="status">
        <span className="visually-hidden">Loading page...</span>
      </div>
      <p className="text-muted small mt-2 mb-0">Loading view...</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<PageSuspenseFallback />}>
        <Routes>
          {/* Public Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Profile page does not require an existing profile */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute requireProfile={false}>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/results" element={<Results />} />
            <Route path="/results/:attemptId" element={<Results />} />
            <Route path="/plan" element={<LearningPlan />} />
            <Route path="/retest" element={<RetestProgress />} />
            <Route path="/internship" element={<InternshipHub />} />
          </Route>

          {/* Fallback routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
