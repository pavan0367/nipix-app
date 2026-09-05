import axios from 'axios';

// Detect whether running in local browser environment
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const getBaseApiUrl = () => {
  // If on localhost and no explicit remote override, use local backend
  if (isLocalhost && !process.env.REACT_APP_FORCE_REMOTE) {
    return 'http://localhost:5000/api';
  }
  return process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseApiUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nipix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;