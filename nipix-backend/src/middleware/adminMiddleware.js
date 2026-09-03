const { ROLES } = require('../utils/constants');

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (req.user.role !== ROLES.ADMIN && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: Administrator role required' });
  }

  next();
};

module.exports = adminMiddleware;
