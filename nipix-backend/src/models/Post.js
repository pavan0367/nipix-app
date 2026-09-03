const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false, field: 'user_id' },
  caption: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING(255) },
  mediaUrl: { type: DataTypes.STRING(500), allowNull: false, field: 'media_url' },
  mediaType: { type: DataTypes.ENUM('image', 'video'), defaultValue: 'image', field: 'media_type' }
}, {
  tableName: 'posts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Post;