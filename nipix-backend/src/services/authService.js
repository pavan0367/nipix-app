const crypto = require('crypto');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const Otp = require('../models/Otp');
const emailService = require('./emailService');

const hashOtpCode = (code) => {
  return crypto.createHash('sha256').update(String(code).trim()).digest('hex');
};

const authService = {
  // Generate a secure 6-digit OTP and store hashed in Otp table
  generateOtp: async (email, type) => {
    // Invalidate prior unconsumed OTPs for this email & type
    await Otp.update(
      { consumed: true },
      { where: { email, type, consumed: false } }
    );

    const code = crypto.randomInt(100000, 999999).toString();
    const code_hash = hashOtpCode(code);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await Otp.create({
      email,
      code_hash,
      type,
      expires_at,
      consumed: false,
      attempts: 0
    });

    return code;
  },

  // 1. User Registration with Email Verification Required
  register: async ({ username, email, password, full_name }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim().toLowerCase();

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: cleanEmail }, { username: cleanUsername }]
      }
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    if (existingUser) {
      if (existingUser.is_verified) {
        throw new Error('An account with this username or email already exists.');
      }
      // Unverified account: allow re-registering / updating credentials
      existingUser.username = cleanUsername;
      existingUser.password = hashedPassword;
      existingUser.full_name = full_name || existingUser.full_name;
      await existingUser.save();
      user = existingUser;
    } else {
      user = await User.create({
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        full_name: full_name || '',
        role: 'user', // Strictly user role
        is_verified: false
      });
    }

    // Generate & send verification code
    const code = await authService.generateOtp(cleanEmail, 'email_verification');
    await emailService.sendVerificationEmail({
      email: cleanEmail,
      code,
      name: user.full_name || user.username
    });

    return {
      requireVerification: true,
      email: cleanEmail,
      message: 'A 6-digit verification code has been dispatched to your email.'
    };
  },

  // 2. Verify Email OTP
  verifyEmail: async ({ email, code }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = String(code).trim();

    const otpRecord = await Otp.findOne({
      where: {
        email: cleanEmail,
        type: 'email_verification',
        consumed: false,
        expires_at: { [Op.gt]: new Date() }
      },
      order: [['createdAt', 'DESC']]
    });

    if (!otpRecord) {
      throw new Error('Invalid or expired verification code. Please request a new code.');
    }

    if (otpRecord.attempts >= 5) {
      await otpRecord.update({ consumed: true });
      throw new Error('Too many failed attempts. Please request a new verification code.');
    }

    const inputHash = hashOtpCode(cleanCode);
    if (inputHash !== otpRecord.code_hash) {
      await otpRecord.increment('attempts');
      const remaining = 4 - otpRecord.attempts;
      throw new Error(`Incorrect verification code. ${remaining > 0 ? remaining + ' attempts remaining.' : 'Code locked.'}`);
    }

    // Mark code consumed
    await otpRecord.update({ consumed: true });

    // Mark user verified
    const user = await User.findOne({ where: { email: cleanEmail } });
    if (!user) throw new Error('Account not found.');

    user.is_verified = true;
    await user.save();

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'NipixSecret2024!!',
      { expiresIn: '7d' }
    );

    // Asynchronously send welcome email
    emailService.sendWelcomeEmail({
      email: cleanEmail,
      name: user.full_name || user.username,
      isGoogle: false
    }).catch(err => console.error('Welcome email error:', err.message));

    const safeUser = user.toJSON();
    delete safeUser.password;
    return { user: safeUser, token };
  },

  // 3. Resend Verification Code
  resendVerification: async ({ email }) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ where: { email: cleanEmail } });
    if (!user) {
      // Return safe message without leaking user existence
      return { success: true, message: 'If your account is awaiting verification, a new code has been sent.' };
    }
    if (user.is_verified) {
      return { success: true, message: 'Account is already verified. You can log in.' };
    }

    const code = await authService.generateOtp(cleanEmail, 'email_verification');
    emailService.sendVerificationEmail({
      email: cleanEmail,
      code,
      name: user.full_name || user.username
    }).catch(err => console.error('Resend verification error:', err.message));

    return { success: true, message: 'A new 6-digit verification code has been sent to your email.' };
  },

  // 4. Normal Email/Password Login
  login: async ({ email, password, clientMeta }) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ where: { email: cleanEmail } });
    if (!user) throw new Error('Invalid email or password.');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid email or password.');

    // Check email verification status
    if (!user.is_verified) {
      const code = await authService.generateOtp(cleanEmail, 'email_verification');
      emailService.sendVerificationEmail({
        email: cleanEmail,
        code,
        name: user.full_name || user.username
      }).catch(err => console.error('Verification email error on login:', err.message));

      return {
        requireVerification: true,
        email: cleanEmail,
        message: 'Your email address is not yet verified. A fresh verification code has been sent to your inbox.'
      };
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'NipixSecret2024!!',
      { expiresIn: '7d' }
    );

    // Asynchronously dispatch login notification email to user's verified address
    emailService.sendLoginNotificationEmail({
      email: user.email,
      name: user.full_name || user.username,
      time: new Date().toLocaleString(),
      ip: clientMeta?.ip || 'Unknown IP',
      userAgent: clientMeta?.userAgent || 'Web Browser'
    }).catch(err => console.error('Login notification email error:', err.message));

    const safeUser = user.toJSON();
    delete safeUser.password;
    return { user: safeUser, token };
  },

  // 5. Server-Side Google Sign-In Validation
  googleAuth: async ({ credential, clientMeta }) => {
    if (!credential) throw new Error('Google credential token is required.');

    // Call Google's tokeninfo API server-side
    let googleData;
    try {
      const res = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`, {
        timeout: 8000
      });
      googleData = res.data;
    } catch (gErr) {
      throw new Error('Google identity validation failed: ' + (gErr.response?.data?.error_description || gErr.message));
    }

    const { email, email_verified, name, sub, picture } = googleData;
    if (!email_verified || !email) {
      throw new Error('Google identity is not verified or email is missing.');
    }

    const cleanEmail = email.trim().toLowerCase();
    let user = await User.findOne({ where: { email: cleanEmail } });
    let isNew = false;

    if (user) {
      // Existing user: link google_id, ensure verified
      if (!user.is_verified) user.is_verified = true;
      if (!user.google_id) user.google_id = sub;
      if (!user.profile_image && picture) user.profile_image = picture;
      await user.save();

      // Dispatch login notification
      emailService.sendLoginNotificationEmail({
        email: user.email,
        name: user.full_name || user.username,
        time: new Date().toLocaleString(),
        ip: clientMeta?.ip || 'Unknown IP',
        userAgent: clientMeta?.userAgent || 'Google Sign-In'
      }).catch(err => console.error('Google login notification error:', err.message));
    } else {
      // New user: auto-create verified account
      isNew = true;
      let baseUsername = (name || cleanEmail.split('@')[0])
        .replace(/[^a-zA-Z0-9_]/g, '_')
        .toLowerCase()
        .slice(0, 30);
      if (!baseUsername) baseUsername = 'scholar';

      // Ensure unique username
      let finalUsername = baseUsername;
      const userExists = await User.findOne({ where: { username: finalUsername } });
      if (userExists) {
        finalUsername = `${baseUsername}_${crypto.randomInt(100, 9999)}`;
      }

      // Secure random password
      const randomPassword = crypto.randomBytes(32).toString('hex');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        username: finalUsername,
        email: cleanEmail,
        password: hashedPassword,
        full_name: name || '',
        profile_image: picture || '',
        role: 'user', // Always user
        is_verified: true, // Google accounts are pre-verified
        google_id: sub
      });

      // Dispatch welcome email
      emailService.sendWelcomeEmail({
        email: cleanEmail,
        name: user.full_name || user.username,
        isGoogle: true
      }).catch(err => console.error('Google welcome email error:', err.message));
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'NipixSecret2024!!',
      { expiresIn: '7d' }
    );

    const safeUser = user.toJSON();
    delete safeUser.password;
    return { user: safeUser, token, isNew };
  },

  // 6. Step 1 & 2: Forgot Password - Request OTP
  forgotPassword: async ({ email }) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ where: { email: cleanEmail } });

    if (user) {
      const code = await authService.generateOtp(cleanEmail, 'password_reset');
      emailService.sendPasswordResetOtpEmail({
        email: cleanEmail,
        code,
        name: user.full_name || user.username
      }).catch(err => console.error('Password reset email error:', err.message));
    }

    // Always return success message to prevent user enumeration
    return {
      success: true,
      message: 'If an account is associated with this email, a 6-digit verification code has been dispatched.'
    };
  },

  // 7. Step 3 & 4: Verify Password Reset OTP
  verifyResetOtp: async ({ email, code }) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = String(code).trim();

    const otpRecord = await Otp.findOne({
      where: {
        email: cleanEmail,
        type: 'password_reset',
        consumed: false,
        expires_at: { [Op.gt]: new Date() }
      },
      order: [['createdAt', 'DESC']]
    });

    if (!otpRecord) {
      throw new Error('Invalid or expired verification code. Please request a new password reset code.');
    }

    if (otpRecord.attempts >= 5) {
      await otpRecord.update({ consumed: true });
      throw new Error('Too many failed attempts. Please request a new verification code.');
    }

    const inputHash = hashOtpCode(cleanCode);
    if (inputHash !== otpRecord.code_hash) {
      await otpRecord.increment('attempts');
      const remaining = 4 - otpRecord.attempts;
      throw new Error(`Incorrect verification code. ${remaining > 0 ? remaining + ' attempts remaining.' : 'Code locked.'}`);
    }

    // Mark OTP consumed and generate a temporary cryptographically secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    await otpRecord.update({
      consumed: true,
      reset_token: resetToken
    });

    return {
      success: true,
      resetToken,
      message: 'OTP verified successfully. You may now set a new password.'
    };
  },

  // 8. Step 5 & 6: Set New Password
  resetPassword: async ({ email, resetToken, newPassword }) => {
    if (!resetToken || !newPassword) {
      throw new Error('Reset token and new password are required.');
    }
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    const cleanEmail = email.trim().toLowerCase();

    // Verify valid reset token (must belong to an unexpired session)
    const validOtp = await Otp.findOne({
      where: {
        email: cleanEmail,
        type: 'password_reset',
        consumed: true,
        reset_token: resetToken,
        updatedAt: { [Op.gt]: new Date(Date.now() - 15 * 60 * 1000) } // Token valid for 15 mins after OTP verification
      }
    });

    if (!validOtp) {
      throw new Error('Invalid, consumed, or expired password reset session. Please restart password recovery.');
    }

    const user = await User.findOne({ where: { email: cleanEmail } });
    if (!user) throw new Error('Account not found.');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    // Invalidate reset token so it can never be used again
    await validOtp.update({ reset_token: null });

    // Send confirmation email
    emailService.sendPasswordChangedEmail({
      email: cleanEmail,
      name: user.full_name || user.username,
      time: new Date().toLocaleString()
    }).catch(err => console.error('Password changed email error:', err.message));

    return {
      success: true,
      message: 'Password updated successfully. You can now log in with your new password.'
    };
  },

  getMe: async (userId) => {
    return await User.findByPk(userId, { attributes: { exclude: ['password'] } });
  }
};

module.exports = authService;