const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Story = sequelize.define('Story', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false, field: 'user_id' },
  mediaUrl: { type: DataTypes.STRING(500), allowNull: false, field: 'media_url' },
  mediaType: { type: DataTypes.ENUM('image', 'video'), defaultValue: 'image', field: 'media_type' },
  expiresAt: { type: DataTypes.DATE, allowNull: false, field: 'expires_at' }
}, {
  tableName: 'stories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Story;