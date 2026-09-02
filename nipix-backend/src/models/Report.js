const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  reporterId: { type: DataTypes.BIGINT, allowNull: false },
  reportedUserId: { type: DataTypes.BIGINT, allowNull: true },
  postId: { type: DataTypes.BIGINT, allowNull: true },
  reason: { type: DataTypes.STRING(255), allowNull: false },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('pending', 'reviewed', 'resolved'), defaultValue: 'pending' }
}, { timestamps: true });

module.exports = Report;