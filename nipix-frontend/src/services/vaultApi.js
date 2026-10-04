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
  }
};

export default vaultApi;
