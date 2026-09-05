const {
  generateRealAIResponse,
  streamRealAIResponse,
  getAIHealth
} = require('../services/llmService');

const USER_FRIENDLY_ERROR = "I couldn't connect to the AI service right now. Please try again.";

// In-memory active request tracking to prevent concurrent duplicates
const activeRequests = new Map();

/**
 * Controller endpoint: GET /api/ai/health
 * Public diagnostic status showing provider availability
 */
exports.health = (req, res) => {
  return res.json(getAIHealth());
};

/**
 * Controller endpoint: POST /api/ai/chat
 * Standard JSON AI response
 */
exports.chat = async (req, res) => {
  const { botId = 'bytebot_ai', message = '', history = [], requestId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message content is required.'
    });
  }

  const reqKey = requestId || `${botId}_${Date.now()}`;

  if (activeRequests.has(reqKey)) {
    return res.status(429).json({
      success: false,
      reply: 'A request is already being processed.',
      message: 'A request is already being processed.'
    });
  }

  const abortController = new AbortController();
  activeRequests.set(reqKey, abortController);
  res.on('close', () => {
    if (!res.writableEnded) {
      abortController.abort();
    }
    activeRequests.delete(reqKey);
  });

  try {
    const result = await generateRealAIResponse({
      botId,
      message: message.trim(),
      history,
      signal: abortController.signal
    });

    return res.json({
      success: true,
      botId: result.botId,
      reply: result.reply,
      message: result.reply,
      provider: result.provider
    });
  } catch (error) {
    console.error(`[Nipix AI Backend Error] (${botId}):`, error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      reply: USER_FRIENDLY_ERROR,
      message: USER_FRIENDLY_ERROR,
      error: 'AI_PROVIDER_ERROR'
    });
  } finally {
    activeRequests.delete(reqKey);
  }
};

/**
 * Controller endpoint: POST /api/ai/chat/stream
 * Real-time SSE streaming AI response with client abort & deduplication
 */
exports.streamChat = async (req, res) => {
  const { botId = 'bytebot_ai', message = '', history = [], requestId } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Message content is required.'
    });
  }

  const reqKey = requestId || `${botId}_${Date.now()}`;

  // Duplicate request prevention
  if (activeRequests.has(reqKey)) {
    console.warn(`[Nipix AI Stream] Duplicate streaming request rejected: ${reqKey}`);
    return res.status(429).json({
      success: false,
      message: 'Duplicate request in progress.'
    });
  }

  const abortController = new AbortController();
  activeRequests.set(reqKey, abortController);

  let isClosed = false;
  res.on('close', () => {
    if (!res.writableEnded) {
      isClosed = true;
      abortController.abort();
      console.log(`[Nipix AI Stream] Client disconnected/cancelled request: ${reqKey}`);
    }
    activeRequests.delete(reqKey);
  });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  try {
    const result = await streamRealAIResponse({
      botId,
      message: message.trim(),
      history,
      signal: abortController.signal,
      onChunk: (chunk) => {
        if (!isClosed) {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        }
      }
    });

    if (!isClosed) {
      res.write(`data: ${JSON.stringify({ done: true, provider: result.provider, ttft: result.ttft, totalTime: result.totalTime })}\n\n`);
      res.end();
    }
  } catch (error) {
    if (isClosed || abortController.signal.aborted) {
      // Client cancelled intentionally, nothing more to send
      return;
    }

    console.error(`[Nipix AI Stream Error] (${botId}):`, error.response?.data || error.message);

    res.write(`data: ${JSON.stringify({ error: USER_FRIENDLY_ERROR })}\n\n`);
    res.end();
  } finally {
    activeRequests.delete(reqKey);
  }
};
