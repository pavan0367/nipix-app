const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const adminController = require('../controllers/adminController');

// All admin routes strictly enforce authentication AND administrator role
router.use(authMiddleware);
router.use(adminMiddleware);

// Analytics & Overview
router.get('/stats', adminController.getStats);
router.get('/system', adminController.getSystemHealth);
router.get('/email-status', adminController.getEmailStatus);
router.post('/test-email', adminController.sendTestEmail);

// User Management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
