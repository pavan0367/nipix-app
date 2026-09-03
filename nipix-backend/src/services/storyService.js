const { Op } = require('sequelize');
const { Story, StoryView, User } = require('../models');

class StoryService {
  async createStory(userId, mediaUrl, mediaType = 'image') {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
    return Story.create({
      userId,
      media_url: mediaUrl,
      media_type: mediaType,
      expires_at: expiresAt,
    });
  }

  async getActiveStories() {
    return Story.findAll({
      where: {
        expires_at: {
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
      order: [['created_at', 'DESC']],
    });
  }

  async recordStoryView(storyId, userId) {
    const [view, created] = await StoryView.findOrCreate({
      where: { story_id: storyId, user_id: userId },
      defaults: { story_id: storyId, user_id: userId, viewed_at: new Date() },
    });
    return { view, created };
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
