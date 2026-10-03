// Nipix A-to-Z Educational Course Directory & Full Curriculum
// Structured 8-Stage Learning Path for All Major Disciplines:
// 1. Introduction -> 2. Fundamentals -> 3. Lessons (Multi-part) -> 4. Practice -> 5. Videos -> 6. Tasks -> 7. Tests -> 8. Projects & Completion

export const SUBJECT_CATEGORIES = [
  'All Courses',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Electrical / Electronics',
  'Science & Technology',
  'Research & Knowledge'
];

export const COURSES = [
  // =========================================================================
  // 1. COMPUTER SCIENCE: DATA STRUCTURES & ALGORITHMS
  // =========================================================================
  {
    id: 'cs-dsa',
    title: 'Data Structures & Algorithms Masterclass',
    subject: 'Computer Science',
    category: 'Computer Science',
    level: 'Beginner to Advanced',
    badge: 'Core Curriculum',
    readTime: '40 hours comprehensive',
    recommendedBot: 'bytebot',
    shortDescription: 'Master algorithmic thinking from arrays, linked lists, trees, heaps, and graphs to dynamic programming.',
    introduction: {
      overview: 'Data Structures and Algorithms form the foundational bedrock of computer science and software engineering. This A-to-Z course takes you from fundamental pointer manipulations to advanced dynamic programming state-machine reductions.',
      prerequisites: ['Basic familiarity with any programming language (Python, C++, or JavaScript)', 'High-school algebra'],
      learningObjectives: [
        'Analyze asymptotic time and space complexities using Big-O notation',
        'Implement balanced binary search trees, binary heaps, and priority queues',
        'Master graph traversal (BFS/DFS), Dijkstra, and topological sorting',
        'Construct optimal memoization tables for 1D and 2D dynamic programming'
      ]
    },
    fundamentals: [
      {
        term: 'Big-O Notation',
        definition: 'Mathematical notation describing the upper bound of algorithm runtime as input size N grows towards infinity.'
      },
      {
        term: 'Contiguous vs Linked Memory',
        definition: 'Arrays utilize cache-friendly contiguous RAM chunks, while linked structures utilize dispersed heap memory connected via pointers.'
      },
      {
        term: 'Recursion & Call Stack',
        definition: 'A function calling itself with a diminishing base case, storing activation records on the execution stack.'
      }
    ],
    lessons: [
      {
        id: 'cs-dsa-l1',
        title: 'Lesson 1: Asymptotic Analysis & Recursion Invariants',
        description: 'Mathematical proofs of time complexities, Master Theorem for recurrence relations, and tail recursion.',
        points: 30,
        portions: [
          {
            title: 'Part 1: The Formal Definition of Big-O, Big-Omega, and Big-Theta',
            content: 'We say f(n) = O(g(n)) if there exist positive constants c and n0 such that 0 <= f(n) <= c*g(n) for all n >= n0. Big-O provides a tight upper bound on worst-case execution time, allowing platform-independent algorithm comparisons.'
          },
          {
            title: 'Part 2: Master Theorem for Divide-and-Conquer Recurrences',
            content: 'For recurrences of the form T(n) = a*T(n/b) + f(n): if f(n) = O(n^(log_b(a) - ε)), then T(n) = Θ(n^(log_b(a))). This governs algorithms like Merge Sort (a=2, b=2, f(n)=n => Θ(n log n)) and Binary Search (a=1, b=2, f(n)=1 => Θ(log n)).'
          },
          {
            title: 'Part 3: Call Stack Frames & Recursion Trees',
            content: 'Every recursive invocation pushes a new stack frame containing local variables and return address. When unbounded or lacking a termination base case, it triggers stack overflow. Recursion tree visualization maps recursive branching factor.'
          }
        ]
      },
      {
        id: 'cs-dsa-l2',
        title: 'Lesson 2: Balanced Search Trees, AVL & Red-Black Rotations',
        description: 'Self-balancing binary trees maintaining O(log N) search, insertion, and deletion guarantees.',
        points: 35,
        portions: [
          {
            title: 'Part 1: Binary Search Tree Property & Degeneracy',
            content: 'In a BST, every node x satisfies: key(left_child) <= key(x) <= key(right_child). Without balancing, inserting sorted data degenerates the tree into a linked list with O(N) operations.'
          },
          {
            title: 'Part 2: AVL Tree Balance Factors & Tree Rotations',
            content: 'An AVL tree requires BalanceFactor = height(left) - height(right) ∈ {-1, 0, +1}. When balance is violated, we perform Single Left, Single Right, Left-Right, or Right-Left rotations in O(1) time to restore height balance.'
          },
          {
            title: 'Part 3: Red-Black Tree Invariants & Color Flipping',
            content: 'Red-black trees enforce 5 properties: root is black, leaves (NIL) are black, red nodes have black children, every path from root to NIL has equal black nodes. Used in C++ std::map and Java TreeMap.'
          }
        ]
      },
      {
        id: 'cs-dsa-l3',
        title: 'Lesson 3: Priority Queues, Binary Heaps & Heap Sort',
        description: 'Complete binary tree representations within arrays for O(1) top access and O(log N) modifications.',
        points: 35,
        portions: [
          {
            title: 'Part 1: Array Representation of Complete Binary Trees',
            content: 'For a 0-indexed array, for node at index i: Parent = floor((i-1)/2), Left Child = 2i + 1, Right Child = 2i + 2. This eliminates pointer overhead entirely.'
          },
          {
            title: 'Part 2: Heapify Up (Percolate Up) & Heapify Down (Sift Down)',
            content: 'When pushing an element, append to the end and sift up while parent is smaller (for Max Heap). When popping the root, replace with the last element and sift down with the maximum of its children in O(log N) time.'
          },
          {
            title: 'Part 3: Linear-Time Heap Construction (Floyd Algorithm)',
            content: 'Building a heap by sifting down from index (N/2)-1 down to 0 takes mathematical O(N) time because most nodes reside near the leaves with tiny sift depths.'
          }
        ]
      }
    ],
    practice: [
      {
        id: 'cs-dsa-p1',
        question: 'What is the tightest worst-case time complexity of building a binary heap from an unsorted array of size N using Floyd’s sift-down algorithm?',
        options: ['O(N log N)', 'O(N)', 'O(log N)', 'O(N²)'],
        correctIndex: 1,
        explanation: 'Floyd’s algorithm starts at the bottom-most parent nodes and sifts down. Summing (h / 2^h) yields a convergent geometric series that proves O(N) linear time construction.'
      },
      {
        id: 'cs-dsa-p2',
        question: 'In an AVL tree, what rotation sequence is required when a node’s balance factor is +2 and its left child has balance factor -1?',
        options: ['Single Left Rotation', 'Single Right Rotation', 'Left-Right Double Rotation', 'Right-Left Double Rotation'],
        correctIndex: 2,
        explanation: 'A left-heavy node (+2) whose left child is right-heavy (-1) forms a "dogleg" shape requiring a Left-Right double rotation.'
      }
    ],
    videos: [
      {
        id: 'cs-dsa-v1',
        title: 'MIT 6.006: Asymptotic Complexity & Binary Search Trees',
        duration: '48:15',
        videoUrl: 'https://www.youtube.com/embed/fNKuz4kg51g',
        points: 20
      },
      {
        id: 'cs-dsa-v2',
        title: 'Graph Traversal Algorithms: BFS, DFS and Shortest Paths',
        duration: '34:20',
        videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
        points: 20
      }
    ],
    tasks: [
      {
        id: 'cs-dsa-t1',
        title: 'Task: Implement Circular Queue with Ring Buffer',
        instructions: 'Design an integer circular queue using a fixed-size array without resizing, supporting enqueue, dequeue, front, and isEmpty operations in O(1) time.',
        points: 30,
        solutionHint: 'Maintain head, tail, and size variables with modulo arithmetic: tail = (tail + 1) % capacity.'
      }
    ],
    tests: [
      {
        id: 'cs-dsa-test1',
        title: 'Chapter Assessment: Trees, Graphs & Complexity Proofs',
        passingScore: 70,
        points: 60,
        questions: [
          {
            question: 'What is the recurrence relation for Merge Sort?',
            options: ['T(n) = T(n-1) + O(1)', 'T(n) = 2T(n/2) + O(n)', 'T(n) = 2T(n/2) + O(1)', 'T(n) = T(n/2) + O(n)'],
            correctIndex: 1
          },
          {
            question: 'Which graph algorithm can detect negative cycles?',
            options: ['Dijkstra with Min Heap', 'Breadth First Search', 'Bellman-Ford Algorithm', 'Kruskal Algorithm'],
            correctIndex: 2
          },
          {
            question: 'What is the space complexity of Breadth-First Search on a balanced tree with branching factor B and depth D?',
            options: ['O(D)', 'O(B * D)', 'O(B^D)', 'O(1)'],
            correctIndex: 2
          }
        ]
      }
    ],
    project: {
      id: 'cs-dsa-proj1',
      title: 'Capstone Project: High-Throughput In-Memory LRU Cache',
      description: 'Implement a thread-safe Least Recently Used (LRU) cache using a Doubly Linked List and Hash Map with O(1) get, put, and eviction operations.',
      points: 100
    }
  },

  // =========================================================================
  // 2. COMPUTER SCIENCE: PYTHON MASTERCLASS
  // =========================================================================
  {
    id: 'cs-python',
    title: 'Python Complete Engineering Masterclass',
    subject: 'Computer Science',
    category: 'Computer Science',
    level: 'Beginner to Advanced',
    badge: 'Popular',
    readTime: '35 hours comprehensive',
    recommendedBot: 'bytebot',
    shortDescription: 'From variables and control flow to decorators, generators, asyncio event loops, and package architecture.',
    introduction: {
      overview: 'Python is the world’s most versatile language for AI, web services, and scientific research. This A-to-Z course guides you through core syntax, object-oriented paradigms, meta-programming, and modern asynchronous concurrency.',
      prerequisites: ['None. Designed for beginners progressing to advanced developers.'],
      learningObjectives: [
        'Master Python data structures: lists, dicts, sets, tuples, and comprehensions',
        'Build robust classes with dunder methods, inheritance, and properties',
        'Implement closures, function decorators, and custom context managers',
        'Write non-blocking asynchronous network pipelines with asyncio and coroutines'
      ]
    },
    fundamentals: [
      {
        term: 'Duck Typing',
        definition: '"If it walks like a duck and quacks like a duck, it is a duck." Python inspects object capabilities rather than nominal types.'
      },
      {
        term: 'Global Interpreter Lock (GIL)',
        definition: 'A mutex protecting access to Python objects, preventing multiple native threads from executing Python bytecodes simultaneously.'
      },
      {
        term: 'List Comprehensions',
        definition: 'Syntactic construct for constructing new lists from existing iterables: [x**2 for x in items if x % 2 == 0].'
      }
    ],
    lessons: [
      {
        id: 'cs-py-l1',
        title: 'Lesson 1: Memory Model, References & Mutability',
        description: 'Understanding id(), reference counting, shallow vs deep copying, and mutable default parameter traps.',
        points: 30,
        portions: [
          {
            title: 'Part 1: Everything in Python is an Object',
            content: 'In Python, numbers, strings, functions, and classes are first-class heap objects. Variables are names bound to memory locations rather than typed memory slots.'
          },
          {
            title: 'Part 2: Mutable vs Immutable Objects',
            content: 'Integers, floats, strings, and tuples are immutable; their values cannot change after creation. Lists, dictionaries, and sets are mutable. Passing mutable objects to functions allows in-place modifications.'
          },
          {
            title: 'Part 3: The Perils of Mutable Default Arguments',
            content: 'Default arguments in def func(x=[]): are evaluated ONCE at function definition time, not at invocation time. All calls share the same list instance unless defaulted to None.'
          }
        ]
      },
      {
        id: 'cs-py-l2',
        title: 'Lesson 2: Advanced OOP, Dunder Methods & Descriptors',
        description: 'Operator overloading, __getitem__, __enter__/__exit__, and class properties.',
        points: 35,
        portions: [
          {
            title: 'Part 1: Magic / Dunder (Double Underscore) Methods',
            content: '__str__ controls human display, __repr__ controls unambiguous debugging representation, __len__ handles len(obj), and __getitem__ enables bracket indexing.'
          },
          {
            title: 'Part 2: The Context Manager Protocol',
            content: 'The with statement invokes __enter__ at entry and guarantees __exit__ is called even when exceptions arise, ensuring reliable file, lock, and socket closures.'
          },
          {
            title: 'Part 3: Descriptors and @property',
            content: 'Descriptors define __get__, __set__, and __delete__. The @property decorator is a descriptor providing clean getter/setter syntax with input validation.'
          }
        ]
      },
      {
        id: 'cs-py-l3',
        title: 'Lesson 3: Asyncio, Coroutines & Asynchronous Event Loops',
        description: 'Cooperative multitasking, async/await syntax, Task scheduling, and non-blocking I/O.',
        points: 40,
        portions: [
          {
            title: 'Part 1: Generators and yield vs async/await',
            content: 'Generators yield values and suspend execution state. Coroutines declared with async def return coroutine objects that can be awaited on an event loop.'
          },
          {
            title: 'Part 2: Event Loop Scheduling and asyncio.gather',
            content: 'The single-threaded event loop switches execution whenever an awaited I/O operation yields control, achieving thousands of concurrent connections.'
          },
          {
            title: 'Part 3: ThreadPoolExecutor Integration for CPU-Bound Tasks',
            content: 'Because the GIL prevents pure multi-core Python execution, CPU-bound workloads are offloaded to multiprocessing or loop.run_in_executor.'
          }
        ]
      }
    ],
    practice: [
      {
        id: 'cs-py-p1',
        question: 'What is the output of: a = [1, 2]; b = a; b.append(3); print(len(a))?',
        options: ['2', '3', 'Error', 'None'],
        correctIndex: 1,
        explanation: 'Both a and b reference the exact same mutable list object in memory, so appending to b mutates a.'
      },
      {
        id: 'cs-py-p2',
        question: 'Which method must be implemented to allow an object to be used inside a Python "with" statement?',
        options: ['__open__ and __close__', '__enter__ and __exit__', '__start__ and __stop__', '__init__ and __del__'],
        correctIndex: 1,
        explanation: 'The context manager protocol requires __enter__(self) and __exit__(self, exc_type, exc_val, exc_tb).'
      }
    ],
    videos: [
      {
        id: 'cs-py-v1',
        title: 'Core Python Concurrency: Asyncio Under the Hood',
        duration: '28:10',
        videoUrl: 'https://www.youtube.com/embed/bZ6h_4A8x7Q',
        points: 20
      }
    ],
    tasks: [
      {
        id: 'cs-py-t1',
        title: 'Task: Build a Custom @rate_limit Decorator',
        instructions: 'Write a Python decorator that limits a function to at most N calls per second using time.time() and raising a custom RateLimitException if exceeded.',
        points: 30,
        solutionHint: 'Use functools.wraps and maintain a deque or list of timestamps within the closure.'
      }
    ],
    tests: [
      {
        id: 'cs-py-test1',
        title: 'Python Engineering Certification Exam',
        passingScore: 70,
        points: 60,
        questions: [
          {
            question: 'What does the Global Interpreter Lock (GIL) primarily restrict in CPython?',
            options: ['Network bandwidth', 'Multiple native OS threads running Python bytecode simultaneously', 'File reading permissions', 'Memory allocation over 4GB'],
            correctIndex: 1
          },
          {
            question: 'How do you create a generator function in Python?',
            options: ['Using return inside a loop', 'Using the yield keyword', 'Decorating with @generator', 'Subclassing Generator'],
            correctIndex: 1
          }
        ]
      }
    ],
    project: {
      id: 'cs-py-proj1',
      title: 'Capstone Project: Asynchronous Web Scraper & Data Pipeline',
      description: 'Build a production-grade asynchronous web crawler using aiohttp and asyncio that gathers real-time articles, parses HTML, and writes JSON feeds with concurrency throttling.',
      points: 100
    }
  },

  // =========================================================================
  // 3. MATHEMATICS: MULTIVARIABLE CALCULUS & VECTOR FIELDS
  // =========================================================================
  {
    id: 'math-calculus',
    title: 'Multivariable Calculus & Vector Fields',
    subject: 'Mathematics',
    category: 'Mathematics',
    level: 'Intermediate to Advanced',
    badge: 'Rigorous Math',
    readTime: '30 hours comprehensive',
    recommendedBot: 'aether',
    shortDescription: 'Partial derivatives, gradient vectors, double/triple integrals, Green’s Theorem, Divergence, and Stokes’ Theorem.',
    introduction: {
      overview: 'Multivariable calculus extends single-variable concepts into n-dimensional Euclidean space. Essential for physics, machine learning optimization, and computer graphics, this course builds rigorous geometrical intuition and analytical proofs.',
      prerequisites: ['Single-variable differentiation and integration', 'Basic 3D vector dot/cross products'],
      learningObjectives: [
        'Compute gradients, directional derivatives, and tangent hyperplanes',
        'Evaluate double and triple integrals using Cartesian, polar, and cylindrical coordinates',
        'Calculate curl and divergence of vector fields',
        'Apply Green’s Theorem, Stokes’ Theorem, and Gauss’s Divergence Theorem'
      ]
    },
    fundamentals: [
      {
        term: 'Gradient (∇f)',
        definition: 'Vector of all partial derivatives pointing in the direction of steepest ascent of the scalar function.'
      },
      {
        term: 'Divergence (∇ · F)',
        definition: 'Scalar measure of a vector field’s source or sink rate at a given point.'
      },
      {
        term: 'Curl (∇ × F)',
        definition: 'Vector describing the infinitesimal rotation and angular velocity of a 3D vector field.'
      }
    ],
    lessons: [
      {
        id: 'math-calc-l1',
        title: 'Lesson 1: Directional Derivatives & Tangent Planes',
        description: 'Deriving the gradient operator, normal vectors to level surfaces, and linear approximations.',
        points: 30,
        portions: [
          {
            title: 'Part 1: The Directional Derivative Operator',
            content: 'The rate of change of f(x,y) in the direction of unit vector u = <u1, u2> is given by Du f = ∇f · u = |∇f| cos(θ). It achieves its maximum value |∇f| when u aligns with ∇f.'
          },
          {
            title: 'Part 2: Tangent Plane Equation to Level Surfaces',
            content: 'For a surface defined implicitly by F(x, y, z) = C, the gradient ∇F(x0, y0, z0) is orthogonal to the surface at (x0, y0, z0). The tangent plane is: F_x(x - x0) + F_y(y - y0) + F_z(z - z0) = 0.'
          }
        ]
      },
      {
        id: 'math-calc-l2',
        title: 'Lesson 2: Green’s Theorem in the Plane',
        description: 'Connecting line integrals around closed curves to double integrals over enclosed planar domains.',
        points: 35,
        portions: [
          {
            title: 'Part 1: Circulation and Flux Forms',
            content: '∮_C (L dx + M dy) = ∬_D ((∂M/∂x) - (∂L/∂y)) dA. Green’s Theorem states that the macroscopic circulation around the boundary curve C equals the sum of microscopic curls over domain D.'
          },
          {
            title: 'Part 2: Calculating Planar Area via Line Integrals',
            content: 'Setting (∂M/∂x) - (∂L/∂y) = 1, Area(D) = ∮_C x dy = -∮_C y dx = (1/2) ∮_C (x dy - y dx), forming the basis for mechanical planimeters.'
          }
        ]
      }
    ],
    practice: [
      {
        id: 'math-calc-p1',
        question: 'If a vector field F has curl(F) = 0 everywhere in a simply-connected domain, what can be concluded about line integrals of F?',
        options: ['They are always equal to 1', 'They are path-independent and F is conservative', 'They cannot be evaluated', 'They must equal infinity'],
        correctIndex: 1,
        explanation: 'A curl-free (irrotational) field on a simply connected domain is conservative, meaning F = ∇f and line integrals depend only on endpoints.'
      }
    ],
    videos: [
      {
        id: 'math-calc-v1',
        title: 'Visualizing Green’s Theorem & Stokes’ Curl Invariants',
        duration: '14:26',
        videoUrl: 'https://www.youtube.com/embed/IHZwWFHWa-w',
        points: 20
      }
    ],
    tasks: [
      {
        id: 'math-calc-t1',
        title: 'Task: Evaluate Closed Contour Circulation with Green’s Theorem',
        instructions: 'Calculate ∮_C (y³ dx - x³ dy) where C is the unit circle oriented counterclockwise by transforming to polar coordinates.',
        points: 30,
        solutionHint: '∂M/∂x - ∂L/∂y = -3x² - 3y² = -3r². Integrate over r from 0 to 1 and θ from 0 to 2π.'
      }
    ],
    tests: [
      {
        id: 'math-calc-test1',
        title: 'Vector Calculus Comprehensive Exam',
        passingScore: 70,
        points: 60,
        questions: [
          {
            question: 'What is div(curl(F)) for any twice continuously differentiable vector field F?',
            options: ['Always 0', 'Always 1', 'Equal to grad(F)', 'Cannot be determined'],
            correctIndex: 0
          },
          {
            question: 'Which coordinate transformation satisfies dA = r dr dθ?',
            options: ['Spherical coordinates', 'Polar coordinates', 'Cartesian coordinates', 'Hyperbolic coordinates'],
            correctIndex: 1
          }
        ]
      }
    ],
    project: {
      id: 'math-calc-proj1',
      title: 'Capstone Project: Numerical Vector Field Simulator in Python',
      description: 'Write a Python script using NumPy and Matplotlib that plots 2D vector fields, computes numerical curl and divergence heatmaps, and verifies Green’s Theorem.',
      points: 100
    }
  },

  // =========================================================================
  // 4. PHYSICS: ELECTROMAGNETISM & MAXWELL'S EQUATIONS
  // =========================================================================
  {
    id: 'phys-maxwell',
    title: 'Electromagnetism & Maxwell’s Unified Field Theory',
    subject: 'Physics',
    category: 'Physics',
    level: 'Intermediate to Advanced',
    badge: 'Physics Core',
    readTime: '28 hours comprehensive',
    recommendedBot: 'aether',
    shortDescription: 'Electrostatics, Gauss’s Law, Magnetostatics, Ampere-Maxwell Law, Faraday Induction, and Light Propagation.',
    introduction: {
      overview: 'Classical electrodynamics unifies electricity, magnetism, and light through James Clerk Maxwell’s four fundamental equations. Learn the mathematical formulation and physical insights behind electromagnetic waves.',
      prerequisites: ['Vector calculus (div, curl, gradient)', 'Basic Newtonian physics'],
      learningObjectives: [
        'Formulate Gauss’s Law for electricity and magnetism in differential and integral forms',
        'Analyze electromagnetic induction and Faraday’s Law',
        'Derive the wave equation for light propagating in vacuum',
        'Calculate Poynting vector energy density transfer'
      ]
    },
    fundamentals: [
      {
        term: 'Electric Permittivity (ε0)',
        definition: 'Physical constant representing vacuum capability to permit electric field lines: ~8.854 × 10^-12 F/m.'
      },
      {
        term: 'Magnetic Permeability (μ0)',
        definition: 'Physical constant representing vacuum magnetic field resistance: 4π × 10^-7 H/m.'
      },
      {
        term: 'Displacement Current',
        definition: 'Maxwell’s correction term (ε0 ∂E/∂t) in Ampere’s Law accounting for changing electric fields producing magnetic fields.'
      }
    ],
    lessons: [
      {
        id: 'phys-em-l1',
        title: 'Lesson 1: The Four Maxwell Equations in Differential Form',
        description: 'Gauss’s Law, Gauss’s Magnetism Law, Faraday’s Law, and Ampere-Maxwell Law.',
        points: 30,
        portions: [
          {
            title: 'Part 1: ∇ · E = ρ / ε0 and ∇ · B = 0',
            content: 'Gauss’s Law states divergence of E is proportional to charge density ρ. ∇ · B = 0 asserts the non-existence of isolated magnetic monopoles; magnetic field lines are always closed loops.'
          },
          {
            title: 'Part 2: ∇ × E = -∂B/∂t and ∇ × B = μ0 J + μ0 ε0 (∂E/∂t)',
            content: 'A time-varying magnetic field induces an electric curl (Faraday). Symmetrically, electric currents and time-varying electric fields induce magnetic fields (Ampere-Maxwell).'
          }
        ]
      }
    ],
    practice: [
      {
        id: 'phys-em-p1',
        question: 'What is the speed of electromagnetic waves in vacuum expressed in terms of fundamental constants?',
        options: ['c = ε0 * μ0', 'c = 1 / sqrt(ε0 * μ0)', 'c = sqrt(ε0 / μ0)', 'c = μ0 / ε0'],
        correctIndex: 1,
        explanation: 'Substituting Maxwell’s vacuum wave equation yields the wave propagation speed c = 1 / √(ε0 * μ0) ≈ 3 × 10^8 m/s.'
      }
    ],
    videos: [
      {
        id: 'phys-em-v1',
        title: 'Maxwell’s Equations: Geometric Intuition & Wave Solutions',
        duration: '19:13',
        videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
        points: 20
      }
    ],
    tasks: [
      {
        id: 'phys-em-t1',
        title: 'Task: Derive Vacuum Electromagnetic Wave Equation',
        instructions: 'Take the curl of both sides of Faraday’s Law (∇ × E = -∂B/∂t) and apply the vector identity ∇ × (∇ × E) = ∇(∇ · E) - ∇²E in free space (ρ=0, J=0).',
        points: 30,
        solutionHint: 'Since ∇ · E = 0 in vacuum, -∇²E = -∂(∇ × B)/∂t = -μ0 ε0 (∂²E/∂t²).'
      }
    ],
    tests: [
      {
        id: 'phys-em-test1',
        title: 'Electrodynamics Comprehensive Assessment',
        passingScore: 70,
        points: 60,
        questions: [
          {
            question: 'What does the Poynting vector S = (1/μ0) (E × B) represent?',
            options: ['Charge density', 'Electromagnetic energy flux per unit area', 'Electron drift velocity', 'Magnetic vector potential'],
            correctIndex: 1
          }
        ]
      }
    ],
    project: {
      id: 'phys-em-proj1',
      title: 'Capstone Project: Finite-Difference Time-Domain (FDTD) Wave Solver',
      description: 'Implement a 1D FDTD electromagnetic wave simulation solving Yee’s grid for transverse electric and magnetic fields propagating across a dielectric boundary.',
      points: 100
    }
  },

  // =========================================================================
  // 5. ELECTRICAL / ELECTRONICS: DIGITAL ELECTRONICS & LOGIC DESIGN
  // =========================================================================
  {
    id: 'ee-digital',
    title: 'Digital Electronics & Computer Architecture Logic',
    subject: 'Electrical / Electronics',
    category: 'Electrical / Electronics',
    level: 'Beginner to Intermediate',
    badge: 'Hardware & Systems',
    readTime: '26 hours comprehensive',
    recommendedBot: 'sparkx',
    shortDescription: 'Boolean algebra, logic gates, Karnaugh Maps, flip-flops, finite state machines, ALUs, and multiplexers.',
    introduction: {
      overview: 'Digital electronics bridges physical semiconductors and computing architecture. Learn how transistors construct logic gates, how gates combine into arithmetic logic units (ALUs), and how sequential circuits form memory registers.',
      prerequisites: ['Basic high-school physics / circuit concepts'],
      learningObjectives: [
        'Minimize combinational Boolean logic equations using Karnaugh Maps and Quine-McCluskey',
        'Design multiplexers, demultiplexers, decoders, and full adders',
        'Analyze sequential circuits: SR, D, JK, and T flip-flops with setup/hold timing',
        'Synthesize Mealy and Moore Finite State Machines (FSMs)'
      ]
    },
    fundamentals: [
      {
        term: 'Boolean Algebra',
        definition: 'Mathematical system of logic where variables take truth values 1 (True) or 0 (False) under AND (·), OR (+), and NOT (¯).'
      },
      {
        term: 'Setup & Hold Time',
        definition: 'Setup time is the minimum time data must be stable before the clock edge; hold time is the minimum time data must remain stable after.'
      }
    ],
    lessons: [
      {
        id: 'ee-dig-l1',
        title: 'Lesson 1: Karnaugh Map Minimization & Combinational Logic',
        description: 'Gray-code 2D grids, grouping 2^k adjacent cells, and eliminating hazards.',
        points: 30,
        portions: [
          {
            title: 'Part 1: The Karnaugh Map Principle',
            content: 'K-Maps arrange minterms in Gray-code sequence where adjacent cells differ by exactly 1 bit. Grouping powers of 2 (1, 2, 4, 8, 16) eliminates variables that change between adjacent cells.'
          }
        ]
      }
    ],
    practice: [
      {
        id: 'ee-dig-p1',
        question: 'How many select lines are required for an 8-to-1 Multiplexer?',
        options: ['2', '3', '4', '8'],
        correctIndex: 1,
        explanation: 'A 2^N to 1 multiplexer requires N select lines. For 8 inputs, 2^3 = 8, so 3 select lines are needed.'
      }
    ],
    videos: [
      {
        id: 'ee-dig-v1',
        title: 'Digital Logic: Building an 8-Bit ALU from Scratch',
        duration: '22:45',
        videoUrl: 'https://www.youtube.com/embed/bZ6h_4A8x7Q',
        points: 20
      }
    ],
    tasks: [
      {
        id: 'ee-dig-t1',
        title: 'Task: Design a 4-Bit Ripple Carry Adder',
        instructions: 'Connect 4 Full Adders cascading carry-out to carry-in (C_in -> C_out) to sum two 4-bit numbers A[3:0] and B[3:0].',
        points: 30,
        solutionHint: 'Sum = A ⊕ B ⊕ Cin; Cout = (A · B) + (Cin · (A ⊕ B)).'
      }
    ],
    tests: [
      {
        id: 'ee-dig-test1',
        title: 'Digital Systems Logic Examination',
        passingScore: 70,
        points: 60,
        questions: [
          {
            question: 'Which flip-flop toggles its state when both inputs are HIGH?',
            options: ['SR Flip-Flop', 'D Flip-Flop', 'JK Flip-Flop', 'Latch'],
            correctIndex: 2
          }
        ]
      }
    ],
    project: {
      id: 'ee-dig-proj1',
      title: 'Capstone Project: 4-Bit ALU & Register File in Logisim / Verilog',
      description: 'Design and simulate an Arithmetic Logic Unit capable of Addition, Subtraction, Bitwise AND, OR, and Shift operations coupled to a dual-read register bank.',
      points: 100
    }
  },

  // =========================================================================
  // 6. SCIENCE & TECH: QUANTUM COMPUTING & EMERGING TECHNOLOGIES
  // =========================================================================
  {
    id: 'sci-quantum',
    title: 'Quantum Computing & Emerging Information Tech',
    subject: 'Science & Technology',
    category: 'Science & Technology',
    level: 'Intermediate to Advanced',
    badge: 'Frontier Tech',
    readTime: '24 hours comprehensive',
    recommendedBot: 'aether',
    shortDescription: 'Qubits, Bloch sphere, superposition, quantum gates, entanglement, and Grover & Shor algorithms.',
    introduction: {
      overview: 'Quantum information science leverages quantum mechanical phenomena to solve computationally intractable problems. This course covers qubit states, unitary quantum gates, and quantum supremacy algorithms.',
      prerequisites: ['Linear algebra (matrices, eigenvalues, complex vector spaces)'],
      learningObjectives: [
        'Represent single-qubit states on the Bloch sphere using bra-ket Dirac notation',
        'Construct quantum circuits with Hadamard, Pauli-X/Y/Z, Phase, and CNOT gates',
        'Analyze Bell state quantum entanglement and no-cloning theorem',
        'Understand Grover’s quantum database search and quantum phase estimation'
      ]
    },
    fundamentals: [
      {
        term: 'Qubit',
        definition: 'Two-state quantum mechanical system: |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1.'
      },
      {
        term: 'Entanglement',
        definition: 'Non-separable quantum states where measurement on one qubit instantaneously dictates the state of another.'
      }
    ],
    lessons: [
      {
        id: 'sci-qc-l1',
        title: 'Lesson 1: The Qubit, Superposition & Bloch Sphere',
        description: 'Dirac notation, measurement postulates, and single-qubit rotations.',
        points: 30,
        portions: [
          {
            title: 'Part 1: Superposition and State Vectors',
            content: 'Unlike a classical bit that is strictly 0 or 1, a qubit exists in a linear combination of basis states until measured, collapsing according to Born’s rule.'
          }
        ]
      }
    ],
    practice: [
      {
        id: 'sci-qc-p1',
        question: 'What is the action of a Hadamard gate H on basis state |0⟩?',
        options: ['|1⟩', '(|0⟩ + |1⟩) / √2', '(|0⟩ - |1⟩) / √2', '0'],
        correctIndex: 1,
        explanation: 'The Hadamard gate creates an equal superposition state: H|0⟩ = (|0⟩ + |1⟩) / √2 = |+⟩.'
      }
    ],
    videos: [
      {
        id: 'sci-qc-v1',
        title: 'Visualizing Quantum Computing & Superposition',
        duration: '25:30',
        videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
        points: 20
      }
    ],
    tasks: [
      {
        id: 'sci-qc-t1',
        title: 'Task: Create a Bell Entangled State (|Φ+⟩)',
        instructions: 'Specify the sequence of two quantum gates starting from initial state |00⟩ that generates (|00⟩ + |11⟩)/√2.',
        points: 30,
        solutionHint: 'Apply a Hadamard gate to qubit 0, followed by a CNOT gate with control=0 and target=1.'
      }
    ],
    tests: [
      {
        id: 'sci-qc-test1',
        title: 'Quantum Information Science Assessment',
        passingScore: 70,
        points: 60,
        questions: [
          {
            question: 'What does the No-Cloning Theorem state in quantum mechanics?',
            options: ['Qubits cannot be destroyed', 'An unknown arbitrary quantum state cannot be cloned identically', 'Quantum computers cannot exceed 100 qubits', 'Gates must be irreversible'],
            correctIndex: 1
          }
        ]
      }
    ],
    project: {
      id: 'sci-qc-proj1',
      title: 'Capstone Project: Quantum Teleportation Protocol in Qiskit',
      description: 'Write a Python program utilizing Qiskit to simulate quantum teleportation of an arbitrary unknown single-qubit state across an entangled Bell pair.',
      points: 100
    }
  },

  // =========================================================================
  // 7. RESEARCH & KNOWLEDGE: METHODOLOGY & TECHNICAL SCHOLARSHIP
  // =========================================================================
  {
    id: 'res-methodology',
    title: 'Research Methodology & Academic Scholarship',
    subject: 'Research & Knowledge',
    category: 'Research & Knowledge',
    level: 'Beginner to Advanced',
    badge: 'Scholar Core',
    readTime: '20 hours comprehensive',
    recommendedBot: 'scholar',
    shortDescription: 'Literature review strategies, hypothesis formulation, experimental design, peer-review reading, and technical writing.',
    introduction: {
      overview: 'Academic research empowers scholars to critically interrogate existing scientific literature, design reproducible experiments, and communicate technical discoveries clearly.',
      prerequisites: ['Curiosity and critical inquiry mindset'],
      learningObjectives: [
        'Conduct systematic peer-reviewed literature reviews across arXiv, IEEE, and ACM',
        'Formulate null and alternative statistical hypotheses with significance criteria',
        'Critically evaluate methodology validity and threat vectors',
        'Draft technical research papers adhering to publication standards'
      ]
    },
    fundamentals: [
      {
        term: 'Peer Review',
        definition: 'Evaluation of scientific work by one or more experts in the same field before publication to maintain rigor.'
      },
      {
        term: 'Null Hypothesis (H0)',
        definition: 'A default statistical premise stating there is no relationship or effect between variables.'
      }
    ],
    lessons: [
      {
        id: 'res-meth-l1',
        title: 'Lesson 1: Reading Scientific Papers Efficiently',
        description: 'The 3-pass reading method, identifying novelty, and analyzing experimental limitations.',
        points: 30,
        portions: [
          {
            title: 'Part 1: The Three-Pass Approach (Keshav Method)',
            content: 'Pass 1: Read title, abstract, and section headings (5-10 min). Pass 2: Grasp content, figures, and results without detailed math (1 hour). Pass 3: Deep re-implementation dive to verify proofs and experimental assumptions.'
          }
        ]
      }
    ],
    practice: [
      {
        id: 'res-meth-p1',
        question: 'What is the primary function of a p-value in hypothesis testing?',
        options: ['The probability that the alternate hypothesis is true', 'The probability of observing data at least as extreme as collected, assuming the null hypothesis is true', 'The percentage of errors in the paper', 'The statistical power'],
        correctIndex: 1,
        explanation: 'A p-value measures evidence against the null hypothesis; p < 0.05 indicates statistical significance under standard conventions.'
      }
    ],
    videos: [
      {
        id: 'res-meth-v1',
        title: 'How to Read and Critique a Computer Science Research Paper',
        duration: '20:15',
        videoUrl: 'https://www.youtube.com/embed/fNKuz4kg51g',
        points: 20
      }
    ],
    tasks: [
      {
        id: 'res-meth-t1',
        title: 'Task: Draft an Abstract for an Engineering Experiment',
        instructions: 'Write a concise 200-word academic abstract containing context, problem statement, approach, key findings, and conclusion.',
        points: 30,
        solutionHint: 'Follow the 5-sentence formula: Motivation -> Problem -> Approach -> Result -> Impact.'
      }
    ],
    tests: [
      {
        id: 'res-meth-test1',
        title: 'Research Methodology Certification',
        passingScore: 70,
        points: 60,
        questions: [
          {
            question: 'What constitutes scientific reproducibility?',
            options: ['Writing code in Python', 'An independent research team obtaining identical results using the original author’s artifacts', 'Getting high citation counts', 'Publishing in open access journals'],
            correctIndex: 1
          }
        ]
      }
    ],
    project: {
      id: 'res-meth-proj1',
      title: 'Capstone Project: Comprehensive Systematic Literature Review Paper',
      description: 'Produce a 5-page survey paper on modern Transformer Attention mechanisms synthesizing at least 10 seminal peer-reviewed papers.',
      points: 100
    }
  }
];

// Helper to find course by ID
export const getCourseById = (courseId) => {
  return COURSES.find(c => c.id === courseId) || null;
};

// Calculate total required activities for a course
export const getCourseActivityCount = (course) => {
  if (!course) return 0;
  const lessonsCount = course.lessons?.length || 0;
  const videosCount = course.videos?.length || 0;
  const tasksCount = course.tasks?.length || 0;
  const testsCount = course.tests?.length || 0;
  const projectCount = course.project ? 1 : 0;
  return lessonsCount + videosCount + tasksCount + testsCount + projectCount;
};
