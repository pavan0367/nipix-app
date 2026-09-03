const { isValidEmail, isValidUsername, isValidPassword } = require('../utils/validators');

const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !isValidUsername(username)) {
    return res.status(400).json({
      success: false,
      message: 'Username must be 3-30 alphanumeric characters or underscores',
    });
  }

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required',
    });
  }

  if (!password || !isValidPassword(password)) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long',
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username or email and password are required',
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
