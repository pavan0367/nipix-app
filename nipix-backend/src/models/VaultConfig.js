const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VaultConfig = sequelize.define('VaultConfig', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  pin_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  recovery_method: {
    type: DataTypes.ENUM('birthday', 'anniversary'),
    allowNull: false
  },
  recovery_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  failed_attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  locked_until: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'VaultConfigs',
  timestamps: true
});

module.exports = VaultConfig;
