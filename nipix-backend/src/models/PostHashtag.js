
// backend/src/models/PostHashtag.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PostHashtag = sequelize.define('PostHashtag', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  postId: { type: DataTypes.BIGINT, allowNull: false },
  hashtagId: { type: DataTypes.BIGINT, allowNull: false }
}, { timestamps: false });

module.exports = PostHashtag;