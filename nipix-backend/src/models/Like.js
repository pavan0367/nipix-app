const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Like = sequelize.define('Like', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false },
  postId: { type: DataTypes.BIGINT, allowNull: false }
}, { 
  timestamps: true,
  indexes: [{ unique: true, fields: ['userId', 'postId'] }] // Prevents duplicate likes
});

module.exports = Like;