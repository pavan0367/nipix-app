const http = require('http');
const express = require('express');
const jwt = require('jsonwebtoken');
const { initSocket } = require('../sockets/socket');
const { io: ioClient } = require(require('path').resolve(__dirname, '../../../nipix-frontend/node_modules/socket.io-client'));

const JWT_SECRET = 'NipixSecret2024!!';

async function testLocalSocketSignaling() {
  const app = express();
  const server = http.createServer(app);
  const io = initSocket(server);

  await new Promise(res => server.listen(0, res));
  const port = server.address().port;
  console.log(`Local test server running on port ${port}`);

  const token1 = jwt.sign({ id: 210001 }, JWT_SECRET, { expiresIn: '1h' });
  const token2 = jwt.sign({ id: 210002 }, JWT_SECRET, { expiresIn: '1h' });
  const token3 = jwt.sign({ id: 210003 }, JWT_SECRET, { expiresIn: '1h' });

  const url = `http://localhost:${port}`;
  const socket1 = ioClient(url, { auth: { token: token1 } });
  const socket2 = ioClient(url, { auth: { token: token2 } });
  const socket3 = ioClient(url, { auth: { token: token3 } });

  await Promise.all([
    new Promise(res => socket1.on('connect', res)),
    new Promise(res => socket2.on('connect', res)),
    new Promise(res => socket3.on('connect', res))
  ]);
  console.log('✓ All 3 test sockets connected locally!');

  // Test offer & incoming
  const callId = 'test_call_local_123';
  const offerPromise = new Promise(resolve => {
    socket2.once('call:incoming', resolve);
  });

  socket1.emit('call:offer', {
    callId,
    recipientId: 210002,
    callerId: 210001,
    callerName: 'Alice',
    callType: 'audio',
    sdp: { type: 'offer', sdp: 'dummy_offer' }
  });

  const incoming = await offerPromise;
  console.log('✓ Local test: call:incoming received by Bob:', incoming.callId, incoming.callType);

  // Test answer
  const answerPromise = new Promise(resolve => {
    socket1.once('call:answer', resolve);
  });
  socket2.emit('call:answer', {
    callId,
    targetUserId: 210001,
    sdp: { type: 'answer', sdp: 'dummy_answer' }
  });
  const answer = await answerPromise;
  console.log('✓ Local test: call:answer received by Alice:', answer.callId);

  // Test ICE
  const icePromise = new Promise(resolve => {
    socket1.once('call:ice-candidate', resolve);
  });
  socket2.emit('call:ice-candidate', {
    callId,
    targetUserId: 210001,
    candidate: { candidate: 'candidate:dummy' }
  });
  const ice = await icePromise;
  console.log('✓ Local test: call:ice-candidate received by Alice:', ice.candidate);

  // Test End
  const endPromise = new Promise(resolve => {
    socket2.once('call:ended', resolve);
  });
  socket1.emit('call:end', {
    callId,
    targetUserId: 210002,
    duration: 15
  });
  const end = await endPromise;
  console.log('✓ Local test: call:ended received by Bob:', end.duration);

  socket1.disconnect();
  socket2.disconnect();
  socket3.disconnect();
  server.close();
  console.log('🎉 LOCAL SIGNALING VERIFICATION PASSED 100%!');
  process.exit(0);
}

testLocalSocketSignaling().catch(e => {
  console.error('Local test failed:', e);
  process.exit(1);
});
