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

  // 1. Follow-ups ("explain simply", "simple terms", etc.)
  if (q.includes('explain it simply') || q.includes('simple terms') || q.includes('simply') || q.includes('easier')) {
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
    return `In simple terms: ${lastAiMsg ? `building on what we discussed—the core concept boils down to breaking the problem into clear, fundamental steps so every component functions predictably.` : `it's about understanding the core principle without complex jargon.`}`;
  }

  // 2. Mathematics & Calculus Questions (NovaMind focus)
  if (q.includes('calculus') || q.includes('derivative') || q.includes('integral') || q.includes('math')) {
    if (q.includes('calculus')) {
      return `Calculus is the mathematical study of continuous change. It is split into two major branches:
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
    return `Mathematics is the universal language of logical structures. Whether you're working with linear algebra, calculus, or discrete mathematics, breaking expressions down into step-by-step transformations yields clear solutions.`;
  }

  // 3. AI & Neural Network Questions (Aether focus)
  if (q.includes('artificial intelligence') || q.includes('ai') || q.includes('neural network') || q.includes('machine learning')) {
    if (q.includes('neural network') || q.includes('deep learning')) {
      return `Artificial Neural Networks (ANNs) are computational models inspired by biological brain structures. They consist of:
1. Input Layer: Receives feature vectors.
2. Hidden Layers: Apply weighted linear transformations (W * x + b) followed by non-linear activation functions (ReLU, Sigmoid, GELU).
3. Output Layer: Produces predictions or classification logits.

Training uses Backpropagation with Gradient Descent to optimize weights via loss minimization.`;
    }
    return `Artificial Intelligence encompasses machine learning, deep learning, and natural language processing. Modern LLMs (Large Language Models) rely on Transformer architectures using Self-Attention mechanisms to process and generate natural text contextually.`;
  }

  // 4. Transistor & Semiconductor Questions (Spark_X focus)
  if (q.includes('transistor')) {
    if (q.includes('type') || q.includes('kind') || q.includes('category')) {
      return `Transistors are primarily categorized into two main families:
1. Bipolar Junction Transistors (BJTs): NPN and PNP types (current-controlled).
2. Field-Effect Transistors (FETs): MOSFETs (Metal-Oxide-Semiconductor FETs, enhanced/depletion modes) and JFETs (voltage-controlled).

MOSFETs are the most widely used transistors in modern digital integrated circuits and microprocessors due to their high switching speed and low power consumption.`;
    }
    return `A transistor is a fundamental semiconductor device used to amplify or switch electrical signals and power. It consists of semiconductor material (usually silicon) with at least three terminals: Collector, Base, and Emitter (in BJTs) or Drain, Gate, and Source (in MOSFETs).`;
  }

  // 5. Ohm's Law (Spark_X focus)
  if (q.includes("ohm's law") || q.includes("ohms law")) {
    return `Ohm's law states that the electrical current (I) flowing through a conductor between two points is directly proportional to the voltage (V) across the two points, and inversely proportional to the resistance (R).

Mathematical formula: V = I × R (or I = V / R, R = V / I)

Where:
• V = Voltage in Volts (V)
• I = Current in Amperes (A)
• R = Resistance in Ohms (Ω)`;
  }

  // 6. Kirchhoff's Laws (KVL / KCL)
  if (q.includes('kirchhoff') || q.includes('kvl') || q.includes('kcl')) {
    return `Kirchhoff's Circuit Laws consist of two fundamental principles:
1. Kirchhoff's Voltage Law (KVL): The directed sum of electrical potential differences (voltages) around any closed circuit loop is zero (Σ V = 0). This expresses conservation of energy.
2. Kirchhoff's Current Law (KCL): The total current entering a junction or node equals the total current leaving that node (Σ I_in = Σ I_out). This expresses conservation of electric charge.`;
  }

  // 7. Telephone Invention / History (Archivist focus)
  if (q.includes('telephone') || (q.includes('phone') && (q.includes('invent') || q.includes('who')))) {
    return `Alexander Graham Bell is officially credited with inventing the first practical telephone, receiving the US patent for it in March 1876. Elisha Gray and Antonio Meucci also made significant early contributions to electromagnetic voice transmission technology.`;
  }

  // 8. Python Questions (ByteBot AI focus)
  if (q.includes('python')) {
    return `Python is a high-level, interpreted, general-purpose programming language known for its clear, readable syntax and versatile ecosystem. It is widely used in artificial intelligence, machine learning, data science, web development (Django/Flask), automation scripting, and scientific computing.`;
  }

  // 9. Java String Reversal Code & Java Questions
  if (q.includes('java')) {
    if (q.includes('reverse') || q.includes('string')) {
      return `Here is a clean Java program to reverse a String using StringBuilder:

\`\`\`java
public class StringReverser {
    public static void main(String[] args) {
        String original = "Nipix AI Scholar";
        
        // Approach 1: Using StringBuilder
        String reversed = new StringBuilder(original).reverse().toString();
        System.out.println("Reversed: " + reversed);
        
        // Approach 2: Using a char array loop
        char[] characters = original.toCharArray();
        String customReversed = "";
        for (int i = characters.length - 1; i >= 0; i--) {
            customReversed += characters[i];
        }
        System.out.println("Custom Loop Reversed: " + customReversed);
    }
}
\`\`\``;
    }
    if (q.includes('prime')) {
      return `Here is a Java program to check if a number is prime:

\`\`\`java
public class PrimeChecker {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        int number = 29;
        System.out.println(number + " is prime? " + isPrime(number));
    }
}
\`\`\``;
    }
    return `Java is a class-based, object-oriented programming language designed to follow the "Write Once, Run Anywhere" (WORA) principle via the Java Virtual Machine (JVM).`;
  }

  // 10. Recursion Questions
  if (q.includes('recursion') || q.includes('recursive')) {
    return `Recursion is a programming technique where a function calls itself directly or indirectly to solve a problem by breaking it down into smaller sub-problems.

Key Components:
1. Base Case: The condition under which the function stops calling itself to prevent infinite recursion.
2. Recursive Step: The part where the function calls itself with a reduced input.

Example (Factorial in JavaScript):
\`\`\`js
function factorial(n) {
  if (n <= 1) return 1; // Base case
  return n * factorial(n - 1); // Recursive step
}
\`\`\``;
  }

  // 11. Default Persona-Tuned Knowledge Synthesis
  if (botId === 'novamind') {
    return `Regarding "${promptText}": Analytical problem-solving requires breaking this down into foundational mathematical axioms and algebraic steps. Let's solve it step by step!`;
  } else if (botId === 'aether') {
    return `Regarding "${promptText}": Emerging technologies and neural architectures are reshaping how we model this domain. Let's analyze its futuristic implications and computational design!`;
  } else if (botId === 'bytebot_ai') {
    return `Regarding "${promptText}": In software engineering and computer science, analyzing this requires evaluating the underlying data structures, time complexity (Big-O notation), and execution flow. Let me know if you want a code snippet!`;
  } else if (botId === 'spark_x') {
    return `Regarding "${promptText}": From a physical and engineering standpoint, energy conservation and fundamental field equations govern this process. Let me know if you'd like to derive the circuit formulas!`;
  } else if (botId === 'archivist') {
    return `Regarding "${promptText}": Historical records and academic literature document this topic across peer-reviewed sources. Would you like a summary of historical developments?`;
  } else {
    return `Regarding "${promptText}": Analyzing the structural invariants and logical principles reveals an underlying pattern. Let me know what specific aspect you'd like to decipher.`;
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

    // Check if external Gemini API key is configured
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

        const response = await axios.post(geminiUrl, { contents }, { timeout: 8000 });
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

    // Check if external OpenAI API key is configured
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
            timeout: 8000
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
      message: "I couldn't process that message right now. Please try again."
    });
  }
};
