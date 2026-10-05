const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

const initSocket = (server) => {
  const allowedOrigins = [
    'https://nipix-media.vercel.app',
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL
  ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/+$/, '');
        const isAllowed = allowedOrigins.some(o => o.replace(/\/+$/, '') === cleanOrigin) ||
          (cleanOrigin.endsWith('.vercel.app') && cleanOrigin.includes('nipix')) ||
          cleanOrigin.startsWith('http://localhost:') ||
          cleanOrigin.startsWith('http://127.0.0.1:');
        if (isAllowed) return callback(null, true);
        console.warn(`[Socket CORS] Origin rejected: ${origin}`);
        return callback(null, false);
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authenticate socket connection via JWT handshake
  io.use(async (socket, next) => {
    try {
      const authHeader = socket.handshake.auth?.token ||
                         socket.handshake.headers?.authorization ||
                         socket.handshake.query?.token;
      if (!authHeader) {
        console.warn('[VaultSocket Server] Connection rejected: No token provided');
        return next(new Error('Authentication error: Token required'));
      }

      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'NipixSecret2024!!');

      if (!decoded || !decoded.id) {
        console.warn('[VaultSocket Server] Connection rejected: Invalid token payload');
        return next(new Error('Authentication error: Invalid token payload'));
      }

      socket.userId = decoded.id;
      next();
    } catch (err) {
      console.warn('[VaultSocket Server] Handshake verification failed:', err.message);
      return next(new Error('Authentication error: ' + err.message));
    }
  });

  io.on('connection', (socket) => {
    // Automatically join the authenticated user's private room based on server-verified identity
    const userRoom = `user_${socket.userId}`;
    socket.join(userRoom);
    console.log(`[VaultSocket Server] User connected: ${socket.id}, verified userId: ${socket.userId}, joined room: ${userRoom}`);

    // Guard joinUserRoom so a client can never subscribe to another user's room
    socket.on('joinUserRoom', (requestedUserId) => {
      if (requestedUserId && String(requestedUserId) !== String(socket.userId)) {
        console.warn(`[VaultSocket Server] Unauthorized room join attempt by user ${socket.userId} for room user_${requestedUserId}`);
        return;
      }
      socket.join(`user_${socket.userId}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[VaultSocket Server] User disconnected: ${socket.id} (userId: ${socket.userId}, reason: ${reason})`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};

module.exports = { initSocket, getIO };