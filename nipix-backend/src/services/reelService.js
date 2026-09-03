const { Reel, ReelLike, ReelComment, User } = require('../models');

class ReelService {
  async createReel(userId, videoUrl, caption = '') {
    return Reel.create({
      userId,
      video_url: videoUrl,
      caption,
      views: 0,
      shares: 0,
    });
  }

  async getReels(limit = 20, offset = 0) {
    return Reel.findAll({
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'profile_image'],
        },
        {
          model: ReelLike,
          as: 'likes',
          attributes: ['id', 'user_id'],
        },
        {
          model: ReelComment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'commenter',
              attributes: ['id', 'username', 'profile_image'],
            },
          ],
        },
      ],
    });
  }

  async getReelById(reelId) {
    return Reel.findByPk(reelId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'profile_image'],
        },
        {
          model: ReelLike,
          as: 'likes',
        },
        {
          model: ReelComment,
          as: 'comments',
        },
      ],
    });
  }

  async toggleLikeReel(reelId, userId) {
    const existing = await ReelLike.findOne({
      where: { reel_id: reelId, user_id: userId },
    });

    if (existing) {
      await existing.destroy();
      return { action: 'unliked' };
    } else {
      await ReelLike.create({ reel_id: reelId, user_id: userId });
      return { action: 'liked' };
    }
  }

  async addReelComment(reelId, userId, commentText) {
    return ReelComment.create({
      reel_id: reelId,
      user_id: userId,
      comment_text: commentText,
    });
  }

  async deleteReel(reelId, userId) {
    const reel = await Reel.findByPk(reelId);
    if (!reel) throw new Error('Reel not found');
    if (reel.userId !== userId) throw new Error('Unauthorized');
    await reel.destroy();
    return true;
  }
}

module.exports = new ReelService();
