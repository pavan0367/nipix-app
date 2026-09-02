// backend/src/models/Hashtag.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hashtag = sequelize.define('Hashtag', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), unique: true, allowNull: false }
}, { timestamps: true });

module.exports = Hashtag;
