const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReelLike = sequelize.define('ReelLike', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  reel_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
}, {
  tableName: 'reel_likes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['reel_id', 'user_id'],
    },
  ],
});

module.exports = ReelLike;
