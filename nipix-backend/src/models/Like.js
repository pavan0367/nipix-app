const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Like = sequelize.define('Like', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false, field: 'user_id' },
  postId: { type: DataTypes.BIGINT, allowNull: false, field: 'post_id' }
}, { 
  tableName: 'likes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [{ unique: true, fields: ['user_id', 'post_id'] }]
});

module.exports = Like;