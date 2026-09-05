require('dotenv').config();
const http = require('http');
const app = require('./app');
const { sequelize } = require('./models');
const { initSocket } = require('./sockets/socket');
const { checkAIProviderConfig } = require('./services/llmService');

const server = http.createServer(app);
initSocket(server); // Initialize Socket.IO

const PORT = process.env.PORT || 5000;

// Start listening immediately
server.listen(PORT, () => {
  console.log(`🚀 Nipix Backend running on port ${PORT}`);
  
  // AI Provider Health Check
  const aiStatus = checkAIProviderConfig();
  if (aiStatus.ready) {
    console.log(`🤖 AI Provider: ${aiStatus.provider} (${aiStatus.model})`);
    console.log(`⚡ AI Configuration: Ready`);
  } else {
    console.log(`⚠️ AI Provider: Not configured (Neither GEMINI_API_KEY, GROQ_API_KEY, nor OPENAI_API_KEY found in .env)`);
  }
});

// Sync Database in background
sequelize.sync({ force: false }).then(() => {
  console.log('✅ MySQL & Sequelize Connected');
}).catch(err => console.error('❌ DB Error:', err.message));