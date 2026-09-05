const axios = require('axios');

/**
 * 6 Bot Personas inside Nipix AI Scholar
 * Personality & expertise hints only — NOT hard restrictions.
 */
const BOT_PROFILES = {
  bytebot_ai: {
    name: 'ByteBot AI',
    role: 'Programming & Software Engineering Assistant',
    expertise: 'programming languages (Java, Python, JavaScript, C++, React, etc.), algorithms, data structures, debugging, and software architecture'
  },
  cipher_09: {
    name: 'Cipher_09',
    role: 'Research, Cryptography & Cybersecurity Assistant',
    expertise: 'cryptography, cybersecurity, network protocols, logical reasoning, and computer security research'
  },
  spark_x: {
    name: 'Spark_X',
    role: 'Electrical Engineering, Physics & Circuit Theory Assistant',
    expertise: 'electrical engineering, circuit theory (KVL, KCL, Ohm\'s law), semiconductor physics, electronics, and calculations'
  },
  archivist: {
    name: 'Archivist',
    role: 'Study, Knowledge & Research Assistant',
    expertise: 'study techniques, academic research, history, literature, note taking, and conceptual learning guidance'
  },
  novamind: {
    name: 'NovaMind',
    role: 'AI, Mathematics & Logical Reasoning Assistant',
    expertise: 'mathematics, algebra, calculus, AI/machine learning theory, and step-by-step problem solving'
  },
  aether: {
    name: 'Aether',
    role: 'Science & Innovation Assistant',
    expertise: 'science, emerging technologies, space, neural computation, and modern innovation'
  }
};

/**
 * Generates clean, ChatGPT-style system prompt for each bot.
 * Answers directly, understands intent, generates code with explanations, remembers context.
 */
function getSystemPrompt(botId) {
  const profile = BOT_PROFILES[botId] || BOT_PROFILES.bytebot_ai;

  return `You are ${profile.name}, a versatile, highly intelligent, general-purpose AI assistant similar to ChatGPT, with primary focus in ${profile.expertise}.

Core Guidelines:
1. ANSWER ALL AND ANY QUESTIONS: You must answer any and all kinds of questions directly, accurately, and helpfully across all topics and categories—including general knowledge, coding, mathematics, science, literature, history, creative writing, practical advice, casual conversation, logic, and trivia.
2. NO TOPIC RESTRICTIONS: Never refuse a question or claim that a topic is outside your domain. You are a full-capability general-purpose AI assistant. Your profile name and focus provide nuance, but you can and must answer any question the user asks.
3. DIRECT & RELEVANT: Answer the user's actual question directly without fluff, evasion, or altering the topic.
4. NO FILLER TEMPLATES: NEVER use generic templates or filler phrases such as "Regarding...", "Here is the direct breakdown...", "Core Concept...", "Practical Perspective...", "Next Steps...", or "Would you like me to...".
5. CODE & EXPLANATIONS: For code requests, provide clean, runnable code with Markdown syntax highlighting, followed by a concise explanation.
6. STEP-BY-STEP PROBLEM SOLVING: For math, physics, or algorithmic problems, show clear step-by-step reasoning.
7. CASUAL & SHORT QUERIES: For greetings, jokes, or quick definitions, respond naturally and concisely.
8. CONVERSATION CONTEXT: Maintain conversation history and correctly resolve references like "why?", "explain that", "make it faster", or "convert this to Python".
9. FORMATTING: Use clean GitHub-flavored Markdown (bold text, bullet points, language-tagged code blocks).`;
}

/**
 * Normalizes message history into OpenAI standard [{ role, content }]
 */
function normalizeMessages(botId, message, history = []) {
  const systemPrompt = getSystemPrompt(botId);
  const messages = [{ role: 'system', content: systemPrompt }];

  if (Array.isArray(history)) {
    history.forEach((h) => {
      if (h && (h.text || h.content)) {
        const text = (h.text || h.content).trim();
        if (text) {
          messages.push({
            role: h.isUser ? 'user' : 'assistant',
            content: text
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
 * Check AI Provider Configuration from Environment Variables
 */
function checkAIProviderConfig() {
  const preferred = (process.env.AI_PROVIDER || '').trim().toLowerCase();
  const geminiKey = (process.env.GEMINI_API_KEY || (preferred === 'gemini' ? process.env.AI_API_KEY : '') || '').trim();
  const groqKey = (process.env.GROQ_API_KEY || (preferred === 'groq' ? process.env.AI_API_KEY : '') || '').trim();
  const openaiKey = (process.env.OPENAI_API_KEY || (preferred === 'openai' ? process.env.AI_API_KEY : '') || '').trim();
  const openrouterKey = (process.env.OPENROUTER_API_KEY || (preferred === 'openrouter' ? process.env.AI_API_KEY : '') || '').trim();

  // If user specified a preferred provider and its key exists
  if (preferred === 'gemini' && geminiKey) return { provider: 'Gemini', ready: true, key: geminiKey, model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite' };
  if (preferred === 'groq' && groqKey) return { provider: 'Groq', ready: true, key: groqKey, model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile' };
  if (preferred === 'openai' && openaiKey) return { provider: 'OpenAI', ready: true, key: openaiKey, model: process.env.OPENAI_MODEL || 'gpt-4o-mini' };
  if (preferred === 'openrouter' && openrouterKey) return { provider: 'OpenRouter', ready: true, key: openrouterKey, model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct' };

  // Fallback auto-detection: whichever key is configured
  if (geminiKey) return { provider: 'Gemini', ready: true, key: geminiKey, model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite' };
  if (groqKey) return { provider: 'Groq', ready: true, key: groqKey, model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile' };
  if (openaiKey) return { provider: 'OpenAI', ready: true, key: openaiKey, model: process.env.OPENAI_MODEL || 'gpt-4o-mini' };
  if (openrouterKey) return { provider: 'OpenRouter', ready: true, key: openrouterKey, model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct' };

  return { provider: 'None', ready: false, key: null, model: null };
}

/**
 * Call Google Gemini Provider
 */
async function callGemini(apiKey, model, botId, message, history) {
  const systemPrompt = getSystemPrompt(botId);
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `[System Instruction: ${systemPrompt}]` }]
    },
    {
      role: 'model',
      parts: [{ text: 'Understood. I am a versatile general-purpose AI assistant ready to answer all and any kinds of questions directly, accurately, and naturally without artificial restrictions or filler templates.' }]
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
    { timeout: 30000 }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response received from Gemini.');
  return text;
}

/**
 * Call OpenAI-compatible provider (Groq, OpenAI, OpenRouter)
 */
async function callOpenAICompatible(endpoint, apiKey, model, botId, message, history, headers = {}) {
  const messages = normalizeMessages(botId, message, history);

  const response = await axios.post(
    endpoint,
    {
      model,
      messages,
      temperature: 0.7,
      max_tokens: 2048
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 30000
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response received from LLM.');
  return text;
}

/**
 * One Common Real AI Dispatcher (Standard JSON)
 */
async function generateRealAIResponse({ botId = 'bytebot_ai', message = '', history = [] }) {
  const config = checkAIProviderConfig();

  // Useful Developer Logs (Section 2)
  console.log('\n========================================');
  console.log(`[Nipix AI Service] AI request received`);
  console.log(`[Nipix AI Service] Selected bot: ${BOT_PROFILES[botId]?.name || botId} (${botId})`);
  console.log(`[Nipix AI Service] Message: "${message}"`);
  console.log(`[Nipix AI Service] Provider: ${config.provider}`);
  console.log(`[Nipix AI Service] Model: ${config.model || 'N/A'}`);

  if (!config.ready) {
    console.error('[Nipix AI Service] ERROR: No AI API key is configured in nipix-backend/.env.');
    console.error('[Nipix AI Service] Expected one of: GEMINI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY.');
    console.log('========================================\n');
    const err = new Error('NO_AI_KEY_CONFIGURED');
    err.code = 'CONFIG_MISSING';
    throw err;
  }

  console.log(`[Nipix AI Service] Request sent to ${config.provider}...`);

  try {
    let reply = '';
    if (config.provider === 'Gemini') {
      reply = await callGemini(config.key, config.model, botId, message, history);
    } else if (config.provider === 'Groq') {
      reply = await callOpenAICompatible(
        'https://api.groq.com/openai/v1/chat/completions',
        config.key,
        config.model,
        botId,
        message,
        history
      );
    } else if (config.provider === 'OpenAI') {
      reply = await callOpenAICompatible(
        'https://api.openai.com/v1/chat/completions',
        config.key,
        config.model,
        botId,
        message,
        history
      );
    } else if (config.provider === 'OpenRouter') {
      reply = await callOpenAICompatible(
        'https://openrouter.ai/api/v1/chat/completions',
        config.key,
        config.model,
        botId,
        message,
        history,
        { 'HTTP-Referer': 'https://nipix.app', 'X-Title': 'Nipix AI Scholar' }
      );
    }

    console.log(`[Nipix AI Service] Response status: 200 OK`);
    console.log(`[Nipix AI Service] Response received successfully (${reply.length} chars)`);
    console.log('========================================\n');

    return {
      success: true,
      botId,
      reply: reply.trim(),
      provider: config.provider
    };
  } catch (err) {
    console.error(`[Nipix AI Service Exception] Provider ${config.provider} failed:`);
    console.error(`[Nipix AI Service Exception] Status: ${err.response?.status || 'N/A'}`);
    console.error(`[Nipix AI Service Exception] Message: ${err.message}`);
    if (err.response?.data) {
      console.error(`[Nipix AI Service Exception] Details:`, JSON.stringify(err.response.data, null, 2));
    }
    console.log('========================================\n');
    throw err;
  }
}

/**
 * Stream Gemini SSE
 */
async function streamGemini(apiKey, model, botId, message, history, onChunk) {
  const systemPrompt = getSystemPrompt(botId);
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const contents = [
    {
      role: 'user',
      parts: [{ text: `[System Instruction: ${systemPrompt}]` }]
    },
    {
      role: 'model',
      parts: [{ text: 'Understood. I am a versatile general-purpose AI assistant ready to answer all and any kinds of questions directly, accurately, and naturally without artificial restrictions or filler templates.' }]
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
    throw new Error(`Gemini stream error (${response.status}): ${errText}`);
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
            // Ignore partial chunk parse error
          }
        }
      }
    }
  }
}

/**
 * Stream OpenAI-Compatible SSE
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
    throw new Error(`Stream error (${response.status}): ${errText}`);
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
  const config = checkAIProviderConfig();

  console.log('\n========================================');
  console.log(`[Nipix AI Stream] AI request received`);
  console.log(`[Nipix AI Stream] Selected bot: ${BOT_PROFILES[botId]?.name || botId} (${botId})`);
  console.log(`[Nipix AI Stream] Message: "${message}"`);
  console.log(`[Nipix AI Stream] Provider: ${config.provider}`);
  console.log(`[Nipix AI Stream] Model: ${config.model || 'N/A'}`);

  if (!config.ready) {
    console.error('[Nipix AI Stream] ERROR: No AI API key is configured in nipix-backend/.env.');
    console.log('========================================\n');
    const err = new Error('NO_AI_KEY_CONFIGURED');
    err.code = 'CONFIG_MISSING';
    throw err;
  }

  console.log(`[Nipix AI Stream] Streaming request sent to ${config.provider}...`);

  try {
    if (config.provider === 'Gemini') {
      await streamGemini(config.key, config.model, botId, message, history, onChunk);
    } else if (config.provider === 'Groq') {
      await streamOpenAICompatible(
        'https://api.groq.com/openai/v1/chat/completions',
        config.key,
        config.model,
        botId,
        message,
        history,
        onChunk
      );
    } else if (config.provider === 'OpenAI') {
      await streamOpenAICompatible(
        'https://api.openai.com/v1/chat/completions',
        config.key,
        config.model,
        botId,
        message,
        history,
        onChunk
      );
    } else if (config.provider === 'OpenRouter') {
      await streamOpenAICompatible(
        'https://openrouter.ai/api/v1/chat/completions',
        config.key,
        config.model,
        botId,
        message,
        history,
        onChunk,
        { 'HTTP-Referer': 'https://nipix.app', 'X-Title': 'Nipix AI Scholar' }
      );
    }

    console.log(`[Nipix AI Stream] Stream completed successfully`);
    console.log('========================================\n');

    return {
      provider: config.provider
    };
  } catch (err) {
    console.error(`[Nipix AI Stream Exception] Provider ${config.provider} failed:`);
    console.error(`[Nipix AI Stream Exception] Status: ${err.status || err.response?.status || 'N/A'}`);
    console.error(`[Nipix AI Stream Exception] Message: ${err.message}`);
    console.log('========================================\n');
    throw err;
  }
}

module.exports = {
  BOT_PROFILES,
  getSystemPrompt,
  checkAIProviderConfig,
  generateRealAIResponse,
  streamRealAIResponse
};
