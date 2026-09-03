const { Report, User, Post } = require('../models');

class ReportController {
  async createReport(req, res, next) {
    try {
      const { reported_user_id, post_id, comment_id, reel_id, reason, description } = req.body;

      if (!reason) {
        return res.status(400).json({ success: false, message: 'Reason for report is required' });
      }

      const report = await Report.create({
        reporterId: req.user.id,
        reportedUserId: reported_user_id || null,
        postId: post_id || null,
        commentId: comment_id || null,
        reelId: reel_id || null,
        reason,
        description: description || '',
        status: 'pending',
      });

      res.status(201).json({ success: true, report });
    } catch (err) {
      next(err);
    }
  }

  async getAllReports(req, res, next) {
    try {
      const reports = await Report.findAll({
        include: [
          { model: User, as: 'reporter', attributes: ['id', 'username', 'email'] },
          { model: User, as: 'reportedUser', attributes: ['id', 'username', 'email'] },
        ],
        order: [['created_at', 'DESC']],
      });
      res.json({ success: true, reports });
    } catch (err) {
      next(err);
    }
  }

  async updateReportStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const report = await Report.findByPk(id);
      if (!report) {
        return res.status(404).json({ success: false, message: 'Report not found' });
      }

      report.status = status || report.status;
      await report.save();

      res.json({ success: true, report });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ReportController();
