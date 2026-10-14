import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('skillgap_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize user from token on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('skillgap_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          setUser(res.user);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          localStorage.removeItem('skillgap_token');
          localStorage.removeItem('skillgap_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (loginIdentifier, password) => {
    const res = await authService.login({ loginIdentifier, password });
    if (res.token) {
      localStorage.setItem('skillgap_token', res.token);
      localStorage.setItem('skillgap_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const register = async (name, username, email, password) => {
    const res = await authService.register({ name, username, email, password });
    if (res.token) {
      localStorage.setItem('skillgap_token', res.token);
      localStorage.setItem('skillgap_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      setUser(res.user);
      localStorage.setItem('skillgap_user', JSON.stringify(res.user));
      return res.user;
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        hasProfile: user?.hasProfile || false,
        preferredRole: user?.preferredRole || null,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
