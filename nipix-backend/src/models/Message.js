// backend/src/models/Message.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  conversationId: { type: DataTypes.BIGINT, allowNull: false },
  senderId: { type: DataTypes.BIGINT, allowNull: false },
  messageText: { type: DataTypes.TEXT },
  mediaUrl: { type: DataTypes.STRING(500) },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { timestamps: true });

module.exports = Message;