const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Otp = sequelize.define('Otp', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  code_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('email_verification', 'password_reset'),
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },
  consumed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reset_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'otps',
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['type'] },
    { fields: ['reset_token'] }
  ]
});

module.exports = Otp;
