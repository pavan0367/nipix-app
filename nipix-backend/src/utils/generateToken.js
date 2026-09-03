const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
};

module.exports = generateToken;
