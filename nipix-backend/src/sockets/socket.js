const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { User, ConversationMember, CallLog, Message } = require('../models');

let io;
const userSocketsMap = new Map(); // userId -> Set of socket IDs

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

    // Track active connection for server-authoritative presence
    const uid = Number(socket.userId);
    const existingSockets = userSocketsMap.get(uid) || new Set();
    const isFirstConnection = existingSockets.size === 0;
    existingSockets.add(socket.id);
    userSocketsMap.set(uid, existingSockets);

    if (isFirstConnection) {
      console.log(`[Presence Server] User ${uid} is now ONLINE`);
      io.emit('presence:update', { userId: uid, status: 'online' });
    }

    // Send immediate sync of all currently online user IDs to the newly connected socket
    socket.emit('presence:sync', {
      onlineUserIds: Array.from(userSocketsMap.keys())
    });

    // Client query for active presence list
    socket.on('presence:query', (callback) => {
      if (typeof callback === 'function') {
        callback({ onlineUserIds: Array.from(userSocketsMap.keys()) });
      }
    });

    // Guard joinUserRoom so a client can never subscribe to another user's room
    socket.on('joinUserRoom', (requestedUserId) => {
      if (requestedUserId && String(requestedUserId) !== String(socket.userId)) {
        console.warn(`[VaultSocket Server] Unauthorized room join attempt by user ${socket.userId} for room user_${requestedUserId}`);
        return;
      }
      socket.join(`user_${socket.userId}`);
    });

    // =========================================================================
    // WEBRTC CALL SIGNALING (AUDIO & VIDEO CALLS)
    // =========================================================================

    // 1. Outgoing Call Offer
    socket.on('call:offer', async (data) => {
      try {
        const { callId, conversationId, recipientId, callerId, callerName, callType, sdp } = data || {};
        if (!callId || !recipientId || !sdp) {
          console.warn(`[CallSocket Server] Invalid offer payload from user ${socket.userId}`);
          return;
        }

        if (String(socket.userId) !== String(callerId)) {
          console.warn(`[CallSocket Server] Unauthorized callerId ${callerId} attempted by user ${socket.userId}`);
          return;
        }

        // Authorize conversation membership: both caller and recipient must be members
        if (conversationId) {
          const members = await ConversationMember.findAll({
            where: {
              conversationId,
              userId: [socket.userId, recipientId]
            }
          });
          if (members.length < 2 && String(socket.userId) !== String(recipientId)) {
            console.warn(`[CallSocket Server] Membership verification failed: conversation ${conversationId} does not include users ${socket.userId} and ${recipientId}`);
            return;
          }
        }

        console.log(`[CallSocket Server] authenticated user=${socket.userId}`);
        console.log(`[CallSocket Server] call offer=${callId} caller=${socket.userId} recipient=${recipientId} type=${callType}`);
        console.log(`[CallSocket Server] forwarding offer to user_${recipientId}`);

        // Forward incoming call to recipient's private room
        io.to(`user_${recipientId}`).emit('call:incoming', {
          callId,
          conversationId,
          callerId: socket.userId,
          callerName: callerName || 'Scholar',
          callType: callType || 'audio',
          sdp
        });

        // Acknowledge ringing to caller
        socket.emit('call:ringing', { callId, recipientId });
      } catch (err) {
        console.error('[CallSocket Server] call:offer error:', err.message);
      }
    });

    // 2. Call Answer
    socket.on('call:answer', (data) => {
      try {
        const { callId, targetUserId, sdp } = data || {};
        if (!callId || !targetUserId || !sdp) return;

        console.log(`[CallSocket Server] answer=${callId} responder=${socket.userId} target=${targetUserId}`);
        io.to(`user_${targetUserId}`).emit('call:answer', {
          callId,
          responderId: socket.userId,
          sdp
        });
      } catch (err) {
        console.error('[CallSocket Server] call:answer error:', err.message);
      }
    });

    // 3. ICE Candidate Forwarding
    socket.on('call:ice-candidate', (data) => {
      try {
        const { callId, targetUserId, candidate } = data || {};
        if (!callId || !targetUserId || !candidate) return;

        console.log(`[CallSocket Server] ICE candidate=${callId} sender=${socket.userId} target=${targetUserId}`);
        io.to(`user_${targetUserId}`).emit('call:ice-candidate', {
          callId,
          senderId: socket.userId,
          candidate
        });
      } catch (err) {
        console.error('[CallSocket Server] call:ice-candidate error:', err.message);
      }
    });

    // 4. Decline Call
    socket.on('call:decline', async (data) => {
      try {
        const { callId, targetUserId, conversationId, reason } = data || {};
        if (!callId || !targetUserId) return;

        console.log(`[CallSocket Server] call declined=${callId} by=${socket.userId} target=${targetUserId}`);
        io.to(`user_${targetUserId}`).emit('call:declined', {
          callId,
          declinerId: socket.userId,
          reason
        });
      } catch (err) {
        console.error('[CallSocket Server] call:decline error:', err.message);
      }
    });

    // 5. Cancel Call (Caller cancels before answer)
    socket.on('call:cancel', (data) => {
      try {
        const { callId, targetUserId } = data || {};
        if (!callId || !targetUserId) return;

        console.log(`[CallSocket Server] call cancelled=${callId} by=${socket.userId} target=${targetUserId}`);
        io.to(`user_${targetUserId}`).emit('call:cancelled', {
          callId,
          callerId: socket.userId
        });
      } catch (err) {
        console.error('[CallSocket Server] call:cancel error:', err.message);
      }
    });

    // 6. Busy State (User is already in another call)
    socket.on('call:busy', (data) => {
      try {
        const { callId, targetUserId } = data || {};
        if (!callId || !targetUserId) return;

        console.log(`[CallSocket Server] call busy=${callId} responder=${socket.userId} target=${targetUserId}`);
        io.to(`user_${targetUserId}`).emit('call:busy', {
          callId,
          responderId: socket.userId
        });
      } catch (err) {
        console.error('[CallSocket Server] call:busy error:', err.message);
      }
    });

    // 7. End Call
    socket.on('call:end', (data) => {
      try {
        const { callId, targetUserId, duration } = data || {};
        if (!callId || !targetUserId) return;

        console.log(`[CallSocket Server] call ended=${callId} by=${socket.userId} duration=${duration || 0}`);
        io.to(`user_${targetUserId}`).emit('call:ended', {
          callId,
          endedBy: socket.userId,
          duration: duration || 0
        });
      } catch (err) {
        console.error('[CallSocket Server] call:end error:', err.message);
      }
    });

    // 8. Message Read Receipt Flow (Single tick -> Double tick)
    socket.on('message:read', async (data) => {
      try {
        const { conversationId, messageIds } = data || {};
        if (!conversationId) return;

        // SECURITY: Verify caller is an authorized member of this conversation
        const isMember = await ConversationMember.findOne({
          where: { conversationId, userId: socket.userId }
        });
        if (!isMember) {
          console.warn(`[VaultSocket Server] Unauthorized message:read attempt by user ${socket.userId} in conv ${conversationId}`);
          return;
        }

        const updateCondition = {
          conversationId,
          senderId: { [Op.ne]: socket.userId },
          isRead: false
        };

        if (Array.isArray(messageIds) && messageIds.length > 0) {
          updateCondition.id = messageIds;
        }

        const [updatedRows] = await Message.update(
          { isRead: true },
          { where: updateCondition }
        );

        console.log(`[VaultSocket Server] Marked ${updatedRows} messages as read in conversation ${conversationId} by reader ${socket.userId}`);

        // Notify other conversation members in real time
        const otherMembers = await ConversationMember.findAll({
          where: { conversationId, userId: { [Op.ne]: socket.userId } },
          attributes: ['userId']
        });

        otherMembers.forEach((m) => {
          io.to(`user_${m.userId}`).emit('message:read', {
            conversationId,
            readerId: socket.userId,
            messageIds: messageIds || null
          });
        });
      } catch (err) {
        console.error('[VaultSocket Server] message:read error:', err.message);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`[VaultSocket Server] User disconnected: ${socket.id} (userId: ${socket.userId}, reason: ${reason})`);
      const uid = Number(socket.userId);
      const userSockets = userSocketsMap.get(uid);
      if (userSockets) {
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          userSocketsMap.delete(uid);
          console.log(`[Presence Server] User ${uid} is now OFFLINE (all connections closed)`);
          io.emit('presence:update', { userId: uid, status: 'offline' });
        } else {
          console.log(`[Presence Server] User ${uid} remaining connections: ${userSockets.size}`);
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};

module.exports = { initSocket, getIO };