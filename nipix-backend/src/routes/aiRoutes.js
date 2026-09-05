const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// POST /api/ai/chat (Standard JSON)
router.post('/chat', aiController.chat);

// POST /api/ai/chat/stream (Server-Sent Events)
router.post('/chat/stream', aiController.streamChat);

module.exports = router;
