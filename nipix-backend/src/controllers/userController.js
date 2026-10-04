const userService = require('../services/userService');

const userController = {
  getProfile: async (req, res) => {
    try {
      const targetId = req.params.id === 'me' ? req.user?.id : req.params.id;
      const profile = await userService.getProfile(req.user?.id, targetId);
      res.json({ success: true, user: profile });
    } catch (err) {
      res.status(404).json({ success: false, message: err.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const updateData = { ...req.body };
      if (req.file) {
        updateData.profile_image = req.file.path || req.file.secure_url;
      }
      const user = await userService.updateProfile(req.user.id, updateData);
      res.json({ success: true, user });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
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