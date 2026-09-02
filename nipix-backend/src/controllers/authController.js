const authService = require('../services/authService');

const authController = {
  register: async (req, res) => {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ success: true, user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { user, token } = await authService.login(req.body);
      res.json({ success: true, token, user });
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
  }
};

module.exports = authController;