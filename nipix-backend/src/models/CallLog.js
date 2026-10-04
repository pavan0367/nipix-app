const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CallLog = sequelize.define('CallLog', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  contactId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  callType: {
    type: DataTypes.ENUM('audio', 'video'),
    defaultValue: 'audio',
    allowNull: false
  },
  direction: {
    type: DataTypes.ENUM('incoming', 'outgoing'),
    defaultValue: 'outgoing',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('completed', 'missed', 'declined', 'cancelled'),
    defaultValue: 'completed',
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  tableName: 'CallLogs',
  timestamps: true
});

module.exports = CallLog;
