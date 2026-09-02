const { Post, Comment, Like, SavedPost, User, Follow } = require('../models');
const { Op } = require('sequelize');

const postService = {
  createPost: async (userId, mediaUrl, caption, location) => {
    return await Post.create({ userId, mediaUrl, caption, location });
  },

  getFeed: async (userId, limit = 20) => {
    // Get followed user IDs
    const follows = await Follow.findAll({ where: { followerId: userId }, attributes: ['followingId'] });
    const followingIds = follows.map(f => f.followingId);
    followingIds.push(userId); // Include own posts

    return await Post.findAll({
      where: { userId: { [Op.in]: followingIds } },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'profile_image'] },
        { model: Comment, as: 'comments', include: [{ model: User, as: 'commenter', attributes: ['username'] }] },
        { model: Like, as: 'likes', include: [{ model: User, as: 'liker', attributes: ['id'] }] }
      ],
      order: [['createdAt', 'DESC']],
      limit
    });
  },

  toggleLike: async (userId, postId) => {
    const existing = await Like.findOne({ where: { userId, postId } });
    if (existing) {
      await existing.destroy();
      return { action: 'unliked' };
    } else {
      await Like.create({ userId, postId });
      return { action: 'liked' };
    }
  },

  toggleSave: async (userId, postId) => {
    const existing = await SavedPost.findOne({ where: { userId, postId } });
    if (existing) {
      await existing.destroy();
      return { action: 'unsaved' };
    } else {
      await SavedPost.create({ userId, postId });
      return { action: 'saved' };
    }
  },

  addComment: async (userId, postId, commentText) => {
    return await Comment.create({ userId, postId, commentText });
  },

  deletePost: async (userId, postId) => {
    const post = await Post.findByPk(postId);
    if (!post || post.userId !== userId) throw new Error('Unauthorized or not found');
    await post.destroy();
  }
};

module.exports = postService;