const User = require('../models/User');
const Follow = require('../models/Follow');

const userService = {
  getProfile: async (userId, targetUserId) => {
    let user;
    if (isNaN(targetUserId)) {
      // Find by username if targetUserId is non-numeric
      user = await User.findOne({
        where: { username: targetUserId },
        attributes: { exclude: ['password'] }
      });
    } else {
      user = await User.findByPk(targetUserId, { attributes: { exclude: ['password'] } });
    }

    if (!user) throw new Error('Scholar not found.');

    const targetId = user.id;
    const followersCount = await Follow.count({ where: { followingId: targetId } });
    const followingCount = await Follow.count({ where: { followerId: targetId } });
    const isFollowing = userId ? await Follow.findOne({ where: { followerId: userId, followingId: targetId } }) : null;

    return { ...user.toJSON(), followersCount, followingCount, isFollowing: !!isFollowing };
  },

  updateProfile: async (userId, { full_name, bio, profile_image, is_private, username }) => {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('Scholar account not found.');

    const updateFields = {};
    if (full_name !== undefined) updateFields.full_name = full_name ? String(full_name).trim() : '';
    if (bio !== undefined) updateFields.bio = bio ? String(bio).trim() : '';
    if (profile_image !== undefined) updateFields.profile_image = profile_image ? String(profile_image).trim() : '';
    if (is_private !== undefined) updateFields.is_private = Boolean(is_private);

    if (username && username.trim() !== user.username) {
      const cleanUsername = username.trim().toLowerCase();
      if (!/^[a-zA-Z0-9_]{3,30}$/.test(cleanUsername)) {
        throw new Error('Username must be 3-30 characters long and contain only letters, numbers, and underscores.');
      }
      const existing = await User.findOne({ where: { username: cleanUsername } });
      if (existing && existing.id !== user.id) {
        throw new Error('This username is already taken by another scholar.');
      }
      updateFields.username = cleanUsername;
    }

    await user.update(updateFields);

    const safeUser = user.toJSON();
    delete safeUser.password;
    return safeUser;
  },

  toggleFollow: async (userId, targetUserId) => {
    if (userId === targetUserId) throw new Error('Cannot follow yourself');
    
    const existing = await Follow.findOne({ where: { followerId: userId, followingId: targetUserId } });
    if (existing) {
      await existing.destroy();
      return { action: 'unfollowed' };
    } else {
      await Follow.create({ followerId: userId, followingId: targetUserId });
      return { action: 'followed' };
    }
  },

  searchUsers: async (query) => {
    return await User.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { username: { [require('sequelize').Op.like]: `%${query}%` } },
          { full_name: { [require('sequelize').Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'username', 'full_name', 'profile_image'],
      limit: 10
    });
  }
};

module.exports = userService;