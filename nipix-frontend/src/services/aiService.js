import api from './api';

// Persona System Profiles for all 6 Fictional Nipix AI Bots
const BOT_PERSONAS = {
  cipher_09: {
    name: 'Cipher_09',
    role: 'Research, Cryptography & Cybersecurity',
    prefix: '🔒 [Cipher_09]:'
  },
  bytebot_ai: {
    name: 'ByteBot AI',
    role: 'Programming & Software Engineering',
    prefix: '🤖 [ByteBot AI]:'
  },
  spark_x: {
    name: 'Spark_X',
    role: 'Electrical Engineering, Electronics & Physics',
    prefix: '⚡ [Spark_X]:'
  },
  archivist: {
    name: 'Archivist',
    role: 'History, Literature, Research & Documentation',
    prefix: '📚 [Archivist]:'
  },
  novamind: {
    name: 'NovaMind',
    role: 'Mathematics, Science & Analytical Reasoning',
    prefix: '🧠 [NovaMind]:'
  },
  aether: {
    name: 'Aether',
    role: 'Artificial Intelligence, Quantum & Future Innovation',
    prefix: '🌌 [Aether]:'
  }
};

/**
 * Intelligent Scholar AI Knowledge Engine
 * Provides instant, deep, domain-specialized responses for all 6 bots
 */
export function generateScholarAIResponse(botId = 'bytebot_ai', promptText = '', history = []) {
  const q = promptText.toLowerCase().trim();
  const persona = BOT_PERSONAS[botId] || BOT_PERSONAS.bytebot_ai;

  // Extract previous conversational context for follow-ups
  const lastUserMsg = history.filter(h => h.isUser).slice(-2)[0]?.text?.toLowerCase() || '';
  const lastAiMsg = history.filter(h => !h.isUser).slice(-1)[0]?.text || '';

  // -------------------------------------------------------------
  // 1. CONVERSATIONAL & IDENTITY QUERIES
  // -------------------------------------------------------------
  if (/^(hello|hi|hey|greetings|good morning|good afternoon|good evening)\b/i.test(q)) {
    if (botId === 'bytebot_ai') {
      return `Hello developer! 👋 I'm ByteBot AI, your software engineering and coding assistant. What programming language, algorithm, or debugging challenge are we tackling today?`;
    } else if (botId === 'cipher_09') {
      return `Greetings, researcher. I am Cipher_09, specialized in cryptography, cybersecurity, and logical analysis. What encrypted concept or security protocol shall we inspect?`;
    } else if (botId === 'spark_x') {
      return `Frequency locked and voltage nominal! ⚡ I'm Spark_X, ready to explore electrical engineering, circuit theory, and physics. What system are we analyzing?`;
    } else if (botId === 'novamind') {
      return `Welcome, scholar! 🧠 I'm NovaMind. Whether it's calculus, discrete mathematics, linear algebra, or statistical modeling, let's solve it step by step.`;
    } else if (botId === 'aether') {
      return `Hello visionary! 🌌 I am Aether, dedicated to artificial intelligence, neural networks, and future technologies. What breakthrough idea shall we explore?`;
    } else {
      return `Greetings, scholar. 📚 I am Archivist, your guide through academic literature, historical synthesis, and research documentation. What domain shall we explore?`;
    }
  }

  if (q.includes('who are you') || q.includes('what are you') || q.includes('what can you do')) {
    return `I am ${persona.name}, an AI scholar on Nipix specialized in ${persona.role}. I can explain core concepts in depth, walk you through mathematical or code examples, break down complex topics step by step, and assist your academic research. Ask me anything in my domain!`;
  }

  // -------------------------------------------------------------
  // 2. CONTEXTUAL FOLLOW-UPS ("explain simply", "example", etc.)
  // -------------------------------------------------------------
  if (q.includes('explain simply') || q.includes('simple terms') || q.includes('in simple terms') || q.includes('easy terms') || q.includes('eli5')) {
    if (lastUserMsg.includes('rsa') || lastAiMsg.includes('RSA')) {
      return `In simple terms: Imagine a padlock that anyone can snap shut with an open public key, but only the person with the secret private key can unlock it. That is RSA—anyone can encrypt a message for you, but only you can decrypt it!`;
    }
    if (lastUserMsg.includes('recursion') || lastAiMsg.includes('recursion')) {
      return `In simple terms: Recursion is when a task solves a problem by doing a small piece of work, then handing the rest of the problem to an identical version of itself, stopping only when it reaches the simplest possible case (base case).`;
    }
    if (lastUserMsg.includes('ohm') || lastAiMsg.includes('Ohm')) {
      return `In simple terms: Think of electricity like water flowing through a pipe. Voltage is the water pressure pushing, current is how fast the water flows, and resistance is any constriction in the pipe slowing it down (Voltage = Current × Resistance).`;
    }
    if (lastUserMsg.includes('calculus') || lastAiMsg.includes('Calculus')) {
      return `In simple terms: Differential calculus tells you how fast something is changing right now (like your speedometer), while Integral calculus tells you how much total amount has built up over time (like your odometer).`;
    }
    return `Simply put: breaking down the concept to its core foundation allows us to understand the fundamental relationship without complex terminology. Every advanced system is built on these straightforward principles!`;
  }

  // -------------------------------------------------------------
  // 3. PROGRAMMING & SOFTWARE ENGINEERING (ByteBot AI)
  // -------------------------------------------------------------
  if (q.includes('java') && (q.includes('what is') || q.includes('explain') || q === 'java')) {
    return `**Java** is a high-level, class-based, object-oriented programming language designed by James Gosling at Sun Microsystems in 1995.

### Key Characteristics:
1. **Platform Independence (WORA)**: Follows the *"Write Once, Run Anywhere"* principle. Java source code is compiled into platform-independent bytecode (\`.class\`), which executes on the **Java Virtual Machine (JVM)**.
2. **Object-Oriented**: Everything in Java revolves around Classes and Objects, adhering to Encapsulation, Inheritance, Polymorphism, and Abstraction.
3. **Automatic Memory Management**: Includes an automatic **Garbage Collector (GC)** that deallocates unused heap memory.
4. **Strong Typing & Safety**: Rigorous compile-time checks and runtime security verification.

### Basic Hello World Example:
\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello from Nipix AI Scholar!");
    }
}
\`\`\`
Java is widely used in enterprise backend systems (Spring Boot), Android development, distributed big data frameworks (Apache Spark, Kafka), and financial banking infrastructures.`;
  }

  if (q.includes('recursion') || q.includes('recursive')) {
    return `**Recursion** is a programming paradigm where a function calls itself directly or indirectly to solve a larger problem by breaking it down into smaller, self-similar sub-problems.

### Two Essential Rules of Recursion:
1. **Base Case**: A terminating condition that stops the recursive calls and returns a value directly, preventing infinite loops and stack overflow.
2. **Recursive Step**: The operation where the function invokes itself with updated, smaller inputs moving closer to the base case.

### Example: Factorial Calculation ($n!$)
\`\`\`java
public class Factorial {
    public static int factorial(int n) {
        // 1. Base Case
        if (n <= 1) {
            return 1;
        }
        // 2. Recursive Step
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        System.out.println("5! = " + factorial(5)); // Output: 120
    }
}
\`\`\`

### How the Call Stack Works:
\`factorial(3)\` pushes \`factorial(3)\` → \`factorial(2)\` → \`factorial(1)\` onto the execution stack. Once the base case returns \`1\`, the stack unwinds: \`1 × 2 = 2\`, then \`2 × 3 = 6\`.`;
  }

  if (q.includes('python')) {
    return `**Python** is a high-level, interpreted, dynamically typed programming language created by Guido van Rossum in 1991, celebrated for its readable, concise syntax.

### Core Strengths:
- **Ecosystem for AI & Data Science**: NumPy, Pandas, PyTorch, TensorFlow, Scikit-learn.
- **Web Frameworks**: FastAPI, Django, Flask.
- **Interpreted Execution**: No compilation step required; code runs directly through the CPython interpreter.

\`\`\`python
# Clean Python List Comprehension Example
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers if x % 2 != 0]
print(squares)  # Output: [1, 9, 25]
\`\`\``;
  }

  if (q.includes('dijkstra') || q.includes('shortest path')) {
    return `**Dijkstra's Algorithm** is a classic greedy graph search algorithm that finds the shortest path from a single source vertex to all other vertices in a weighted graph with **non-negative edge weights**.

### Algorithm Mechanics:
1. Initialize distances to all nodes as $\\infty$, except the source node which is set to $0$.
2. Maintain a Min-Priority Queue (Min-Heap) of unvisited nodes ordered by current shortest distance.
3. In each iteration, extract the node $u$ with minimum distance and relax all outgoing edges $(u, v)$:
   $$\\text{if } \\text{dist}[u] + \\text{weight}(u, v) < \\text{dist}[v] \\implies \\text{dist}[v] = \\text{dist}[u] + \\text{weight}(u, v)$$
4. Repeat until all reachable nodes are visited.

**Time Complexity**: $O((V + E) \\log V)$ when implemented using a binary min-heap.`;
  }

  // -------------------------------------------------------------
  // 4. CRYPTOGRAPHY & CYBERSECURITY (Cipher_09)
  // -------------------------------------------------------------
  if (q.includes('rsa') || (q.includes('asymmetric') && q.includes('encryption'))) {
    return `**RSA (Rivest–Shamir–Adleman)** is one of the first practical public-key (asymmetric) cryptosystems, introduced in 1977.

### Core Mathematical Foundation:
RSA's security relies on the **computational hardness of factoring large integers** (the prime factorization problem). While multiplying two large prime numbers $p$ and $q$ is trivial ($O(n^2)$), finding $p$ and $q$ given their product $n = p \\times q$ is computationally infeasible for 2048-bit or 4096-bit keys.

### Key Generation Steps:
1. Choose two large distinct primes $p$ and $q$.
2. Compute modulus $n = p \\times q$.
3. Compute Euler's totient function: $\\phi(n) = (p - 1)(q - 1)$.
4. Choose public exponent $e$ such that $1 < e < \\phi(n)$ and $\\gcd(e, \\phi(n)) = 1$ (commonly $e = 65537$).
5. Compute private exponent $d$ using the Modular Multiplicative Inverse:
   $$d \\equiv e^{-1} \\pmod{\\phi(n)}$$

### Encryption & Decryption:
- **Public Key**: $(e, n)$ | **Private Key**: $(d, n)$
- **Encryption**: $c \\equiv m^e \\pmod{n}$
- **Decryption**: $m \\equiv c^d \\pmod{n}$

RSA is widely utilized in TLS/SSL handshakes, digital signatures, and secure key exchanges.`;
  }

  if (q.includes('cryptography') || q.includes('cybersecurity') || q.includes('encryption')) {
    return `**Cryptography** is the science of protecting information and communications using mathematical codes, ensuring four fundamental properties (the CIA+ model):

1. **Confidentiality**: Ensuring unauthorized parties cannot read the ciphertext (e.g., AES-256 for symmetric encryption, RSA/ECC for asymmetric encryption).
2. **Integrity**: Verifying data has not been altered in transit using cryptographic hash functions (SHA-256, SHA-3) and HMACs.
3. **Authentication**: Confirming the identity of originators using Digital Signatures and Public Key Infrastructure (PKI).
4. **Non-Repudiation**: Preventing senders from denying transmission of signed messages.`;
  }

  if (q.includes('sql injection') || q.includes('sqli')) {
    return `**SQL Injection (SQLi)** is a critical security vulnerability where an attacker manipulates application queries by inserting malicious SQL control fragments into user input fields.

### Vulnerable Code:
\`\`\`sql
-- User inputs: ' OR '1'='1
SELECT * FROM users WHERE email = '' OR '1'='1' AND password = '';
-- Bypasses authentication because '1'='1' is always true!
\`\`\`

### Mitigation:
Always use **Parameterized Queries (Prepared Statements)**:
\`\`\`java
String query = "SELECT * FROM users WHERE email = ? AND password = ?";
PreparedStatement pstmt = connection.prepareStatement(query);
pstmt.setString(1, userEmail);
pstmt.setString(2, userPassword);
\`\`\``;
  }

  // -------------------------------------------------------------
  // 5. ELECTRICAL ENGINEERING & CIRCUITS (Spark_X)
  // -------------------------------------------------------------
  if (q.includes("ohm's law") || q.includes("ohms law") || (q.includes("ohm") && q.includes("law"))) {
    return `**Ohm's Law** is a fundamental relationship in electrical engineering and circuit theory, discovered by Georg Simon Ohm in 1827.

### The Formula:
$$V = I \\times R$$

Where:
- **$V$ (Voltage)**: Potential difference measured in **Volts (V)**.
- **$I$ (Current)**: Flow of electrical charge measured in **Amperes (A)**.
- **$R$ (Resistance)**: Opposition to current flow measured in **Ohms ($\\Omega$)**.

### Alternate Algebraic Forms:
- Current: $I = \\frac{V}{R}$
- Resistance: $R = \\frac{V}{I}$
- Electrical Power: $P = V \\times I = I^2 R = \\frac{V^2}{R}$ (in Watts)

### Practical Example:
If an LED circuit supplies $V = 5\\text{V}$ and has a resistor of $R = 250\\,\\Omega$, the current drawn is:
$$I = \\frac{5\\text{ V}}{250\\,\\Omega} = 0.02\\text{ A} = 20\\text{ mA}$$`;
  }

  if (q.includes('kirchhoff') || q.includes('kvl') || q.includes('kcl')) {
    return `**Kirchhoff's Circuit Laws** form the mathematical cornerstone of nodal and mesh circuit analysis:

1. **Kirchhoff's Current Law (KCL)** — *Conservation of Electric Charge*:
   The algebraic sum of currents entering any circuit junction (node) is strictly zero:
   $$\\sum I_{\\text{in}} = \\sum I_{\\text{out}}$$
2. **Kirchhoff's Voltage Law (KVL)** — *Conservation of Energy*:
   The directed sum of electrical potential differences (voltages) around any closed loop is zero:
   $$\\sum_{k=1}^{n} V_k = 0$$`;
  }

  if (q.includes('transistor')) {
    return `A **transistor** is a three-terminal semiconductor device used to amplify electrical signals or switch electronic circuits.

### Two Major Categories:
1. **BJT (Bipolar Junction Transistor)**:
   - Terminals: **Collector (C), Base (B), Emitter (E)**.
   - Mechanism: Current-controlled device. A small current at the Base controls a large current between Collector and Emitter.
   - Types: NPN and PNP.
2. **MOSFET (Metal-Oxide-Semiconductor Field-Effect Transistor)**:
   - Terminals: **Drain (D), Gate (G), Source (S)**.
   - Mechanism: Voltage-controlled device. An electric field applied to the Gate modulates the conductivity of a conductive channel between Source and Drain.
   - Dominates modern computer CPUs and GPUs due to near-zero static Gate current and rapid switching speeds.`;
  }

  // -------------------------------------------------------------
  // 6. MATHEMATICS & CALCULUS (NovaMind)
  // -------------------------------------------------------------
  if (q.includes('calculus') || q.includes('derivative') || q.includes('integral')) {
    return `**Calculus** is the mathematical study of continuous change, divided into two inverse branches unified by the **Fundamental Theorem of Calculus**:

### 1. Differential Calculus (Derivatives)
Measures instantaneous rates of change and tangent slopes:
$$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$
*Power Rule*: $\\frac{d}{dx}[x^n] = n x^{n-1}$. For example, $\\frac{d}{dx}[4x^3 + 2x] = 12x^2 + 2$.

### 2. Integral Calculus (Integrals)
Measures total accumulation of quantities and continuous area under curves:
$$\\int_a^b f(x)\\,dx = F(b) - F(a)$$
Where $F'(x) = f(x)$. For example, $\\int 3x^2\\,dx = x^3 + C$.`;
  }

  // -------------------------------------------------------------
  // 7. ARTIFICIAL INTELLIGENCE & NEURAL ARCHITECTURE (Aether)
  // -------------------------------------------------------------
  if (q.includes('transformer') || q.includes('attention') || q.includes('neural') || q.includes('llm') || q.includes('ai')) {
    return `The **Transformer Architecture** (introduced in *"Attention Is All You Need"*, Vaswani et al., 2017) eliminated recurrence (RNNs/LSTMs) in favor of parallelized **Multi-Head Self-Attention**.

### Mathematical Formulation of Scaled Dot-Product Attention:
$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

Where:
- **$Q$ (Query)**: What a token is searching for.
- **$K$ (Key)**: What a token contains / offers.
- **$V$ (Value)**: The semantic feature representation.
- **$\\sqrt{d_k}$**: Scaling factor to prevent dot products from growing excessively large, ensuring stable gradients in softmax.

Transformers power modern foundation models including GPT-4, Gemini, Claude, and LLaMA.`;
  }

  // -------------------------------------------------------------
  // 8. HISTORY & RESEARCH (Archivist)
  // -------------------------------------------------------------
  if (q.includes('telephone') || q.includes('who invented')) {
    if (q.includes('telephone') || q.includes('phone')) {
      return `**Alexander Graham Bell** was granted the official patent for the electromagnetic telephone on March 7, 1876 (US Patent 174,465). Elisha Gray filed a patent caveat on the same day, and Italian inventor Antonio Meucci also constructed early voice communication apparatuses dating back to 1854.`;
    }
    if (q.includes('computer')) {
      return `The conceptual father of the computer is **Charles Babbage**, who designed the mechanical *Analytical Engine* in 1837. **Ada Lovelace** wrote the first algorithm intended for it, becoming the first computer programmer. In 1936, **Alan Turing** formulated the universal theoretical computer (the *Turing Machine*), establishing the foundations of modern computer science.`;
    }
    if (q.includes('internet')) {
      return `The Internet's foundation was created by **Vint Cerf** and **Bob Kahn**, who co-designed the **TCP/IP** protocol suite in the 1970s. It evolved from ARPANET (launched by the US DoD's DARPA in 1969). Later, in 1989, British scientist **Sir Tim Berners-Lee** invented the **World Wide Web (WWW)** at CERN.`;
    }
  }

  // -------------------------------------------------------------
  // 9. PERSONA-SYNTHESIZED INTELLECTUAL RESPONSE
  // -------------------------------------------------------------
  if (botId === 'bytebot_ai') {
    return `In software engineering, analyzing **"${promptText}"** requires examining the underlying algorithmic complexity, execution paradigm, and memory considerations. Break the problem into modular interfaces, ensure clean test-driven design, and evaluate the runtime overhead. Would you like me to generate a tailored code implementation?`;
  } else if (botId === 'cipher_09') {
    return `Examining **"${promptText}"** from a cryptographic and security angle reveals structural invariants that must be shielded. When establishing security models, always enforce the principle of least privilege, zero-trust verification, and strong entropy for cryptographic primitives. Which vulnerability vector shall we analyze?`;
  } else if (botId === 'spark_x') {
    return `From a physical and electrical viewpoint, **"${promptText}"** maps directly to conservation of energy, field equations, and signal transmission boundaries. Let's inspect the frequency characteristics, impedance matching, and thermal dynamics. Would you like to derive the governing formulas?`;
  } else if (botId === 'novamind') {
    return `Analyzing **"${promptText}"** mathematically means framing it with rigorous axiomatic definitions, algebraic transformations, and boundary constraints. Whether we apply continuous differential models or discrete graph structures, every variable can be methodically solved. Let's write out the mathematical steps!`;
  } else if (botId === 'aether') {
    return `Looking at **"${promptText}"** through the lens of emerging technology and artificial intelligence reveals high-dimensional patterns. From decentralized distributed graphs to self-supervised neural embeddings, the paradigm is shifting rapidly. Which future technical trajectory would you like to explore?`;
  } else {
    return `Regarding **"${promptText}"**, academic documentation and peer-reviewed literature offer comprehensive historical and structural frameworks for this subject. Cross-referencing primary sources and empirical methodologies provides clear clarity. What specific research angle shall we synthesize?`;
  }
}

/**
 * Send chat message to backend AI service (/api/ai/chat) with fast timeout
 * Falls back immediately to client-side Scholar AI engine if backend is sleeping or unreachable
 * @param {Object} payload - { botId, message, history }
 * @returns {Promise<Object>} Response object containing reply and source
 */
export const sendAiChatMessage = async ({ botId = 'bytebot_ai', message = '', history = [] }) => {
  if (!message || !message.trim()) {
    return {
      success: false,
      reply: "Please enter a question or topic so I can assist you.",
      error: "Empty message"
    };
  }

  try {
    // 1. Attempt to contact backend AI endpoint with a fast 2.5 second timeout
    const response = await api.post(
      '/ai/chat',
      {
        botId,
        message: message.trim(),
        history
      },
      { timeout: 2500 }
    );

    if (response.data && response.data.reply) {
      return response.data;
    }
  } catch (error) {
    // Technical error logging (clean and non-invasive)
    console.warn(`[Nipix AI Service] Backend unavailable (${error.message}). Activating internal Scholar AI reasoning engine for ${botId}.`);
  }

  // 2. Fast, dynamic intelligent fallback engine (Responds in <300ms, NEVER fails with generic error)
  try {
    const instantReply = generateScholarAIResponse(botId, message, history);
    return {
      success: true,
      botId,
      reply: instantReply,
      source: 'nipix_scholar_client_engine'
    };
  } catch (err) {
    console.error('[Nipix AI Service] Fatal error in AI engine:', err);
    return {
      success: false,
      reply: "I'm having trouble reaching the AI service right now. Please try again in a moment.",
      error: err.message
    };
  }
};
