const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { initSocket } = require('../sockets/socket');
const { sequelize, User, Message, Conversation, ConversationMember } = require('../models');
const { io: ioClient } = require(path.resolve(__dirname, '../../../nipix-frontend/node_modules/socket.io-client'));

const JWT_SECRET = process.env.JWT_SECRET || 'NipixSecret2024!!';
const TEST_PORT = 5008;

async function runLocalVerification() {
  console.log('================================================================');
  console.log('🧪 LOCAL PRESENCE & READ RECEIPT ARCHITECTURE VERIFICATION');
  console.log('================================================================');

  const app = require('../app');
  const server = http.createServer(app);
  initSocket(server);

  await new Promise((res) => server.listen(TEST_PORT, res));
  console.log(`✓ Test server running on http://localhost:${TEST_PORT}`);

  const user1Id = 210001; // Alice
  const user2Id = 210002; // Bob

  const token1 = jwt.sign({ id: user1Id }, JWT_SECRET, { expiresIn: '1h' });
  const token2 = jwt.sign({ id: user2Id }, JWT_SECRET, { expiresIn: '1h' });

  const createSocket = (token) => {
    return ioClient(`http://localhost:${TEST_PORT}`, {
      auth: { token },
      query: { token },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      forceNew: true
    });
  };

  try {
    // 1. Connect User 1 socket first
    console.log('\n--- 1. TESTING REAL-TIME PRESENCE (ONLINE / OFFLINE) ---');
    const socket1 = createSocket(token1);
    await new Promise((res) => socket1.on('connect', res));
    console.log('✓ User 1 (Alice) connected to test Socket.IO:', socket1.id);

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
      new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout waiting for Bob online event')), 5000))
    ]);
    console.log('✓ SUCCESS: User 1 received real-time presence:update online:', onlineEvent);

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
      new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout waiting for Bob offline event')), 5000))
    ]);
    console.log('✓ SUCCESS: User 1 received real-time presence:update offline:', offlineEvent);

    // Reconnect User 2
    console.log('Reconnecting User 2 (Bob)...');
    const socket2Reconnected = createSocket(token2);
    await new Promise((res) => socket2Reconnected.on('connect', res));

    // --- 2. TESTING MESSAGE FLOW AND READ RECEIPTS (SINGLE TICK ✓ -> DOUBLE TICK ✓✓) ---
    console.log('\n--- 2. TESTING MESSAGE FLOW & READ RECEIPTS (SINGLE TICK -> DOUBLE TICK) ---');
    const axios = require('axios');
    const LOCAL_API = `http://localhost:${TEST_PORT}/api`;

    // Ensure conversation exists between Alice and Bob
    const convRes = await axios.post(
      `${LOCAL_API}/vault/conversations`,
      { targetUserId: user2Id },
      { headers: { Authorization: `Bearer ${token1}` } }
    );
    const convId = convRes.data.conversation.id;
    console.log(`✓ Active Conversation ID: ${convId}`);

    // User 1 sends message to conversation
    const testMsgText = `Local test read receipt at ${new Date().toISOString()}`;
    console.log('User 1 sending message via REST API...');
    const sendRes = await axios.post(
      `${LOCAL_API}/vault/conversations/${convId}/messages`,
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
      new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout waiting for message:read event')), 5000))
    ]);
    console.log('✓ SUCCESS: User 1 received real-time read receipt event:', receiptEvent);

    // Verify in DB via REST API
    const messagesRes = await axios.get(
      `${LOCAL_API}/vault/conversations/${convId}/messages`,
      { headers: { Authorization: `Bearer ${token1}` } }
    );
    const foundMsg = messagesRes.data.messages.find((m) => m.id === sentMsg.id);
    console.log(`✓ DB Verification: Message ${sentMsg.id} isRead is now: ${foundMsg?.isRead}`);
    if (!foundMsg || foundMsg.isRead !== true) {
      throw new Error('Expected message in DB to be marked isRead = true');
    }
    console.log('✓ DOUBLE TICK VERIFIED: Recipient opened message, isRead = true (✓✓)');

    // Cleanup sockets and server
    socket1.disconnect();
    socket2Reconnected.disconnect();
    server.close();

    console.log('\n================================================================');
    console.log('🎉 ALL PRESENCE & READ RECEIPT ARCHITECTURE TESTS PASSED!');
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification failed:', err);
    server.close();
    process.exit(1);
  }
}

runLocalVerification();
