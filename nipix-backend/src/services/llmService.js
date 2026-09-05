const axios = require('axios');

/**
 * 6 Bot Personas inside Nipix AI Scholar
 * Personality & specialization hints — NEVER hard restrictions.
 */
const BOT_PROFILES = {
  bytebot_ai: {
    name: 'ByteBot AI',
    role: 'Programming & Software Engineering',
    expertise: 'Programming & Software Engineering (Java, Python, JavaScript, C/C++, React, Spring Boot, Data Structures, Algorithms, Software Engineering, Debugging, Programming projects, Code generation, and Code explanation)'
  },
  cipher_09: {
    name: 'Cipher_09',
    role: 'Research, Cryptography & Cybersecurity',
    expertise: 'Research, Cryptography & Cybersecurity (Cryptography, Cybersecurity, Networks, Security concepts, Logical reasoning, Research questions, Programming/security concepts)'
  },
  spark_x: {
    name: 'Spark_X',
    role: 'Electrical Engineering, Physics & Circuit Theory',
    expertise: 'Electrical Engineering, Physics & Circuit Theory (Electrical engineering, Electronics, Circuit theory, Ohm\'s law, Physics, Signals, VLSI, Digital & Analog electronics, Engineering calculations)'
  },
  archivist: {
    name: 'Archivist',
    role: 'Study, Knowledge & Research',
    expertise: 'Study, Knowledge & Research (Study materials, Research, History, General knowledge, Academic topics, Summaries, Explanations, Notes)'
  },
  novamind: {
    name: 'NovaMind',
    role: 'General AI / Learning Assistant',
    expertise: 'General AI & Learning Assistant (General educational and knowledge questions, learning guidance, problem solving, mathematics and analytical reasoning)'
  },
  aether: {
    name: 'Aether',
    role: 'Science / Innovation / Technology',
    expertise: 'Science, Innovation & Technology (Science, Technology, Innovation, Engineering, Quantum computing, Emerging technologies, Scientific concepts)'
  }
};

/**
 * Generates clean, ChatGPT-style system prompt for each bot.
 * Answers any and all questions directly, naturally, contextually, without artificial filler.
 */
function getSystemPrompt(botId) {
  const profile = BOT_PROFILES[botId] || BOT_PROFILES.bytebot_ai;

  return `You are ${profile.name}, an exceptionally capable, intelligent, and versatile AI assistant similar to ChatGPT, with a specialized domain in ${profile.expertise}.

CORE INSTRUCTIONS & BEHAVIOR:
1. ANSWER ALL AND ANY QUESTIONS: You must directly, accurately, and helpfully answer ANY question the user asks across ANY subject or category (e.g., programming, mathematics, science, physics, literature, history, creative writing, practical life advice, casual conversation, logic, trivia, etc.).
2. NO TOPIC RESTRICTIONS OR REFUSALS: Never refuse a request by claiming it is outside your domain or expertise. You have full general-purpose AI capabilities. Your persona and specialization guide your nuance and style, but you must answer every question helpfully.
3. DIRECT, CONCISE & NATURAL:
   - Understand the user's true intent and answer the exact question directly.
   - Do NOT blindly repeat or mirror the user's question back to them.
   - Do NOT use generic template filler such as "Regarding...", "Here is the direct breakdown...", "Core Concept...", "Practical Perspective...", "Next Steps...", or "Would you like me to..." unless the user specifically asks for that structure.
   - For simple or casual queries (greetings, definitions, jokes), respond naturally and concisely.
4. CODE & TECHNICAL QUESTIONS:
   - Provide clean, runnable code first with proper markdown syntax highlighting (e.g. \`\`\`java, \`\`\`python, \`\`\`javascript), followed by a clear, concise explanation.
   - For creative coding requests (e.g. emojis, patterns, secret messages like "∞ I ❤️ YOU 💖"), generate the exact code and output requested.
5. MATH, SCIENCE & CALCULATION:
   - For engineering, math, or physics problems (e.g. Ohm's Law, equations, circuit analysis), provide clear step-by-step reasoning, formulas, and the final answer.
6. CONVERSATION CONTEXT:
   - Maintain multi-turn memory. Seamlessly resolve pronouns and follow-up prompts such as "why?", "explain that", "make it simpler", "convert this to Python", or "give an example".
7. FORMATTING:
   - Format responses using clean GitHub-flavored Markdown (bold text, bullet points, language-tagged code blocks).`;
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
        // Skip connection errors or placeholder text from history
        if (text && !text.includes("having trouble connecting") && !text.includes("couldn't get a response")) {
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
 * Normalizes message history into Gemini standard [{ role, parts: [{ text }] }]
 */
function normalizeGeminiContents(botId, message, history = []) {
  const systemPrompt = getSystemPrompt(botId);
  const contents = [
    {
      role: 'user',
      parts: [{ text: `[System Instruction: ${systemPrompt}]` }]
    },
    {
      role: 'model',
      parts: [{ text: 'Understood. I am a versatile, general-purpose AI assistant ready to answer all and any kinds of questions directly, accurately, and naturally without artificial restrictions or filler templates.' }]
    }
  ];

  if (Array.isArray(history)) {
    history.forEach((h) => {
      if (h && (h.text || h.content)) {
        const text = (h.text || h.content).trim();
        // Skip connection errors or placeholder text from history
        if (text && !text.includes("having trouble connecting") && !text.includes("couldn't get a response")) {
          contents.push({
            role: h.isUser ? 'user' : 'model',
            parts: [{ text }]
          });
        }
      }
    });
  }

  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  return contents;
}

/**
 * Retrieve all configured AI providers ordered by user preference, with fallbacks.
 */
function getConfiguredProviders() {
  const preferred = (process.env.AI_PROVIDER || '').trim().toLowerCase();
  const geminiKey = (process.env.GEMINI_API_KEY || (preferred === 'gemini' ? process.env.AI_API_KEY : '') || '').trim();
  const groqKey = (process.env.GROQ_API_KEY || (preferred === 'groq' ? process.env.AI_API_KEY : '') || '').trim();
  const openaiKey = (process.env.OPENAI_API_KEY || (preferred === 'openai' ? process.env.AI_API_KEY : '') || '').trim();
  const openrouterKey = (process.env.OPENROUTER_API_KEY || (preferred === 'openrouter' ? process.env.AI_API_KEY : '') || '').trim();

  const providerDefs = {
    gemini: { provider: 'Gemini', key: geminiKey, model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite' },
    groq: { provider: 'Groq', key: groqKey, model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile' },
    openai: { provider: 'OpenAI', key: openaiKey, model: process.env.OPENAI_MODEL || 'gpt-4o-mini' },
    openrouter: { provider: 'OpenRouter', key: openrouterKey, model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct' }
  };

  const list = [];

  // 1. Add preferred provider first if configured
  if (preferred && providerDefs[preferred] && providerDefs[preferred].key) {
    list.push(providerDefs[preferred]);
  }

  // 2. Add remaining providers with valid keys as fallbacks
  Object.keys(providerDefs).forEach((k) => {
    const item = providerDefs[k];
    if (item.key && !list.some((p) => p.provider === item.provider)) {
      list.push(item);
    }
  });

  return list;
}

/**
 * Check primary AI Provider Configuration status
 */
function checkAIProviderConfig() {
  const providers = getConfiguredProviders();
  if (providers.length > 0) {
    return {
      provider: providers[0].provider,
      ready: true,
      key: providers[0].key,
      model: providers[0].model
    };
  }
  return { provider: 'None', ready: false, key: null, model: null };
}

/**
 * Call Google Gemini Provider
 */
async function callGemini(apiKey, model, botId, message, history) {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const contents = normalizeGeminiContents(botId, message, history);

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
      timeout: 25000
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response received from LLM.');
  return text;
}

/**
 * Dispatcher to execute a call for a given provider configuration
 */
async function executeProviderCall(providerConfig, botId, message, history) {
  const { provider, key, model } = providerConfig;
  if (provider === 'Gemini') {
    return await callGemini(key, model, botId, message, history);
  }
  if (provider === 'Groq') {
    return await callOpenAICompatible(
      'https://api.groq.com/openai/v1/chat/completions',
      key,
      model,
      botId,
      message,
      history
    );
  }
  if (provider === 'OpenAI') {
    return await callOpenAICompatible(
      'https://api.openai.com/v1/chat/completions',
      key,
      model,
      botId,
      message,
      history
    );
  }
  if (provider === 'OpenRouter') {
    return await callOpenAICompatible(
      'https://openrouter.ai/api/v1/chat/completions',
      key,
      model,
      botId,
      message,
      history,
      { 'HTTP-Referer': 'https://nipix.app', 'X-Title': 'Nipix AI Scholar' }
    );
  }
  throw new Error(`Unsupported provider: ${provider}`);
}

/**
 * Real AI Dispatcher with Single Retry and Multi-Provider Fallback
 */
async function generateRealAIResponse({ botId = 'bytebot_ai', message = '', history = [] }) {
  const providers = getConfiguredProviders();

  console.log('\n========================================');
  console.log(`[Nipix AI Service] AI request received`);
  console.log(`[Nipix AI Service] Selected bot: ${BOT_PROFILES[botId]?.name || botId} (${botId})`);
  console.log(`[Nipix AI Service] Message: "${message}"`);
  console.log(`[Nipix AI Service] Configured providers: ${providers.map((p) => p.provider).join(', ') || 'None'}`);

  if (providers.length === 0) {
    console.error('[Nipix AI Service] ERROR: No AI API key is configured in nipix-backend/.env.');
    console.log('========================================\n');
    const err = new Error('NO_AI_KEY_CONFIGURED');
    err.code = 'CONFIG_MISSING';
    throw err;
  }

  let lastError = null;

  // Try each provider in preference order
  for (const prov of providers) {
    console.log(`[Nipix AI Service] Attempting call with ${prov.provider} (${prov.model})...`);

    // Attempt up to 2 times (1 retry for transient glitches)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const reply = await executeProviderCall(prov, botId, message, history);
        console.log(`[Nipix AI Service] SUCCESS with ${prov.provider} on attempt ${attempt} (${reply.length} chars)`);
        console.log('========================================\n');
        return {
          success: true,
          botId,
          reply: reply.trim(),
          provider: prov.provider
        };
      } catch (err) {
        lastError = err;
        console.warn(`[Nipix AI Service] Provider ${prov.provider} attempt ${attempt} failed: ${err.message}`);
        if (attempt === 1) {
          // Wait 600ms before transient retry
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
      }
    }
    console.warn(`[Nipix AI Service] Provider ${prov.provider} exhausted. Trying fallback if available...`);
  }

  console.error('[Nipix AI Service] All available providers failed.');
  console.log('========================================\n');
  throw lastError;
}

/**
 * Stream Gemini SSE
 */
async function streamGemini(apiKey, model, botId, message, history, onChunk) {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
  const contents = normalizeGeminiContents(botId, message, history);

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
 * Stream Real AI Response Dispatcher with Fallbacks
 */
async function streamRealAIResponse({ botId = 'bytebot_ai', message = '', history = [], onChunk }) {
  const providers = getConfiguredProviders();

  console.log('\n========================================');
  console.log(`[Nipix AI Stream] Stream request received for bot: ${BOT_PROFILES[botId]?.name || botId}`);
  console.log(`[Nipix AI Stream] Message: "${message}"`);
  console.log(`[Nipix AI Stream] Configured providers: ${providers.map((p) => p.provider).join(', ') || 'None'}`);

  if (providers.length === 0) {
    console.error('[Nipix AI Stream] ERROR: No AI API key is configured.');
    console.log('========================================\n');
    const err = new Error('NO_AI_KEY_CONFIGURED');
    err.code = 'CONFIG_MISSING';
    throw err;
  }

  let lastError = null;

  for (const prov of providers) {
    try {
      console.log(`[Nipix AI Stream] Streaming with ${prov.provider}...`);
      if (prov.provider === 'Gemini') {
        await streamGemini(prov.key, prov.model, botId, message, history, onChunk);
      } else if (prov.provider === 'Groq') {
        await streamOpenAICompatible(
          'https://api.groq.com/openai/v1/chat/completions',
          prov.key,
          prov.model,
          botId,
          message,
          history,
          onChunk
        );
      } else if (prov.provider === 'OpenAI') {
        await streamOpenAICompatible(
          'https://api.openai.com/v1/chat/completions',
          prov.key,
          prov.model,
          botId,
          message,
          history,
          onChunk
        );
      } else if (prov.provider === 'OpenRouter') {
        await streamOpenAICompatible(
          'https://openrouter.ai/api/v1/chat/completions',
          prov.key,
          prov.model,
          botId,
          message,
          history,
          onChunk,
          { 'HTTP-Referer': 'https://nipix.app', 'X-Title': 'Nipix AI Scholar' }
        );
      }

      console.log(`[Nipix AI Stream] Stream completed successfully with ${prov.provider}`);
      console.log('========================================\n');
      return { provider: prov.provider };
    } catch (err) {
      lastError = err;
      console.warn(`[Nipix AI Stream] Stream with ${prov.provider} failed: ${err.message}`);
    }
  }

  console.error('[Nipix AI Stream] All streaming providers failed.');
  console.log('========================================\n');
  throw lastError;
}

module.exports = {
  BOT_PROFILES,
  getSystemPrompt,
  getConfiguredProviders,
  checkAIProviderConfig,
  generateRealAIResponse,
  streamRealAIResponse
};
