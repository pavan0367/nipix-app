const { generateRealAIResponse } = require('../services/llmService');

/**
 * Controller endpoint: POST /api/ai/chat
 * Real AI Chat conversation handler
 */
exports.chat = async (req, res) => {
  try {
    const { botId = 'bytebot_ai', message = '', history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.'
      });
    }

    // Call Real LLM Dispatcher
    const result = await generateRealAIResponse({
      botId,
      message: message.trim(),
      history
    });

    return res.json({
      success: true,
      botId: result.botId,
      reply: result.reply,
      provider: result.provider
    });

  } catch (error) {
    console.error('[Nipix AI Chat Controller] Error:', error.message);

    if (error.message === 'NO_LLM_KEY_CONFIGURED') {
      return res.status(503).json({
        success: false,
        reply: "AI service is not configured. Please add your GEMINI_API_KEY (or GROQ_API_KEY / OPENAI_API_KEY) to nipix-backend/.env to enable live AI responses.",
        error: 'NO_LLM_KEY_CONFIGURED'
      });
    }

    return res.status(500).json({
      success: false,
      reply: "I'm having trouble reaching the AI service right now. Please try again in a moment.",
      error: error.message
    });
  }
};
