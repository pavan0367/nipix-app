const { io: ioClient } = require(require('path').resolve(__dirname, '../../../nipix-frontend/node_modules/socket.io-client'));
const jwt = require('jsonwebtoken');

async function testProductionConnection() {
  console.log('Testing live connection to https://nipix-app.onrender.com ...');
  const token = jwt.sign({ id: 210001 }, process.env.JWT_SECRET || 'NipixSecret2024!!');

  const socket = ioClient('https://nipix-app.onrender.com', {
    auth: { token },
    query: { token },
    transports: ['websocket', 'polling'],
    timeout: 10000
  });

  return new Promise((resolve, reject) => {
    socket.on('connect', () => {
      console.log('✓ Successfully connected to production Socket.IO server! Socket ID:', socket.id);
      console.log('  Transport being used:', socket.io.engine.transport.name);
      socket.disconnect();
      resolve(true);
    });

    socket.on('connect_error', (err) => {
      console.error('✗ Connection error to production Socket.IO:', err.message);
      socket.disconnect();
      reject(err);
    });

    setTimeout(() => {
      socket.disconnect();
      reject(new Error('Connection timed out after 10s'));
    }, 10000);
  });
}

testProductionConnection()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Test finished with error:', err.message);
    process.exit(1);
  });
