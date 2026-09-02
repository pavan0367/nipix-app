const userService = require('../services/userService');

const userController = {
  getProfile: async (req, res) => {
    try {
      const profile = await userService.getProfile(req.user?.id, req.params.id);
      res.json({ success: true, user: profile });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      res.json({ success: true, user });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  toggleFollow: async (req, res) => {
    try {
      const result = await userService.toggleFollow(req.user.id, req.params.id);
      res.json({ success: true, action: result.action });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  search: async (req, res) => {
    try {
      const users = await userService.searchUsers(req.query.q);
      res.json({ success: true, users });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = userController;