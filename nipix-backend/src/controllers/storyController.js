const storyService = require('../services/storyService');
const mediaService = require('../services/mediaService');

class StoryController {
  async createStory(req, res, next) {
    try {
      let mediaUrl = req.body.media_url || req.body.image;

      if (req.file) {
        const uploadResult = await mediaService.uploadMedia(req.file, 'nipix/stories');
        mediaUrl = uploadResult.url;
      }

      if (!mediaUrl) {
        return res.status(400).json({ success: false, message: 'Media URL or file is required' });
      }

      const mediaType = req.body.media_type || (req.file?.mimetype?.startsWith('video') ? 'video' : 'image');
      const story = await storyService.createStory(req.user.id, mediaUrl, mediaType);
      res.status(201).json({ success: true, story });
    } catch (err) {
      next(err);
    }
  }

  async getFeedStories(req, res, next) {
    try {
      const stories = await storyService.getActiveStories();
      res.json(stories);
    } catch (err) {
      next(err);
    }
  }

  async viewStory(req, res, next) {
    try {
      const { id } = req.params;
      const result = await storyService.recordStoryView(id, req.user.id);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  async deleteStory(req, res, next) {
    try {
      const { id } = req.params;
      await storyService.deleteStory(id, req.user.id);
      res.json({ success: true, message: 'Story deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StoryController();
