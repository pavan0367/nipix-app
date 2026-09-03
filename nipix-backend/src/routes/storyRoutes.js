const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', storyController.getFeedStories);
router.get('/feed', storyController.getFeedStories);
router.post('/', authMiddleware, upload.single('media'), storyController.createStory);
router.post('/:id/view', authMiddleware, storyController.viewStory);
router.delete('/:id', authMiddleware, storyController.deleteStory);

module.exports = router;
