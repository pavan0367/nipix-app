import api from './api';

export const vaultApi = {
  getStatus: async () => {
    const res = await api.get('/vault/status');
    return res.data;
  },

  setup: async ({ pin, confirmPin, recoveryMethod, recoveryDate }) => {
    const res = await api.post('/vault/setup', {
      pin,
      confirmPin,
      recoveryMethod,
      recoveryDate
    });
    return res.data;
  },

  unlock: async (pin) => {
    const res = await api.post('/vault/unlock', { pin });
    return res.data;
  },

  verifyRecovery: async ({ recoveryMethod, recoveryDate }) => {
    const res = await api.post('/vault/verify-recovery', {
      recoveryMethod,
      recoveryDate
    });
    return res.data;
  },

  resetPin: async ({ resetToken, newPin, confirmPin }) => {
    const res = await api.post('/vault/reset-pin', {
      resetToken,
      newPin,
      confirmPin
    });
    return res.data;
  },

  changePin: async ({ currentPin, newPin, confirmPin }) => {
    const res = await api.post('/vault/change-pin', {
      currentPin,
      newPin,
      confirmPin
    });
    return res.data;
  },

  updateRecoveryMethod: async ({ currentPin, recoveryMethod, recoveryDate }) => {
    const res = await api.put('/vault/recovery-method', {
      currentPin,
      recoveryMethod,
      recoveryDate
    });
    return res.data;
  },

  getConversations: async () => {
    const res = await api.get('/vault/conversations');
    return res.data;
  },

  startConversation: async (targetUserId) => {
    const res = await api.post('/vault/conversations', { targetUserId });
    return res.data;
  },

  getMessages: async (conversationId) => {
    const res = await api.get(`/vault/conversations/${conversationId}/messages`);
    return res.data;
  },

  sendMessage: async (conversationId, payload) => {
    const res = await api.post(`/vault/conversations/${conversationId}/messages`, payload);
    return res.data;
  },

  searchScholars: async (query) => {
    const res = await api.get(`/vault/users/search?q=${encodeURIComponent(query || '')}`);
    return res.data;
  },

  getCallLogs: async () => {
    const res = await api.get('/vault/call-logs');
    return res.data;
  },

  recordCallLog: async (payload) => {
    const res = await api.post('/vault/call-logs', payload);
    return res.data;
  }
};

export default vaultApi;
