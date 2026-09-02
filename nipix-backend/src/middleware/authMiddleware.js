const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization') || req.header('x-auth-token');
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nipix_secret_key');
    
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;