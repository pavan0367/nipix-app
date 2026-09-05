require('dotenv').config();
const { checkAIProviderConfig, generateRealAIResponse } = require('./src/services/llmService');

async function testBackendAI() {
  console.log('========================================');
  console.log('🧪 NIPIX AI BACKEND DIRECT TEST HARNESS');
  console.log('========================================');

  const config = checkAIProviderConfig();
  console.log(`Configured Provider: ${config.provider}`);
  console.log(`Configured Model:    ${config.model || 'None'}`);
  console.log(`Has Key:             ${config.ready ? 'YES (Key detected)' : 'NO (Key is missing)'}`);

  if (!config.ready) {
    console.log('\n❌ FAILED: No AI API key is configured.');
    console.log('Please add one of the following to nipix-backend/.env:');
    console.log('  GEMINI_API_KEY=your_key_here');
    console.log('  GROQ_API_KEY=your_key_here');
    console.log('  OPENAI_API_KEY=your_key_here');
    console.log('========================================\n');
    process.exit(1);
  }

  const testQuestions = [
    { bot: 'bytebot_ai', question: 'What is Java?' },
    { bot: 'bytebot_ai', question: 'polymorphism in java' },
    { bot: 'bytebot_ai', question: 'give a code for a secret message as infinity i love you with emojis, each' }
  ];

  for (const t of testQuestions) {
    console.log(`\n--- Testing Bot: ${t.bot} with: "${t.question}" ---`);
    try {
      const startTime = Date.now();
      const res = await generateRealAIResponse({
        botId: t.bot,
        message: t.question,
        history: []
      });
      const elapsed = Date.now() - startTime;
      console.log(`✅ SUCCESS (${elapsed}ms) [Provider: ${res.provider}]:`);
      console.log('----------------------------------------');
      console.log(res.reply);
      console.log('----------------------------------------');
    } catch (err) {
      console.error(`❌ FAILED on "${t.question}":`, err.message);
      if (err.response?.data) {
        console.error('Response Data:', JSON.stringify(err.response.data, null, 2));
      }
      process.exit(1);
    }
  }

  console.log('\n🎉 ALL BACKEND AI TESTS PASSED SUCCESSFULLY!');
  console.log('========================================\n');
}

testBackendAI();
