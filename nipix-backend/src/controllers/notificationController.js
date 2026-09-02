const notificationService = require('../services/notificationService');

const notificationController = {
  getNotifications: async (req, res) => {
    try {
      const notifications = await notificationService.getNotifications(req.user.id);
      res.json({ success: true, notifications });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },

  markAsRead: async (req, res) => {
    try {
      await notificationService.markAsRead(req.user.id, req.params.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },

  markAllAsRead: async (req, res) => {
    try {
      await notificationService.markAllAsRead(req.user.id);
      res.json({ success: true });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  }
};

module.exports = notificationController;