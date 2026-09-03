const { Comment, User } = require('../models');

class CommentController {
  async getCommentsByPost(req, res, next) {
    try {
      const { postId } = req.params;
      const comments = await Comment.findAll({
        where: { postId },
        include: [{ model: User, as: 'commenter', attributes: ['id', 'username', 'profile_image'] }],
        order: [['created_at', 'ASC']],
      });
      res.json({ success: true, comments });
    } catch (err) {
      next(err);
    }
  }

  async addComment(req, res, next) {
    try {
      const { postId } = req.params;
      const { comment_text, text } = req.body;
      const content = comment_text || text;

      if (!content) {
        return res.status(400).json({ success: false, message: 'Comment text is required' });
      }

      const comment = await Comment.create({
        postId,
        userId: req.user.id,
        comment_text: content,
      });

      const fullComment = await Comment.findByPk(comment.id, {
        include: [{ model: User, as: 'commenter', attributes: ['id', 'username', 'profile_image'] }],
      });

      res.status(201).json({ success: true, comment: fullComment });
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { id } = req.params;
      const comment = await Comment.findByPk(id);

      if (!comment) {
        return res.status(404).json({ success: false, message: 'Comment not found' });
      }

      if (comment.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment' });
      }

      await comment.destroy();
      res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CommentController();
