const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const pool = require('../../database');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, 'STORY-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);
        const [result] = await pool.query('INSERT INTO stories (userId, image, expiresAt) VALUES (?, ?, ?)', [req.user.id, req.file.path, expiresAt]);
        res.json({ id: result.insertId, userId: req.user.id, image: req.file.path });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

router.get('/feed', auth, async (req, res) => {
    try {
        const [follows] = await pool.query('SELECT followingId FROM follows WHERE followerId = ?', [req.user.id]);
        const followingIds = follows.map(f => f.followingId);
        followingIds.push(req.user.id);

        const [stories] = await pool.query(
            `SELECT stories.id, stories.image, stories.createdAt, users.id as userId, users.username, users.profilePic
       FROM stories JOIN users ON stories.userId = users.id
       WHERE stories.userId IN (?) AND stories.expiresAt > NOW()
       ORDER BY stories.createdAt DESC`, [followingIds]
        );

        const storiesByUser = {};
        stories.forEach(story => {
            if (!storiesByUser[story.userId]) {
                storiesByUser[story.userId] = { user: { id: story.userId, username: story.username, profilePic: story.profilePic }, stories: [] };
            }
            storiesByUser[story.userId].stories.push({ id: story.id, image: story.image, createdAt: story.createdAt });
        });

        res.json(Object.values(storiesByUser));
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;