import axios from 'axios';
import { API_BASE } from '../utils/constants';

export const getBaseApiUrl = () => {
  return API_BASE;
};

const api = axios.create({
  baseURL: API_BASE,
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