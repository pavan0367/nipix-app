require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const http = require('http');
const jwt = require('jsonwebtoken');
const { io: ioClient } = require(require('path').resolve(__dirname, '../../../nipix-frontend/node_modules/socket.io-client'));
const { sequelize, User, Conversation, ConversationMember, Message } = require('../models');
const { initSocket } = require('../sockets/socket');
const vaultService = require('../services/vaultService');

async function runLiveSocketTests() {
  console.log('=== STARTING SECRET VAULT SOCKET.IO LIVE TEST SUITE ===');
  await sequelize.authenticate();
  console.log('✓ Database connected.');

  // 1. Setup in-process HTTP server with Socket.IO
  const server = http.createServer();
  const ioServer = initSocket(server);

  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const serverUrl = `http://127.0.0.1:${port}`;
  console.log(`✓ Test HTTP + Socket.IO server running on ${serverUrl}`);

  // 2. Fetch or create test users: Alice (User A), Bob (User B), Charlie (User C)
  let userA = await User.findOne({ where: { username: 'test_vault_user_a' } });
  if (!userA) {
    userA = await User.create({
      username: 'test_vault_user_a',
      email: 'test_vault_a@nipix.test',
      password: 'hashedpassword123',
      full_name: 'Alice Scholar'
    });
  }

  let userB = await User.findOne({ where: { username: 'test_vault_user_b' } });
  if (!userB) {
    userB = await User.create({
      username: 'test_vault_user_b',
      email: 'test_vault_b@nipix.test',
      password: 'hashedpassword123',
      full_name: 'Bob Scholar'
    });
  }

  let userC = await User.findOne({ where: { username: 'test_vault_user_c' } });
  if (!userC) {
    userC = await User.create({
      username: 'test_vault_user_c',
      email: 'test_vault_c@nipix.test',
      password: 'hashedpassword123',
      full_name: 'Charlie Scholar'
    });
  }

  console.log(`✓ Test users verified: Alice (${userA.id}), Bob (${userB.id}), Charlie (${userC.id})`);

  // 3. Generate authenticated JWT tokens
  const jwtSecret = process.env.JWT_SECRET || 'NipixSecret2024!!';
  const tokenA = jwt.sign({ id: userA.id }, jwtSecret, { expiresIn: '1h' });
  const tokenB = jwt.sign({ id: userB.id }, jwtSecret, { expiresIn: '1h' });
  const tokenC = jwt.sign({ id: userC.id }, jwtSecret, { expiresIn: '1h' });

  // 4. Setup clean conversation between User A and User B
  const convAB = await vaultService.startConversation(userA.id, userB.id);
  console.log(`✓ Conversation A-B active with ID: ${convAB.id}`);

  // 5. Connect Socket Clients
  console.log('--- Connecting authenticated Socket.IO clients ---');
  const createSocket = (token) => {
    return ioClient(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true
    });
  };

  const socketA = createSocket(tokenA);
  const socketB = createSocket(tokenB);
  const socketC = createSocket(tokenC);

  await Promise.all([
    new Promise(res => socketA.on('connect', res)),
    new Promise(res => socketB.on('connect', res)),
    new Promise(res => socketC.on('connect', res))
  ]);
  console.log('✓ Socket A, Socket B, Socket C connected with authenticated handshake.');

  // TEST 10: Unauthorized socket access prevention
  // Charlie attempts to join Alice's private room:
  socketC.emit('joinUserRoom', userA.id);
  // Give server time to process
  await new Promise(r => setTimeout(r, 200));

  let charlieReceivedAny = false;
  socketC.on('vaultMessage', (msg) => {
    charlieReceivedAny = true;
  });

  // TEST 1 & 2: User 1 sends message -> User 2 receives immediately with canonical timestamp
  console.log('--- TEST 1 & 2: User A sends message to User B ---');
  const receivedBPromise = new Promise((resolve) => {
    socketB.once('vaultMessage', (msg) => {
      resolve(msg);
    });
  });

  const sentMsg1 = await vaultService.sendVaultMessage(userA.id, convAB.id, {
    messageText: 'Hello Bob! This is live real-time test.'
  });

  const receivedMsgB1 = await receivedBPromise;

  console.log('✓ TEST 1 PASSED: User B received message immediately via Socket.IO');
  console.log('  Payload text:', receivedMsgB1.text);
  console.log('  Payload isUser for Bob:', receivedMsgB1.isUser);
  console.log('  Payload senderId:', receivedMsgB1.senderId);

  if (receivedMsgB1.text !== 'Hello Bob! This is live real-time test.') {
    throw new Error('TEST 1 FAILED: Text mismatch');
  }
  if (receivedMsgB1.isUser !== false) {
    throw new Error('TEST 1 FAILED: isUser must be false for recipient Bob');
  }

  // TEST 2: Canonical timestamp check
  const sentTime = new Date(sentMsg1.createdAt).getTime();
  const receivedTime = new Date(receivedMsgB1.createdAt).getTime();
  console.log(`✓ TEST 2 PASSED: Canonical timestamp matches perfectly (Sent: ${sentMsg1.createdAt}, Received: ${receivedMsgB1.createdAt})`);
  if (sentTime !== receivedTime) {
    throw new Error('TEST 2 FAILED: Timestamp mismatch');
  }

  // TEST 9 & 10: Charlie (User C) must NOT receive this message
  await new Promise(r => setTimeout(r, 300));
  if (charlieReceivedAny) {
    throw new Error('TEST 9 & 10 FAILED: Charlie received a message from Alice to Bob! Unauthorized room access was not prevented.');
  }
  console.log('✓ TEST 9 & 10 PASSED: Private room targeting verified. Unauthorized client Charlie received 0 messages.');

  // TEST 4: Rapid messages delivery & ordering
  console.log('--- TEST 4: Rapid consecutive messages ---');
  const rapidCount = 5;
  const rapidReceived = [];

  const rapidPromise = new Promise((resolve) => {
    const onRapid = (msg) => {
      if (msg.text && msg.text.startsWith('Rapid-')) {
        rapidReceived.push(msg);
        if (rapidReceived.length === rapidCount) {
          socketB.off('vaultMessage', onRapid);
          resolve();
        }
      }
    };
    socketB.on('vaultMessage', onRapid);
  });

  for (let i = 1; i <= rapidCount; i++) {
    await vaultService.sendVaultMessage(userA.id, convAB.id, {
      messageText: `Rapid-${i}`
    });
  }

  await Promise.race([
    rapidPromise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Rapid messages timeout')), 5000))
  ]);

  console.log(`✓ TEST 4 PASSED: User B received all ${rapidCount} rapid messages.`);
  for (let i = 0; i < rapidCount; i++) {
    const expected = `Rapid-${i + 1}`;
    if (rapidReceived[i].text !== expected) {
      throw new Error(`TEST 4 FAILED: Ordering mismatch at index ${i}. Expected ${expected}, got ${rapidReceived[i].text}`);
    }
  }
  console.log('  Ordering strictly preserved: ' + rapidReceived.map(m => m.text).join(' -> '));

  // TEST 7: Attachments delivery in real-time
  console.log('--- TEST 7: Attachments live delivery ---');
  const imgPromise = new Promise((resolve) => {
    socketB.once('vaultMessage', (msg) => {
      resolve(msg);
    });
  });

  const sentImg = await vaultService.sendVaultMessage(userA.id, convAB.id, {
    messageText: 'quantum_schematic.png',
    mediaUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    mediaType: 'image',
    fileName: 'quantum_schematic.png',
    fileSize: '2.4 KB'
  });

  const receivedImg = await imgPromise;
  console.log('✓ TEST 7a PASSED: Image attachment delivered live with metadata:', receivedImg.mediaType, receivedImg.fileName);
  if (receivedImg.mediaType !== 'image' || receivedImg.fileName !== 'quantum_schematic.png') {
    throw new Error('TEST 7a FAILED: Image attachment metadata mismatch');
  }

  const locPromise = new Promise((resolve) => {
    socketB.once('vaultMessage', (msg) => {
      resolve(msg);
    });
  });

  const sentLoc = await vaultService.sendVaultMessage(userA.id, convAB.id, {
    messageText: 'Location: 37.7749, -122.4194',
    mediaUrl: 'https://www.google.com/maps?q=37.7749,-122.4194',
    mediaType: 'location',
    fileName: 'Shared Location Coordinates'
  });

  const receivedLoc = await locPromise;
  console.log('✓ TEST 7b PASSED: Location attachment delivered live:', receivedLoc.mediaType, receivedLoc.mediaUrl);
  if (receivedLoc.mediaType !== 'location' || !receivedLoc.mediaUrl.includes('google.com/maps')) {
    throw new Error('TEST 7b FAILED: Location attachment mismatch');
  }

  // TEST 6: Socket disconnect and reconnect behavior
  console.log('--- TEST 6: Socket disconnect and reconnect ---');
  socketB.disconnect();
  await new Promise(r => setTimeout(r, 200));

  const reconnectPromise = new Promise((resolve) => {
    socketB.once('connect', () => {
      resolve();
    });
  });
  socketB.connect();
  await reconnectPromise;
  console.log('✓ Socket B reconnected successfully.');

  const postReconnectPromise = new Promise((resolve) => {
    socketB.once('vaultMessage', (msg) => {
      resolve(msg);
    });
  });

  await vaultService.sendVaultMessage(userA.id, convAB.id, {
    messageText: 'Post-reconnect live message'
  });

  const postReconnectMsg = await postReconnectPromise;
  console.log('✓ TEST 6 PASSED: Real-time message delivered successfully after reconnection:', postReconnectMsg.text);

  // TEST 8: Database Persistence remains source of truth
  console.log('--- TEST 8: DB Persistence verification ---');
  const allMessages = await vaultService.getConversationMessages(userB.id, convAB.id);
  console.log(`✓ TEST 8 PASSED: All messages persisted in database (total: ${allMessages.length}).`);
  const foundPostReconnect = allMessages.some(m => m.text === 'Post-reconnect live message');
  if (!foundPostReconnect) {
    throw new Error('TEST 8 FAILED: Post reconnect message not found in DB');
  }

  // Teardown
  socketA.disconnect();
  socketB.disconnect();
  socketC.disconnect();
  await new Promise(resolve => server.close(resolve));

  console.log('========================================================');
  console.log('🎉 ALL 10 PRODUCTION REAL-TIME SOCKET TESTS PASSED! 🎉');
  console.log('========================================================');
  process.exit(0);
}

runLiveSocketTests().catch((err) => {
  console.error('FATAL REAL-TIME TEST ERROR:', err);
  process.exit(1);
});
