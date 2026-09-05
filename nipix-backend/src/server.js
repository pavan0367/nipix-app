require('dotenv').config();
const http = require('http');
const app = require('./app');
const { sequelize } = require('./models');
const { initSocket } = require('./sockets/socket');
const { checkAIProviderConfig } = require('./services/llmService');

const server = http.createServer(app);
initSocket(server); // Initialize Socket.IO

sequelize.sync({ force: false }).then(() => {
  console.log('✅ MySQL & Sequelize Connected');
  
  // AI Provider Health Check per Section 12
  const aiStatus = checkAIProviderConfig();
  if (aiStatus.ready) {
    console.log(`🤖 AI Provider: ${aiStatus.provider}`);
    console.log(`⚡ AI Configuration: Ready`);
  } else {
    console.log(`⚠️ AI Provider: Not configured`);
  }

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`🚀 Nipix Backend running on port ${PORT}`));
}).catch(err => console.error('❌ DB Error:', err));