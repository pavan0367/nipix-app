const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  recipientId: { type: DataTypes.BIGINT, allowNull: false },
  senderId: { type: DataTypes.BIGINT, allowNull: false },
  type: { type: DataTypes.ENUM('like', 'comment', 'follow', 'message', 'mention'), allowNull: false },
  postId: { type: DataTypes.BIGINT, allowNull: true },
  message: { type: DataTypes.STRING(255) },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });

module.exports = Notification;