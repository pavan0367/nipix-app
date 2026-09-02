const { Op } = require('sequelize');
const { User, Post, Like, Comment, Hashtag } = require('../models');

const searchService = {
  searchUsers: async (query) => {
    return await User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${query}%` } },
          { full_name: { [Op.like]: `%${query}%` } }
        ]
      },
      attributes: ['id', 'username', 'full_name', 'profile_image'],
      limit: 10
    });
  },

  searchHashtags: async (query) => {
    return await Hashtag.findAll({
      where: { name: { [Op.like]: `%${query}%` } },
      limit: 10
    });
  },

  getExploreFeed: async () => {
    // SRS Section 30.2: Score = (Likes × 1) + (Comments × 2)
    const posts = await Post.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'profile_image'] },
        { model: Like, as: 'likes' },
        { model: Comment, as: 'comments' }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    // Calculate score and sort
    const scoredPosts = posts.map(post => {
      const likesCount = post.likes ? post.likes.length : 0;
      const commentsCount = post.comments ? post.comments.length : 0;
      const score = (likesCount * 1) + (commentsCount * 2);
      return { ...post.toJSON(), score };
    });

    return scoredPosts.sort((a, b) => b.score - a.score);
  }
};

module.exports = searchService;