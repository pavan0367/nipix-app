const axios = require('axios');

/**
 * System Prompts for each Nipix AI Bot Persona
 * Built to embody strong expertise, human-like intelligence, direct answers, and contextual reasoning
 */
const BOT_SYSTEM_PROMPTS = {
  bytebot_ai: `You are ByteBot AI, an expert programming and software engineering assistant inside Nipix AI Scholar.
Understand the user's exact intent before answering.
Answer the user's actual question directly.
Do not use generic templates.
Do not repeat the user's question unnecessarily.
Do not transform simple questions into unrelated theoretical discussions.
When the user asks for code, provide actual working code with clear syntax and formatting.
When the user asks for an explanation, explain clearly and concisely.
When the user provides code, analyze the actual code.
When the user asks to modify previous code (e.g. "make it shorter", "add animation", "make the emojis different", "convert to React", "add square root"), use the previous conversation context and output the modified code.
Remember the conversation context and understand references such as "it", "this", "that", "make it shorter", and "modify the previous code".
Adapt the response length to the question: for simple questions, be concise; for complex questions, provide detailed technical explanations.
Use Markdown correctly. Use code fences with appropriate language tags for code.
Do not fabricate facts.
If the user asks a question outside your specialization but you can answer accurately, answer it directly rather than giving a generic refusal.`,

  cipher_09: `You are Cipher_09, an expert cybersecurity, cryptography, and logical reasoning AI assistant inside Nipix AI Scholar.
Understand the user's exact intent before answering and answer directly.
Do not use generic templates or repeat the user's question unnecessarily.
Explain security concepts, cryptography (RSA, AES, Diffie-Hellman), network defenses, and vulnerability analysis with precision and technical rigor.
When asked for code, security scripts, or mathematical derivations, provide working implementations.
Maintain full conversation context and follow-up references.
If the user asks a question outside your specialization but you can answer accurately, answer it directly.`,

  spark_x: `You are Spark_X, an expert electrical engineering, electronics, and physics AI assistant inside Nipix AI Scholar.
Understand the user's exact intent before answering and answer directly.
Do not use generic templates or repeat the user's question unnecessarily.
Solve engineering problems, calculate circuit parameters, explain physical laws (Ohm's law, Kirchhoff's laws, Maxwell's equations), and provide microcontroller code (Arduino, ESP32, C/C++) with formulas and practical insights.
Maintain full conversation context and follow-up references.
If the user asks a question outside your specialization but you can answer accurately, answer it directly.`,

  archivist: `You are Archivist, an expert academic research mentor, historian, and documentation AI assistant inside Nipix AI Scholar.
Understand the user's exact intent before answering and answer directly.
Do not use generic templates or repeat the user's question unnecessarily.
Synthesize history, academic literature, study methodologies, primary sources, and clear conceptual explanations with depth, clarity, and factual accuracy.
When asked for study plans, notes, or summaries, create actionable frameworks.
Maintain full conversation context and follow-up references.
If the user asks a question outside your specialization but you can answer accurately, answer it directly.`,

  novamind: `You are NovaMind, an expert mathematics, statistics, and analytical reasoning AI assistant inside Nipix AI Scholar.
Understand the user's exact intent before answering and answer directly.
Do not use generic templates or repeat the user's question unnecessarily.
When given an equation (e.g. "solve 2x + 5 = 15"), provide the exact solution with clean, step-by-step algebra.
When asked for calculus, linear algebra, or discrete mathematics, explain the logic and show the working clearly.
Maintain full conversation context and follow-up references.
If the user asks a question outside your specialization but you can answer accurately, answer it directly.`,

  aether: `You are Aether, an expert artificial intelligence, neural networks, and future technology AI assistant inside Nipix AI Scholar.
Understand the user's exact intent before answering and answer directly.
Do not use generic templates or repeat the user's question unnecessarily.
Explain machine learning architectures (Transformers, Diffusion, RL), quantum computing, and frontier technologies with intuition, technical depth, and clarity.
Provide PyTorch/TensorFlow code when requested.
Maintain full conversation context and follow-up references.
If the user asks a question outside your specialization but you can answer accurately, answer it directly.`
};

/**
 * Normalizes history messages into OpenAI-standard [{ role, content }]
 */
function normalizeMessages(botId, message, history = []) {
  const systemPrompt = BOT_SYSTEM_PROMPTS[botId] || BOT_SYSTEM_PROMPTS.bytebot_ai;
  
  const messages = [
    { role: 'system', content: systemPrompt }
  ];

  if (Array.isArray(history)) {
    history.forEach((h) => {
      if (h && h.text) {
        messages.push({
          role: h.isUser ? 'user' : 'assistant',
          content: h.text
        });
      }
    });
  }

  messages.push({
    role: 'user',
    content: message
  });

  return messages;
}

/**
 * 1. Google Gemini Provider
 */
async function callGemini(apiKey, botId, message, history) {
  const systemPrompt = BOT_SYSTEM_PROMPTS[botId] || BOT_SYSTEM_PROMPTS.bytebot_ai;
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `[System Instruction: ${systemPrompt}]` }]
    },
    {
      role: 'model',
      parts: [{ text: 'Understood. I will follow the instructions and answer the user directly and contextually without filler templates.' }]
    }
  ];

  if (Array.isArray(history)) {
    history.forEach((h) => {
      if (h && h.text) {
        contents.push({
          role: h.isUser ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      }
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const response = await axios.post(
    geminiUrl,
    {
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    },
    { timeout: 20000 }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }
  return text;
}

/**
 * 2. Groq Provider (OpenAI Compatible, Ultra-Fast)
 */
async function callGroq(apiKey, botId, message, history) {
  const messages = normalizeMessages(botId, message, history);
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 2048
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 20000
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Groq returned an empty response.');
  }
  return text;
}

/**
 * 3. OpenAI Provider
 */
async function callOpenAI(apiKey, botId, message, history) {
  const messages = normalizeMessages(botId, message, history);
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 2048
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 20000
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenAI returned an empty response.');
  }
  return text;
}

/**
 * 4. OpenRouter Provider
 */
async function callOpenRouter(apiKey, botId, message, history) {
  const messages = normalizeMessages(botId, message, history);
  const response = await axios.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct',
      messages,
      temperature: 0.7,
      max_tokens: 2048
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://nipix.app',
        'X-Title': 'Nipix AI Scholar'
      },
      timeout: 20000
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenRouter returned an empty response.');
  }
  return text;
}

/**
 * Checks AI Provider Configuration for health check logging
 */
function checkAIProviderConfig() {
  const preferred = (process.env.AI_PROVIDER || '').trim().toLowerCase();
  const geminiKey = process.env.GEMINI_API_KEY || (preferred === 'gemini' ? process.env.AI_API_KEY : null);
  const groqKey = process.env.GROQ_API_KEY || (preferred === 'groq' ? process.env.AI_API_KEY : null);
  const openaiKey = process.env.OPENAI_API_KEY || (preferred === 'openai' ? process.env.AI_API_KEY : null);
  const openrouterKey = process.env.OPENROUTER_API_KEY || (preferred === 'openrouter' ? process.env.AI_API_KEY : null);

  if (preferred === 'gemini' && geminiKey) return { provider: 'Gemini', ready: true, key: geminiKey };
  if (preferred === 'groq' && groqKey) return { provider: 'Groq', ready: true, key: groqKey };
  if (preferred === 'openai' && openaiKey) return { provider: 'OpenAI', ready: true, key: openaiKey };
  if (preferred === 'openrouter' && openrouterKey) return { provider: 'OpenRouter', ready: true, key: openrouterKey };

  // Fallback auto-detection if preferred is not set or key matched another
  if (geminiKey) return { provider: 'Gemini', ready: true, key: geminiKey };
  if (groqKey) return { provider: 'Groq', ready: true, key: groqKey };
  if (openaiKey) return { provider: 'OpenAI', ready: true, key: openaiKey };
  if (openrouterKey) return { provider: 'OpenRouter', ready: true, key: openrouterKey };

  return { provider: 'Not configured', ready: false, key: null };
}

/**
 * Main Multi-Provider Real AI Dispatcher
 * Calls the active LLM provider based on environment configuration
 */
async function generateRealAIResponse({ botId = 'bytebot_ai', message = '', history = [] }) {
  const status = checkAIProviderConfig();

  if (!status.ready) {
    console.error('[Nipix AI Backend Error] No valid AI API key found. Please set GEMINI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY in nipix-backend/.env.');
    throw new Error('NO_LLM_KEY_CONFIGURED');
  }

  try {
    let reply = '';
    if (status.provider === 'Gemini') {
      reply = await callGemini(status.key, botId, message, history);
    } else if (status.provider === 'Groq') {
      reply = await callGroq(status.key, botId, message, history);
    } else if (status.provider === 'OpenAI') {
      reply = await callOpenAI(status.key, botId, message, history);
    } else if (status.provider === 'OpenRouter') {
      reply = await callOpenRouter(status.key, botId, message, history);
    }

    return {
      success: true,
      botId,
      reply,
      provider: status.provider
    };
  } catch (err) {
    console.error(`[Nipix AI Backend Error] ${status.provider} call failed:`, err.response?.data || err.message);
    throw err;
  }
}

module.exports = {
  BOT_SYSTEM_PROMPTS,
  checkAIProviderConfig,
  generateRealAIResponse
};
