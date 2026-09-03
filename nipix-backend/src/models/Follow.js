const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Follow = sequelize.define('Follow', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  followerId: { type: DataTypes.BIGINT, allowNull: false, field: 'follower_id' },
  followingId: { type: DataTypes.BIGINT, allowNull: false, field: 'following_id' }
}, {
  tableName: 'follows',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Follow;