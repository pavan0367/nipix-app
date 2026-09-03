const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReelComment = sequelize.define('ReelComment', {
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
  comment_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'reel_comments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = ReelComment;
