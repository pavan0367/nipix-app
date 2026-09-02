import api from './api';

export const getFeed = () => api.get('/posts/feed');
export const createPost = (formData) => api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const toggleLike = (id) => api.post(`/posts/${id}/like`);
export const toggleSave = (id) => api.post(`/posts/${id}/save`);
export const addComment = (id, commentText) => api.post(`/posts/${id}/comments`, { commentText });