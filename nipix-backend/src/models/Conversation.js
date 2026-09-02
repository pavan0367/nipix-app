const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true }
}, { timestamps: true });

module.exports = Conversation;