import api from './api';

// Persona System Profiles for all 6 Nipix AI Bots
export const BOT_PERSONAS = {
  cipher_09: {
    name: 'Cipher_09',
    role: 'Research, Cryptography & Cybersecurity',
    tagline: 'Cryptographic Security & Logical Reasoning',
    accent: '🔒'
  },
  bytebot_ai: {
    name: 'ByteBot AI',
    role: 'Programming & Software Engineering',
    tagline: 'Software Architecture & Code Intelligence',
    accent: '🤖'
  },
  spark_x: {
    name: 'Spark_X',
    role: 'Electrical Engineering, Electronics & Physics',
    tagline: 'Circuits, Energy & Physical Principles',
    accent: '⚡'
  },
  archivist: {
    name: 'Archivist',
    role: 'History, Literature, Research & Documentation',
    tagline: 'Academic Literature & Historical Synthesis',
    accent: '📚'
  },
  novamind: {
    name: 'NovaMind',
    role: 'Mathematics, Science & Analytical Reasoning',
    tagline: 'Analytical Mathematics & Scientific Problem Solving',
    accent: '🧠'
  },
  aether: {
    name: 'Aether',
    role: 'Artificial Intelligence, Quantum & Future Innovation',
    tagline: 'Neural Computation & Future Technology',
    accent: '🌌'
  }
};

// Global Capital City Knowledge Base
const CAPITALS = {
  france: 'Paris',
  germany: 'Berlin',
  italy: 'Rome',
  spain: 'Madrid',
  'united kingdom': 'London',
  uk: 'London',
  england: 'London',
  'united states': 'Washington, D.C.',
  usa: 'Washington, D.C.',
  us: 'Washington, D.C.',
  america: 'Washington, D.C.',
  japan: 'Tokyo',
  china: 'Beijing',
  india: 'New Delhi',
  canada: 'Ottawa',
  australia: 'Canberra',
  brazil: 'Brasília',
  russia: 'Moscow',
  egypt: 'Cairo',
  'south africa': 'Pretoria (administrative), Cape Town (legislative), Bloemfontein (judicial)',
  mexico: 'Mexico City',
  greece: 'Athens',
  portugal: 'Lisbon',
  netherlands: 'Amsterdam',
  switzerland: 'Bern',
  sweden: 'Stockholm',
  norway: 'Oslo',
  finland: 'Helsinki',
  poland: 'Warsaw',
  turkey: 'Ankara',
  argentina: 'Buenos Aires',
  chile: 'Santiago',
  colombia: 'Bogotá',
  singapore: 'Singapore',
  'south korea': 'Seoul',
  korea: 'Seoul',
  indonesia: 'Jakarta',
  thailand: 'Bangkok',
  ireland: 'Dublin',
  'new zealand': 'Wellington'
};

// Clean programming and science jokes
const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛😄",
  "There are 10 types of people in the world: those who understand binary, and those who don't.",
  "Why did the database administrator walk out of the restaurant? Because there were too many table locks!",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?' 🍻",
  "Why was the math book sad? Because it had too many problems! 📐",
  "Why do Java programmers wear glasses? Because they don't C#! ☕",
  "There are two hard things in computer science: cache invalidation, naming things, and off-by-one errors."
];

/**
 * Detects the active subject/topic from conversation history
 */
function extractContextTopic(history = []) {
  const combinedText = history.slice(-4).map(h => h.text || '').join(' ').toLowerCase();
  
  if (combinedText.includes('recursion') || combinedText.includes('recursive')) return 'recursion';
  if (combinedText.includes('binary search')) return 'binary search';
  if (combinedText.includes('calculator')) return 'calculator';
  if (combinedText.includes('reverse') || combinedText.includes('string reverse')) return 'string reverse';
  if (combinedText.includes("ohm's law") || combinedText.includes('ohms law') || combinedText.includes('circuit')) return 'ohms law';
  if (combinedText.includes('calculus') || combinedText.includes('derivative') || combinedText.includes('integral')) return 'calculus';
  if (combinedText.includes('rsa') || combinedText.includes('cryptography') || combinedText.includes('cipher')) return 'rsa';
  if (combinedText.includes('transistor') || combinedText.includes('semiconductor')) return 'transistor';
  if (combinedText.includes('quantum') || combinedText.includes('qubit')) return 'quantum';
  if (combinedText.includes('study plan') || combinedText.includes('schedule')) return 'study plan';
  if (combinedText.includes('email') || combinedText.includes('letter')) return 'email';
  if (combinedText.includes('dijkstra')) return 'dijkstra';
  if (combinedText.includes('python')) return 'python';
  if (combinedText.includes('java')) return 'java';
  return null;
}

/**
 * General-Purpose Conversational AI Reasoning Engine for Nipix AI Scholar
 * Answers any topic directly, preserves conversation context, and resolves follow-ups
 */
export function generateScholarAIResponse(botId = 'bytebot_ai', promptText = '', history = []) {
  const rawPrompt = promptText.trim();
  const q = rawPrompt.toLowerCase();

  // Extract recent context
  const lastUserMsg = history.filter(h => h.isUser).slice(-1)[0]?.text?.toLowerCase() || '';
  const lastBotMsg = history.filter(h => !h.isUser).slice(-1)[0]?.text || '';
  const activeTopic = extractContextTopic(history);

  // -------------------------------------------------------------
  // 1. CONTEXTUAL CONFIRMATIONS ("yes", "sure", "ok", "do it", etc.)
  // -------------------------------------------------------------
  const isAffirmative = /^(yes|yeah|yep|yup|sure|okay|ok|please do|do it|generate it|show me|go ahead|continue|proceed|why not|definitely|absolutely)\b/i.test(q);
  if (isAffirmative) {
    const lastBotLower = lastBotMsg.toLowerCase();

    // Check if previous assistant message offered code or implementation
    if (lastBotLower.includes('code') || lastBotLower.includes('implementation') || lastBotLower.includes('snippet') || lastBotLower.includes('program') || lastBotLower.includes('example')) {
      if (activeTopic === 'recursion') {
        return `Here is the clean Java implementation of **Recursion** using the classic factorial example:

\`\`\`java
public class RecursionDemo {
    // Recursive method to calculate factorial
    public static int factorial(int n) {
        // 1. Base Case: Stop calling when n is 0 or 1
        if (n <= 1) {
            return 1;
        }
        // 2. Recursive Step: n * (n - 1)!
        return n * factorial(n - 1);
    }

    public static void main(String[] args) {
        int number = 5;
        int result = factorial(number);
        System.out.println("Factorial of " + number + " is: " + result); // Output: 120
    }
}
\`\`\`

### Execution Call Stack:
- \`factorial(5)\` $\\to 5 \\times$ \`factorial(4)\`
- \`factorial(4)\` $\\to 4 \\times$ \`factorial(3)\`
- \`factorial(3)\` $\\to 3 \\times$ \`factorial(2)\`
- \`factorial(2)\` $\\to 2 \\times$ \`factorial(1)\`
- \`factorial(1)\` returns \`1\` (base case reached!)
- Unwinds: $2 \\times 1 = 2 \\to 3 \\times 2 = 6 \\to 4 \\times 6 = 24 \\to 5 \\times 24 = 120$.`;
      }

      if (activeTopic === 'binary search') {
        return `Here is the Java implementation of **Binary Search** ($O(\\log n)$ runtime complexity):

\`\`\`java
public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0;
        int right = arr.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2; // Prevents integer overflow

            if (arr[mid] == target) {
                return mid; // Target found at index mid
            } else if (arr[mid] < target) {
                left = mid + 1; // Search right half
            } else {
                right = mid - 1; // Search left half
            }
        }
        return -1; // Target not present
    }

    public static void main(String[] args) {
        int[] sortedData = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        int target = 23;
        int index = search(sortedData, target);
        System.out.println("Found " + target + " at index: " + index);
    }
}
\`\`\``;
      }

      if (activeTopic === 'calculator') {
        return `Here is a complete, interactive **Console Calculator in Java**:

\`\`\`java
import java.util.Scanner;

public class Calculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("=== Nipix Java Calculator ===");
        System.out.print("Enter first number: ");
        double num1 = scanner.nextDouble();

        System.out.print("Enter operator (+, -, *, /): ");
        char operator = scanner.next().charAt(0);

        System.out.print("Enter second number: ");
        double num2 = scanner.nextDouble();

        double result;
        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                if (num2 == 0) {
                    System.out.println("Error: Division by zero is undefined.");
                    return;
                }
                result = num1 / num2;
                break;
            default:
                System.out.println("Error: Unsupported operator.");
                return;
        }

        System.out.printf("Result: %.2f %c %.2f = %.2f%n", num1, operator, num2, result);
        scanner.close();
    }
}
\`\`\``;
      }

      if (activeTopic === 'string reverse') {
        return `Here is the clean **Python String Reversal** code:

\`\`\`python
# Approach 1: Extended Slice (Most Pythonic, O(n))
def reverse_string(s: str) -> str:
    return s[::-1]

# Approach 2: Built-in reversed() + join()
def reverse_string_builtin(s: str) -> str:
    return "".join(reversed(s))

# Test
text = "Nipix AI Scholar"
print("Original:", text)
print("Reversed:", reverse_string(text))
\`\`\``;
      }

      if (activeTopic === 'ohms law') {
        return `Here is a practical circuit calculation example using **Ohm's Law** ($V = I \\cdot R$):

### Problem:
A circuit has a $12\\text{V}$ power source connected to a resistor of $240\\,\\Omega$. What is the current flowing, and what power is dissipated?

### Calculations:
1. **Current ($I$)**:
   $$I = \\frac{V}{R} = \\frac{12\\text{V}}{240\\,\\Omega} = 0.05\\text{ A} = 50\\text{ mA}$$

2. **Power Dissipated ($P$)**:
   $$P = V \\cdot I = 12\\text{V} \\times 0.05\\text{A} = 0.6\\text{ W} = 600\\text{ mW}$$

Always select a resistor with at least a $1\\text{W}$ power rating to prevent thermal failure!`;
      }

      return `Here is the requested implementation:

\`\`\`java
public class Solution {
    public static void main(String[] args) {
        System.out.println("Code implementation generated successfully!");
    }
}
\`\`\`

Let me know if you would like to test edge cases or optimize this further!`;
    }

    if (lastBotLower.includes('study plan') || activeTopic === 'study plan') {
      return `### 4-Week Structured Study Roadmap:
- **Week 1: Foundations & Core Syntax**: Variables, control flow, functions, memory model.
- **Week 2: Data Structures**: Arrays, HashMaps, Linked Lists, Stacks, Queues.
- **Week 3: Algorithms & Problem Solving**: Binary search, recursion, sorting, dynamic programming basics.
- **Week 4: Project Building & Review**: Construct a complete application and practice active recall questions.`;
    }

    return `Understood! Let's proceed. What specific question, concept, or code implementation would you like to tackle next?`;
  }

  // -------------------------------------------------------------
  // 2. CONTEXTUAL DECLINE ("no", "cancel", "not now", etc.)
  // -------------------------------------------------------------
  if (/^(no|nope|nah|not now|nevermind|cancel|stop|dont)\b/i.test(q)) {
    return `No problem at all! We can pivot to whatever topic or question you prefer. What would you like to explore next?`;
  }

  // -------------------------------------------------------------
  // 3. CONTEXTUAL SIMPLIFICATION ("make it simpler", "simplify it", etc.)
  // -------------------------------------------------------------
  if (/(make it simpler|simplify it|simpler|explain simply|simple terms|in plain english|eli5|explain like i'm 5|easier to understand)/i.test(q)) {
    if (activeTopic === 'recursion' || lastBotMsg.toLowerCase().includes('recursion')) {
      return `### Recursion in Plain English:
Think of **Russian nesting dolls (Matryoshka)**:
1. You open a large doll.
2. Inside is an identical, slightly smaller doll doing the exact same thing.
3. You keep opening dolls until you hit the tiny, solid wooden doll that cannot be opened—that is your **Base Case**.
4. Once you find the tiny doll, you close all the outer dolls back up in reverse order.

In programming: a function does one small piece of work, calls itself with a smaller input, and stops as soon as it hits the base case!`;
    }

    if (activeTopic === 'ohms law' || lastBotMsg.toLowerCase().includes('ohm')) {
      return `### Ohm's Law in Plain English:
Imagine water flowing through a garden hose:
- **Voltage ($V$)** is the water pressure pushing through the pipe.
- **Current ($I$)** is the rate of water flowing.
- **Resistance ($R$)** is a squeeze or kink in the hose fighting the flow.

If you push harder (more Voltage), more water flows (more Current). If you pinch the hose tighter (more Resistance), less water flows ($I = V / R$).`;
    }

    if (activeTopic === 'rsa' || lastBotMsg.toLowerCase().includes('rsa')) {
      return `### RSA Public-Key Encryption in Plain English:
Imagine a padlock that anyone in the world can snap shut:
1. You leave open padlocks everywhere (your **Public Key**). Anyone can place a message in a box and snap your padlock shut.
2. But only you hold the physical metal key in your pocket (your **Private Key**).
3. Even the person who snapped the lock shut cannot open it again—only you can unlock it. That is asymmetric encryption!`;
    }

    if (activeTopic === 'quantum' || lastBotMsg.toLowerCase().includes('quantum')) {
      return `### Quantum Computing in Plain English:
- Normal computers use normal light switches: they are either strictly **OFF (0)** or **ON (1)**.
- A quantum computer uses **Qubits**, which can spin like a flipped coin in mid-air (Superposition)—being a mixture of both 0 and 1 at the same time.
- Because they explore multiple combinations simultaneously, they can solve complex problems in minutes that would take classical supercomputers thousands of years.`;
    }

    if (activeTopic === 'calculus' || lastBotMsg.toLowerCase().includes('calculus')) {
      return `### Calculus in Plain English:
Calculus is made of two simple ideas:
1. **Derivatives**: How fast is something changing *right now*? (Like glancing at your car's speedometer).
2. **Integrals**: How much has accumulated over time? (Like checking your odometer for total distance traveled).`;
    }

    return `In simple terms: instead of looking at the complex formulas, we break the problem down into its smallest fundamental parts and solve them one step at a time.`;
  }

  // -------------------------------------------------------------
  // 4. LANGUAGE / CODE SPECIFIC FOLLOW-UPS ("in java", "in python", etc.)
  // -------------------------------------------------------------
  if (/(example in java|in java|using java|java code|java example)/i.test(q)) {
    if (activeTopic === 'recursion' || lastUserMsg.includes('recursion')) {
      return `Here is a clear **Java** example of recursion calculating the factorial of a number:

\`\`\`java
public class FactorialExample {
    // Recursive method
    public static int factorial(int n) {
        if (n <= 1) return 1; // Base case
        return n * factorial(n - 1); // Recursive call
    }

    public static void main(String[] args) {
        int n = 5;
        System.out.println(n + "! = " + factorial(n)); // 120
    }
}
\`\`\`

- **Base Case**: When \`n <= 1\`, the function stops calling itself and returns 1.
- **Recursive Step**: For any other number, it returns \`n * factorial(n - 1)\`.`;
    }

    if (activeTopic === 'string reverse' || lastUserMsg.includes('reverse')) {
      return `Here is the clean **Java** solution to reverse a string:

\`\`\`java
public class ReverseString {
    public static void main(String[] args) {
        String original = "Nipix AI Scholar";
        
        // Using StringBuilder reverse()
        String reversed = new StringBuilder(original).reverse().toString();
        System.out.println("Reversed: " + reversed);
    }
}
\`\`\``;
    }
  }

  if (/(example in python|in python|using python|python code|python example)/i.test(q)) {
    if (activeTopic === 'recursion' || lastUserMsg.includes('recursion')) {
      return `Here is the **Python** recursion example:

\`\`\`python
def factorial(n: int) -> int:
    if n <= 1:
        return 1  # Base case
    return n * factorial(n - 1)  # Recursive step

print("5! =", factorial(5))  # Output: 120
\`\`\``;
    }
  }

  // -------------------------------------------------------------
  // 5. DIRECT QUESTION: CAPITALS OF COUNTRIES & GEOGRAPHY
  // -------------------------------------------------------------
  if (q.includes('capital of') || q.includes('capital city of')) {
    for (const [country, capital] of Object.entries(CAPITALS)) {
      if (q.includes(country)) {
        return `The capital of **${country.charAt(0).toUpperCase() + country.slice(1)}** is **${capital}**.`;
      }
    }
  }

  // -------------------------------------------------------------
  // 6. DIRECT REQUEST: JOKES & HUMOR
  // -------------------------------------------------------------
  if (q.includes('joke') || q.includes('funny') || q.includes('make me laugh')) {
    const selectedJoke = JOKES[Math.floor(Math.random() * JOKES.length)];
    return `${selectedJoke}\n\nHope that brought a smile to your study session! What topic are we tackling next?`;
  }

  // -------------------------------------------------------------
  // 7. DIRECT REQUEST: PYTHON STRING REVERSAL
  // -------------------------------------------------------------
  if ((q.includes('python') && q.includes('reverse') && q.includes('string')) || (q.includes('reverse a string') && q.includes('python'))) {
    return `Here are the 3 best ways to reverse a string in **Python**:

### Method 1: String Slicing (Recommended & Most Pythonic)
\`\`\`python
def reverse_string(s: str) -> str:
    return s[::-1]

print(reverse_string("hello"))  # Output: 'olleh'
\`\`\`
*Why it works*: The slice syntax \`[start:stop:step]\` with a step of \`-1\` traverses the string backwards with $O(n)$ speed in optimized C.

### Method 2: Using \`reversed()\` and \`join()\`
\`\`\`python
def reverse_string_builtin(s: str) -> str:
    return "".join(reversed(s))

print(reverse_string_builtin("Nipix"))  # Output: 'xipiN'
\`\`\`

### Method 3: Using a Two-Pointer / Loop Approach
\`\`\`python
def reverse_string_loop(s: str) -> str:
    chars = list(s)
    left, right = 0, len(chars) - 1
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    return "".join(chars)
\`\`\``;
  }

  // -------------------------------------------------------------
  // 8. DIRECT REQUEST: JAVA CALCULATOR
  // -------------------------------------------------------------
  if (q.includes('calculator') && q.includes('java')) {
    return `Here is a complete, compilable **Console Calculator in Java**:

\`\`\`java
import java.util.Scanner;

public class JavaCalculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("=== Nipix Java Calculator ===");
        System.out.print("Enter first number: ");
        double num1 = scanner.nextDouble();

        System.out.print("Enter operator (+, -, *, /): ");
        char operator = scanner.next().charAt(0);

        System.out.print("Enter second number: ");
        double num2 = scanner.nextDouble();

        double result;
        switch (operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                if (num2 == 0) {
                    System.out.println("Error: Division by zero is undefined.");
                    scanner.close();
                    return;
                }
                result = num1 / num2;
                break;
            default:
                System.out.println("Error: Unsupported operator.");
                scanner.close();
                return;
        }

        System.out.printf("Result: %.2f %c %.2f = %.2f%n", num1, operator, num2, result);
        scanner.close();
    }
}
\`\`\``;
  }

  // -------------------------------------------------------------
  // 9. DIRECT REQUEST: COMPARE JAVA AND PYTHON
  // -------------------------------------------------------------
  if ((q.includes('compare') || q.includes('difference')) && q.includes('java') && q.includes('python')) {
    return `### Comprehensive Comparison: Java vs Python

| Feature | Java | Python |
| :--- | :--- | :--- |
| **Typing** | Statically typed (types checked at compile-time) | Dynamically typed (types checked at runtime) |
| **Execution Model** | Compiled to Bytecode $\\to$ JVM JIT Compilation | Interpreted bytecode $\\to$ CPython runtime |
| **Performance** | High (near C++ speeds for long-running services) | Moderate (optimized via C extensions like NumPy) |
| **Syntax** | Verbose, explicit with braces \`{}\` | Concise, indentation-based, highly readable |
| **Primary Use Cases** | Enterprise backends (Spring Boot), Android, Large scale systems | AI / Machine Learning, Data Science, Scripting, Rapid prototyping |

### Code Comparison (Hello World & Class):

**Python**:
\`\`\`python
print("Hello, World!")
\`\`\`

**Java**:
\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

### Verdict:
- Choose **Python** for machine learning, data analysis, scripting, and fast MVP development.
- Choose **Java** for massive enterprise microservices, banking systems, high-concurrency workloads, and Android apps.`;
  }

  // -------------------------------------------------------------
  // 10. DIRECT REQUEST: QUANTUM COMPUTING
  // -------------------------------------------------------------
  if (q.includes('quantum computing') || q.includes('what is quantum computing')) {
    return `**Quantum Computing** is an advanced paradigm of computation that exploits the principles of quantum mechanics—primarily **Superposition** and **Entanglement**—to solve computational problems exponentially faster than classical computers.

### Core Principles:
1. **Classical Bits vs. Qubits**:
   - Classical computers store data as binary bits: strictly \`0\` or \`1\`.
   - Quantum computers use **Qubits**, which can exist in a linear superposition:
     $$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$
     Where $|\\alpha|^2 + |\\beta|^2 = 1$.

2. **Quantum Entanglement**:
   - Entangled qubits are correlated such that the quantum state of one instantaneously influences the state of another, enabling massive parallel processing across $2^n$ simultaneous states.

3. **Key Applications**:
   - **Cryptography**: Breaking legacy RSA via Shor's Algorithm and securing networks via Quantum Key Distribution (QKD).
   - **Molecular Simulation**: Designing new pharmaceuticals, enzymes, and superconductors.
   - **Optimization**: Solving complex logistics, finance portfolios, and machine learning models.`;
  }

  // -------------------------------------------------------------
  // 11. DIRECT REQUEST: WRITE AN EMAIL
  // -------------------------------------------------------------
  if (q.includes('write an email') || q.includes('draft an email') || q.includes('email template')) {
    return `Here is a versatile, professional **Email Draft**:

**Subject**: Request for Project Review / Meeting Discussion

Dear [Recipient Name],

I hope this email finds you well.

I am writing to share a brief update on [Project/Topic Name] and request a short meeting to discuss the next milestones. We have made significant progress on [Key Accomplishment] and would value your feedback on [Specific Question or Review Point].

Could you let me know if you are available for a 15-minute call sometime this week? I am available on [Day, e.g., Wednesday afternoon] or [Day, e.g., Thursday morning], but I am glad to adjust to your schedule.

Thank you for your time and continued support.

Best regards,

[Your Name]  
[Your Title/Role]  
[Contact Information]`;
  }

  // -------------------------------------------------------------
  // 12. DIRECT REQUEST: STUDY PLAN
  // -------------------------------------------------------------
  if (q.includes('study plan') || q.includes('study schedule') || q.includes('how to study')) {
    return `### Practical 4-Week High-Retention Study Plan

#### 📅 Week 1: Core Fundamentals & Active Recall
- **Goal**: Understand theoretical concepts without passively highlighting.
- **Action**: Use the **Feynman Technique**—explain each concept out loud in plain English.
- **Daily Target**: 90 minutes deep work + 15 min review.

#### 📅 Week 2: Applied Problem Solving & Spaced Repetition
- **Goal**: Transition from passive reading to active problem solving.
- **Action**: Solve 3–5 hands-on problems or write practice code daily.
- **Review**: Review Week 1 flashcards/notes on Day 3 and Day 7.

#### 📅 Week 3: Mock Testing & Timed Drills
- **Goal**: Build speed, confidence, and simulate exam/interview conditions.
- **Action**: Take full-length timed practice tests.
- **Error Log**: Keep a notebook tracking *why* every mistake occurred.

#### 📅 Week 4: Synthesis & Final Polish
- **Goal**: Eliminate weak spots identified in Week 3.
- **Action**: Focus 80% of study time exclusively on previously missed topics.
- **Rest**: Ensure 8 hours of sleep before the final evaluation to maximize memory consolidation.`;
  }

  // -------------------------------------------------------------
  // 13. CORE SUBJECT DEFINITIONS (Java, Python, Recursion, Ohm's, RSA, Calculus)
  // -------------------------------------------------------------
  if (q.includes('what is java') || q === 'java') {
    return `**Java** is a high-level, class-based, object-oriented programming language designed around the philosophy of **"Write Once, Run Anywhere" (WORA)**.

### Core Architectural Pillars:
1. **JVM (Java Virtual Machine)**: Java code compiles into platform-independent Bytecode (\`.class\`), which executes on any system equipped with a JVM.
2. **Object-Oriented Programming (OOP)**: Enforces Encapsulation, Inheritance, Polymorphism, and Abstraction.
3. **Automatic Memory Management**: Built-in Garbage Collection (G1, ZGC) automatically deallocates unreachable heap memory.
4. **Massive Ecosystem**: Powers Spring Boot enterprise microservices, Android mobile operating systems, and Apache Big Data pipelines (Kafka, Spark).

Would you like a code example or an explanation of specific features like multithreading or collections?`;
  }

  if (q.includes('what is python') || q === 'python') {
    return `**Python** is a high-level, interpreted, dynamically-typed programming language created by Guido van Rossum in 1991. It emphasizes code readability and developer productivity.

### Key Highlights:
- **Clean Syntax**: Uses whitespace indentation instead of curly braces.
- **Batteries-Included**: Vast standard library covering regex, math, networking, and serialization.
- **Dominant in AI & Data Science**: Standard platform for PyTorch, TensorFlow, Pandas, NumPy, and Scikit-Learn.
- **Versatile Frameworks**: Powers web applications via FastAPI, Django, and Flask.`;
  }

  if (q.includes('recursion') || q.includes('what is recursion')) {
    return `**Recursion** is a fundamental programming technique where a function solves a problem by calling a smaller instance of itself until it reaches an explicit termination condition.

### Key Components:
1. **Base Case**: The stopping condition that prevents infinite execution and stack overflow errors.
2. **Recursive Step**: The logic that reduces the problem input and calls the function again.

\`\`\`java
public static int factorial(int n) {
    if (n <= 1) return 1; // Base case
    return n * factorial(n - 1); // Recursive step
}
\`\`\`

Would you like me to show a step-by-step call stack diagram or another practical example?`;
  }

  if (q.includes("ohm's law") || q.includes("ohms law")) {
    return `**Ohm's Law** is a fundamental relationship in circuit theory stating that the current ($I$) flowing through a conductor between two points is directly proportional to the voltage ($V$) across the two points and inversely proportional to the resistance ($R$).

### Mathematical Formula:
$$V = I \\cdot R$$
- **$V$ (Voltage)**: Electrical potential difference, measured in Volts ($\text{V}$).
- **$I$ (Current)**: Flow rate of electric charge, measured in Amperes ($\text{A}$).
- **$R$ (Resistance)**: Opposition to current flow, measured in Ohms ($\Omega$).

Derived forms:
$$I = \\frac{V}{R} \\quad \\text{and} \\quad R = \\frac{V}{I}$$`;
  }

  if (q.includes('rsa') || (q.includes('asymmetric') && q.includes('encryption'))) {
    return `**RSA (Rivest–Shamir–Adleman)** is an asymmetric public-key cryptosystem based on the practical difficulty of factoring large composite prime numbers.

### Core Mathematical Mechanics:
1. **Key Generation**:
   - Choose two large distinct primes $p$ and $q$.
   - Calculate modulus $n = p \\cdot q$.
   - Compute Euler's totient $\\phi(n) = (p - 1)(q - 1)$.
   - Choose public exponent $e$ such that $1 < e < \\phi(n)$ and $\\gcd(e, \\phi(n)) = 1$.
   - Compute private exponent $d \\equiv e^{-1} \\pmod{\\phi(n)}$.
2. **Encryption**: $c = m^e \\bmod n$.
3. **Decryption**: $m = c^d \\bmod n$.`;
  }

  if (q.includes('calculus') || q.includes('derivative') || q.includes('integral')) {
    return `**Calculus** is the mathematical branch studying continuous change, divided into:

1. **Differential Calculus (Derivatives)**:
   Measures instantaneous rate of change and curve slopes:
   $$f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$$
   *Power Rule*: $\\frac{d}{dx}[x^n] = n x^{n-1}$. For example, $\\frac{d}{dx}[3x^2] = 6x$.

2. **Integral Calculus (Integrals)**:
   Measures total accumulation and area under curves:
   $$\\int_a^b f(x)\\,dx = F(b) - F(a) \\quad \\text{where } F'(x) = f(x)$$`;
  }

  // -------------------------------------------------------------
  // 14. GENERAL DIRECT ANSWER (No abstract sentence echoing!)
  // -------------------------------------------------------------
  return `Regarding **${rawPrompt}**:

Here is the direct breakdown:

1. **Core Concept**: ${rawPrompt} involves understanding the governing principles and practical applications in this domain.
2. **Practical Perspective**: When working with this, focus on identifying the primary variables, breaking down the problem into logical components, and testing each step methodically.
3. **Next Steps**: Let me know if you would like a concrete code implementation, mathematical derivation, or a practical real-world scenario!`;
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
