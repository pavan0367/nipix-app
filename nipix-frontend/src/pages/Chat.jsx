import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Search,
  ArrowLeft,
  Send,
  Shield,
  Lock,
  Smile,
  Paperclip,
  RotateCcw,
  AlertCircle,
  MoreHorizontal,
  Info,
  Palette,
  Trash2,
  X
} from 'lucide-react';
import { sendAiChatMessageStream } from '../services/aiService';
import MarkdownMessage from '../components/chat/MarkdownMessage';
import BotProfileDashboard from '../components/chat/BotProfileDashboard';
import NipixLogo from '../components/NipixLogo';

// Format current local system/browser time dynamically (e.g. 3:48 PM, 10:12 AM)
export const getCurrentSystemTime = () => {
  try {
    return new Date().toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    const d = new Date();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  }
};

// Centralized Bot Chat Theme Configurations
export const CHAT_THEMES = {
  cyber: {
    id: 'cyber',
    name: 'Cyber Indigo (Default)',
    color: '#3b82f6',
    bg: '#0b0f19',
    headerBg: '#0f1422',
    composerBg: '#0f1422',
    userBubble: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    aiBubble: '#161d2f',
    borderColor: 'rgba(59, 130, 246, 0.2)',
    accent: '#3b82f6'
  },
  neon: {
    id: 'neon',
    name: 'Midnight Violet',
    color: '#8b5cf6',
    bg: '#0c0919',
    headerBg: '#130e26',
    composerBg: '#130e26',
    userBubble: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    aiBubble: '#1a1334',
    borderColor: 'rgba(139, 92, 246, 0.25)',
    accent: '#8b5cf6'
  },
  emerald: {
    id: 'emerald',
    name: 'Scholar Emerald',
    color: '#10b981',
    bg: '#061610',
    headerBg: '#0b2118',
    composerBg: '#0b2118',
    userBubble: 'linear-gradient(135deg, #10b981, #047857)',
    aiBubble: '#0f2c20',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    accent: '#10b981'
  },
  amber: {
    id: 'amber',
    name: 'Solar Circuit',
    color: '#f59e0b',
    bg: '#140f06',
    headerBg: '#1f170a',
    composerBg: '#1f170a',
    userBubble: 'linear-gradient(135deg, #f59e0b, #b45309)',
    aiBubble: '#291f0e',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    accent: '#f59e0b'
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Minimal',
    color: '#94a3b8',
    bg: '#08090c',
    headerBg: '#101217',
    composerBg: '#101217',
    userBubble: 'linear-gradient(135deg, #475569, #334155)',
    aiBubble: '#181b22',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    accent: '#94a3b8'
  },
  sakura: {
    id: 'sakura',
    name: 'Sakura Blossom',
    color: '#ec4899',
    bg: '#160b14',
    headerBg: '#21101e',
    composerBg: '#21101e',
    userBubble: 'linear-gradient(135deg, #ec4899, #be185d)',
    aiBubble: '#2b1627',
    borderColor: 'rgba(236, 72, 153, 0.25)',
    accent: '#ec4899'
  }
};

// Generate a bot-specific personalized welcome message with live system time
export const createBotWelcomeMessage = (bot) => ({
  id: `${bot.id}-intro-${Date.now()}`,
  sender: bot.name,
  isUser: false,
  text: bot.introText,
  time: getCurrentSystemTime()
});

// Helper to identify error messages that should not be saved or previewed
const isErrorMessage = (text) => {
  if (!text || typeof text !== 'string') return true;
  const lower = text.toLowerCase();
  return (
    lower.includes("couldn't get a response") ||
    lower.includes("trouble connecting right now") ||
    lower.includes("temporarily unavailable") ||
    lower.includes("not configured") ||
    lower.includes("no ai api key")
  );
};

// Helper to detect legacy static intro messages for automatic upgrade
const isOldIntroMessage = (text) => {
  if (!text || typeof text !== 'string') return false;
  return (
    text.startsWith("Hello developer! 👋 I am ByteBot AI") ||
    text.startsWith("Greetings! I am Cipher_09") ||
    text.startsWith("Frequency locked! I am Spark_X") ||
    text.startsWith("Welcome scholar. I am Archivist") ||
    text.startsWith("Greetings! I am NovaMind") ||
    text.startsWith("Hello visionary! I am Aether") ||
    text.startsWith("Konnichiwa! 🌸 I am Sakura (@sakura_jp)")
  );
};

// All 7 Nipix AI Bot Personas with personalized intro greetings and domain specialties
export const AI_BOTS = [
  {
    id: 'bytebot_ai',
    name: 'ByteBot AI',
    username: '@bytebot_ai',
    role: 'Programming & Software Engineering',
    avatar: '🤖',
    badgeClass: 'badge-bytebot',
    accentColor: '#3b82f6',
    specialty: 'Programming, Software Engineering & Code Intelligence',
    description: 'Advanced software engineering assistant specialized in full-stack web development, system architecture, algorithm optimization, and debugging.',
    specialtiesList: [
      'Full-Stack Development',
      'Python & JavaScript',
      'React & Modern Frontend',
      'Node.js & Backend APIs',
      'Algorithms & Data Structures',
      'Debugging & Code Review',
      'System Architecture',
      'Database Design & SQL'
    ],
    introText: "Hello! I'm ByteBot AI, your Programming & Software Engineering assistant. What would you like me to help you with today?",
    previewText: "Hello! I'm ByteBot AI, your Programming & Software Engineering assistant.",
    ageText: 'Just now',
    lastTime: '08:42 AM'
  },
  {
    id: 'cipher_09',
    name: 'Cipher_09',
    username: '@cipher_09',
    role: 'Research, Cryptography & Cybersecurity',
    avatar: '🔮',
    badgeClass: 'badge-cipher',
    accentColor: '#8b5cf6',
    specialty: 'Research, Cryptography, Security & Logic',
    description: 'Elite cryptography and cybersecurity research intelligence specialized in secure computation, vulnerability assessments, and discrete mathematical logic.',
    specialtiesList: [
      'Cryptography & Ciphers',
      'Cybersecurity Protocols',
      'Network Security',
      'Vulnerability Assessment',
      'Discrete Mathematics',
      'Security Audits',
      'Logic & Formal Proofs',
      'Data Privacy & Encryption'
    ],
    introText: "Hello! I'm Cipher_09, your Research, Cryptography & Cybersecurity assistant. What would you like me to help you with today?",
    previewText: "Hello! I'm Cipher_09, your Research, Cryptography & Cybersecurity assistant.",
    ageText: '12 min ago',
    lastTime: '03:14 AM'
  },
  {
    id: 'spark_x',
    name: 'Spark_X',
    username: '@spark_x',
    role: 'Electrical Engineering, Physics & Circuit Theory',
    avatar: '⚡',
    badgeClass: 'badge-spark',
    accentColor: '#f59e0b',
    specialty: 'Electrical Engineering, Electronics, Circuits & Physics',
    description: 'High-energy electrical engineering and physics assistant focused on circuit analysis, electromagnetism, semiconductor physics, and hardware design.',
    specialtiesList: [
      'Circuit Theory & Analysis',
      'Electronics & Semiconductors',
      'Electromagnetism & Waves',
      'Classical & Quantum Physics',
      'Microcontrollers & Embedded',
      'Signal Processing',
      'Power Systems',
      'Robotics Hardware'
    ],
    introText: "Hello! I'm Spark_X, your Electrical Engineering, Physics & Circuit Theory assistant. What would you like me to help you with today?",
    previewText: "Hello! I'm Spark_X, your Electrical Engineering, Physics & Circuit Theory assistant.",
    ageText: '25 min ago',
    lastTime: '10:15 AM'
  },
  {
    id: 'archivist',
    name: 'Archivist',
    username: '@archivist',
    role: 'Study, Knowledge & Research',
    avatar: '📚',
    badgeClass: 'badge-mentor',
    accentColor: '#10b981',
    specialty: 'Study Materials, History, Literature & General Knowledge',
    description: 'Comprehensive academic research and study materials librarian covering historical analysis, literature, philosophy, and scholarly writing.',
    specialtiesList: [
      'Academic Research',
      'Study Materials & Notes',
      'World History & Civilizations',
      'Literature & Linguistics',
      'Philosophy & Ethics',
      'Scientific Citations',
      'Exam Preparation',
      'Essay Writing & Structure'
    ],
    introText: "Hello! I'm Archivist, your Study, Knowledge & Research assistant. What would you like me to help you with today?",
    previewText: "Hello! I'm Archivist, your Study, Knowledge & Research assistant.",
    ageText: '1 hr ago',
    lastTime: '11:30 AM'
  },
  {
    id: 'novamind',
    name: 'NovaMind',
    username: '@novamind',
    role: 'General AI / Learning Assistant',
    avatar: '🧠',
    badgeClass: 'badge-cipher',
    accentColor: '#ec4899',
    specialty: 'General Learning, Educational Guidance & Logical Reasoning',
    description: 'Versatile multidisciplinary learning companion offering intuitive breakdowns of complex concepts, reasoning methodologies, and educational tutoring.',
    specialtiesList: [
      'Mathematical Foundations',
      'Multidisciplinary Learning',
      'Conceptual Analogies',
      'Step-by-Step Problem Solving',
      'Cognitive Learning Techniques',
      'Critical Thinking',
      'General Sciences',
      'Study Roadmaps'
    ],
    introText: "Hello! I'm NovaMind, your General AI & Learning assistant. What would you like me to help you with today?",
    previewText: "Hello! I'm NovaMind, your General AI & Learning assistant.",
    ageText: '15 min ago',
    lastTime: '01:05 PM'
  },
  {
    id: 'aether',
    name: 'Aether',
    username: '@aether',
    role: 'Science / Innovation / Technology',
    avatar: '🌌',
    badgeClass: 'badge-spark',
    accentColor: '#06b6d4',
    specialty: 'Science, Innovation, Emerging Tech & Future Engineering',
    description: 'Visionary frontier science and emerging technology assistant exploring deep tech, space exploration, nanotechnology, and future engineering breakthroughs.',
    specialtiesList: [
      'Frontier & Emerging Tech',
      'Astrophysics & Space Exploration',
      'Nanotechnology & Materials',
      'Artificial Intelligence & Robotics',
      'Biotechnology & Genetics',
      'Quantum Computing',
      'Renewable Energy Innovation',
      'Futurism & Deep Tech'
    ],
    introText: "Hello! I'm Aether, your Science, Innovation & Technology assistant. What would you like me to help you with today?",
    previewText: "Hello! I'm Aether, your Science, Innovation & Technology assistant.",
    ageText: '5 min ago',
    lastTime: '02:20 PM'
  },
  {
    id: 'sakura',
    name: 'Sakura',
    username: '@sakura_jp',
    role: 'Japanese Language & JLPT',
    avatar: '🌸',
    badgeClass: 'badge-cipher',
    accentColor: '#ec4899',
    specialty: 'Japanese Grammar, Vocabulary, Kanji, Hiragana, Katakana, JLPT & Translation',
    description: 'Dedicated Japanese language sensei and JLPT mentor specialized in grammar, vocabulary, Kanji, reading comprehension, and conversational fluency.',
    specialtiesList: [
      'Japanese Grammar',
      'Vocabulary & Expressions',
      'Kanji Mastery',
      'Hiragana & Katakana',
      'JLPT N5 to N1 Preparation',
      'Keigo & Formal Japanese',
      'Accurate Translation',
      'Conversational Fluency'
    ],
    introText: "Hello! 🌸 I'm Sakura, your Japanese Language & JLPT assistant. What would you like me to help you with today?",
    previewText: "Hello! 🌸 I'm Sakura, your Japanese Language & JLPT assistant.",
    ageText: 'Just now',
    lastTime: '12:00 PM'
  }
];

// Encrypted Hidden Vault Transmissions (Strictly Authenticated)
const HIDDEN_VAULT_MESSAGES = [
  {
    id: 'v-1',
    sender: 'Lead Researcher (Dr. K. Vance)',
    role: 'Quantum Architect',
    time: '11:45 AM',
    text: 'Decrypted Channel Active: The topological qubit test benchmarks have matched theoretical parity. Access token for Shard 4 is 0x7F4A92B.',
    isPrivate: true
  },
  {
    id: 'v-2',
    sender: 'Cipher_09',
    role: 'Security Fellow',
    time: '12:10 PM',
    text: 'Verified: Multi-agent consensus protocol verified for distributed study graph. All private transcripts are locked to authenticated keys.',
    isPrivate: true
  }
];

const Chat = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const { botId } = useParams();

  // URL state checking for secret chat redirect
  const searchParams = new URLSearchParams(location.search);
  const requestedHiddenView = searchParams.get('view') === 'hidden' || location.pathname === '/hidden-chat';

  // Active Chat & UI States (Default to ByteBot AI)
  const [activeBot, setActiveBot] = useState(AI_BOTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Clean initialization: initialize all bots with personalized intro & dynamic system time
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      localStorage.removeItem('nipix_scholar_chat_history');
      localStorage.removeItem('nipix_scholar_chat_history_v2');
      localStorage.removeItem('nipix_chat_messages_v3');
      localStorage.removeItem('nipix_chat_messages_v4');
      localStorage.removeItem('nipix_chat_messages_v5');

      const saved = localStorage.getItem('nipix_chat_messages_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const sanitized = {};
          AI_BOTS.forEach((bot) => {
            const list = parsed[bot.id];
            if (Array.isArray(list)) {
              // Filter out any stored error messages
              const cleanList = list.filter((m) => m && m.text && !isErrorMessage(m.text));
              // If empty or only contains the legacy static welcome message, upgrade to personalized intro with current time
              if (cleanList.length === 0 || (cleanList.length === 1 && !cleanList[0].isUser && isOldIntroMessage(cleanList[0].text))) {
                sanitized[bot.id] = [createBotWelcomeMessage(bot)];
              } else {
                sanitized[bot.id] = cleanList;
              }
            } else {
              sanitized[bot.id] = [createBotWelcomeMessage(bot)];
            }
          });
          return sanitized;
        }
      }
    } catch (err) {
      console.warn('Could not load cached chat messages:', err);
    }

    const initialMap = {};
    AI_BOTS.forEach((bot) => {
      initialMap[bot.id] = [createBotWelcomeMessage(bot)];
    });
    return initialMap;
  });

  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [chatError, setChatError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [nicknames, setNicknames] = useState(() => {
    try {
      const saved = localStorage.getItem('nipix_bot_nicknames');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [botThemes, setBotThemes] = useState(() => {
    try {
      const saved = localStorage.getItem('nipix_bot_themes');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [streamingEnabled, setStreamingEnabled] = useState(true);

  // Top-Right Options dropdown and modal dialog states
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const optionsMenuRef = useRef(null);

  // Dismiss Options dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(e.target)) {
        setShowOptionsMenu(false);
      }
    };
    if (showOptionsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOptionsMenu]);

  // Active theme calculation and synchronized updating
  const currentThemeId = botThemes[activeBot?.id] || (activeBot?.id === 'sakura' ? 'sakura' : 'cyber');
  const currentTheme = CHAT_THEMES[currentThemeId] || CHAT_THEMES.cyber;

  const handleSelectTheme = (themeId) => {
    if (!activeBot) return;
    setBotThemes((prev) => {
      const updated = { ...prev, [activeBot.id]: themeId };
      try {
        localStorage.setItem('nipix_bot_themes', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Dedicated active streaming state to prevent re-rendering the full conversation array
  const [streamingText, setStreamingText] = useState('');
  const [streamingBotId, setStreamingBotId] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Hidden Vault State
  const [isVaultView, setIsVaultView] = useState(requestedHiddenView);
  const [vaultMessages, setVaultMessages] = useState(HIDDEN_VAULT_MESSAGES);
  const [vaultInput, setVaultInput] = useState('');

  // Performance & Control Refs
  const messagesContainerRef = useRef(null);
  const vaultContainerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const autoScrollEnabledRef = useRef(true);
  const pendingChunkBufferRef = useRef('');
  const renderTimerRef = useRef(null);
  const lastSentPromptRef = useRef('');

  // Keep localStorage in sync ONLY when completed messages change (NEVER on every token!)
  useEffect(() => {
    try {
      if (chatMessages && Object.keys(chatMessages).length > 0) {
        localStorage.setItem('nipix_chat_messages_v6', JSON.stringify(chatMessages));
      }
    } catch (err) {
      console.warn('Could not persist chat messages to localStorage:', err);
    }
  }, [chatMessages]);

  // Handle URL route params (/chat/:botId and /hidden-chat)
  useEffect(() => {
    if (location.pathname === '/hidden-chat') {
      if (!currentUser) {
        navigate('/login?redirect=hidden-chat');
      } else {
        setIsVaultView(true);
        setShowMobileChat(true);
      }
    } else if (botId) {
      const foundBot = AI_BOTS.find((b) => b.id.toLowerCase() === botId.toLowerCase());
      if (foundBot) {
        setActiveBot(foundBot);
        setIsVaultView(false);
        setShowMobileChat(true);
      }
    }
  }, [botId, location.pathname, currentUser, navigate]);

  // Auto-switch to secret vault view if authenticated user comes back with ?view=hidden
  useEffect(() => {
    if (requestedHiddenView && currentUser) {
      setIsVaultView(true);
      setShowMobileChat(true);
    }
  }, [requestedHiddenView, currentUser]);

  // Smart user scroll detector: stops forced auto-scroll if user scrolls up
  const handleContainerScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    autoScrollEnabledRef.current = scrollHeight - scrollTop - clientHeight < 80;
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current && autoScrollEnabledRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Scroll to bottom only when switching bot or when user sends message
  useEffect(() => {
    autoScrollEnabledRef.current = true;
    scrollToBottom();
  }, [activeBot]);

  useEffect(() => {
    if (vaultContainerRef.current) {
      vaultContainerRef.current.scrollTop = vaultContainerRef.current.scrollHeight;
    }
  }, [vaultMessages, isVaultView]);

  // Select an AI Bot (preserves active background generations)
  const handleSelectBot = (bot, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsVaultView(false);
    setActiveBot(bot);
    setShowMobileChat(true);
    setShowProfile(false);
    setShowOptionsMenu(false);
    setShowAboutModal(false);
    setShowThemeModal(false);
    setChatError(null);
  };

  // Clear active bot's conversation after confirmation and restore fresh intro message with live system time
  const handleClearCurrentBotChat = (e) => {
    if (e) e.preventDefault();
    if (!activeBot) return;
    const botDisplayName = nicknames[activeBot.id] || activeBot.name;
    const confirmed = window.confirm(`Clear chat conversation with ${botDisplayName}?`);
    if (!confirmed) return;

    if (isGenerating && streamingBotId === activeBot.id) {
      handleStopGeneration();
    }
    const botId = activeBot.id;
    const freshIntroMessage = createBotWelcomeMessage(activeBot);
    setChatMessages((prev) => {
      const updated = {
        ...prev,
        [botId]: [freshIntroMessage]
      };
      try {
        localStorage.setItem('nipix_chat_messages_v6', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
    setUserInput('');
    setChatError(null);
  };

  // Magic Wand Icon 🪄 Action: Entry point to Hidden Chat
  const handleSecretWandClick = () => {
    if (!currentUser) {
      navigate('/login?redirect=hidden-chat');
    } else {
      setIsVaultView(!isVaultView);
      setShowMobileChat(true);
    }
  };

  // Stop Generation Handler: cancels upstream request and preserves received text
  const handleStopGeneration = (e) => {
    if (e) e.preventDefault();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (renderTimerRef.current) {
      clearTimeout(renderTimerRef.current);
      renderTimerRef.current = null;
    }

    const partialContent = pendingChunkBufferRef.current;
    if (partialContent && partialContent.trim() && streamingBotId) {
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        sender: activeBot?.name || 'Assistant',
        isUser: false,
        text: partialContent,
        time: getCurrentSystemTime()
      };
      setChatMessages((prev) => ({
        ...prev,
        [streamingBotId]: [...(prev[streamingBotId] || []), assistantMsg]
      }));
    }

    setIsGenerating(false);
    setIsTyping(false);
    setStreamingText('');
    setStreamingBotId(null);
    pendingChunkBufferRef.current = '';
    abortControllerRef.current = null;
  };

  // Retry last failed prompt
  const handleRetryLastMessage = (e) => {
    if (e) e.preventDefault();
    if (lastSentPromptRef.current && !isGenerating) {
      handleSendMessage(null, lastSentPromptRef.current);
    }
  };

  // High-Performance Stream Handler with Micro-Batching (Zero UI Freezing)
  const handleSendMessage = async (e, retryText) => {
    if (e) e.preventDefault();
    const userText = (typeof retryText === 'string' ? retryText : userInput).trim();
    if (!userText || !activeBot || isGenerating) return;

    const botId = activeBot.id;
    const currentHistory = (chatMessages[botId] || []).filter(
      (m) => m && m.text && !isErrorMessage(m.text)
    );

    // Save prompt for retry support
    lastSentPromptRef.current = userText;

    // Immediately display user message
    if (!retryText) {
      const newUserMsg = {
        id: Date.now().toString(),
        sender: currentUser?.username || 'Learner',
        isUser: true,
        text: userText,
        time: getCurrentSystemTime()
      };
      setChatMessages((prev) => ({
        ...prev,
        [botId]: [...(prev[botId] || []), newUserMsg]
      }));
      setUserInput('');
    }

    // Set active streaming state
    setChatError(null);
    setIsGenerating(true);
    setStreamingBotId(botId);
    setStreamingText('');
    setIsTyping(true); // Shows subtle "thinking..." indicator until first token
    autoScrollEnabledRef.current = true;
    pendingChunkBufferRef.current = '';

    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    let streamStarted = false;

    try {
      const response = await sendAiChatMessageStream({
        botId,
        message: userText,
        history: currentHistory,
        signal: abortController.signal,
        onChunk: (currentStreamedText) => {
          pendingChunkBufferRef.current = currentStreamedText;

          if (!streamStarted) {
            streamStarted = true;
            setIsTyping(false); // Seamlessly switch from typing dots to streamed text
          }

          // Throttle UI updates to 40ms (~25fps) to prevent React reconciler flooding
          if (!renderTimerRef.current) {
            renderTimerRef.current = setTimeout(() => {
              renderTimerRef.current = null;
              setStreamingText(pendingChunkBufferRef.current);
              if (autoScrollEnabledRef.current && messagesContainerRef.current) {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
              }
            }, 40);
          }
        }
      });

      if (abortController.signal.aborted) {
        return;
      }

      // Flush any pending render frame
      if (renderTimerRef.current) {
        clearTimeout(renderTimerRef.current);
        renderTimerRef.current = null;
      }

      const finalReply = response.reply || pendingChunkBufferRef.current;

      if (!finalReply || isErrorMessage(finalReply)) {
        throw new Error(finalReply || 'Connection failed');
      }

      // Commit finalized assistant message to conversation history
      const assistantMsg = {
        id: (Date.now() + 1).toString(),
        sender: activeBot.name,
        isUser: false,
        text: finalReply,
        time: getCurrentSystemTime()
      };

      setChatMessages((prev) => ({
        ...prev,
        [botId]: [...(prev[botId] || []), assistantMsg]
      }));

    } catch (err) {
      if (abortController.signal.aborted) {
        return;
      }
      console.error('[Nipix Chat] Error during message processing:', err);
      setChatError("I couldn't connect to the AI service right now. Please try again.");
    } finally {
      if (renderTimerRef.current) {
        clearTimeout(renderTimerRef.current);
        renderTimerRef.current = null;
      }
      setIsGenerating(false);
      setIsTyping(false);
      setStreamingText('');
      setStreamingBotId(null);
      pendingChunkBufferRef.current = '';
      abortControllerRef.current = null;
    }
  };

  // Keyboard Input Handler for Chat Composer
  const handleKeyDown = (e) => {
    // Enter without Shift -> send user's message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Prevent send during IME composition (e.g., Asian script input)
      if (e.nativeEvent && e.nativeEvent.isComposing) return;
      // Do not send empty/whitespace-only messages or duplicate sends while generating
      if (!userInput.trim() || isGenerating) return;
      handleSendMessage(e);
    }
    // Shift + Enter preserves standard textarea multi-line break
  };

  // Send message in Secret Vault
  const handleSendVaultMessage = (e) => {
    e.preventDefault();
    if (!vaultInput.trim()) return;

    const newVMsg = {
      id: Date.now().toString(),
      sender: currentUser?.username || 'Verified Scholar',
      role: 'Authenticated Fellow',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: vaultInput,
      isUser: true
    };

    setVaultMessages((prev) => [...prev, newVMsg]);
    setVaultInput('');
  };

  // Filter bots in real time based on search query
  const filteredBots = AI_BOTS.filter((bot) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const botMsgs = chatMessages[bot.id] || [];
    const hasMatchingMsg = botMsgs.some((m) => m && m.text && m.text.toLowerCase().includes(query));
    return (
      bot.name.toLowerCase().includes(query) ||
      bot.role.toLowerCase().includes(query) ||
      bot.specialty.toLowerCase().includes(query) ||
      bot.previewText.toLowerCase().includes(query) ||
      hasMatchingMsg
    );
  });

  return (
    <div className="page-theme-chat">
      <div className="chat-messaging-grid">

        {/* -------------------------------------------------------- */}
        {/* LEFT PANEL: SEARCH BAR + MAGIC WAND 🪄 + 6 BOT ROWS     */}
        {/* -------------------------------------------------------- */}
        <div className={`chat-bot-list-sidebar ${showMobileChat ? 'hidden-mobile' : ''}`}>
          
          {/* Search Bar [ 🔍 Search chats... ] + Magic Wand Button [ 🪄 ] */}
          <div className="chat-panel-search-header">
            <div className="chat-search-container-panel">
              <Search size={15} className="chat-search-icon-panel" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="chat-search-input-panel"
              />
            </div>

            {/* Small Magic Wand Button 🪄: Entry point to Hidden Chat */}
            <button
              type="button"
              onClick={handleSecretWandClick}
              className="wand-action-btn"
              title="Hidden Chat"
              aria-label="Hidden Chat"
            >
              🪄
            </button>
          </div>

          {/* Exactly 6 AI Bot Conversation Rows (Independently Scrollable) */}
          <div className="chat-bot-scroll-list">
            {filteredBots.map((bot) => {
              const isSelected = activeBot?.id === bot.id && !isVaultView;
              // Ensure preview text only displays clean meaningful messages, never error strings
              const cleanMsgs = (chatMessages[bot.id] || []).filter(
                (m) => m && m.text && !isErrorMessage(m.text)
              );
              const lastMsg = cleanMsgs.slice(-1)[0];
              const previewText = lastMsg ? lastMsg.text : bot.previewText;
              const lastTime = lastMsg ? lastMsg.time : bot.lastTime;

              return (
                <div
                  key={bot.id}
                  onClick={(e) => handleSelectBot(bot, e)}
                  className={`chat-bot-item ${isSelected ? 'active' : ''}`}
                >
                  {/* Profile Avatar + Small Overlapping Active Green Dot */}
                  <div className="avatar-wrapper">
                    <div className={`avatar-badge ${bot.badgeClass}`} style={{ width: '40px', height: '40px', fontSize: '1.15rem' }}>
                      {bot.avatar}
                    </div>
                    <div className="active-dot-badge" />
                  </div>

                  {/* Bot Name & Message Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '2px' }}>
                      {nicknames[bot.id] || bot.name}
                    </div>
                    <div style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {previewText} <span style={{ opacity: 0.6 }}>· {bot.ageText}</span>
                    </div>
                  </div>

                  {/* Far Right Chat Timestamp */}
                  <div className="bot-meta-right">
                    {lastTime}
                  </div>
                </div>
              );
            })}

            {filteredBots.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px 16px', color: 'var(--text-dim)', fontSize: '0.84rem' }}>
                No conversations found.
              </div>
            )}
          </div>

          {/* Secret Vault Bottom Action Button */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-input)', flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleSecretWandClick}
              className="btn-secondary"
              style={{ width: '100%', fontSize: '0.78rem', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Lock size={14} color="var(--accent-emerald)" />
              <span>{currentUser ? (isVaultView ? 'Return to AI Bots' : 'Open Hidden Vault') : 'Hidden Chat Login'}</span>
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------- */}
        {/* RIGHT PANEL: SELECTED AI CONVERSATION WORKSPACE           */}
        {/* -------------------------------------------------------- */}
        <div className={`chat-active-workspace ${!showMobileChat ? 'hidden-mobile' : ''}`}>
          {isVaultView ? (
            /* SECRET VAULT VIEW (AUTHENTICATED) */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
              <div style={{
                padding: '10px 16px',
                borderBottom: '1px solid var(--border-color)',
                background: 'rgba(5, 150, 105, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--text-main)',
                fontSize: '0.86rem',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                  <Shield size={16} />
                  <span>SECRET VAULT CHANNEL UNLOCKED</span>
                </div>
                <button
                  onClick={() => setIsVaultView(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Back to AI Bots
                </button>
              </div>

              <div ref={vaultContainerRef} className="chat-messages" style={{ flex: 1, minHeight: 0, padding: '18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {vaultMessages.map((vMsg) => (
                  <div
                    key={vMsg.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: vMsg.isUser ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-input)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.84rem', color: 'var(--text-main)' }}>
                        {vMsg.sender} <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', marginLeft: '4px' }}>[{vMsg.role}]</span>
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{vMsg.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                      {vMsg.text}
                    </p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendVaultMessage} style={{
                padding: '10px 16px',
                borderTop: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                display: 'flex',
                gap: '10px',
                flexShrink: 0
              }}>
                <input
                  type="text"
                  placeholder="Broadcast encrypted transmission..."
                  value={vaultInput}
                  onChange={(e) => setVaultInput(e.target.value)}
                  className="input-field"
                  style={{ borderRadius: 'var(--radius-full)', padding: '10px 16px' }}
                />
                <button
                  type="submit"
                  className="btn-vault"
                  style={{ borderRadius: 'var(--radius-full)', padding: '10px 18px', flexShrink: 0, fontSize: '0.84rem' }}
                >
                  Send
                </button>
              </form>
            </div>
          ) : activeBot ? (
            /* REAL INTERACTIVE AI BOT CHAT SCREEN (NO LOGIN REQUIRED) */
            showProfile ? (
              <BotProfileDashboard
                bot={activeBot}
                onBack={() => setShowProfile(false)}
                onClearChat={handleClearCurrentBotChat}
                onOpenSearch={() => {
                  setShowProfile(false);
                  const searchInput = document.querySelector('.chat-search-input');
                  if (searchInput) searchInput.focus();
                }}
                customNickname={nicknames[activeBot.id]}
                onUpdateNickname={(newName) => {
                  setNicknames((prev) => {
                    const updated = { ...prev, [activeBot.id]: newName };
                    try {
                      localStorage.setItem('nipix_bot_nicknames', JSON.stringify(updated));
                    } catch (e) {}
                    return updated;
                  });
                }}
                activeTheme={currentThemeId}
                onSelectTheme={handleSelectTheme}
                streamingEnabled={streamingEnabled}
                onToggleStreaming={() => setStreamingEnabled((prev) => !prev)}
              />
            ) : (
            <div className="chat-conversation" style={{ background: currentTheme.bg }}>
              
              {/* Conversation Header: [Avatar ●] Bot Name + Role + Restored Top-Right Options Icon */}
              <div
                className="chat-header"
                style={{
                  background: currentTheme.headerBg,
                  borderBottom: `1px solid ${currentTheme.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                  <button
                    type="button"
                    onClick={() => setShowMobileChat(false)}
                    className="btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                  >
                    <ArrowLeft size={16} />
                  </button>

                  {/* Clickable Bot Profile Area (Avatar + Name + Role) */}
                  <div
                    onClick={() => setShowProfile(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flex: 1,
                      minWidth: 0,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    title={`View ${nicknames[activeBot.id] || activeBot.name}'s profile & details`}
                  >
                    {/* Profile Avatar + Overlapping Active Green Dot */}
                    <div className="avatar-wrapper">
                      <div className={`avatar-badge ${activeBot.badgeClass}`} style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
                        {activeBot.avatar}
                      </div>
                      <div className="active-dot-badge" />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: '0.96rem', fontWeight: '800', color: '#ffffff', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {nicknames[activeBot.id] || activeBot.name}
                      </h3>
                      <p style={{ fontSize: '0.74rem', color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {activeBot.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Top-Right Options Icon Button and Dropdown Menu */}
                <div style={{ position: 'relative' }} ref={optionsMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowOptionsMenu((prev) => !prev)}
                    className="btn-secondary"
                    aria-label="Chat options"
                    title="Options"
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#cbd5e1',
                      border: `1px solid ${currentTheme.borderColor}`,
                      background: showOptionsMenu ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {/* Clean Dismissible Options Dropdown Popup */}
                  {showOptionsMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 6px)',
                        right: 0,
                        width: '180px',
                        background: '#161926',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        borderRadius: '10px',
                        boxShadow: '0 12px 28px rgba(0, 0, 0, 0.6)',
                        padding: '6px',
                        zIndex: 100,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      {/* About Bot */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowOptionsMenu(false);
                          setShowAboutModal(true);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'transparent',
                          color: '#f8fafc',
                          fontSize: '0.84rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Info size={16} color="var(--accent-blue)" />
                        <span>About Bot</span>
                      </button>

                      {/* Theme */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowOptionsMenu(false);
                          setShowThemeModal(true);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'transparent',
                          color: '#f8fafc',
                          fontSize: '0.84rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Palette size={16} color="#8b5cf6" />
                        <span>Theme</span>
                      </button>

                      <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

                      {/* Clear Chat */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowOptionsMenu(false);
                          handleClearCurrentBotChat();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'transparent',
                          color: '#f87171',
                          fontSize: '0.84rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textAlign: 'left',
                          width: '100%',
                          transition: 'background 0.15s ease'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <Trash2 size={16} color="#ef4444" />
                        <span>Clear Chat</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Messages Workspace (Independently Scrollable via container ref) */}
              <div ref={messagesContainerRef} onScroll={handleContainerScroll} className="chat-messages" style={{ background: currentTheme.bg }}>
                {(chatMessages[activeBot.id] || [])
                  .filter((msg) => msg && msg.text && msg.text.trim().length > 0 && !isErrorMessage(msg.text))
                  .map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}
                  >
                    {!msg.isUser && (
                      <div className={`avatar-badge ${activeBot.badgeClass}`} style={{ width: '30px', height: '30px', fontSize: '0.95rem', flexShrink: 0 }}>
                        {activeBot.avatar}
                      </div>
                    )}

                    <div className={!msg.isUser ? 'chat-bubble-ai-msg' : ''} style={{
                      maxWidth: '82%',
                      padding: '10px 16px',
                      borderRadius: msg.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.isUser ? currentTheme.userBubble : currentTheme.aiBubble,
                      color: msg.isUser ? '#ffffff' : '#f8fafc',
                      border: msg.isUser ? 'none' : `1px solid ${currentTheme.borderColor}`,
                      fontSize: '0.88rem',
                      lineHeight: '1.55',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <MarkdownMessage content={msg.text} isUser={msg.isUser} />
                      {/* Subtle reduced-size secondary timestamp */}
                      <div style={{
                        fontSize: '0.62rem',
                        lineHeight: '1',
                        letterSpacing: '0.01em',
                        textAlign: 'right',
                        marginTop: '4px',
                        opacity: 0.65,
                        color: msg.isUser ? '#e0e7ff' : 'var(--text-dim)',
                        userSelect: 'none'
                      }}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}

                {/* ACTIVE REAL-TIME STREAMING BUBBLE */}
                {streamingBotId === activeBot.id && streamingText.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      gap: '8px'
                    }}
                  >
                    <div className={`avatar-badge ${activeBot.badgeClass}`} style={{ width: '30px', height: '30px', fontSize: '0.95rem', flexShrink: 0 }}>
                      {activeBot.avatar}
                    </div>

                    <div className="chat-bubble-ai-msg" style={{
                      maxWidth: '82%',
                      padding: '10px 16px',
                      borderRadius: '16px 16px 16px 4px',
                      background: currentTheme.aiBubble,
                      color: 'var(--text-main)',
                      border: `1px solid ${currentTheme.borderColor}`,
                      fontSize: '0.88rem',
                      lineHeight: '1.55',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <MarkdownMessage content={streamingText} isUser={false} />
                      {/* Subtle reduced-size secondary timestamp */}
                      <div style={{
                        fontSize: '0.62rem',
                        lineHeight: '1',
                        letterSpacing: '0.01em',
                        textAlign: 'right',
                        marginTop: '4px',
                        opacity: 0.65,
                        color: 'var(--text-dim)',
                        userSelect: 'none'
                      }}>
                        Streaming...
                      </div>
                    </div>
                  </div>
                )}

                {/* REAL-TIME AI THINKING ANIMATION (Before first token arrives) */}
                {isTyping && (!streamingText || streamingText.length === 0) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', paddingLeft: '38px' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{nicknames[activeBot.id] || activeBot.name} is thinking...</span>
                  </div>
                )}

                {/* TRANSIENT CONNECTION ERROR BANNER WITH RETRY */}
                {chatError && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    color: '#f87171',
                    fontSize: '0.82rem',
                    margin: '6px 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={15} style={{ flexShrink: 0 }} />
                      <span>{chatError}</span>
                    </div>
                    {lastSentPromptRef.current && (
                      <button
                        type="button"
                        onClick={handleRetryLastMessage}
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          color: '#fca5a5',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Retry
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ALWAYS VISIBLE FIXED BOTTOM COMPOSER: [ 😊 Ask Bot Name anything... 📎 ➤ / Stop ] */}
              <form onSubmit={handleSendMessage} className="chat-composer" style={{ background: currentTheme.composerBg, borderTop: `1px solid ${currentTheme.borderColor}` }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '8px', borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--text-muted)', flexShrink: 0, cursor: 'pointer' }}
                  title="Emoji"
                >
                  <Smile size={20} />
                </button>

                <textarea
                  rows={1}
                  placeholder={`Ask ${nicknames[activeBot.id] || activeBot.name} anything...`}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input-field"
                  style={{
                    flex: 1,
                    borderRadius: '20px',
                    padding: '10px 16px',
                    resize: 'none',
                    maxHeight: '100px',
                    fontSize: '0.88rem',
                    lineHeight: '1.4',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-main)'
                  }}
                />

                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '8px', borderRadius: '50%', border: 'none', background: 'transparent', color: 'var(--text-muted)', flexShrink: 0, cursor: 'pointer' }}
                  title="Attach file"
                >
                  <Paperclip size={20} />
                </button>

                {isGenerating ? (
                  <button
                    type="button"
                    onClick={handleStopGeneration}
                    style={{
                      borderRadius: '20px',
                      padding: '8px 16px',
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.4)',
                      color: '#f87171',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      fontWeight: '600'
                    }}
                    title="Stop Generating"
                  >
                    <div style={{ width: '9px', height: '9px', background: '#ef4444', borderRadius: '2px' }} />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!userInput.trim()}
                    className="btn-primary"
                    style={{
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
                      padding: 0,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: !userInput.trim() ? 0.45 : 1,
                      cursor: !userInput.trim() ? 'not-allowed' : 'pointer',
                      background: currentTheme.userBubble,
                      boxShadow: `0 2px 8px ${currentTheme.accent}55`
                    }}
                    title="Send Message"
                  >
                    <Send size={16} />
                  </button>
                )}
              </form>
            </div>
            )
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', padding: '24px', textAlign: 'center', gap: '14px' }}>
              <NipixLogo size={80} style={{ borderRadius: '18px' }} glow />
              <div>
                <h3 style={{ margin: '0 0 6px 0', color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: '800' }}>
                  Nipix AI Scholar Workspace
                </h3>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Select an AI bot to start chatting.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* -------------------------------------------------------- */}
        {/* ABOUT BOT MODAL (DYNAMIC INFORMATION PER BOT)            */}
        {/* -------------------------------------------------------- */}
        {showAboutModal && activeBot && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.72)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setShowAboutModal(false)}
          >
            <div
              style={{
                background: '#131726',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '460px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className={`avatar-badge ${activeBot.badgeClass}`} style={{ width: '42px', height: '42px', fontSize: '1.25rem' }}>
                    {activeBot.avatar}
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
                      {nicknames[activeBot.id] || activeBot.name}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      {activeBot.username || `@${activeBot.id}`} · {activeBot.role}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAboutModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <p style={{ fontSize: '0.86rem', color: '#e2e8f0', lineHeight: '1.5', margin: '0 0 16px 0' }}>
                {activeBot.description}
              </p>

              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: currentTheme.color, margin: '0 0 10px 0' }}>
                  Specializes in:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(activeBot.specialtiesList || []).map((spec, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.76rem',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${currentTheme.borderColor}`,
                        color: '#cbd5e1',
                        fontWeight: '500'
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  background: currentTheme.userBubble,
                  border: 'none'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* CHAT THEME PICKER MODAL                                  */}
        {/* -------------------------------------------------------- */}
        {showThemeModal && activeBot && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.72)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px'
            }}
            onClick={() => setShowThemeModal(false)}
          >
            <div
              style={{
                background: '#131726',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '440px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Palette size={20} color={currentTheme.color} />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#ffffff' }}>
                    Chat Theme — {nicknames[activeBot.id] || activeBot.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowThemeModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                  title="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {Object.values(CHAT_THEMES).map((t) => {
                  const isSelected = currentThemeId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleSelectTheme(t.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: isSelected ? `2px solid ${t.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                        background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: t.color,
                            boxShadow: `0 0 10px ${t.color}55`
                          }}
                        />
                        <span style={{ fontSize: '0.88rem', fontWeight: isSelected ? '700' : '500', color: isSelected ? '#ffffff' : '#e2e8f0' }}>
                          {t.name}
                        </span>
                      </div>
                      {isSelected && (
                        <span style={{ color: t.color, fontWeight: '700', fontSize: '0.82rem' }}>
                          ✓ Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowThemeModal(false)}
                className="btn-primary"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  background: currentTheme.userBubble,
                  border: 'none'
                }}
              >
                Apply Theme
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Chat;