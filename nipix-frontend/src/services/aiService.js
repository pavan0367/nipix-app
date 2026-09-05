import api, { getBaseApiUrl } from './api';

// Bot Persona Metadata for Nipix AI Characters
export const BOT_PERSONAS = {
  cipher_09: {
    name: 'Cipher_09',
    role: 'Research, Cryptography & Cybersecurity',
    tagline: 'Cryptographic Security & Logical Reasoning',
    accent: '🔒'
  },
  bytebot_ai: {
    name: 'ByteBot AI',
    role: 'Programming & Software Engineering',
    tagline: 'Software Architecture & Code Intelligence',
    accent: '🤖'
  },
  spark_x: {
    name: 'Spark_X',
    role: 'Electrical Engineering, Electronics & Physics',
    tagline: 'Circuits, Energy & Physical Principles',
    accent: '⚡'
  },
  archivist: {
    name: 'Archivist',
    role: 'History, Literature, Research & Documentation',
    tagline: 'Academic Literature & Historical Synthesis',
    accent: '📚'
  },
  novamind: {
    name: 'NovaMind',
    role: 'Mathematics, Science & Analytical Reasoning',
    tagline: 'Analytical Mathematics & Scientific Problem Solving',
    accent: '🧠'
  },
  aether: {
    name: 'Aether',
    role: 'Artificial Intelligence, Quantum & Future Innovation',
    tagline: 'Neural Computation & Future Technology',
    accent: '🌌'
  }
};

/**
 * Send chat message to backend AI service (/api/ai/chat)
 * Standard non-streaming request
 * @param {Object} payload - { botId, message, history }
 * @returns {Promise<Object>} Response object containing reply and provider info
 */
export const sendAiChatMessage = async ({ botId = 'bytebot_ai', message = '', history = [] }) => {
  if (!message || !message.trim()) {
    return {
      success: false,
      reply: "Please enter a message.",
      error: "Empty message"
    };
  }

  try {
    const response = await api.post(
      '/ai/chat',
      {
        botId,
        message: message.trim(),
        history
      },
      { timeout: 30000 }
    );

    const reply = response.data?.reply || response.data?.message;
    console.log(`[Nipix AI Chat] POST /api/ai/chat Status: ${response.status}`);

    if (response.data && reply) {
      return {
        ...response.data,
        reply,
        message: reply
      };
    }

    return {
      success: false,
      reply: "I'm having trouble connecting right now. Please try again.",
      message: "I'm having trouble connecting right now. Please try again.",
      error: "Invalid response format"
    };
  } catch (error) {
    const status = error.response?.status || 'Network Error';
    console.error(`[Nipix AI Chat] POST /api/ai/chat Status: ${status}`, error.response?.data || error.message);

    const errReply = error.response?.data?.reply || error.response?.data?.message || "I'm having trouble connecting right now. Please try again.";

    return {
      success: false,
      reply: errReply,
      message: errReply,
      error: error.response?.data?.error || error.message
    };
  }
};

/**
 * Stream chat message from backend AI service (/api/ai/chat/stream)
 * Server-Sent Events (SSE) streaming with chunk callback
 * Falls back to standard POST if streaming is unsupported
 * @param {Object} payload - { botId, message, history, onChunk }
 * @returns {Promise<Object>} Final response object
 */
export const sendAiChatMessageStream = async ({ botId = 'bytebot_ai', message = '', history = [], onChunk }) => {
  if (!message || !message.trim()) {
    return {
      success: false,
      reply: "Please enter a message.",
      error: "Empty message"
    };
  }

  const baseUrl = getBaseApiUrl();
  const streamUrl = `${baseUrl}/ai/chat/stream`;

  try {
    const token = localStorage.getItem('nipix_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-auth-token'] = token;
    }

    console.log(`[Nipix AI Stream] POST ${streamUrl}`);
    const response = await fetch(streamUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        botId,
        message: message.trim(),
        history
      })
    });

    console.log(`[Nipix AI Stream] Status: ${response.status}`);

    if (!response.ok) {
      console.warn(`[Nipix AI Stream] Stream endpoint status ${response.status}, falling back to standard POST`);
      return await sendAiChatMessage({ botId, message, history });
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let accumulatedText = '';
    let buffer = '';
    let streamDone = false;
    let streamProvider = null;
    let streamError = null;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep partial line

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const jsonStr = line.replace(/^data:\s*/, '').trim();
          if (jsonStr) {
            try {
              const data = JSON.parse(jsonStr);
              if (data.chunk) {
                accumulatedText += data.chunk;
                if (typeof onChunk === 'function') {
                  onChunk(accumulatedText);
                }
              }
              if (data.done) {
                streamDone = true;
                streamProvider = data.provider;
              }
              if (data.error) {
                streamError = data.error;
              }
            } catch (e) {
              // Ignore partial JSON parse errors
            }
          }
        }
      }
    }

    if (streamError && !accumulatedText) {
      return {
        success: false,
        reply: streamError,
        error: streamError
      };
    }

    if (accumulatedText) {
      return {
        success: true,
        reply: accumulatedText,
        provider: streamProvider
      };
    }

    // Fallback if nothing was received from stream
    return await sendAiChatMessage({ botId, message, history });

  } catch (streamError) {
    console.warn('[Nipix AI Chat Stream] Stream failed, falling back to standard POST:', streamError.message);
    return await sendAiChatMessage({ botId, message, history });
  }
};
