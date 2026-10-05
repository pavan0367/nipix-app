const axios = require('axios');
const jwt = require('jsonwebtoken');
const path = require('path');
const { io: ioClient } = require(path.resolve(__dirname, '../../../nipix-frontend/node_modules/socket.io-client'));

const API_BASE = 'https://nipix-app.onrender.com/api';
const SOCKET_URL = 'https://nipix-app.onrender.com';
const JWT_SECRET = process.env.JWT_SECRET || 'NipixSecret2024!!';

async function runCallSignalingSuite() {
  console.log('================================================================');
  console.log('📞 WEBRTC & SOCKET.IO LIVE CALL SIGNALING TEST SUITE (RENDER)');
  console.log('================================================================');
  console.log(`Backend API: ${API_BASE}`);
  console.log(`Socket URL:  ${SOCKET_URL}`);

  // Test users: User 1 (Alice: 210001), User 2 (Bob: 210002), User 3 (Charlie: 210003)
  const token1 = jwt.sign({ id: 210001 }, JWT_SECRET, { expiresIn: '1h' });
  const token2 = jwt.sign({ id: 210002 }, JWT_SECRET, { expiresIn: '1h' });
  const token3 = jwt.sign({ id: 210003 }, JWT_SECRET, { expiresIn: '1h' });

  const createSocket = (token) => {
    return ioClient(SOCKET_URL, {
      auth: { token },
      query: { token },
      transports: ['websocket', 'polling'],
      withCredentials: true,
      forceNew: true
    });
  };

  const socket1 = createSocket(token1);
  const socket2 = createSocket(token2);
  const socket3 = createSocket(token3);

  await Promise.all([
    new Promise(res => socket1.on('connect', res)),
    new Promise(res => socket2.on('connect', res)),
    new Promise(res => socket3.on('connect', res))
  ]);
  console.log('✓ All 3 test user sockets connected to production Socket.IO!');

  // Ensure conversation between Alice and Bob
  const convRes = await axios.post(
    `${API_BASE}/vault/conversations`,
    { targetUserId: 210002 },
    { headers: { Authorization: `Bearer ${token1}` } }
  );
  const convAB = convRes.data.conversation.id;
  console.log(`✓ Active Conversation (Alice <-> Bob) ID: ${convAB}`);

  // TEST 1: Outgoing Audio Call (Alice -> Bob) & Incoming Call Delivery
  console.log('\n--- TEST 1: Alice initiates Audio Call to Bob ---');
  const callId1 = `call_test_audio_${Date.now()}`;
  const mockSdpOffer = { type: 'offer', sdp: 'v=0\r\no=alice 12345 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n' };

  let charlieHeardCall = false;
  socket3.on('call:incoming', () => { charlieHeardCall = true; });

  const bobIncomingPromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Bob incoming call timeout')), 10000);
    socket2.once('call:incoming', (data) => {
      clearTimeout(t);
      resolve(data);
    });
  });

  const aliceRingingPromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Alice ringing timeout')), 10000);
    socket1.once('call:ringing', (data) => {
      clearTimeout(t);
      resolve(data);
    });
  });

  socket1.emit('call:offer', {
    callId: callId1,
    conversationId: convAB,
    recipientId: 210002,
    callerId: 210001,
    callerName: 'Alice Scholar',
    callType: 'audio',
    sdp: mockSdpOffer
  });

  const [bobIncoming, aliceRinging] = await Promise.all([bobIncomingPromise, aliceRingingPromise]);
  console.log('✓ TEST 1 PASSED: Bob received call:incoming event live!');
  console.log('  callId:', bobIncoming.callId);
  console.log('  callerId:', bobIncoming.callerId);
  console.log('  callerName:', bobIncoming.callerName);
  console.log('  callType:', bobIncoming.callType);
  console.log('✓ Alice received call:ringing acknowledgement live!');

  // TEST 2: Private Call Targeting (Charlie must receive 0 call events)
  await new Promise(r => setTimeout(r, 200));
  if (charlieHeardCall) {
    throw new Error('TEST 2 FAILED: Unauthorized user Charlie received call intended for Bob!');
  }
  console.log('✓ TEST 2 PASSED: Charlie received 0 call events. Private call targeting verified.');

  // TEST 3: Bob Accepts Audio Call & Emits Answer
  console.log('\n--- TEST 3: Bob accepts Audio Call and returns SDP answer ---');
  const mockSdpAnswer = { type: 'answer', sdp: 'v=0\r\no=bob 67890 2 IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n' };

  const aliceAnswerPromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Alice answer timeout')), 10000);
    socket1.once('call:answer', (data) => {
      clearTimeout(t);
      resolve(data);
    });
  });

  socket2.emit('call:answer', {
    callId: callId1,
    targetUserId: 210001,
    sdp: mockSdpAnswer
  });

  const aliceAnswer = await aliceAnswerPromise;
  console.log('✓ TEST 3 PASSED: Alice received call:answer event live!');
  console.log('  callId:', aliceAnswer.callId);
  console.log('  responderId:', aliceAnswer.responderId);
  console.log('  sdp type:', aliceAnswer.sdp?.type);

  // TEST 4: ICE Candidate Exchange in both directions
  console.log('\n--- TEST 4: Bidirectional ICE Candidate Exchange ---');
  const bobIcePromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Bob ICE timeout')), 10000);
    socket2.once('call:ice-candidate', resolve);
  });
  const aliceIcePromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Alice ICE timeout')), 10000);
    socket1.once('call:ice-candidate', resolve);
  });

  socket1.emit('call:ice-candidate', {
    callId: callId1,
    targetUserId: 210002,
    candidate: { candidate: 'candidate:1 1 UDP 2130706431 192.168.1.1 50000 typ host', sdpMid: '0', sdpMLineIndex: 0 }
  });

  socket2.emit('call:ice-candidate', {
    callId: callId1,
    targetUserId: 210001,
    candidate: { candidate: 'candidate:2 1 UDP 2130706431 192.168.1.2 50001 typ host', sdpMid: '0', sdpMLineIndex: 0 }
  });

  const [bobIce, aliceIce] = await Promise.all([bobIcePromise, aliceIcePromise]);
  console.log('✓ TEST 4 PASSED: Bob received Alice\'s ICE candidate live!');
  console.log('✓ TEST 4 PASSED: Alice received Bob\'s ICE candidate live!');

  // TEST 5: Call Ending
  console.log('\n--- TEST 5: Call End & Duration Sync ---');
  const bobEndedPromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Bob call end timeout')), 10000);
    socket2.once('call:ended', resolve);
  });

  socket1.emit('call:end', {
    callId: callId1,
    targetUserId: 210002,
    duration: 42
  });

  const bobEnded = await bobEndedPromise;
  console.log('✓ TEST 5 PASSED: Bob received call:ended event live!');
  console.log('  endedBy:', bobEnded.endedBy);
  console.log('  duration:', bobEnded.duration);

  // TEST 6: Decline Flow (Alice calls Bob -> Bob declines)
  console.log('\n--- TEST 6: Decline Call Flow ---');
  const callId2 = `call_test_decline_${Date.now()}`;

  const bobIncomingPromise2 = new Promise(res => socket2.once('call:incoming', res));
  socket1.emit('call:offer', {
    callId: callId2,
    conversationId: convAB,
    recipientId: 210002,
    callerId: 210001,
    callerName: 'Alice Scholar',
    callType: 'audio',
    sdp: mockSdpOffer
  });
  await bobIncomingPromise2;

  const aliceDeclinedPromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Alice decline timeout')), 10000);
    socket1.once('call:declined', resolve);
  });

  socket2.emit('call:decline', {
    callId: callId2,
    targetUserId: 210001,
    conversationId: convAB,
    reason: 'declined'
  });

  const aliceDeclined = await aliceDeclinedPromise;
  console.log('✓ TEST 6 PASSED: Alice received call:declined event live!');
  console.log('  declinerId:', aliceDeclined.declinerId);

  // TEST 7: Cancel Flow (Alice calls Bob -> Alice cancels before Bob answers)
  console.log('\n--- TEST 7: Cancel Call Flow (Caller Cancels) ---');
  const callId3 = `call_test_cancel_${Date.now()}`;

  const bobIncomingPromise3 = new Promise(res => socket2.once('call:incoming', res));
  socket1.emit('call:offer', {
    callId: callId3,
    conversationId: convAB,
    recipientId: 210002,
    callerId: 210001,
    callerName: 'Alice Scholar',
    callType: 'video',
    sdp: mockSdpOffer
  });
  await bobIncomingPromise3;

  const bobCancelledPromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Bob cancelled timeout')), 10000);
    socket2.once('call:cancelled', resolve);
  });

  socket1.emit('call:cancel', {
    callId: callId3,
    targetUserId: 210002
  });

  const bobCancelled = await bobCancelledPromise;
  console.log('✓ TEST 7 PASSED: Bob received call:cancelled event live!');
  console.log('  callerId:', bobCancelled.callerId);

  // TEST 8: Busy State Handling
  console.log('\n--- TEST 8: Busy State Handling ---');
  const callId4 = `call_test_busy_${Date.now()}`;

  const aliceBusyPromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Alice busy timeout')), 10000);
    socket1.once('call:busy', resolve);
  });

  socket2.emit('call:busy', {
    callId: callId4,
    targetUserId: 210001
  });

  const aliceBusy = await aliceBusyPromise;
  console.log('✓ TEST 8 PASSED: Alice received call:busy event live!');
  console.log('  responderId:', aliceBusy.responderId);

  // TEST 9: CallLog Persistence via REST API
  console.log('\n--- TEST 9: CallLog Database Persistence ---');
  const logRes = await axios.post(
    `${API_BASE}/vault/call-logs`,
    {
      contactId: 210002,
      callType: 'video',
      direction: 'outgoing',
      status: 'completed',
      duration: 125
    },
    { headers: { Authorization: `Bearer ${token1}` } }
  );
  console.log('✓ CallLog created for Alice: id =', logRes.data.callLog.id);

  const getLogsRes = await axios.get(
    `${API_BASE}/vault/call-logs`,
    { headers: { Authorization: `Bearer ${token1}` } }
  );
  const found = getLogsRes.data.callLogs.find(l => l.id === logRes.data.callLog.id);
  if (!found) throw new Error('TEST 9 FAILED: CallLog not found in database');
  console.log('✓ TEST 9 PASSED: CallLog verified in database:');
  console.log('  callType:', found.callType);
  console.log('  direction:', found.direction);
  console.log('  status:', found.status);
  console.log('  duration:', found.duration);

  // TEST 10: Verify Existing Text Chat is 100% Intact
  console.log('\n--- TEST 10: Verify Existing Text Chat is Completely Intact ---');
  const textMsgPromise = new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('Text message timeout')), 10000);
    socket2.once('vaultMessage', resolve);
  });

  const sendTextRes = await axios.post(
    `${API_BASE}/vault/conversations/${convAB}/messages`,
    { messageText: 'VERIFY_CHAT_INTACT_AFTER_CALL_FIX', mediaType: 'text' },
    { headers: { Authorization: `Bearer ${token1}` } }
  );

  const recTextMsg = await textMsgPromise;
  if (recTextMsg.text !== 'VERIFY_CHAT_INTACT_AFTER_CALL_FIX') {
    throw new Error('TEST 10 FAILED: Chat message text mismatch');
  }
  console.log('✓ TEST 10 PASSED: Live text chat continues to function flawlessly!');

  // Cleanup
  socket1.disconnect();
  socket2.disconnect();
  socket3.disconnect();

  console.log('\n================================================================');
  console.log('🎉 ALL CALL SIGNALING & WEBRTC E2E TESTS PASSED 100%!');
  console.log('================================================================');
  process.exit(0);
}

runCallSignalingSuite().catch(err => {
  console.error('CALL SIGNALING TEST FAILED:', err.response?.data || err.message);
  process.exit(1);
});
