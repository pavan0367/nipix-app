const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  postId: { type: DataTypes.BIGINT, allowNull: false, field: 'post_id' },
  userId: { type: DataTypes.BIGINT, allowNull: false, field: 'user_id' },
  commentText: { type: DataTypes.TEXT, allowNull: false, field: 'comment_text' }
}, {
  tableName: 'comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Comment;