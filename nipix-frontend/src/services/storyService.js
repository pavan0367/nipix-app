import api from './api';

export const getStoriesFeed = () => api.get('/stories/feed');
export const uploadStory = (formData) => api.post('/stories', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const viewStory = (storyId) => api.post(`/stories/${storyId}/view`);
export const deleteStory = (storyId) => api.delete(`/stories/${storyId}`);

export default {
  getStoriesFeed,
  uploadStory,
  viewStory,
  deleteStory,
};
