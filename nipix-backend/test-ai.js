require('dotenv').config();
const readline = require('readline');
const { checkAIProviderConfig, generateRealAIResponse, BOT_PROFILES } = require('./src/services/llmService');

async function askQuestion(botId, question) {
  console.log(`\n========================================`);
  console.log(`[Query] Bot: ${BOT_PROFILES[botId]?.name || botId} (${botId})`);
  console.log(`[Query] Question: "${question}"`);
  console.log(`========================================`);

  try {
    const startTime = Date.now();
    const res = await generateRealAIResponse({
      botId,
      message: question,
      history: []
    });
    const elapsed = Date.now() - startTime;
    console.log(`\n✅ ANSWER (${elapsed}ms) [Provider: ${res.provider}]:`);
    console.log('----------------------------------------------------');
    console.log(res.reply);
    console.log('----------------------------------------------------\n');
    return true;
  } catch (err) {
    console.error(`\n❌ FAILED on "${question}":`, err.message);
    if (err.response?.data) {
      console.error('Details:', JSON.stringify(err.response.data, null, 2));
    }
    return false;
  }
}

async function testBackendAI() {
  console.log('========================================');
  console.log('🧪 NIPIX AI - ALL-KIND QUESTION RUNNER');
  console.log('========================================');

  const config = checkAIProviderConfig();
  console.log(`Configured Provider: ${config.provider}`);
  console.log(`Configured Model:    ${config.model || 'None'}`);
  console.log(`Has Key:             ${config.ready ? 'YES (Key detected)' : 'NO (Key is missing)'}`);

  if (!config.ready) {
    console.log('\n❌ FAILED: No AI API key is configured.');
    console.log('Please configure your API key in nipix-backend/.env:');
    console.log('  GEMINI_API_KEY=your_gemini_key_here');
    console.log('  GROQ_API_KEY=your_groq_key_here');
    console.log('  OPENAI_API_KEY=your_openai_key_here');
    console.log('========================================\n');
    process.exit(1);
  }

  // Parse command line arguments to accept ANY user question on the fly
  const args = process.argv.slice(2);
  let customQuestion = null;
  let selectedBot = 'bytebot_ai';

  if (args.length > 0) {
    const botArg = args.find(a => a.startsWith('--bot='));
    if (botArg) {
      selectedBot = botArg.split('=')[1];
      const remaining = args.filter(a => !a.startsWith('--bot='));
      customQuestion = remaining.join(' ');
    } else if (BOT_PROFILES[args[0]]) {
      selectedBot = args[0];
      customQuestion = args.slice(1).join(' ');
    } else {
      customQuestion = args.join(' ');
    }
  }

  // 1. If user passed a question via CLI: answer it directly
  if (customQuestion && customQuestion.trim()) {
    await askQuestion(selectedBot, customQuestion.trim());
    return;
  }

  // 2. Default: Multi-category demonstration answering all/any kinds of questions
  const allKindDemoQuestions = [
    {
      category: 'General Knowledge / Astronomy',
      bot: 'bytebot_ai',
      question: 'What is the average distance between Earth and the Moon, and why does it vary?'
    },
    {
      category: 'Mathematics & Logic',
      bot: 'bytebot_ai',
      question: 'Solve this step by step: If 3x + 15 = 45, what is the value of x?'
    },
    {
      category: 'Creative / Everyday Life',
      bot: 'bytebot_ai',
      question: 'Give 3 quick, healthy breakfast ideas that can be prepared in under 5 minutes.'
    },
    {
      category: 'Programming & Algorithms',
      bot: 'bytebot_ai',
      question: 'Write a Python function to check if a string is a palindrome, with test examples.'
    }
  ];

  console.log(`\n📋 Testing all/any kind questions across diverse categories...`);
  console.log(`💡 Tip: You can test ANY custom question by running:`);
  console.log(`   node test-ai.js "your question here"`);
  console.log(`   node test-ai.js --bot=cipher_09 "your question here"\n`);

  for (const item of allKindDemoQuestions) {
    console.log(`\n[Category: ${item.category}]`);
    const success = await askQuestion(item.bot, item.question);
    if (!success) {
      process.exit(1);
    }
  }

  console.log('🎉 ALL QUESTION CATEGORIES ANSWERED SUCCESSFULLY!');
  console.log('========================================\n');
}

testBackendAI();
