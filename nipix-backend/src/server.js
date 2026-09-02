const http = require('http');
const app = require('./app');
const { sequelize } = require('./models');
const { initSocket } = require('./sockets/socket');

const server = http.createServer(app);
initSocket(server); // Initialize Socket.IO

sequelize.sync({ force: false }).then(() => {
  console.log('✅ MySQL & Sequelize Connected');
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`🚀 Nipix Backend running on port ${PORT}`));
}).catch(err => console.error('❌ DB Error:', err));