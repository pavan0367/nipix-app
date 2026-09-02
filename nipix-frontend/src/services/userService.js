import api from './api';

export const getProfile = (id) => api.get(`/users/${id}`);
export const updateProfile = (id, data) => api.put(`/users/${id}`, data);
export const toggleFollow = (id) => api.post(`/users/${id}/follow`);
export const searchUsers = (query) => api.get(`/users/search?q=${query}`);