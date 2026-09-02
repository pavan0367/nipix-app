const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
// Add story and reel routes similarly
app.use('/api/notifications', require('./routes/notificationRoutes'));
// Add search routes to userRoutes or create searchRoutes

module.exports = app;