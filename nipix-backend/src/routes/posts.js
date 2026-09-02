const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const pool = require('../../database');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, 'NIPIX-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const [result] = await pool.query('INSERT INTO posts (userId, image, caption) VALUES (?, ?, ?)', [req.user.id, req.file.path, req.body.caption]);
    res.json({ id: result.insertId, userId: req.user.id, image: req.file.path, caption: req.body.caption });
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

    const [posts] = await pool.query(
      `SELECT posts.id, posts.image, posts.caption, posts.createdAt, users.username, users.profilePic 
       FROM posts JOIN users ON posts.userId = users.id 
       WHERE posts.userId IN (?) ORDER BY posts.createdAt DESC`, [followingIds]
    );

    const formattedPosts = await Promise.all(posts.map(async (post) => {
      const [likes] = await pool.query('SELECT userId FROM likes WHERE postId = ?', [post.id]);
      const [comments] = await pool.query('SELECT comments.id, comments.text, comments.createdAt, users.username FROM comments JOIN users ON comments.userId = users.id WHERE comments.postId = ?', [post.id]);

      return {
        _id: post.id,
        userId: { username: post.username, profilePic: post.profilePic },
        image: post.image,
        caption: post.caption,
        likes: likes.map(l => l.userId),
        comments: comments
      };
    }));

    res.json(formattedPosts);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/like', auth, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM likes WHERE postId = ? AND userId = ?', [req.params.id, req.user.id]);
    if (existing.length > 0) {
      await pool.query('DELETE FROM likes WHERE postId = ? AND userId = ?', [req.params.id, req.user.id]);
    } else {
      await pool.query('INSERT INTO likes (postId, userId) VALUES (?, ?)', [req.params.id, req.user.id]);
    }
    const [likes] = await pool.query('SELECT userId FROM likes WHERE postId = ?', [req.params.id]);
    res.json(likes.map(l => l.userId));
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/comment', auth, async (req, res) => {
  try {
    const [result] = await pool.query('INSERT INTO comments (postId, userId, text) VALUES (?, ?, ?)', [req.params.id, req.user.id, req.body.text]);
    const [comments] = await pool.query('SELECT comments.id, comments.text, comments.createdAt, users.username FROM comments JOIN users ON comments.userId = users.id WHERE comments.postId = ?', [req.params.id]);
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await pool.query('DELETE FROM posts WHERE id = ? AND userId = ?', [req.params.id, req.user.id]);
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;