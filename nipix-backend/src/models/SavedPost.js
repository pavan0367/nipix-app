const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SavedPost = sequelize.define('SavedPost', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false },
  postId: { type: DataTypes.BIGINT, allowNull: false }
}, { 
  timestamps: true,
  indexes: [{ unique: true, fields: ['userId', 'postId'] }]
});

module.exports = SavedPost;