const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', authMiddleware, upload.single('media'), postController.create);
router.get('/feed', authMiddleware, postController.getFeed);
router.post('/:id/like', authMiddleware, postController.toggleLike);
router.post('/:id/save', authMiddleware, postController.toggleSave);
router.post('/:id/comments', authMiddleware, postController.addComment);
router.delete('/:id', authMiddleware, postController.delete);

module.exports = router;