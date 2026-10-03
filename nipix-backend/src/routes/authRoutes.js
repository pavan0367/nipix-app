const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public registration & email verification
router.post('/register', authController.register);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);

// Public login & Google Sign-In
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);

// Password recovery 4-step sequence
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-otp', authController.verifyResetOtp);
router.post('/reset-password', authController.resetPassword);

// Session verification & audit
router.get('/me', authMiddleware, authController.getMe);
router.get('/email-logs', authMiddleware, authController.getEmailLogs);

module.exports = router;