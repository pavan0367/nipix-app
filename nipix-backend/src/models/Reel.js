const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reel = sequelize.define('Reel', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.BIGINT, allowNull: false },
  videoUrl: { type: DataTypes.STRING(500), allowNull: false },
  caption: { type: DataTypes.TEXT },
  views: { type: DataTypes.BIGINT, defaultValue: 0 },
  shares: { type: DataTypes.BIGINT, defaultValue: 0 }
}, { timestamps: true });

module.exports = Reel;