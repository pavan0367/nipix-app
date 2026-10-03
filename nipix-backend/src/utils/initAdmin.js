const bcrypt = require('bcryptjs');
const User = require('../models/User');

const initAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nipix.app';
    const adminUsername = process.env.ADMIN_USERNAME || 'nipix_admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'NipixAdmin2024!';

    let admin = await User.findOne({ where: { email: adminEmail } });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      admin = await User.create({
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        full_name: 'Nipix Platform Administrator',
        role: 'admin'
      });
      console.log(`🛡️ Admin account provisioned: ${admin.email}`);
    } else if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
      console.log(`🛡️ Admin role confirmed for: ${admin.email}`);
    }
    return admin;
  } catch (err) {
    console.warn('⚠️ Admin provisioning notice:', err.message);
  }
};

module.exports = { initAdmin };
