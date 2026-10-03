const { Op } = require('sequelize');
const { User, Post, Comment, Reel, Story, Report, sequelize } = require('../models');
const { checkAIProviderConfig } = require('../services/llmService');

const adminController = {
  // 1. Overview & Platform Analytics
  getStats: async (req, res) => {
    try {
      const [
        totalUsers,
        adminCount,
        totalPosts,
        totalComments,
        totalReels,
        totalStories,
        pendingReports
      ] = await Promise.all([
        User.count(),
        User.count({ where: { role: 'admin' } }),
        Post.count().catch(() => 0),
        Comment.count().catch(() => 0),
        Reel.count().catch(() => 0),
        Story.count().catch(() => 0),
        Report.count({ where: { status: 'pending' } }).catch(() => 0)
      ]);

      const aiStatus = checkAIProviderConfig();

      res.json({
        success: true,
        stats: {
          totalUsers,
          regularUsers: totalUsers - adminCount,
          adminCount,
          totalPosts,
          totalComments,
          totalReels,
          totalStories,
          pendingReports,
          coursesCount: 8, // 8 Structured Courses
          japaneseModulesCount: 12,
          serverUptimeSeconds: Math.floor(process.uptime()),
          nodeVersion: process.version,
          aiProvider: aiStatus.provider,
          aiModel: aiStatus.model,
          aiReady: aiStatus.ready
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 2. User Management: Search, Filter, Paginate
  getUsers: async (req, res) => {
    try {
      const { search = '', role, page = 1, limit = 20 } = req.query;
      const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

      const whereClause = {};
      if (search) {
        whereClause[Op.or] = [
          { username: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { full_name: { [Op.like]: `%${search}%` } }
        ];
      }

      if (role && (role === 'admin' || role === 'user')) {
        whereClause.role = role;
      }

      const { count, rows: users } = await User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit, 10),
        offset
      });

      res.json({
        success: true,
        total: count,
        page: parseInt(page, 10),
        totalPages: Math.ceil(count / limit),
        users
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 3. User Details
  getUserDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const [postsCount, commentsCount] = await Promise.all([
        Post.count({ where: { userId: id } }).catch(() => 0),
        Comment.count({ where: { userId: id } }).catch(() => 0)
      ]);

      res.json({
        success: true,
        user: {
          ...user.toJSON(),
          postsCount,
          commentsCount
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 4. Update User Role or Info
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { role, full_name, bio, is_private } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Prevent admin from demoting themselves to maintain at least one admin
      if (req.user.id === user.id && role && role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Cannot demote your own administrative account'
        });
      }

      if (role && (role === 'user' || role === 'admin')) {
        user.role = role;
      }
      if (typeof full_name === 'string') user.full_name = full_name;
      if (typeof bio === 'string') user.bio = bio;
      if (typeof is_private === 'boolean') user.is_private = is_private;

      await user.save();

      res.json({
        success: true,
        message: 'User updated successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          bio: user.bio,
          is_private: user.is_private
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 5. Delete User
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (req.user.id === user.id) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete your own active administrative account'
        });
      }

      await user.destroy();
      res.json({ success: true, message: `User ${user.username} deleted successfully` });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // 6. System Status & Health
  getSystemHealth: async (req, res) => {
    try {
      await sequelize.authenticate();
      const aiStatus = checkAIProviderConfig();

      const memoryUsage = process.memoryUsage();

      res.json({
        success: true,
        system: {
          status: 'operational',
          uptimeSeconds: Math.floor(process.uptime()),
          nodeVersion: process.version,
          platform: process.platform,
          memory: {
            heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
            heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
            rssMB: Math.round(memoryUsage.rss / 1024 / 1024)
          },
          database: {
            status: 'connected',
            dialect: 'mysql (TiDB Cloud)'
          },
          ai: aiStatus
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
};

module.exports = adminController;
