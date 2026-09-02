const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || '*', methods: ['GET', 'POST'] }
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