const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Follow = sequelize.define('Follow', {
  followerId: { type: DataTypes.BIGINT, primaryKey: true },
  followingId: { type: DataTypes.BIGINT, primaryKey: true }
}, { timestamps: true });

module.exports = Follow;