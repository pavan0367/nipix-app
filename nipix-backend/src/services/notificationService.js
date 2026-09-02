const Notification = require('../models/Notification');
const { User } = require('../models');
const { getIO } = require('../sockets/socket');

const notificationService = {
  createNotification: async (recipientId, senderId, type, postId, message) => {
    if (recipientId === senderId) return null; // Don't notify yourself

    const notification = await Notification.create({
      recipientId, senderId, type, postId, message
    });

    // Emit real-time event via Socket.IO
    try {
      const io = getIO();
      io.to(`user_${recipientId}`).emit('newNotification', notification);
    } catch (err) {
      console.warn('Socket emit notification failed:', err.message);
    }

    return notification;
  },

  getNotifications: async (userId) => {
    return await Notification.findAll({
      where: { recipientId: userId },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'username', 'profile_image'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: 50
    });
  },

  markAsRead: async (userId, notificationId) => {
    await Notification.update({ isRead: true }, { where: { id: notificationId, recipientId: userId } });
  },

  markAllAsRead: async (userId) => {
    await Notification.update({ isRead: true }, { where: { recipientId: userId, isRead: false } });
  }
};

module.exports = notificationService;