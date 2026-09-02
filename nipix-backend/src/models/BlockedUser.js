const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BlockedUser = sequelize.define('BlockedUser', {
  blockerId: { type: DataTypes.BIGINT, primaryKey: true },
  blockedId: { type: DataTypes.BIGINT, primaryKey: true }
}, { timestamps: true });

module.exports = BlockedUser;