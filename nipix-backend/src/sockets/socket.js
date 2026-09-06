const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  const allowedOrigins = [
    'https://nipix-media.vercel.app',
    process.env.CLIENT_URL,
    process.env.NODE_ENV !== 'production' && 'http://localhost:3000',
    process.env.NODE_ENV !== 'production' && 'http://localhost:5173',
    process.env.NODE_ENV !== 'production' && 'http://127.0.0.1:3000'
  ].filter(Boolean);

  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const isAllowed = allowedOrigins.includes(origin) ||
          (origin.endsWith('.vercel.app') && origin.includes('nipix'));
        if (isAllowed) return callback(null, true);
        return callback(new Error('Origin not allowed by Socket CORS'), false);
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // User joins their own room for private messages
    socket.on('joinUserRoom', (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};

module.exports = { initSocket, getIO };