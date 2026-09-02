const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Post = sequelize.define('Post', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false },
  caption: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING(255) },
  mediaUrl: { type: DataTypes.STRING(500), allowNull: false },
  mediaType: { type: DataTypes.ENUM('image', 'video'), defaultValue: 'image' }
}, { timestamps: true });

module.exports = Post;