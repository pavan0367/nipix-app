import api from './api';

export const getReels = (limit = 20, offset = 0) => api.get(`/reels?limit=${limit}&offset=${offset}`);
export const getReelById = (id) => api.get(`/reels/${id}`);
export const uploadReel = (formData) => api.post('/reels', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const toggleLikeReel = (id) => api.post(`/reels/${id}/like`);
export const addReelComment = (id, commentText) => api.post(`/reels/${id}/comments`, { comment_text: commentText });
export const deleteReel = (id) => api.delete(`/reels/${id}`);

export default {
  getReels,
  getReelById,
  uploadReel,
  toggleLikeReel,
  addReelComment,
  deleteReel,
};
