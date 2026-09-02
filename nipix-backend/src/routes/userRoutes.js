const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/search', authMiddleware, userController.search);
router.get('/:id', authMiddleware, userController.getProfile);
router.put('/:id', authMiddleware, userController.updateProfile);
router.post('/:id/follow', authMiddleware, userController.toggleFollow);

module.exports = router;