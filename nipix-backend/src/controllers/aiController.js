const {
  generateRealAIResponse,
  streamRealAIResponse,
  categorizeError
} = require('../services/llmService');

/**
 * Controller endpoint: POST /api/ai/chat
 * Standard JSON conversation handler
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
      provider: result.provider
    });
  } catch (error) {
    const errorInfo = categorizeError(error, 'AI_CHAT');

    return res.status(errorInfo.type === 'API_KEY_MISSING' ? 503 : 500).json({
      success: false,
      reply: errorInfo.clientMessage,
      error: errorInfo.type
    });
  }
};

/**
 * Controller endpoint: POST /api/ai/chat/stream
 * Real-time Server-Sent Events (SSE) streaming conversation handler
 */
exports.streamChat = async (req, res) => {
  const { botId = 'bytebot_ai', message = '', history = [] } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message content is required.'
    });
  }

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  let hasSentChunk = false;

  try {
    const { provider } = await streamRealAIResponse({
      botId,
      message: message.trim(),
      history,
      onChunk: (chunk) => {
        hasSentChunk = true;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      }
    });

    res.write(`data: ${JSON.stringify({ done: true, provider })}\n\n`);
    res.end();
  } catch (error) {
    const errorInfo = categorizeError(error, 'STREAM_CHAT');

    if (!hasSentChunk) {
      // If error occurred before sending any chunk, send error data
      res.write(`data: ${JSON.stringify({ error: errorInfo.clientMessage, errorType: errorInfo.type })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ error: errorInfo.clientMessage, errorType: errorInfo.type })}\n\n`);
    }
    res.end();
  }
};
