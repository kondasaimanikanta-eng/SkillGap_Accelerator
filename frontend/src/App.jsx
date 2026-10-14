import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import Results from './pages/Results';
import LearningPlan from './pages/LearningPlan';
import RetestProgress from './pages/RetestProgress';

function App() {
  return (
    <AuthProvider>
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
        </Route>

        {/* Fallback routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
