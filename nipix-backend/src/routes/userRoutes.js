const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/search', authMiddleware, userController.search);
router.put('/me', authMiddleware, upload.single('avatar'), userController.updateProfile);
router.put('/profile', authMiddleware, upload.single('avatar'), userController.updateProfile);
router.get('/:id', authMiddleware, userController.getProfile);
router.put('/:id', authMiddleware, upload.single('avatar'), userController.updateProfile);
router.post('/:id/follow', authMiddleware, userController.toggleFollow);

module.exports = router;