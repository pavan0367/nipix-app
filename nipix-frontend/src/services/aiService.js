import api from './api';

/**
 * Send chat message to backend AI service (/api/ai/chat)
 * @param {Object} payload - { botId, message, history }
 * @returns {Promise<Object>} Response object containing reply and source
 */
export const sendAiChatMessage = async ({ botId, message, history = [] }) => {
  try {
    const response = await api.post('/ai/chat', {
      botId,
      message,
      history
    });
    return response.data;
  } catch (error) {
    console.error('Error contacting AI service backend:', error);
    // Graceful error fallback response
    return {
      success: false,
      reply: "I couldn't process that message right now. Please try again.",
      error: error.message
    };
  }
};
