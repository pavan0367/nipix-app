const postService = require('../services/postService');

const postController = {
  create: async (req, res) => {
    try {
      const post = await postService.createPost(req.user.id, req.file.path, req.body.caption, req.body.location);
      res.status(201).json({ success: true, post });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },

  getFeed: async (req, res) => {
    try {
      const feed = await postService.getFeed(req.user?.id);
      res.json(Array.isArray(feed) ? feed : []);
    } catch (err) {
      console.warn('getFeed error:', err.message);
      res.json([]);
    }
  },

  toggleLike: async (req, res) => {
    try {
      const result = await postService.toggleLike(req.user.id, req.params.id);
      res.json({ success: true, action: result.action });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },

  toggleSave: async (req, res) => {
    try {
      const result = await postService.toggleSave(req.user.id, req.params.id);
      res.json({ success: true, action: result.action });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },

  addComment: async (req, res) => {
    try {
      const comment = await postService.addComment(req.user.id, req.params.id, req.body.commentText);
      res.status(201).json({ success: true, comment });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  },

  delete: async (req, res) => {
    try {
      await postService.deletePost(req.user.id, req.params.id);
      res.json({ success: true, message: 'Post deleted' });
    } catch (err) { res.status(403).json({ success: false, message: err.message }); }
  }
};

module.exports = postController;