const {
  generateRealAIResponse,
  streamRealAIResponse
} = require('../services/llmService');

const USER_FRIENDLY_ERROR = "I'm having trouble connecting right now. Please try again.";

/**
 * Controller endpoint: POST /api/ai/chat
 * Standard JSON AI response
 */
exports.chat = async (req, res) => {
  const { botId = 'bytebot_ai', message = '', history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message content is required.'
    });
  }

  try {
    const result = await generateRealAIResponse({
      botId,
      message: message.trim(),
      history
    });

    return res.json({
      success: true,
      botId: result.botId,
      reply: result.reply,
      message: result.reply,
      provider: result.provider
    });
  } catch (error) {
    // Technical provider errors are logged to the backend console only
    console.error(`[Nipix AI Backend Error] (${botId}):`, error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      reply: USER_FRIENDLY_ERROR,
      message: USER_FRIENDLY_ERROR,
      error: 'AI_PROVIDER_ERROR'
    });
  }
};

/**
 * Controller endpoint: POST /api/ai/chat/stream
 * Real-time SSE streaming AI response
 */
exports.streamChat = async (req, res) => {
  const { botId = 'bytebot_ai', message = '', history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message content is required.'
    });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  try {
    const { provider } = await streamRealAIResponse({
      botId,
      message: message.trim(),
      history,
      onChunk: (chunk) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
    });

    res.write(`data: ${JSON.stringify({ done: true, provider })}\n\n`);
    res.end();
  } catch (error) {
    console.error(`[Nipix AI Stream Error] (${botId}):`, error.response?.data || error.message);

    res.write(`data: ${JSON.stringify({ error: USER_FRIENDLY_ERROR })}\n\n`);
    res.end();
  }
};
