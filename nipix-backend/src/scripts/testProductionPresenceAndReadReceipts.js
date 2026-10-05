const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('path');
const { io: ioClient } = require(path.resolve(__dirname, '../../../nipix-frontend/node_modules/socket.io-client'));

const API_BASE = 'https://nipix-app.onrender.com/api';
const SOCKET_URL = 'https://nipix-app.onrender.com';
const JWT_SECRET = process.env.JWT_SECRET || 'NipixSecret2024!!';

async function runPresenceAndReadReceiptTest() {
  console.log('================================================================');
  console.log('🌐 PRODUCTION PRESENCE, READ RECEIPTS & CALL RECOVERY VERIFICATION');
  console.log('================================================================');
  console.log(`Backend API: ${API_BASE}`);
  console.log(`Socket URL:  ${SOCKET_URL}`);

  const user1Id = 210001; // Alice
  const user2Id = 210002; // Bob

  const token1 = jwt.sign({ id: user1Id }, JWT_SECRET, { expiresIn: '1h' });
  const token2 = jwt.sign({ id: user2Id }, JWT_SECRET, { expiresIn: '1h' });

  const createSocket = (token) => {
    return ioClient(SOCKET_URL, {
      auth: { token },
      query: { token },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      forceNew: true
    });
  };

  // 1. Connect User 1 socket first
  console.log('\n--- 1. TESTING REAL-TIME PRESENCE (ONLINE / OFFLINE) ---');
  const socket1 = createSocket(token1);
  await new Promise((res) => socket1.on('connect', res));
  console.log('✓ User 1 (Alice) connected to production Socket.IO:', socket1.id);

  // User 1 listens for presence updates
  let presencePromiseOnline = new Promise((resolve) => {
    const handler = (data) => {
      if (Number(data.userId) === user2Id && data.status === 'online') {
        socket1.off('presence:update', handler);
        resolve(data);
      }
    };
    socket1.on('presence:update', handler);
  });

  // User 2 connects
  console.log('Connecting User 2 (Bob)...');
  const socket2 = createSocket(token2);
  await new Promise((res) => socket2.on('connect', res));
  console.log('✓ User 2 (Bob) connected:', socket2.id);

  const onlineEvent = await Promise.race([
    presencePromiseOnline,
    new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout waiting for Bob online event')), 8000))
  ]);
  console.log('✓ SUCCESS: User 1 received real-time presence update:', onlineEvent);

  // User 2 disconnects -> User 1 must see Bob go offline
  let presencePromiseOffline = new Promise((resolve) => {
    const handler = (data) => {
      if (Number(data.userId) === user2Id && data.status === 'offline') {
        socket1.off('presence:update', handler);
        resolve(data);
      }
    };
    socket1.on('presence:update', handler);
  });

  console.log('Disconnecting User 2 (Bob)...');
  socket2.disconnect();

  const offlineEvent = await Promise.race([
    presencePromiseOffline,
    new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout waiting for Bob offline event')), 8000))
  ]);
  console.log('✓ SUCCESS: User 1 received real-time presence update:', offlineEvent);

  // Reconnect User 2
  console.log('Reconnecting User 2 (Bob)...');
  const socket2Reconnected = createSocket(token2);
  await new Promise((res) => socket2Reconnected.on('connect', res));

  // --- 2. TESTING MESSAGE FLOW AND READ RECEIPTS (SINGLE TICK ✓ -> DOUBLE TICK ✓✓) ---
  console.log('\n--- 2. TESTING MESSAGE FLOW & READ RECEIPTS (SINGLE TICK -> DOUBLE TICK) ---');
  // Ensure conversation exists between Alice and Bob
  const convRes = await axios.post(
    `${API_BASE}/vault/conversations`,
    { targetUserId: user2Id },
    { headers: { Authorization: `Bearer ${token1}` } }
  );
  const convId = convRes.data.conversation.id;
  console.log(`✓ Active Conversation ID: ${convId}`);

  // User 1 sends message to conversation
  const testMsgText = `Test message read receipt at ${new Date().toISOString()}`;
  console.log('User 1 sending message via REST API...');
  const sendRes = await axios.post(
    `${API_BASE}/vault/conversations/${convId}/messages`,
    { messageText: testMsgText, mediaType: 'text' },
    { headers: { Authorization: `Bearer ${token1}` } }
  );
  const sentMsg = sendRes.data.message;
  console.log(`✓ Message sent (ID: ${sentMsg.id}). Server persisted with isRead: ${sentMsg.isRead}`);
  if (sentMsg.isRead !== false) {
    throw new Error('Expected new message to have isRead: false for single tick (✓)');
  }
  console.log('✓ SINGLE TICK VERIFIED: New message delivered to server has isRead = false (✓)');

  // User 1 listens for message:read receipt
  const readReceiptPromise = new Promise((resolve) => {
    socket1.on('message:read', (data) => {
      if (String(data.conversationId) === String(convId)) {
        resolve(data);
      }
    });
  });

  // User 2 opens/reads the conversation: emits message:read
  console.log('User 2 opens conversation and emits message:read...');
  socket2Reconnected.emit('message:read', {
    conversationId: convId,
    messageIds: [sentMsg.id]
  });

  const receiptEvent = await Promise.race([
    readReceiptPromise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout waiting for message:read event')), 8000))
  ]);
  console.log('✓ SUCCESS: User 1 received real-time read receipt event:', receiptEvent);

  // Verify in DB via REST API
  const messagesRes = await axios.get(
    `${API_BASE}/vault/conversations/${convId}/messages`,
    { headers: { Authorization: `Bearer ${token1}` } }
  );
  const foundMsg = messagesRes.data.messages.find((m) => m.id === sentMsg.id);
  console.log(`✓ DB Verification: Message ${sentMsg.id} isRead is now: ${foundMsg?.isRead}`);
  if (!foundMsg || foundMsg.isRead !== true) {
    throw new Error('Expected message in DB to be marked isRead = true');
  }
  console.log('✓ DOUBLE TICK VERIFIED: Recipient opened message, isRead = true (✓✓)');

  // --- 3. TESTING CALL SIGNALING & RECONNECT EVENT ---
  console.log('\n--- 3. TESTING CALL SIGNALING & RECONNECT EVENT ---');
  const callId = `call_test_${Date.now()}`;

  const incomingPromise = new Promise((resolve) => {
    socket2Reconnected.on('call:incoming', resolve);
  });

  // User 1 initiates call
  socket1.emit('call:initiate', {
    callId,
    conversationId: convId,
    targetUserId: user2Id,
    callType: 'video',
    sdp: { type: 'offer', sdp: 'v=0\r\no=alice ... m=audio 9 UDP/TLS/RTP/SAVPF 111\r\nm=video 9 UDP/TLS/RTP/SAVPF 96' }
  });

  const incoming = await Promise.race([
    incomingPromise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout waiting for incoming call')), 8000))
  ]);
  console.log('✓ User 2 received incoming video call:', incoming.callId);

  // User 2 accepts call
  const answerPromise = new Promise((resolve) => {
    socket1.on('call:answer', resolve);
  });
  socket2Reconnected.emit('call:accept', {
    callId,
    targetUserId: user1Id,
    sdp: { type: 'answer', sdp: 'v=0\r\no=bob ... m=audio 9 UDP/TLS/RTP/SAVPF 111\r\nm=video 9 UDP/TLS/RTP/SAVPF 96' }
  });
  const answer = await Promise.race([
    answerPromise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout waiting for call answer')), 8000))
  ]);
  console.log('✓ User 1 received call answer:', answer.callId);

  // User 1 signals temporary network reconnect
  const reconnectPromise = new Promise((resolve) => {
    socket2Reconnected.on('call:reconnect', resolve);
  });
  socket1.emit('call:reconnect', {
    callId,
    targetUserId: user2Id,
    reason: 'temporary_packet_loss'
  });
  const recEvent = await Promise.race([
    reconnectPromise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout waiting for call:reconnect event')), 8000))
  ]);
  console.log('✓ User 2 received call:reconnect signal successfully:', recEvent);

  // User 1 ends call
  const endPromise = new Promise((resolve) => {
    socket2Reconnected.on('call:ended', resolve);
  });
  socket1.emit('call:end', {
    callId,
    targetUserId: user2Id,
    duration: 15
  });
  await Promise.race([
    endPromise,
    new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout waiting for call:ended event')), 8000))
  ]);
  console.log('✓ User 2 received call:ended event successfully');

  // Cleanup sockets
  socket1.disconnect();
  socket2Reconnected.disconnect();

  console.log('\n================================================================');
  console.log('🎉 ALL PRODUCTION TESTS PASSED WITH 100% SUCCESS!');
  console.log('================================================================');
}

runPresenceAndReadReceiptTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
