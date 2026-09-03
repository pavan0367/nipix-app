const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostMedia = sequelize.define('PostMedia', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  post_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  media_url: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  media_type: {
    type: DataTypes.ENUM('image', 'video'),
    defaultValue: 'image',
  },
  media_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'post_media',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = PostMedia;
