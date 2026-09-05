const axios = require('axios');

/**
 * System Prompts for each Nipix AI Bot Persona
 * Built to embody strong expertise, high-level natural language intelligence, direct answers, and contextual reasoning.
 * No generic templates, no repetitive filler, no artificial refusal of reasonable general questions.
 */
const BOT_SYSTEM_PROMPTS = {
  bytebot_ai: `You are ByteBot AI, an expert programming and software engineering assistant inside Nipix AI Scholar.
Your role:
- Answer programming, software engineering, algorithms, data structures, and computer science questions with deep expertise (Java, Python, JavaScript, TypeScript, C/C++, React, Spring Boot, SQL, etc.).
- Understand the user's exact intent and question before answering. Provide a direct, accurate, useful answer to that exact question.
- When the user asks for code, provide working, clean, properly formatted code with syntax highlighting tags.
- When the user asks to modify previous code (e.g., "make it shorter", "add validation", "make the emojis different", "make it animated", "give only code"), understand references like "it", "this", "that" from the conversation history and output the modified code.
- Do NOT use generic templates such as "Regarding...", "Here is the direct breakdown...", "Core Concept...", "Practical Perspective...", "Next Steps...", or "Would you like me to...".
- Answer naturally, directly, and concisely when appropriate, or in detail when complex.
- Do NOT refuse reasonable educational, scientific, mathematical, or general questions outside programming; answer them intelligently.`,

  cipher_09: `You are Cipher_09, an expert cryptography, cybersecurity, and logical reasoning AI assistant inside Nipix AI Scholar.
Your role:
- Answer questions on cryptography (RSA, AES, hashing, zero-knowledge proofs), cybersecurity, network security, logical reasoning, and algorithmic problem solving.
- Understand the user's exact question and answer directly without generic template filler.
- When asked for security code, vulnerability explanations, or mathematical logic, provide concrete explanations and code.
- Maintain full conversation context across follow-ups.
- Do NOT refuse reasonable questions outside your specialty; answer them intelligently.`,

  spark_x: `You are Spark_X, an expert electrical engineering, electronics, physics, and circuit theory AI assistant inside Nipix AI Scholar.
Your role:
- Answer questions on electrical engineering, circuit theory (KVL, KCL, Ohm's law, Thévenin's theorem), analog/digital electronics, semiconductor devices (transistors, diodes, MOSFETs), signals, VLSI, and physics.
- Provide clear formulas, mathematical derivations, calculations, and circuit diagrams/code (e.g., Arduino, Verilog, C++) when requested.
- Answer directly and naturally without generic template filler.
- Maintain full conversation context across follow-ups.
- Do NOT refuse reasonable questions outside your specialty; answer them intelligently.`,

  archivist: `You are Archivist, an expert study, knowledge synthesis, literature, and research AI assistant inside Nipix AI Scholar.
Your role:
- Answer questions on academic subjects, research methods, study techniques, history, literature, notes, and general knowledge.
- Help students synthesize complex concepts, structure study plans, summarize papers, and understand foundational principles.
- Answer directly, naturally, and thoughtfully without generic template filler.
- Maintain full conversation context across follow-ups.
- Do NOT refuse reasonable programming, mathematical, or technical questions; answer them intelligently.`,

  novamind: `You are NovaMind, an expert mathematics, artificial intelligence, and analytical reasoning assistant inside Nipix AI Scholar.
Your role:
- Answer questions on mathematics (algebra, calculus, linear algebra, statistics, discrete math), AI/machine learning theory, and analytical logic.
- When asked to solve equations (e.g., "solve 2x + 5 = 15"), provide the direct answer and clean step-by-step working.
- When asked for machine learning concepts or Python data science code, provide working code and clear explanations.
- Answer directly and naturally without generic template filler.
- Maintain full conversation context across follow-ups.
- Do NOT refuse reasonable questions outside your specialty; answer them intelligently.`,

  aether: `You are Aether, an expert science, frontier technology, space, and innovation AI assistant inside Nipix AI Scholar.
Your role:
- Answer questions on science, frontier technology, emerging AI architectures, quantum computing, astrophysics, and modern innovation.
- Explain advanced scientific concepts clearly with technical depth and intuitive analogies.
- Answer directly and naturally without generic template filler.
- Maintain full conversation context across follow-ups.
- Do NOT refuse reasonable questions outside your specialty; answer them intelligently.`
};

/**
 * Normalizes history messages into OpenAI-compatible format [{ role, content }]
 */
function normalizeMessages(botId, message, history = []) {
  const systemPrompt = BOT_SYSTEM_PROMPTS[botId] || BOT_SYSTEM_PROMPTS.bytebot_ai;

  const messages = [
    { role: 'system', content: systemPrompt }
  ];

  if (Array.isArray(history)) {
    history.forEach((h) => {
      if (h && (h.text || h.content)) {
        const textContent = (h.text || h.content).trim();
        if (textContent) {
          messages.push({
            role: h.isUser ? 'user' : 'assistant',
            content: textContent
          });
        }
      }
    });
  }

  messages.push({
    role: 'user',
    content: message.trim()
  });

  return messages;
}

/**
 * Categorize errors to provide clear server diagnostics and clean client-facing messages
 */
function categorizeError(err, providerName) {
  const status = err.response?.status || err.status;
  const message = err.message || '';
  const data = err.response?.data;

  console.error(`[Nipix AI Backend Error] [Provider: ${providerName}] [Status: ${status || 'N/A'}]:`, data || message);

  if (err.code === 'CONFIG_MISSING' || message.includes('NO_LLM_KEY_CONFIGURED')) {
    return {
      type: 'API_KEY_MISSING',
      clientMessage: "AI service is not configured. Please add your GEMINI_API_KEY (or GROQ_API_KEY/OPENAI_API_KEY) to nipix-backend/.env to enable live AI responses."
    };
  }

  if (status === 401 || status === 403 || message.includes('API_KEY_INVALID') || message.includes('Unauthorized')) {
    return {
      type: 'AUTH_FAILURE',
      clientMessage: "Sorry, I couldn't reach the AI service right now. Please check the configured API key."
    };
  }

  if (status === 429 || message.includes('quota') || message.includes('rate limit')) {
    return {
      type: 'RATE_LIMIT',
      clientMessage: "The AI assistant is experiencing high traffic right now. Please wait a moment and try again."
    };
  }

  if (err.code === 'ECONNABORTED' || message.includes('timeout') || message.includes('ETIMEDOUT')) {
    return {
      type: 'TIMEOUT',
      clientMessage: "The AI service took too long to respond. Please try again."
    };
  }

  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || message.includes('network')) {
    return {
      type: 'NETWORK_ERROR',
      clientMessage: "Unable to connect to the AI network service. Please check your internet connection and try again."
    };
  }

  return {
    type: 'PROVIDER_ERROR',
    clientMessage: "Sorry, I couldn't reach the AI service right now. Please try again."
  };
}

/**
 * Checks AI Provider Configuration
 */
function checkAIProviderConfig() {
  const preferred = (process.env.AI_PROVIDER || '').trim().toLowerCase();
  const geminiKey = (process.env.GEMINI_API_KEY || (preferred === 'gemini' ? process.env.AI_API_KEY : '')).trim();
  const groqKey = (process.env.GROQ_API_KEY || (preferred === 'groq' ? process.env.AI_API_KEY : '')).trim();
  const openaiKey = (process.env.OPENAI_API_KEY || (preferred === 'openai' ? process.env.AI_API_KEY : '')).trim();
  const openrouterKey = (process.env.OPENROUTER_API_KEY || (preferred === 'openrouter' ? process.env.AI_API_KEY : '')).trim();

  // 1. If preferred provider is explicitly configured and has a key
  if (preferred === 'gemini' && geminiKey) return { provider: 'Gemini', ready: true, key: geminiKey };
  if (preferred === 'groq' && groqKey) return { provider: 'Groq', ready: true, key: groqKey };
  if (preferred === 'openai' && openaiKey) return { provider: 'OpenAI', ready: true, key: openaiKey };
  if (preferred === 'openrouter' && openrouterKey) return { provider: 'OpenRouter', ready: true, key: openrouterKey };

  // 2. Fallback auto-detection: whichever key exists
  if (geminiKey) return { provider: 'Gemini', ready: true, key: geminiKey };
  if (groqKey) return { provider: 'Groq', ready: true, key: groqKey };
  if (openaiKey) return { provider: 'OpenAI', ready: true, key: openaiKey };
  if (openrouterKey) return { provider: 'OpenRouter', ready: true, key: openrouterKey };

  return { provider: 'Not configured', ready: false, key: null };
}

/**
 * 1. Google Gemini Provider (Non-Streaming)
 */
async function callGemini(apiKey, botId, message, history) {
  const systemPrompt = BOT_SYSTEM_PROMPTS[botId] || BOT_SYSTEM_PROMPTS.bytebot_ai;
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `[System Instruction: ${systemPrompt}]` }]
    },
    {
      role: 'model',
      parts: [{ text: 'Understood. I will answer directly, intelligently, and contextually without filler templates.' }]
    }
  ];

  if (Array.isArray(history)) {
    history.forEach((h) => {
      if (h && (h.text || h.content)) {
        contents.push({
          role: h.isUser ? 'user' : 'model',
          parts: [{ text: h.text || h.content }]
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
    { timeout: 25000 }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }
  return text;
}

/**
 * 2. Groq Provider (OpenAI Compatible, Ultra-Fast Non-Streaming)
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
      timeout: 25000
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('Groq returned an empty response.');
  }
  return text;
}

/**
 * 3. OpenAI Provider (Non-Streaming)
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
      timeout: 25000
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenAI returned an empty response.');
  }
  return text;
}

/**
 * 4. OpenRouter Provider (Non-Streaming)
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
      timeout: 25000
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('OpenRouter returned an empty response.');
  }
  return text;
}

/**
 * Main Multi-Provider Real AI Dispatcher (Standard JSON)
 */
async function generateRealAIResponse({ botId = 'bytebot_ai', message = '', history = [] }) {
  const status = checkAIProviderConfig();

  if (!status.ready) {
    const err = new Error('NO_LLM_KEY_CONFIGURED');
    err.code = 'CONFIG_MISSING';
    throw err;
  }

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
    reply: reply.trim(),
    provider: status.provider
  };
}

/**
 * Stream Gemini SSE
 */
async function streamGemini(apiKey, botId, message, history, onChunk) {
  const systemPrompt = BOT_SYSTEM_PROMPTS[botId] || BOT_SYSTEM_PROMPTS.bytebot_ai;
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `[System Instruction: ${systemPrompt}]` }]
    },
    {
      role: 'model',
      parts: [{ text: 'Understood. I will answer directly, intelligently, and contextually without filler templates.' }]
    }
  ];

  if (Array.isArray(history)) {
    history.forEach((h) => {
      if (h && (h.text || h.content)) {
        contents.push({
          role: h.isUser ? 'user' : 'model',
          parts: [{ text: h.text || h.content }]
        });
      }
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const response = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    const err = new Error(`Gemini stream error (${response.status}): ${errText}`);
    err.status = response.status;
    throw err;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep remainder

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.replace(/^data:\s*/, '').trim();
        if (jsonStr) {
          try {
            const parsed = JSON.parse(jsonStr);
            const chunkText = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
            if (chunkText) {
              onChunk(chunkText);
            }
          } catch (e) {
            // Ignore parse errors on partial chunks
          }
        }
      }
    }
  }
}

/**
 * Stream OpenAI-Compatible (Groq, OpenAI, OpenRouter)
 */
async function streamOpenAICompatible(url, apiKey, model, botId, message, history, onChunk, extraHeaders = {}) {
  const messages = normalizeMessages(botId, message, history);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...extraHeaders
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
      stream: true
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    const err = new Error(`Stream error (${response.status}): ${errText}`);
    err.status = response.status;
    throw err;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === 'data: [DONE]') continue;
      if (trimmed.startsWith('data: ')) {
        const jsonStr = trimmed.replace(/^data:\s*/, '');
        try {
          const parsed = JSON.parse(jsonStr);
          const chunkText = parsed.choices?.[0]?.delta?.content;
          if (chunkText) {
            onChunk(chunkText);
          }
        } catch (e) {
          // Ignore partial chunk parse error
        }
      }
    }
  }
}

/**
 * Stream Real AI Response Dispatcher
 */
async function streamRealAIResponse({ botId = 'bytebot_ai', message = '', history = [], onChunk }) {
  const status = checkAIProviderConfig();

  if (!status.ready) {
    const err = new Error('NO_LLM_KEY_CONFIGURED');
    err.code = 'CONFIG_MISSING';
    throw err;
  }

  if (status.provider === 'Gemini') {
    await streamGemini(status.key, botId, message, history, onChunk);
  } else if (status.provider === 'Groq') {
    await streamOpenAICompatible(
      'https://api.groq.com/openai/v1/chat/completions',
      status.key,
      process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      botId,
      message,
      history,
      onChunk
    );
  } else if (status.provider === 'OpenAI') {
    await streamOpenAICompatible(
      'https://api.openai.com/v1/chat/completions',
      status.key,
      process.env.OPENAI_MODEL || 'gpt-4o-mini',
      botId,
      message,
      history,
      onChunk
    );
  } else if (status.provider === 'OpenRouter') {
    await streamOpenAICompatible(
      'https://openrouter.ai/api/v1/chat/completions',
      status.key,
      process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct',
      botId,
      message,
      history,
      onChunk,
      { 'HTTP-Referer': 'https://nipix.app', 'X-Title': 'Nipix AI Scholar' }
    );
  }

  return {
    provider: status.provider
  };
}

module.exports = {
  BOT_SYSTEM_PROMPTS,
  checkAIProviderConfig,
  categorizeError,
  generateRealAIResponse,
  streamRealAIResponse
};
