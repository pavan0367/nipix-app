import api from './api';

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
 * Send chat message to authoritative backend AI service (/api/ai/chat)
 * Real AI conversation with multi-turn context
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

    if (response.data && response.data.reply) {
      return response.data;
    }

    return {
      success: false,
      reply: "I'm having trouble reaching the AI service right now. Please try again in a moment.",
      error: "Invalid response format"
    };
  } catch (error) {
    console.error('[Nipix AI Chat Client] Error contacting backend:', error.message);

    // If backend provided a specific helpful message (e.g. key missing)
    if (error.response?.data?.reply) {
      return {
        success: false,
        reply: error.response.data.reply,
        error: error.response.data.error || error.message
      };
    }

    return {
      success: false,
      reply: "I'm having trouble reaching the AI service right now. Please try again in a moment.",
      error: error.message
    };
  }
};
