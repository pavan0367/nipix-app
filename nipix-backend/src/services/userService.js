const User = require('../models/User');
const Follow = require('../models/Follow');

const userService = {
  getProfile: async (userId, targetUserId) => {
    const user = await User.findByPk(targetUserId, { attributes: { exclude: ['password'] } });
    if (!user) throw new Error('User not found');

    const followersCount = await Follow.count({ where: { followingId: targetUserId } });
    const followingCount = await Follow.count({ where: { followerId: targetUserId } });
    const isFollowing = userId ? await Follow.findOne({ where: { followerId: userId, followingId: targetUserId } }) : null;

    return { ...user.toJSON(), followersCount, followingCount, isFollowing: !!isFollowing };
  },

  updateProfile: async (userId, { full_name, bio, profile_image, is_private }) => {
    const user = await User.findByPk(userId);
    await user.update({ full_name, bio, profile_image, is_private });
    return user;
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