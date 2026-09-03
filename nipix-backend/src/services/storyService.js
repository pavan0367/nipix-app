const { Op } = require('sequelize');
const { Story, StoryView, User } = require('../models');

class StoryService {
  async createStory(userId, mediaUrl, mediaType = 'image') {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    return Story.create({
      userId,
      mediaUrl,
      mediaType,
      expiresAt,
    });
  }

  async getActiveStories() {
    try {
      const stories = await Story.findAll({
        where: {
          expiresAt: {
            [Op.gt]: new Date(),
          },
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'profile_image'],
          },
        ],
        order: [['createdAt', 'DESC']],
      });
      return stories || [];
    } catch (err) {
      console.warn('getActiveStories query warning:', err.message);
      return [];
    }
  }

  async recordStoryView(storyId, userId) {
    try {
      const [view, created] = await StoryView.findOrCreate({
        where: { story_id: storyId, user_id: userId },
        defaults: { story_id: storyId, user_id: userId, viewed_at: new Date() },
      });
      return { view, created };
    } catch (err) {
      console.warn('recordStoryView warning:', err.message);
      return { view: null, created: false };
    }
  }

  async deleteStory(storyId, userId) {
    const story = await Story.findByPk(storyId);
    if (!story) throw new Error('Story not found');
    if (story.userId !== userId) throw new Error('Unauthorized');
    await story.destroy();
    return true;
  }
}

module.exports = new StoryService();
