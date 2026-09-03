const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(50), unique: true, allowNull: false },
  email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  password: { type: DataTypes.STRING(255), allowNull: false },
  full_name: { type: DataTypes.STRING(100), defaultValue: '' },
  bio: { type: DataTypes.TEXT, defaultValue: '' },
  profile_image: { type: DataTypes.STRING(500), defaultValue: '' },
  is_private: { type: DataTypes.BOOLEAN, defaultValue: false },
  role: { type: DataTypes.ENUM('user', 'admin'), defaultValue: 'user' }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = User;