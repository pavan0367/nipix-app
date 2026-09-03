const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StoryView = sequelize.define('StoryView', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  story_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  viewed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'story_views',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['story_id', 'user_id'],
    },
  ],
});

module.exports = StoryView;
