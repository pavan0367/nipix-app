const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConversationMember = sequelize.define('ConversationMember', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  conversationId: { type: DataTypes.BIGINT, allowNull: false },
  userId: { type: DataTypes.BIGINT, allowNull: false }
}, { timestamps: true });

module.exports = ConversationMember;
