const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../../database');

router.get('/:username', async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, username, profilePic, bio FROM users WHERE username = ?', [req.params.username]);
    if (users.length === 0) return res.status(404).json({ msg: 'User not found' });
    const user = users[0];

    const [posts] = await pool.query('SELECT id, image, caption, createdAt FROM posts WHERE userId = ? ORDER BY createdAt DESC', [user.id]);
    const [followers] = await pool.query('SELECT COUNT(*) as count FROM follows WHERE followingId = ?', [user.id]);
    const [following] = await pool.query('SELECT COUNT(*) as count FROM follows WHERE followerId = ?', [user.id]);

    res.json({
      user: { ...user, _id: user.id, followers: new Array(followers[0].count), following: new Array(following[0].count) },
      posts: posts.map(p => ({ ...p, _id: p.id }))
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/follow', auth, async (req, res) => {
  try {
    if (req.params.id == req.user.id) return res.status(403).json({ msg: "Cannot follow yourself" });
    const [existing] = await pool.query('SELECT * FROM follows WHERE followerId = ? AND followingId = ?', [req.user.id, req.params.id]);
    if (existing.length > 0) {
      await pool.query('DELETE FROM follows WHERE followerId = ? AND followingId = ?', [req.user.id, req.params.id]);
    } else {
      await pool.query('INSERT INTO follows (followerId, followingId) VALUES (?, ?)', [req.user.id, req.params.id]);
    }
    res.json({ msg: 'Success' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;