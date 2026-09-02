const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  postId: { type: DataTypes.BIGINT, allowNull: false },
  userId: { type: DataTypes.BIGINT, allowNull: false },
  commentText: { type: DataTypes.TEXT, allowNull: false }
}, { timestamps: true });

module.exports = Comment;