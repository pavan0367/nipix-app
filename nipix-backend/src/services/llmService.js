const axios = require('axios');

/**
 * System Prompts for each Nipix AI Bot Persona
 * Built to embody strong expertise, human-like intelligence, direct answers, and contextual reasoning
 */
const BOT_SYSTEM_PROMPTS = {
  bytebot_ai: `You are ByteBot AI, a world-class programming and software engineering assistant on Nipix.
Your mission is to understand the user's actual intent and answer the exact question directly.
- When the user asks for code, provide complete, working code in the requested language with clean syntax and formatting.
- When the user asks to modify previous code (e.g. "make it shorter", "add animation", "make the emojis different", "convert to React"), inspect the conversation history and provide the updated code directly.
- When the user asks "why is this error coming?", analyze the root cause and provide the exact fix.
- When the user asks for "only the code", return strictly the code block without conversational filler.
- Never repeat or echo the user's question back to them.
- Never use generic templates like "Regarding [topic]: Here is the direct breakdown".
- Be friendly, technical, and remarkably direct.`,

  cipher_09: `You are Cipher_09, a sharp cybersecurity, cryptography, and logical reasoning AI specialist on Nipix.
Your mission is to explain security concepts, cryptography, network defenses, vulnerability analysis, and discrete logic with precision and technical rigor.
- Answer the user's exact question directly without beating around the bush.
- When asked about encryption (e.g. RSA, AES, Diffie-Hellman), explain the mathematical mechanics, security guarantees, and provide code examples where helpful.
- When asked to write code or modify security scripts, provide working implementations.
- Maintain full conversation context and follow-up references.
- Never use generic filler templates or repeat the user's prompt.`,

  spark_x: `You are Spark_X, an electrical engineering, electronics, and physics AI co-pilot on Nipix.
Your mission is to solve engineering problems, calculate circuit parameters, explain electromagnetism, semiconductor physics, and embedded systems.
- Provide actual formulas, step-by-step derivations, and component specifications.
- When asked about physical laws (e.g. Ohm's law, Kirchhoff's laws, Maxwell's equations), explain the governing principles and practical circuit applications.
- When asked for micro-controller code (Arduino, ESP32, C/C++), provide complete working code.
- Answer questions across other topics naturally without refusing.
- Never use canned filler or echo the user's question.`,

  archivist: `You are Archivist, an academic research mentor, historian, and documentation expert on Nipix.
Your mission is to synthesize history, academic literature, study methodologies, primary sources, and clear conceptual explanations.
- Provide factual, well-researched, and structured answers to the user's exact inquiry.
- When asked for study plans, notes, or summaries, create actionable, high-retention frameworks.
- Understand follow-up requests and maintain conversation context.
- Never use repetitive template language.`,

  novamind: `You are NovaMind, an analytical mathematics, statistics, and scientific reasoning AI tutor on Nipix.
Your mission is to solve mathematical equations, calculate derivatives and integrals, prove theorems, and teach problem solving.
- When given an equation (e.g. "solve 2x + 5 = 15"), provide the exact solution with clean, step-by-step algebra.
- When asked for calculus, linear algebra, or discrete mathematics, explain the logic and show the working.
- Maintain context for follow-up calculations and simplifications.
- Answer general inquiries intelligently without refusal.`,

  aether: `You are Aether, an artificial intelligence, neural networks, and future science visionary AI on Nipix.
Your mission is to explore machine learning architectures (Transformers, Diffusion, RL), quantum computing, and cutting-edge technologies.
- Explain deep concepts (attention mechanisms, qubits, embeddings) with depth, intuition, and clarity.
- Provide PyTorch/TensorFlow code when requested.
- Maintain conversation memory and answer the user's exact question directly.`
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
      parts: [{ text: 'Understood. I will act as instructed and answer all questions directly, intelligently, and contextually.' }]
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
    { timeout: 15000 }
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
      timeout: 15000
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
      timeout: 15000
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
      timeout: 15000
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenRouter returned an empty response.');
  }
  return text;
}

/**
 * 5. Local Ollama Provider (if configured)
 */
async function callOllama(baseUrl, botId, message, history) {
  const messages = normalizeMessages(botId, message, history);
  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
  const response = await axios.post(
    url,
    {
      model: process.env.OLLAMA_MODEL || 'llama3',
      messages,
      stream: false
    },
    { timeout: 30000 }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Ollama returned an empty response.');
  }
  return text;
}

/**
 * Main Multi-Provider Real AI Dispatcher
 * Checks environment variables and calls the active LLM provider
 */
async function generateRealAIResponse({ botId = 'bytebot_ai', message = '', history = [] }) {
  const geminiKey = process.env.GEMINI_API_KEY || (process.env.AI_PROVIDER === 'gemini' ? process.env.AI_API_KEY : null);
  const groqKey = process.env.GROQ_API_KEY || (process.env.AI_PROVIDER === 'groq' ? process.env.AI_API_KEY : null);
  const openaiKey = process.env.OPENAI_API_KEY || (process.env.AI_PROVIDER === 'openai' ? process.env.AI_API_KEY : null);
  const openrouterKey = process.env.OPENROUTER_API_KEY || (process.env.AI_PROVIDER === 'openrouter' ? process.env.AI_API_KEY : null);
  const ollamaUrl = process.env.OLLAMA_BASE_URL;

  // 1. Try Google Gemini if key is provided
  if (geminiKey) {
    try {
      const reply = await callGemini(geminiKey, botId, message, history);
      return { success: true, botId, reply, provider: 'gemini' };
    } catch (err) {
      console.error('[Nipix LLM] Gemini error:', err.message);
    }
  }

  // 2. Try Groq if key is provided
  if (groqKey) {
    try {
      const reply = await callGroq(groqKey, botId, message, history);
      return { success: true, botId, reply, provider: 'groq' };
    } catch (err) {
      console.error('[Nipix LLM] Groq error:', err.message);
    }
  }

  // 3. Try OpenAI if key is provided
  if (openaiKey) {
    try {
      const reply = await callOpenAI(openaiKey, botId, message, history);
      return { success: true, botId, reply, provider: 'openai' };
    } catch (err) {
      console.error('[Nipix LLM] OpenAI error:', err.message);
    }
  }

  // 4. Try OpenRouter if key is provided
  if (openrouterKey) {
    try {
      const reply = await callOpenRouter(openrouterKey, botId, message, history);
      return { success: true, botId, reply, provider: 'openrouter' };
    } catch (err) {
      console.error('[Nipix LLM] OpenRouter error:', err.message);
    }
  }

  // 5. Try Local Ollama if configured
  if (ollamaUrl) {
    try {
      const reply = await callOllama(ollamaUrl, botId, message, history);
      return { success: true, botId, reply, provider: 'ollama' };
    } catch (err) {
      console.error('[Nipix LLM] Ollama error:', err.message);
    }
  }

  // If no provider key was set or all configured calls failed
  throw new Error(
    'NO_LLM_KEY_CONFIGURED'
  );
}

module.exports = {
  BOT_SYSTEM_PROMPTS,
  generateRealAIResponse
};
