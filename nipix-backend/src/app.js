const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    'https://nipix-media.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173'
  ].filter(Boolean),
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/stories', require('./routes/storyRoutes'));
app.use('/api/reels', require('./routes/reelRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Centralized error handling middleware per SRS Section 25
app.use(require('./middleware/errorMiddleware'));

module.exports = app;