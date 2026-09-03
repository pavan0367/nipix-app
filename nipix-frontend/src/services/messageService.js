import api from './api';

export const getConversations = () => api.get('/conversations');
export const getMessages = (conversationId) => api.get(`/messages/${conversationId}`);
export const sendMessage = (conversationId, text) => api.post('/messages', { conversationId, text });
export const markMessageRead = (id) => api.put(`/messages/${id}/read`);

export default {
  getConversations,
  getMessages,
  sendMessage,
  markMessageRead,
};
