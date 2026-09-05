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
    expertise: 'Mathematics, Science & Educational explanations (Algebra, Calculus, Problem solving, Science principles, Logical reasoning, Step-by-step guidance)'
  },
  aether: {
    name: 'Aether',
    role: 'Science / Innovation / Technology',
    expertise: 'Innovation, Emerging Tech & AI (Science, Technology, Innovation, Quantum computing, Engineering concepts, Futuristic ideas, Creative problem solving)'
  }
};

/**
 * Generates tailored ChatGPT-style system prompt for each bot.
 * Answers any and all questions directly, naturally, contextually, without artificial filler.
 */
function getSystemPrompt(botId) {
  const baseRules = `CORE ASSISTANT INSTRUCTIONS:
1. DIRECT & ACTIONABLE ANSWERS (UNDERSTAND -> SOLVE -> ANSWER -> EXPLAIN):
   - Answer the user's actual question directly without evasion, fluff, or mechanical filler.
   - NEVER start responses with generic parrot phrases like "Regarding your question...", "Regarding **...**", "Here is the direct breakdown...", "Core Concept...", "Practical Perspective...", "Next Steps...", or "Would you like me to...".
   - Do NOT blindly echo or repeat the user's question back to them.
2. CODE GENERATION:
   - When code is requested, provide clean, working, runnable code FIRST with syntax highlighting (\`\`\`java, \`\`\`python, \`\`\`javascript, \`\`\`react, \`\`\`sql, etc.), followed by a clear, concise explanation.
   - For creative coding requests (e.g. secret messages with emojis, patterns, animations), produce the exact working code outputting the requested emojis and text.
3. MATHEMATICAL & SCIENCE PROBLEMS:
   - Solve step-by-step with clear reasoning, show formulas, and highlight the final answer clearly (e.g. for "solve 2x + 5 = 15", show 2x = 10, x = 5, final answer: x = 5).
4. CONVERSATION CONTEXT & FOLLOW-UPS:
   - Remember previous turns in the chat. Accurately resolve pronouns and follow-up directives like "in java", "give example", "make it simple", "make it shorter", "convert this to Python", or "explain line by line".
5. CROSS-DOMAIN QUESTIONS & RECOMMENDATIONS:
   - You have full, versatile general-purpose intelligence like ChatGPT. NEVER refuse to answer a question because it is outside your primary domain! Answer every question accurately and helpfully first.
   - If another Nipix AI bot is substantially better suited to the subject (e.g. ByteBot asked about physics, or Spark_X asked about literature), answer the question thoroughly first, and then briefly and naturally recommend the peer bot at the very end.
6. CASUAL & CREATIVE QUERIES:
   - For greetings, casual questions ("hello", "how are you"), or quick answers (e.g. "2 + 2"), respond naturally and concisely without unnecessary essays.
   - For creative requests (poems, project ideas, messages), fulfill the request directly with creativity.
7. FORMATTING:
   - Use clean GitHub-flavored Markdown (bold headings, bullet points, language-tagged code blocks).`;

  const botPrompts = {
    bytebot_ai: `You are ByteBot AI, the programming and software engineering assistant inside Nipix.
Your primary expertise includes Java, Python, JavaScript, C, C++, React, Spring Boot, software engineering, algorithms, data structures, debugging, system design, and programming projects.
Answer the user's actual question directly.
If the user asks for code, provide working code and explain it clearly.
If the user asks a conceptual question, explain it with clean examples.
You may answer questions outside your primary expertise when asked. If another Nipix AI bot is substantially better suited (e.g., NovaMind for pure mathematics, Spark_X for physics/circuits, Cipher_09 for cryptography, Archivist for history/literature, or Aether for futuristic tech), answer the question first and then briefly recommend that bot at the end.
Be natural, helpful, precise, and conversational.

${baseRules}`,

    cipher_09: `You are Cipher_09, the research, cryptography, and cybersecurity assistant inside Nipix.
Your primary expertise includes cryptography, cybersecurity, logical reasoning, security concepts, encryption algorithms (AES, RSA, SHA, ECC), secure programming, network security, protocols, and security research.
Answer the user's actual question directly.
If the user asks for code or security analysis, provide clean code/steps and explain them clearly.
You may answer questions outside your primary expertise when asked. If another Nipix AI bot is substantially better suited (e.g., ByteBot AI for general software engineering, Spark_X for circuit hardware, NovaMind for pure math, Archivist for history/literature, or Aether for emerging tech), answer the question first and then briefly recommend that bot at the end.
Be sharp, analytical, precise, and conversational.

${baseRules}`,

    spark_x: `You are Spark_X, the electrical engineering, physics, and circuit theory assistant inside Nipix.
Your primary expertise includes electronics, electrical engineering, physics, circuit theory, Ohm's law, Kirchhoff's laws, transistors, semiconductors, embedded systems, hardware, VLSI, signals, and engineering calculations.
Answer the user's actual question directly.
For physics/circuit problems, show formulas and step-by-step calculations clearly.
You may answer questions outside your primary expertise when asked. If another Nipix AI bot is substantially better suited (e.g., ByteBot AI for software development, NovaMind for pure math/algebra, Archivist for history/literature, or Aether for futuristic concepts), answer the question first and then briefly recommend that bot at the end.
Be energetic, accurate, insightful, and conversational.

${baseRules}`,

    archivist: `You are Archivist, the study, knowledge, and research assistant inside Nipix.
Your primary expertise includes study materials, academic research, history, world events, literature, document synthesis, summaries, notes, and general knowledge.
Answer the user's actual question directly like a great tutor.
Explain concepts clearly using analogies, structured summaries, and historical context where useful.
You may answer questions outside your primary expertise when asked. If another Nipix AI bot is substantially better suited (e.g., ByteBot AI for coding, Spark_X for circuit physics, NovaMind for mathematics, or Aether for emerging AI), answer the question first and then briefly recommend that bot at the end.
Be scholarly, thoughtful, articulate, and conversational.

${baseRules}`,

    novamind: `You are NovaMind, the mathematics, science, and learning assistant inside Nipix.
Your primary expertise includes mathematics (algebra, calculus, geometry, statistics), scientific logic, problem-solving, educational explanations, and conceptual reasoning.
Answer the user's actual question directly.
For math problems, provide clear step-by-step solutions and highlight the final answer.
You may answer questions outside your primary expertise when asked. If another Nipix AI bot is substantially better suited (e.g., ByteBot AI for programming, Spark_X for electrical circuits, Cipher_09 for cryptography, or Archivist for history/literature), answer the question first and then briefly recommend that bot at the end.
Be clear, patient, logical, and conversational.

${baseRules}`,

    aether: `You are Aether, the science, innovation, and technology assistant inside Nipix.
Your primary expertise includes innovation, emerging technologies, artificial intelligence architectures, quantum computing, creative engineering concepts, future tech, and creative technical problem-solving.
Answer the user's actual question directly.
For innovative or creative requests (e.g. project ideas, poems, futuristic architectures), provide inspiring and actionable ideas.
You may answer questions outside your primary expertise when asked. If another Nipix AI bot is substantially better suited (e.g., ByteBot AI for software engineering, Spark_X for electrical hardware, NovaMind for pure math, or Archivist for history), answer the question first and then briefly recommend that bot at the end.
Be visionary, forward-looking, inspiring, and conversational.

${baseRules}`
  };

  return botPrompts[botId] || botPrompts.bytebot_ai;
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
    groq: { provider: 'Groq', key: groqKey, model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b' },
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
 * Non-sensitive AI health check status for deployment verification
 */
function getAIHealth() {
  const providers = getConfiguredProviders();
  const preferred = (process.env.AI_PROVIDER || '').trim().toLowerCase();
  return {
    success: true,
    ready: providers.length > 0,
    preferredProvider: preferred || 'gemini',
    activeProvider: providers[0]?.provider || 'None',
    model: providers[0]?.model || 'None',
    availableProviders: providers.map((p) => p.provider),
    environment: {
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY || (preferred === 'gemini' && process.env.AI_API_KEY)),
      hasGroqKey: Boolean(process.env.GROQ_API_KEY || (preferred === 'groq' && process.env.AI_API_KEY)),
      hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY || (preferred === 'openai' && process.env.AI_API_KEY)),
      hasOpenRouterKey: Boolean(process.env.OPENROUTER_API_KEY || (preferred === 'openrouter' && process.env.AI_API_KEY))
    }
  };
}

/**
 * Call Google Gemini REST API
 */
async function callGemini(apiKey, model, botId, message, history, signal) {
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
    { timeout: 25000, signal }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response received from Gemini.');
  return text;
}

/**
 * Call OpenAI-compatible provider (Groq, OpenAI, OpenRouter)
 */
async function callOpenAICompatible(endpoint, apiKey, model, botId, message, history, headers = {}, signal) {
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
      timeout: 25000,
      signal
    }
  );

  const text = response.data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response received from LLM.');
  return text;
}

/**
 * Dispatcher to execute a call for a given provider configuration
 */
async function executeProviderCall(providerConfig, botId, message, history, signal) {
  const { provider, key, model } = providerConfig;
  if (provider === 'Gemini') {
    return await callGemini(key, model, botId, message, history, signal);
  }
  if (provider === 'Groq') {
    return await callOpenAICompatible(
      'https://api.groq.com/openai/v1/chat/completions',
      key,
      model,
      botId,
      message,
      history,
      {},
      signal
    );
  }
  if (provider === 'OpenAI') {
    return await callOpenAICompatible(
      'https://api.openai.com/v1/chat/completions',
      key,
      model,
      botId,
      message,
      history,
      {},
      signal
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
      { 'HTTP-Referer': 'https://nipix.app', 'X-Title': 'Nipix AI Scholar' },
      signal
    );
  }
  throw new Error(`Unsupported provider: ${provider}`);
}

/**
 * Real AI Dispatcher with Single Retry and Multi-Provider Fallback
 */
async function generateRealAIResponse({ botId = 'bytebot_ai', message = '', history = [], signal }) {
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
    if (signal?.aborted) {
      throw new Error('REQUEST_ABORTED');
    }

    const requestStart = Date.now();
    console.log(`[Nipix AI Service] Attempting call with ${prov.provider} (${prov.model})...`);

    // Attempt up to 2 times (1 retry for transient glitches)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const reply = await executeProviderCall(prov, botId, message, history, signal);
        const totalTime = Date.now() - requestStart;
        console.log(`[Nipix AI Service] SUCCESS with ${prov.provider} on attempt ${attempt} (${reply.length} chars)`);
        console.log('========================================\n');
        console.log(`[AI Performance] Bot: ${botId} | Provider: ${prov.provider} | TTFT: ${totalTime}ms | Total: ${totalTime}ms | Chunks: 1\n`);

        return {
          success: true,
          botId,
          reply: reply.trim(),
          provider: prov.provider
        };
      } catch (err) {
        lastError = err;
        console.warn(`[Nipix AI Service] Provider ${prov.provider} attempt ${attempt} failed: ${err.message}`);
        if (signal?.aborted) throw err;
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
 * Helper to combine external abort signal with a safety timeout
 */
function combineSignals(signal, timeoutMs = 25000) {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  if (signal && typeof AbortSignal.any === 'function') {
    return AbortSignal.any([signal, timeoutSignal]);
  }
  return signal || timeoutSignal;
}

/**
 * Stream Gemini SSE
 */
async function streamGemini(apiKey, model, botId, message, history, onChunk, signal) {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
  const contents = normalizeGeminiContents(botId, message, history);
  const activeSignal = combineSignals(signal, 25000);

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
    }),
    signal: activeSignal
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini stream error (${response.status}): ${errText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    if (signal?.aborted) {
      await reader.cancel();
      break;
    }
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
async function streamOpenAICompatible(url, apiKey, model, botId, message, history, onChunk, extraHeaders = {}, signal) {
  const messages = normalizeMessages(botId, message, history);
  const activeSignal = combineSignals(signal, 25000);

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
    }),
    signal: activeSignal
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Stream error (${response.status}): ${errText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    if (signal?.aborted) {
      await reader.cancel();
      break;
    }
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
 * Stream Real AI Response Dispatcher with Fallbacks & TTFT Metrics
 */
async function streamRealAIResponse({ botId = 'bytebot_ai', message = '', history = [], onChunk, signal }) {
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
    if (signal?.aborted) {
      throw new Error('REQUEST_ABORTED');
    }

    const requestStart = Date.now();
    let firstChunkTime = null;
    let chunkCount = 0;

    const wrappedOnChunk = (chunkText) => {
      if (!firstChunkTime) {
        firstChunkTime = Date.now();
      }
      chunkCount++;
      if (typeof onChunk === 'function') {
        onChunk(chunkText);
      }
    };

    try {
      console.log(`[Nipix AI Stream] Streaming with ${prov.provider}...`);
      if (prov.provider === 'Gemini') {
        await streamGemini(prov.key, prov.model, botId, message, history, wrappedOnChunk, signal);
      } else if (prov.provider === 'Groq') {
        await streamOpenAICompatible(
          'https://api.groq.com/openai/v1/chat/completions',
          prov.key,
          prov.model,
          botId,
          message,
          history,
          wrappedOnChunk,
          {},
          signal
        );
      } else if (prov.provider === 'OpenAI') {
        await streamOpenAICompatible(
          'https://api.openai.com/v1/chat/completions',
          prov.key,
          prov.model,
          botId,
          message,
          history,
          wrappedOnChunk,
          {},
          signal
        );
      } else if (prov.provider === 'OpenRouter') {
        await streamOpenAICompatible(
          'https://openrouter.ai/api/v1/chat/completions',
          prov.key,
          prov.model,
          botId,
          message,
          history,
          wrappedOnChunk,
          { 'HTTP-Referer': 'https://nipix.app', 'X-Title': 'Nipix AI Scholar' },
          signal
        );
      }

      const totalTime = Date.now() - requestStart;
      const ttft = firstChunkTime ? firstChunkTime - requestStart : totalTime;

      console.log(`[Nipix AI Stream] Stream completed successfully with ${prov.provider} (${chunkCount} chunks)`);
      console.log('========================================\n');
      console.log(`[AI Performance] Bot: ${botId} | Provider: ${prov.provider} | TTFT: ${ttft}ms | Total: ${totalTime}ms | Chunks: ${chunkCount}\n`);

      return { provider: prov.provider, chunkCount, ttft, totalTime };
    } catch (err) {
      lastError = err;
      console.warn(`[Nipix AI Stream] Stream with ${prov.provider} failed: ${err.message}`);

      // If chunks have ALREADY been emitted to the client, DO NOT try another provider from scratch
      // (as this would output two combined answers into the stream).
      if (chunkCount > 0 || signal?.aborted) {
        throw err;
      }
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
  getAIHealth,
  generateRealAIResponse,
  streamRealAIResponse
};
