const authService = require('../services/authService');
const emailService = require('../services/emailService');

const extractClientMeta = (req) => {
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || 'Unknown IP';
  const userAgent = req.headers['user-agent'] || 'Web Browser';
  return { ip, userAgent };
};

const authController = {
  register: async (req, res) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Email and 6-digit code are required.' });
      }
      const result = await authService.verifyEmail({ email, code });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  resendVerification: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email address is required.' });
      }
      const result = await authService.resendVerification({ email });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const clientMeta = extractClientMeta(req);
      const result = await authService.login({ ...req.body, clientMeta });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  googleAuth: async (req, res) => {
    try {
      const { credential } = req.body;
      const clientMeta = extractClientMeta(req);
      const result = await authService.googleAuth({ credential, clientMeta });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email address is required.' });
      }
      const result = await authService.forgotPassword({ email });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  verifyResetOtp: async (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ success: false, message: 'Email and verification code are required.' });
      }
      const result = await authService.verifyResetOtp({ email, code });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, resetToken, newPassword } = req.body;
      if (!email || !resetToken || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, reset token, and new password are required.' });
      }
      const result = await authService.resetPassword({ email, resetToken, newPassword });
      res.json({ success: true, ...result });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  getMe: async (req, res) => {
    try {
      const user = await authService.getMe(req.user.id);
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  getEmailLogs: async (req, res) => {
    try {
      const logs = emailService.getDeliveryLogs();
      res.json({ success: true, logs });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = authController;