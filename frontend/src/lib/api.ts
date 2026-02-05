import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect if we are already on an auth page or if the error is from an auth endpoint
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      const isAuthPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/auth/');

      if (!isAuthEndpoint && !isAuthPage) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/auth/signin';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
