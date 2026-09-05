require('dotenv').config();
const readline = require('readline');
const { checkAIProviderConfig, generateRealAIResponse, BOT_PROFILES } = require('./src/services/llmService');

async function askQuestion(botId, question, history = []) {
  const botName = BOT_PROFILES[botId]?.name || botId;
  console.log(`\n========================================`);
  console.log(`[Query] Bot: ${botName} (${botId})`);
  console.log(`[Query] Question: "${question}"`);
  console.log(`========================================`);

  try {
    const startTime = Date.now();
    const res = await generateRealAIResponse({
      botId,
      message: question,
      history
    });
    const elapsed = Date.now() - startTime;
    console.log(`\n✅ ${botName} (${elapsed}ms) [Provider: ${res.provider}]:`);
    console.log('----------------------------------------------------');
    console.log(res.reply);
    console.log('----------------------------------------------------\n');
    return res.reply;
  } catch (err) {
    console.error(`\n❌ Request Failed:`, err.message);
    if (err.response?.data) {
      console.error('Details:', JSON.stringify(err.response.data, null, 2));
    }
    return null;
  }
}

async function startInteractiveCLI() {
  console.log('========================================================');
  console.log('💬 NIPIX AI - LIVE INTERACTIVE ASSISTANT');
  console.log('   Ask ANY question on any topic to any bot.');
  console.log('========================================================');

  const config = checkAIProviderConfig();
  console.log(`Configured Provider: ${config.provider}`);
  console.log(`Configured Model:    ${config.model || 'Default'}`);
  console.log(`Status:              ${config.ready ? 'Ready (Connected)' : 'Not Configured'}`);

  if (!config.ready) {
    console.log('\n❌ No AI API key is configured.');
    console.log('Please configure your API key in nipix-backend/.env:');
    console.log('  GEMINI_API_KEY=your_gemini_key_here');
    console.log('  GROQ_API_KEY=your_groq_key_here');
    console.log('  OPENAI_API_KEY=your_openai_key_here\n');
    process.exit(1);
  }

  // Parse command line arguments if user passed a question directly
  const args = process.argv.slice(2);
  let customQuestion = null;
  let selectedBot = 'bytebot_ai';

  if (args.length > 0) {
    const botArg = args.find((a) => a.startsWith('--bot='));
    if (botArg) {
      selectedBot = botArg.split('=')[1];
      const remaining = args.filter((a) => !a.startsWith('--bot='));
      customQuestion = remaining.join(' ');
    } else if (BOT_PROFILES[args[0]]) {
      selectedBot = args[0];
      customQuestion = args.slice(1).join(' ');
    } else {
      customQuestion = args.join(' ');
    }
  }

  // If user passed a single question via CLI: answer it directly
  if (customQuestion && customQuestion.trim()) {
    await askQuestion(selectedBot, customQuestion.trim());
    return;
  }

  // Interactive Live Chat REPL
  console.log(`\nActive Bot: ${BOT_PROFILES[selectedBot]?.name || selectedBot}`);
  console.log(`Available Bots: ${Object.keys(BOT_PROFILES).join(', ')}`);
  console.log(`\nCommands:`);
  console.log(`  /bot <name>  -> Switch active bot (e.g. /bot spark_x)`);
  console.log(`  /clear       -> Clear conversation history`);
  console.log(`  exit         -> Quit`);
  console.log('--------------------------------------------------------\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const sessionHistory = [];

  const promptUser = () => {
    rl.question(`You (${selectedBot}) > `, async (input) => {
      const trimmed = input.trim();
      if (!trimmed) {
        promptUser();
        return;
      }

      if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
        console.log('\nGoodbye! 👋\n');
        rl.close();
        process.exit(0);
      }

      if (trimmed.toLowerCase().startsWith('/bot ')) {
        const newBot = trimmed.slice(5).trim().toLowerCase();
        if (BOT_PROFILES[newBot]) {
          selectedBot = newBot;
          sessionHistory.length = 0; // Fresh context for new bot
          console.log(`\nSwitched active bot to: ${BOT_PROFILES[newBot].name} (${newBot})\n`);
        } else {
          console.log(`\nUnknown bot "${newBot}". Available bots: ${Object.keys(BOT_PROFILES).join(', ')}\n`);
        }
        promptUser();
        return;
      }

      if (trimmed.toLowerCase() === '/clear') {
        sessionHistory.length = 0;
        console.log('\nConversation history cleared.\n');
        promptUser();
        return;
      }

      const reply = await askQuestion(selectedBot, trimmed, sessionHistory);
      if (reply) {
        sessionHistory.push({ isUser: true, text: trimmed });
        sessionHistory.push({ isUser: false, text: reply });
      }

      promptUser();
    });
  };

  promptUser();
}

startInteractiveCLI();
