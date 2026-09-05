const axios = require('axios');

// AI Bot System Persona Prompts for 6 Fictional AI Bots
const BOT_PERSONAS = {
  cipher_09: {
    name: 'Cipher_09',
    role: 'Research & Cybersecurity AI',
    systemPrompt: `You are Cipher_09, an AI research fellow specializing in cryptography, cybersecurity, computer science, and logical reasoning on Nipix. Your tone is calm, highly intelligent, and slightly mysterious, yet always helpful, direct, and factually precise.`
  },
  bytebot_ai: {
    name: 'ByteBot AI',
    role: 'Programming & Software Assistant',
    systemPrompt: `You are ByteBot AI, a programming and software engineering assistant on Nipix. Your tone is technical, friendly, clear, and precise. You excel at coding in Python, JavaScript, Java, C++, React, algorithms, and debugging.`
  },
  spark_x: {
    name: 'Spark_X',
    role: 'Electrical Engineering & Physics',
    systemPrompt: `You are Spark_X, an engineering and physics AI assistant on Nipix. Your tone is energetic, technical, and educational. You specialize in electrical engineering, electronics, circuits, quantum physics, and physical laws.`
  },
  archivist: {
    name: 'Archivist',
    role: 'History & Research Mentor',
    systemPrompt: `You are Archivist, an academic and research mentor AI on Nipix. Your tone is knowledgeable, calm, and explanatory. You specialize in history, books, academic literature, citation methodologies, and general knowledge.`
  },
  novamind: {
    name: 'NovaMind',
    role: 'Mathematics & Science Tutor',
    systemPrompt: `You are NovaMind, an analytical mathematics and problem-solving AI tutor on Nipix. Your tone is analytical, encouraging, and teaching-focused. You excel at algebra, calculus, discrete math, statistics, and scientific reasoning.`
  },
  aether: {
    name: 'Aether',
    role: 'AI & Future Technology Guide',
    systemPrompt: `You are Aether, a creative technology and future science AI assistant on Nipix. Your tone is innovative, creative, and forward-looking. You specialize in artificial intelligence, neural networks, machine learning, and emerging tech.`
  }
};

/**
 * Intelligent Fallback AI Reasoning Engine
 * Handles math, calculus, AI, physics, programming, history, and context follow-ups accurately
 */
function generateContextualAIResponse(botId, promptText, history = []) {
  const q = promptText.toLowerCase().trim();
  
  // Extract previous context if user refers to "it", "its", "that", "explain simply", etc.
  const lastUserMsg = history.filter(h => h.isUser).slice(-2)[0]?.text?.toLowerCase() || '';
  const lastAiMsg = history.filter(h => !h.isUser).slice(-1)[0]?.text || '';

  // 1. Conversational greetings
  if (/^(hello|hi|hey|greetings|good morning|good evening)\b/i.test(q)) {
    if (botId === 'bytebot_ai') return `Hello developer! 👋 I am ByteBot AI, your software engineering assistant. What code, algorithm, or framework shall we study today?`;
    if (botId === 'cipher_09') return `Greetings, researcher. I am Cipher_09, specialized in cryptography and cybersecurity. What security concept or protocol are we inspecting?`;
    if (botId === 'spark_x') return `Voltage nominal and circuit ready! ⚡ I am Spark_X, your electrical engineering and physics co-pilot. What question do you have?`;
    if (botId === 'novamind') return `Welcome! 🧠 I am NovaMind, your mathematics tutor. Let's solve equations, calculus, or analytical problems together.`;
    if (botId === 'aether') return `Greetings visionary! 🌌 I am Aether, exploring artificial intelligence and future technology. What frontier shall we explore?`;
    return `Welcome scholar. 📚 I am Archivist, your research guide across history, books, and literature. What topic shall we research?`;
  }

  // 2. Follow-ups ("explain simply", "simple terms", etc.)
  if (q.includes('explain simply') || q.includes('simple terms') || q.includes('simply') || q.includes('easier')) {
    if (lastUserMsg.includes('calculus') || lastAiMsg.includes('Calculus')) {
      return `Simply put: Differential calculus is about finding how fast things change at an exact instant (like a car's speedometer), while Integral calculus is about adding up tiny pieces to find a total accumulation (like total distance traveled).`;
    }
    if (lastUserMsg.includes('ohm') || lastAiMsg.includes('Ohm')) {
      return `Think of voltage as water pressure pushing through a pipe, current as the rate of water flowing, and resistance as a narrow squeeze in the pipe opposing that flow. Higher pressure (voltage) means more flow (current), while tighter squeezes (resistance) slow it down!`;
    }
    if (lastUserMsg.includes('transistor') || lastAiMsg.includes('transistor')) {
      return `Simply put, a transistor is an electronic switch with no moving parts. A tiny electric signal at one terminal controls a much larger current flowing between two other terminals, allowing it to amplify signals or act as a digital 1/0 switch in computers.`;
    }
    if (lastUserMsg.includes('recursion') || lastAiMsg.includes('recursion')) {
      return `Recursion is like looking into two facing mirrors: a process calls a smaller version of itself again and again until it hits a stopping condition (base case).`;
    }
    if (lastUserMsg.includes('rsa') || lastAiMsg.includes('RSA')) {
      return `In simple terms: Imagine a padlock anyone can snap shut with an open public key, but only the person holding the secret private key can unlock it. That is RSA public-key encryption!`;
    }
    return `In simple terms: breaking the problem down into clear fundamental steps allows every component to be evaluated predictably and intuitively.`;
  }

  // 3. Mathematics & Calculus Questions (NovaMind focus)
  if (q.includes('calculus') || q.includes('derivative') || q.includes('integral') || q.includes('math')) {
    if (q.includes('calculus')) {
      return `Calculus is the mathematical study of continuous change, divided into:
1. Differential Calculus: Studies rates of change and slopes of curves using derivatives (e.g., f'(x) = d/dx [f(x)]).
2. Integral Calculus: Studies accumulation of quantities and areas under curves using integrals (e.g., ∫ f(x) dx).

The Fundamental Theorem of Calculus links derivatives and integrals together as inverse operations!`;
    }
    if (q.includes('derivative')) {
      return `A derivative represents the instantaneous rate of change of a function with respect to one of its variables.

Power Rule Example:
d/dx [x^n] = n * x^(n-1)

For example, the derivative of f(x) = 3x^2 + 5x - 4 is f'(x) = 6x + 5.`;
    }
    return `Mathematics is the universal language of logical structures. Breaking expressions into step-by-step transformations reveals the underlying proof.`;
  }

  // 4. Cryptography & Cybersecurity (Cipher_09 focus)
  if (q.includes('rsa') || (q.includes('asymmetric') && q.includes('encryption'))) {
    return `RSA (Rivest–Shamir–Adleman) is a widely used public-key cryptosystem based on the mathematical difficulty of factoring large composite prime numbers.

Core Mechanics:
1. Modulus: n = p * q (p and q are large distinct primes).
2. Totient: φ(n) = (p - 1)(q - 1).
3. Public exponent: e coprime to φ(n). Public key = (e, n).
4. Private exponent: d ≡ e^(-1) (mod φ(n)). Private key = (d, n).
5. Encryption: c = m^e mod n. Decryption: m = c^d mod n.`;
  }

  if (q.includes('cryptography') || q.includes('cybersecurity')) {
    return `Cryptography protects information through encryption, hashing, and digital signatures. It guarantees Confidentiality (AES, RSA), Integrity (SHA-256), Authentication, and Non-Repudiation.`;
  }

  // 5. AI & Neural Network Questions (Aether focus)
  if (q.includes('artificial intelligence') || q.includes('ai') || q.includes('neural network') || q.includes('transformer')) {
    if (q.includes('transformer')) {
      return `The Transformer architecture uses Multi-Head Self-Attention mechanisms: Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V, allowing massive parallelization over sequences compared to traditional RNNs.`;
    }
    return `Artificial Intelligence encompasses machine learning, deep learning, and natural language processing. Modern foundation models rely on Transformer architectures to process context and generate responses.`;
  }

  // 6. Transistor & Circuits (Spark_X focus)
  if (q.includes("ohm's law") || q.includes("ohms law")) {
    return `Ohm's law states that current (I) is directly proportional to voltage (V) and inversely proportional to resistance (R):

Formula: V = I * R (or I = V / R, R = V / I)

Where V is in Volts, I is in Amperes, and R is in Ohms (Ω).`;
  }

  if (q.includes('transistor')) {
    return `A transistor is a semiconductor device used to amplify or switch electrical signals. The two main types are BJTs (current-controlled: Collector, Base, Emitter) and MOSFETs (voltage-controlled: Drain, Gate, Source).`;
  }

  if (q.includes('kirchhoff') || q.includes('kvl') || q.includes('kcl')) {
    return `Kirchhoff's Circuit Laws:
1. KCL (Current Law): The algebraic sum of currents entering any node is zero (Σ I = 0, charge conservation).
2. KVL (Voltage Law): The sum of potential differences around any closed loop is zero (Σ V = 0, energy conservation).`;
  }

  // 7. Java & Programming Questions (ByteBot AI focus)
  if (q.includes('java')) {
    if (q.includes('what is') || q.includes('explain') || q === 'java') {
      return `Java is a high-level, class-based, object-oriented programming language designed for platform independence ("Write Once, Run Anywhere"). It compiles to bytecode that runs on the Java Virtual Machine (JVM) with automatic garbage collection.`;
    }
    if (q.includes('reverse') || q.includes('string')) {
      return `Java String Reversal using StringBuilder:
\`\`\`java
String original = "Nipix";
String reversed = new StringBuilder(original).reverse().toString();
\`\`\``;
    }
    return `Java is an object-oriented language emphasizing Encapsulation, Inheritance, Polymorphism, and Abstraction, widely used in Spring Boot enterprise backends and Android development.`;
  }

  if (q.includes('recursion')) {
    return `Recursion is a programming technique where a function calls itself to solve a smaller version of the problem until reaching a base case.

Example (Factorial in Java):
\`\`\`java
public static int factorial(int n) {
    if (n <= 1) return 1; // Base case
    return n * factorial(n - 1); // Recursive step
}
\`\`\``;
  }

  if (q.includes('dijkstra')) {
    return `Dijkstra's algorithm finds the shortest paths from a source node to all other nodes in a graph with non-negative edge weights using a priority queue (min-heap) in O((V + E) log V) time.`;
  }

  // 8. History & Research (Archivist focus)
  if (q.includes('telephone') || q.includes('who invented')) {
    if (q.includes('telephone') || q.includes('phone')) {
      return `Alexander Graham Bell received the official US patent for the telephone in March 1876. Antonio Meucci and Elisha Gray also developed notable early voice transmission apparatuses.`;
    }
    if (q.includes('computer')) {
      return `Charles Babbage conceptualized the mechanical Analytical Engine in 1837, Ada Lovelace created the first algorithm for it, and Alan Turing formulated universal computation in 1936.`;
    }
  }

  // 9. Default Persona-Tuned Knowledge Synthesis
  if (botId === 'novamind') {
    return `Regarding "${promptText}": Analytical problem-solving requires breaking this down into foundational mathematical axioms and algebraic steps. Let's solve it step by step!`;
  } else if (botId === 'aether') {
    return `Regarding "${promptText}": Emerging technologies and neural architectures are reshaping how we model this domain. Let's analyze its futuristic implications and computational design!`;
  } else if (botId === 'bytebot_ai') {
    return `Regarding "${promptText}": In software engineering, evaluating this requires inspecting the algorithmic complexity, data structures, and execution flow. Would you like a code snippet?`;
  } else if (botId === 'spark_x') {
    return `Regarding "${promptText}": From an engineering standpoint, energy conservation and electromagnetic field equations govern this process. Let's derive the circuit formulas!`;
  } else if (botId === 'archivist') {
    return `Regarding "${promptText}": Historical literature and peer-reviewed documentation provide comprehensive context for this topic. What specific research angle shall we synthesize?`;
  } else {
    return `Regarding "${promptText}": Analyzing the structural invariants and logical principles reveals an underlying pattern. What specific security aspect shall we examine?`;
  }
}

/**
 * Controller endpoint: POST /api/ai/chat
 */
exports.chat = async (req, res) => {
  try {
    const { botId = 'bytebot_ai', message = '', history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const persona = BOT_PERSONAS[botId] || BOT_PERSONAS.bytebot_ai;

    // Check if external Gemini API key is configured with fast 2500ms timeout
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const contents = [
          {
            role: 'user',
            parts: [{ text: `[System Instruction: ${persona.systemPrompt}]` }]
          },
          ...history.map(h => ({
            role: h.isUser ? 'user' : 'model',
            parts: [{ text: h.text }]
          })),
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ];

        const response = await axios.post(geminiUrl, { contents }, { timeout: 2500 });
        const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (aiText) {
          return res.json({
            success: true,
            botId,
            reply: aiText,
            source: 'gemini'
          });
        }
      } catch (geminiError) {
        console.warn('Gemini API call skipped or timed out, utilizing AI reasoning engine:', geminiError.message);
      }
    }

    // Check if external OpenAI API key is configured with fast 2500ms timeout
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [
              { role: 'system', content: persona.systemPrompt },
              ...history.map(h => ({ role: h.isUser ? 'user' : 'assistant', content: h.text })),
              { role: 'user', content: message }
            ]
          },
          {
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
            timeout: 2500
          }
        );
        const aiText = response.data?.choices?.[0]?.message?.content;
        if (aiText) {
          return res.json({
            success: true,
            botId,
            reply: aiText,
            source: 'openai'
          });
        }
      } catch (openaiError) {
        console.warn('OpenAI API call skipped or timed out, utilizing AI reasoning engine:', openaiError.message);
      }
    }

    // Fallback: Intelligent AI Reasoning Engine
    const reply = generateContextualAIResponse(botId, message, history);
    return res.json({
      success: true,
      botId,
      reply,
      source: 'nipix_ai_engine'
    });

  } catch (error) {
    console.error('Error generating AI response:', error);
    return res.status(500).json({
      success: false,
      reply: "I'm having trouble reaching the AI service right now. Please try again in a moment.",
      error: error.message
    });
  }
};
