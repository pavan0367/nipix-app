const express = require('express');
const router = express.Router();
const reelController = require('../controllers/reelController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', reelController.getReels);
router.get('/:id', reelController.getReelById);
router.post('/', authMiddleware, upload.single('video'), reelController.createReel);
router.post('/:id/like', authMiddleware, reelController.toggleLike);
router.post('/:id/comments', authMiddleware, reelController.addComment);
router.delete('/:id', authMiddleware, reelController.deleteReel);

module.exports = router;
