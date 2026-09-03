const reelService = require('../services/reelService');
const mediaService = require('../services/mediaService');

class ReelController {
  async createReel(req, res, next) {
    try {
      let videoUrl = req.body.video_url;

      if (req.file) {
        const uploadResult = await mediaService.uploadMedia(req.file, 'nipix/reels');
        videoUrl = uploadResult.url;
      }

      if (!videoUrl) {
        return res.status(400).json({ success: false, message: 'Video URL or file is required' });
      }

      const caption = req.body.caption || '';
      const reel = await reelService.createReel(req.user.id, videoUrl, caption);
      res.status(201).json({ success: true, reel });
    } catch (err) {
      next(err);
    }
  }

  async getReels(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const offset = parseInt(req.query.offset) || 0;
      const reels = await reelService.getReels(limit, offset);
      res.json({ success: true, reels });
    } catch (err) {
      next(err);
    }
  }

  async getReelById(req, res, next) {
    try {
      const { id } = req.params;
      const reel = await reelService.getReelById(id);
      if (!reel) return res.status(404).json({ success: false, message: 'Reel not found' });
      res.json({ success: true, reel });
    } catch (err) {
      next(err);
    }
  }

  async toggleLike(req, res, next) {
    try {
      const { id } = req.params;
      const result = await reelService.toggleLikeReel(id, req.user.id);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async addComment(req, res, next) {
    try {
      const { id } = req.params;
      const { comment_text, text } = req.body;
      const content = comment_text || text;

      if (!content) {
        return res.status(400).json({ success: false, message: 'Comment text is required' });
      }

      const comment = await reelService.addReelComment(id, req.user.id, content);
      res.status(201).json({ success: true, comment });
    } catch (err) {
      next(err);
    }
  }

  async deleteReel(req, res, next) {
    try {
      const { id } = req.params;
      await reelService.deleteReel(id, req.user.id);
      res.json({ success: true, message: 'Reel deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ReelController();
