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
 * @param {Object} payload - { botId, message, history, signal, requestId }
 * @returns {Promise<Object>} Response object containing reply and provider info
 */
export const sendAiChatMessage = async ({ botId = 'bytebot_ai', message = '', history = [], signal, requestId }) => {
  if (!message || !message.trim()) {
    return {
      success: false,
      reply: "Please enter a message.",
      error: "Empty message"
    };
  }

  const finalRequestId = requestId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);

  try {
    const response = await api.post(
      '/ai/chat',
      {
        botId,
        message: message.trim(),
        history,
        requestId: finalRequestId
      },
      { timeout: 30000, signal }
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
      reply: "I couldn't connect to the AI service right now. Please try again.",
      message: "I couldn't connect to the AI service right now. Please try again.",
      error: "Invalid response format"
    };
  } catch (error) {
    if (signal?.aborted || error.name === 'AbortError' || error.name === 'CanceledError') {
      return {
        success: true,
        aborted: true,
        reply: '',
        message: ''
      };
    }

    const status = error.response?.status || 'Network Error';
    console.error(`[Nipix AI Chat] POST /api/ai/chat Status: ${status}`, error.response?.data || error.message);

    const errReply = error.response?.data?.reply || error.response?.data?.message || "I couldn't connect to the AI service right now. Please try again.";

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
 * Server-Sent Events (SSE) streaming with chunk callback and abort control
 * @param {Object} payload - { botId, message, history, onChunk, signal, requestId }
 * @returns {Promise<Object>} Final response object
 */
export const sendAiChatMessageStream = async ({
  botId = 'bytebot_ai',
  message = '',
  history = [],
  onChunk,
  signal,
  requestId
}) => {
  if (!message || !message.trim()) {
    return {
      success: false,
      reply: "Please enter a message.",
      error: "Empty message"
    };
  }

  const finalRequestId = requestId || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`);
  const baseUrl = getBaseApiUrl();
  const streamUrl = `${baseUrl}/ai/chat/stream`;

  let accumulatedText = '';

  try {
    const token = localStorage.getItem('nipix_token');
    const headers = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      headers['x-auth-token'] = token;
    }

    console.log(`[Nipix AI Stream] POST ${streamUrl} (reqId: ${finalRequestId})`);
    const response = await fetch(streamUrl, {
      method: 'POST',
      headers,
      signal,
      body: JSON.stringify({
        botId,
        message: message.trim(),
        history,
        requestId: finalRequestId
      })
    });

    console.log(`[Nipix AI Stream] Status: ${response.status}`);

    if (!response.ok) {
      // If user aborted while fetching
      if (signal?.aborted) {
        return { success: true, aborted: true, reply: accumulatedText };
      }
      console.warn(`[Nipix AI Stream] Stream endpoint status ${response.status}, falling back to standard POST`);
      return await sendAiChatMessage({ botId, message, history, signal, requestId: finalRequestId });
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let streamDone = false;
    let streamProvider = null;
    let streamError = null;

    while (!streamDone) {
      if (signal?.aborted) {
        try {
          await reader.cancel();
        } catch (e) {
          // Ignore cancel error
        }
        return {
          success: true,
          aborted: true,
          reply: accumulatedText
        };
      }

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
    if (!signal?.aborted) {
      return await sendAiChatMessage({ botId, message, history, signal, requestId: finalRequestId });
    }

    return { success: true, aborted: true, reply: '' };

  } catch (streamError) {
    if (signal?.aborted || streamError.name === 'AbortError') {
      return {
        success: true,
        aborted: true,
        reply: accumulatedText
      };
    }

    console.warn('[Nipix AI Chat Stream] Stream failed, falling back to standard POST:', streamError.message);
    return await sendAiChatMessage({ botId, message, history, signal, requestId: finalRequestId });
  }
};
