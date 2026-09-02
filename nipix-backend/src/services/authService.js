const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authService = {
  register: async ({ username, email, password, full_name }) => {
    const existingUser = await User.findOne({ where: { $or: [{ email }, { username }] } });
    if (existingUser) throw new Error('Username or email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashedPassword, full_name });
    return user;
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return { user, token };
  },

  getMe: async (userId) => {
    return await User.findByPk(userId, { attributes: { exclude: ['password'] } });
  }
};

module.exports = authService;