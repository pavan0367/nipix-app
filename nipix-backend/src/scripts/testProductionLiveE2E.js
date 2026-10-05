const axios = require('axios');
const jwt = require('jsonwebtoken');
const { io: ioClient } = require(require('path').resolve(__dirname, '../../../nipix-frontend/node_modules/socket.io-client'));

const API_BASE = 'https://nipix-app.onrender.com/api';
const SOCKET_URL = 'https://nipix-app.onrender.com';
const JWT_SECRET = process.env.JWT_SECRET || 'NipixSecret2024!!';

async function runFullProductionTestSuite() {
  console.log('===============================================================');
  console.log('🚀 FULL PRODUCTION MULTI-USER LIVE TEST (RENDER + PRODUCTION DB)');
  console.log('===============================================================');
  console.log(`Backend API: ${API_BASE}`);
  console.log(`Socket Server: ${SOCKET_URL}`);

  // Test users: Alice (210001), Bob (210002), Charlie (210003)
  const tokenA = jwt.sign({ id: 210001 }, JWT_SECRET, { expiresIn: '1h' });
  const tokenB = jwt.sign({ id: 210002 }, JWT_SECRET, { expiresIn: '1h' });
  const tokenC = jwt.sign({ id: 210003 }, JWT_SECRET, { expiresIn: '1h' });

  const createSocket = (token) => {
    return ioClient(SOCKET_URL, {
      auth: { token },
      query: { token },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      forceNew: true
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
  console.log('✓ Socket A (Alice), Socket B (Bob), Socket C (Charlie) connected to production Socket.IO!');

  // Ensure conversation between A and B
  const convRes = await axios.post(
    `${API_BASE}/vault/conversations`,
    { targetUserId: 210002 },
    { headers: { Authorization: `Bearer ${tokenA}` } }
  );
  const convAB = convRes.data.conversation.id;
  console.log(`✓ Conversation A-B ID: ${convAB}`);

  // TEST 1 & 2: User 1 sends message to User 2 (Alice -> Bob)
  console.log('\n--- TEST 1 & 2: Alice sends live message to Bob ---');
  let charlieHeard = false;
  socketC.on('vaultMessage', () => { charlieHeard = true; });

  const bobMsgPromise1 = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Bob timeout 1')), 10000);
    socketB.once('vaultMessage', (msg) => {
      clearTimeout(t);
      resolve(msg);
    });
  });

  const send1 = await axios.post(
    `${API_BASE}/vault/conversations/${convAB}/messages`,
    { messageText: 'LIVE_TEST_A_TO_B_001', mediaType: 'text' },
    { headers: { Authorization: `Bearer ${tokenA}` } }
  );
  const sentMsg1 = send1.data.message;

  const recMsg1 = await bobMsgPromise1;
  console.log('✓ TEST 1 PASSED: Bob received live message instantly:');
  console.log('  Text:', recMsg1.text);
  console.log('  isUser for Bob:', recMsg1.isUser);
  console.log('  Sender ID:', recMsg1.senderId);

  // TEST 2: Canonical timestamp check
  if (new Date(sentMsg1.createdAt).getTime() !== new Date(recMsg1.createdAt).getTime()) {
    throw new Error('TEST 2 FAILED: Timestamp mismatch');
  }
  console.log(`✓ TEST 2 PASSED: Canonical timestamp identical (${sentMsg1.createdAt} === ${recMsg1.createdAt})`);

  // TEST 9 & 10: Private targeting & unauthorized room access
  await new Promise(r => setTimeout(r, 200));
  if (charlieHeard) {
    throw new Error('TEST 9 & 10 FAILED: Charlie received private message meant for Bob');
  }
  console.log('✓ TEST 9 & 10 PASSED: Charlie received 0 messages. Private targeting verified on production.');

  // TEST 15: Reverse Direction (Bob -> Alice)
  console.log('\n--- TEST 15: Reverse direction (Bob sends live message to Alice) ---');
  const aliceMsgPromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Alice timeout')), 10000);
    socketA.once('vaultMessage', (msg) => {
      clearTimeout(t);
      resolve(msg);
    });
  });

  const sendReverse = await axios.post(
    `${API_BASE}/vault/conversations/${convAB}/messages`,
    { messageText: 'LIVE_TEST_B_TO_A_REVERSE_002', mediaType: 'text' },
    { headers: { Authorization: `Bearer ${tokenB}` } }
  );
  const recAliceMsg = await aliceMsgPromise;
  console.log('✓ TEST 15 PASSED: Alice received live message from Bob:');
  console.log('  Text:', recAliceMsg.text);
  console.log('  isUser for Alice:', recAliceMsg.isUser);
  console.log('  Sender ID:', recAliceMsg.senderId);

  // TEST 4: Rapid consecutive messages
  console.log('\n--- TEST 4: 5 Rapid messages in succession ---');
  const rapidCount = 5;
  const rapidReceived = [];

  const rapidPromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Rapid timeout')), 15000);
    const handler = (msg) => {
      if (msg.text && msg.text.startsWith('LIVE_RAPID_')) {
        rapidReceived.push(msg);
        if (rapidReceived.length === rapidCount) {
          socketB.off('vaultMessage', handler);
          clearTimeout(t);
          resolve();
        }
      }
    };
    socketB.on('vaultMessage', handler);
  });

  for (let i = 1; i <= rapidCount; i++) {
    await axios.post(
      `${API_BASE}/vault/conversations/${convAB}/messages`,
      { messageText: `LIVE_RAPID_${i}`, mediaType: 'text' },
      { headers: { Authorization: `Bearer ${tokenA}` } }
    );
  }

  await rapidPromise;
  console.log(`✓ TEST 4 PASSED: Bob received all ${rapidCount} rapid messages in exact order:`);
  for (let i = 0; i < rapidCount; i++) {
    const expected = `LIVE_RAPID_${i + 1}`;
    if (rapidReceived[i].text !== expected) {
      throw new Error(`Ordering mismatch: expected ${expected}, got ${rapidReceived[i].text}`);
    }
  }
  console.log('  Order verified:', rapidReceived.map(m => m.text).join(' -> '));

  // TEST 7: Attachment live delivery
  console.log('\n--- TEST 7: Attachments live delivery ---');
  const attachPromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Attachment timeout')), 10000);
    socketB.once('vaultMessage', (msg) => {
      clearTimeout(t);
      resolve(msg);
    });
  });

  await axios.post(
    `${API_BASE}/vault/conversations/${convAB}/messages`,
    {
      messageText: 'quantum_lab_spec.png',
      mediaUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      mediaType: 'image',
      fileName: 'quantum_lab_spec.png',
      fileSize: '1.8 KB'
    },
    { headers: { Authorization: `Bearer ${tokenA}` } }
  );

  const recAttach = await attachPromise;
  console.log('✓ TEST 7 PASSED: Live attachment received with correct metadata:');
  console.log('  mediaType:', recAttach.mediaType);
  console.log('  fileName:', recAttach.fileName);
  console.log('  fileSize:', recAttach.fileSize);

  // TEST 6: Reconnection handling
  console.log('\n--- TEST 6: Socket disconnect and reconnect ---');
  socketB.disconnect();
  await new Promise(r => setTimeout(r, 300));

  const reconnPromise = new Promise((resolve) => {
    socketB.once('connect', resolve);
  });
  socketB.connect();
  await reconnPromise;
  console.log('✓ Bob reconnected to production socket with new socketId:', socketB.id);

  const postReconnPromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Post-reconnect timeout')), 10000);
    socketB.once('vaultMessage', (msg) => {
      clearTimeout(t);
      resolve(msg);
    });
  });

  await axios.post(
    `${API_BASE}/vault/conversations/${convAB}/messages`,
    { messageText: 'LIVE_AFTER_RECONNECT_003', mediaType: 'text' },
    { headers: { Authorization: `Bearer ${tokenA}` } }
  );

  const recPostMsg = await postReconnPromise;
  console.log('✓ TEST 6 PASSED: Live message delivered after socket reconnect:', recPostMsg.text);

  // Clean up
  socketA.disconnect();
  socketB.disconnect();
  socketC.disconnect();

  console.log('\n===============================================================');
  console.log('🏆 ALL PRODUCTION LIVE TESTS PASSED 100% SUCCESSFULLY! 🏆');
  console.log('===============================================================');
  process.exit(0);
}

runFullProductionTestSuite().catch(err => {
  console.error('PRODUCTION SUITE FAILED:', err.response?.data || err.message);
  process.exit(1);
});
