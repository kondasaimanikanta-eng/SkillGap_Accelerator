import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillgap_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if invalid or expired (unless on login/register endpoints)
      if (
        !window.location.pathname.includes('/login') &&
        !window.location.pathname.includes('/register')
      ) {
        localStorage.removeItem('skillgap_token');
        localStorage.removeItem('skillgap_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ================= AUTH SERVICES =================
export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Stateless fallback
    } finally {
      localStorage.removeItem('skillgap_token');
      localStorage.removeItem('skillgap_user');
    }
  },
};

// ================= PROFILE SERVICES =================
export const profileService = {
  getProfile: async () => {
    const res = await api.get('/profile');
    return res.data;
  },
  saveProfile: async (profileData) => {
    const res = await api.post('/profile', profileData);
    return res.data;
  },
};

// ================= ASSESSMENT SERVICES =================
export const assessmentService = {
  getRoles: async () => {
    const res = await api.get('/roles');
    return res.data;
  },
  getQuestions: async (role, setNumber = 1) => {
    const encodedRole = encodeURIComponent(role);
    const res = await api.get(`/assessment/questions/${encodedRole}?set=${setNumber}`);
    return res.data;
  },
  submitAssessment: async (data) => {
    const res = await api.post('/assessment/submit', data);
    return res.data;
  },
  getHistory: async () => {
    const res = await api.get('/assessment/history');
    return res.data;
  },
  getAttemptById: async (id) => {
    const res = await api.get(`/assessment/attempt/${id}`);
    return res.data;
  },
  getComparison: async (role) => {
    const url = role ? `/assessment/comparison?role=${encodeURIComponent(role)}` : '/assessment/comparison';
    const res = await api.get(url);
    return res.data;
  },
};

// ================= LEARNING PLAN SERVICES =================
export const planService = {
  generatePlan: async (attemptId) => {
    const res = await api.post('/plan/generate', { attemptId });
    return res.data;
  },
  getCurrentPlan: async () => {
    const res = await api.get('/plan/current');
    return res.data;
  },
  toggleTask: async (taskId) => {
    const res = await api.patch(`/plan/task/${taskId}`);
    return res.data;
  },
  rescheduleTasks: async () => {
    const res = await api.post('/plan/reschedule');
    return res.data;
  },
};

// ================= DASHBOARD SERVICES =================
export const dashboardService = {
  getStats: async () => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },
};

export default api;
