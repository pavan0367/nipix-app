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
    // Technical log on developer server console
    console.error('[Nipix AI Chat Controller Error]:', error.message);

    // Clean user-facing error response (per requirements: "AI service is temporarily unavailable. Please try again.")
    return res.status(503).json({
      success: false,
      reply: "AI service is temporarily unavailable. Please try again.",
      error: 'AI_SERVICE_UNAVAILABLE'
    });
  }
};
