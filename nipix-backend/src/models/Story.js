const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Story = sequelize.define('Story', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false },
  mediaUrl: { type: DataTypes.STRING(500), allowNull: false },
  mediaType: { type: DataTypes.ENUM('image', 'video'), defaultValue: 'image' },
  expiresAt: { type: DataTypes.DATE, allowNull: false }
}, { timestamps: true });

module.exports = Story;