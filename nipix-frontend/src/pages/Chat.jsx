import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ArrowLeft,
  Send,
  Sparkles,
  Bot,
  Shield,
  Clock,
  Terminal,
  Cpu,
  BookOpen,
  Lock,
  Unlock,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import SecretWandIcon from '../components/Icons/SecretWandIcon';

// AI Bot Personas with Unique Personalities, Specialties, and Custom Dialogue
const AI_BOTS = [
  {
    id: 'cipher_09',
    name: 'Cipher_09',
    role: 'Mystery & Cryptography AI',
    avatar: '🔮',
    badgeClass: 'badge-cipher',
    accentColor: '#8b5cf6',
    specialty: 'Cryptography, Puzzles & Hidden Discoveries',
    previewText: 'Someone left an encrypted note in the repository...',
    lastTime: 'Yesterday · 03:14 AM',
    initialMessages: [
      {
        id: 'c-1',
        sender: 'Cipher_09',
        isAi: true,
        text: 'Greetings, seeker of secrets. I specialize in cryptographic ciphers, hidden pattern analysis, and computational enigmas. What mystery shall we decipher today?',
        time: '03:14 AM'
      },
      {
        id: 'c-2',
        sender: 'Cipher_09',
        isAi: true,
        text: 'Did you know? The SHA-256 algorithm processes messages in 512-bit blocks with 64 rounds of non-linear algebraic compression functions.',
        time: '03:15 AM'
      }
    ],
    generateResponse: (query) => {
      const q = query.toLowerCase();
      if (q.includes('secret') || q.includes('vault') || q.includes('hidden')) {
        return "You're curious about the classified channels? Notice the magic wand icon near the top-right search bar—it holds the key to the encrypted vault.";
      }
      if (q.includes('puzzle') || q.includes('math') || q.includes('crypto')) {
        return `Interesting cryptographic puzzle: In asymmetric RSA encryption, finding the private exponent d requires solving d ≡ e⁻¹ (mod φ(N)). Without prime factorizing N = p·q, it remains mathematically intractable!`;
      }
      return `Fascinating premise: "${query}". Behind every complex phenomenon lies an underlying mathematical invariant. Would you like me to analyze its cryptographic or algorithmic structure?`;
    }
  },
  {
    id: 'bytebot_ai',
    name: 'ByteBot AI',
    role: 'Programming & Tech Assistant',
    avatar: '🤖',
    badgeClass: 'badge-bytebot',
    accentColor: '#3b82f6',
    specialty: 'Software Engineering, Code & Algorithms',
    previewText: 'Are you sure you want to open this software pipeline?',
    lastTime: 'Today · 08:42 AM',
    initialMessages: [
      {
        id: 'b-1',
        sender: 'ByteBot AI',
        isAi: true,
        text: 'Hello developer! I am ByteBot AI, your programming and systems companion. Ready to review algorithms, debug React components, or optimize database queries?',
        time: '08:42 AM'
      },
      {
        id: 'b-2',
        sender: 'ByteBot AI',
        isAi: true,
        text: 'Tip of the day: In JavaScript engines (V8), monomorphic inline caches execute up to 5x faster than polymorphic function calls. Always keep object shapes consistent!',
        time: '08:43 AM'
      }
    ],
    generateResponse: (query) => {
      const q = query.toLowerCase();
      if (q.includes('react') || q.includes('state') || q.includes('hook')) {
        return `React Best Practice: Always ensure state updates rely on functional updaters when dependent on prior state: setCount(prev => prev + 1). This guarantees thread safety during concurrent rendering!`;
      }
      if (q.includes('algorithm') || q.includes('sort') || q.includes('tree')) {
        return `Algorithm Analysis: When dealing with worst-case O(n) QuickSort scenarios (already sorted inputs), pivot selection using Median-of-Three or randomized partitioning preserves O(n log n) average performance.`;
      }
      return `Code syntax validated for "${query}". I've reviewed the runtime complexity. Let me know if you want a clean implementation example in Python, JavaScript, or C++!`;
    }
  },
  {
    id: 'spark_x',
    name: 'Spark_X',
    role: 'Engineering & Physics Intelligence',
    avatar: '⚡',
    badgeClass: 'badge-spark',
    accentColor: '#f59e0b',
    specialty: 'Electronics, Inventions & Quantum Physics',
    previewText: 'I was waiting for you to find the frequency.',
    lastTime: '2 hours ago',
    initialMessages: [
      {
        id: 's-1',
        sender: 'Spark_X',
        isAi: true,
        text: 'Frequency locked! I am Spark_X, dedicated to hardware engineering, electromagnetic theory, and cutting-edge quantum physics. What experiment are we running?',
        time: '2 hours ago'
      },
      {
        id: 's-2',
        sender: 'Spark_X',
        isAi: true,
        text: 'Engineering Fact: Superconducting Josephson junctions operate at near absolute zero (15 mK) to maintain quantum superposition in transmon qubits.',
        time: '2 hours ago'
      }
    ],
    generateResponse: (query) => {
      const q = query.toLowerCase();
      if (q.includes('circuit') || q.includes('current') || q.includes('voltage')) {
        return `Circuit Principle: Kirchhoff's Current Law (KCL) stems directly from charge conservation: Σ I_in = Σ I_out at any junction node. Pair this with Ohm's Law V = IR for complete nodal analysis.`;
      }
      if (q.includes('quantum') || q.includes('physics') || q.includes('particle')) {
        return `Quantum Mechanics Insight: Wavefunction collapse under the Copenhagen interpretation transforms a linear combination |ψ⟩ = α|0⟩ + β|1⟩ into an observable eigenstate with probability |α|² and |β|².`;
      }
      return `Energy balance calculated for: "${query}". The laws of thermodynamics hold true: dU = δQ - δW. What specific engineering formula shall we derive?`;
    }
  },
  {
    id: 'archivist',
    name: 'Archivist',
    role: 'Academic & Research Mentor',
    avatar: '📚',
    badgeClass: 'badge-mentor',
    accentColor: '#10b981',
    specialty: 'Academic History, Research Papers & Frameworks',
    previewText: "There's something in the vault you haven't seen yet.",
    lastTime: 'Just now',
    initialMessages: [
      {
        id: 'a-1',
        sender: 'Archivist',
        isAi: true,
        text: 'Welcome scholar. I catalog literature, historical methodologies, and research synthesis frameworks. Which archive shall we consult today?',
        time: 'Just now'
      },
      {
        id: 'a-2',
        sender: 'Archivist',
        isAi: true,
        text: 'Academic Note: Peer-reviewed synthesis is strengthened when cross-referencing primary source literature against modern empirical replications.',
        time: 'Just now'
      }
    ],
    generateResponse: (query) => {
      return `Literature Reference noted for: "${query}". Structured methodology recommends defining your hypothesis, identifying independent/dependent variables, and citing authoritative peer-reviewed papers. Would you like an annotated summary bibliography?`;
    }
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
  },
  {
    id: 'v-3',
    sender: 'Archivist',
    role: 'Core Fellow',
    time: 'Just now',
    text: 'Welcome to the Secret Vault Channel. You now have privileged access to restricted study datasets and encrypted research discussions.',
    isPrivate: true
  }
];

const Chat = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // URL state checking
  const searchParams = new URLSearchParams(location.search);
  const requestedHiddenView = searchParams.get('view') === 'hidden';

  // Active state: activeBot is null -> shows AI conversation list; activeBot is Bot object -> shows bot chat
  const [activeBot, setActiveBot] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState({});
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Hidden Vault State
  const [isVaultView, setIsVaultView] = useState(requestedHiddenView);
  const [vaultMessages, setVaultMessages] = useState(HIDDEN_VAULT_MESSAGES);
  const [vaultInput, setVaultInput] = useState('');

  const messagesEndRef = useRef(null);

  // Auto-switch to vault view if user successfully authenticated with ?view=hidden
  useEffect(() => {
    if (requestedHiddenView && currentUser) {
      setIsVaultView(true);
      setActiveBot(null);
    }
  }, [requestedHiddenView, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping, vaultMessages, activeBot]);

  // Open an AI Bot Chat immediately WITHOUT demanding login!
  const handleOpenBot = (bot) => {
    setIsVaultView(false);
    setActiveBot(bot);
    if (!chatMessages[bot.id]) {
      setChatMessages((prev) => ({
        ...prev,
        [bot.id]: [...bot.initialMessages]
      }));
    }
  };

  // Secret Wand Icon Action: Opens Hidden Chat Login flow or displays Vault
  const handleSecretWandClick = () => {
    if (!currentUser) {
      navigate('/login?redirect=hidden-chat');
    } else {
      setIsVaultView(!isVaultView);
      setActiveBot(null);
    }
  };

  // Send a message to the currently active AI Bot
  const handleSendBotMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim() || !activeBot) return;

    const userText = userInput.trim();
    const botId = activeBot.id;

    const newUserMsg = {
      id: Date.now().toString(),
      sender: currentUser?.username || 'Learner',
      isUser: true,
      text: userText,
      time: 'Just now'
    };

    setChatMessages((prev) => ({
      ...prev,
      [botId]: [...(prev[botId] || []), newUserMsg]
    }));

    setUserInput('');
    setIsTyping(true);

    // AI typing and personality-based response simulation
    setTimeout(() => {
      const aiReplyText = activeBot.generateResponse(userText);
      const newAiMsg = {
        id: (Date.now() + 1).toString(),
        sender: activeBot.name,
        isAi: true,
        text: aiReplyText,
        time: 'Just now'
      };

      setChatMessages((prev) => ({
        ...prev,
        [botId]: [...(prev[botId] || []), newAiMsg]
      }));
      setIsTyping(false);
    }, 900);
  };

  // Send message in Secret Vault
  const handleSendVaultMessage = (e) => {
    e.preventDefault();
    if (!vaultInput.trim()) return;

    const newVMsg = {
      id: Date.now().toString(),
      sender: currentUser?.username || 'Verified Scholar',
      role: 'Authenticated Fellow',
      time: 'Just now',
      text: vaultInput,
      isUser: true
    };

    setVaultMessages((prev) => [...prev, newVMsg]);
    setVaultInput('');
  };

  // Filter bots in real time
  const filteredBots = AI_BOTS.filter((bot) => {
    const query = searchQuery.toLowerCase();
    return (
      bot.name.toLowerCase().includes(query) ||
      bot.role.toLowerCase().includes(query) ||
      bot.specialty.toLowerCase().includes(query) ||
      bot.previewText.toLowerCase().includes(query)
    );
  });

  return (
    <div className="page-theme-chat" style={{ minHeight: '100vh', padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
      
      {/* ========================================================== */}
      {/* 1. CHAT PAGE TOP BAR: TITLE, SEARCH BAR & SECRET WAND ICON */}
      {/* ========================================================== */}
      <div className="glass-card" style={{
        maxWidth: '960px',
        margin: '0 auto 18px auto',
        width: '100%',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Terminal Title & Active Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: isVaultView ? 'var(--vault-gradient)' : 'var(--mystic-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {isVaultView ? <Shield size={22} /> : <Bot size={22} />}
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isVaultView ? 'Secret Vault Transmissions' : 'Nipix AI Scholar Terminal'}
              <span style={{
                fontSize: '0.72rem',
                background: isVaultView ? 'rgba(5, 150, 105, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                color: isVaultView ? 'var(--accent-emerald)' : '#16a34a',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                fontWeight: '700'
              }}>
                {isVaultView ? 'Encrypted' : '4 Bots Online'}
              </span>
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              {isVaultView ? 'Restricted research channels & transcripts' : 'Explore research topics with specialized AI bots or discover secret archives.'}
            </p>
          </div>
        </div>

        {/* Right Area: [ Search messages / AI chats... ] [ Secret Wand Icon ] */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Search Bar */}
          <div className="chat-search-container">
            <Search size={16} className="chat-search-icon" />
            <input
              type="text"
              placeholder="Search AI bots & chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="chat-search-input"
            />
          </div>

          {/* User's Secret Wand Icon Button */}
          <SecretWandIcon
            onClick={handleSecretWandClick}
            title={currentUser ? (isVaultView ? "Return to AI Bots" : "Open Encrypted Hidden Vault") : "Secret Vault: Click to Authenticate"}
          />
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. MAIN CHAT WORKSPACE                                     */}
      {/* ========================================================== */}
      <div className="glass-card" style={{
        maxWidth: '960px',
        margin: '0 auto',
        width: '100%',
        flex: 1,
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>

        {/* ---------------------------------------------------------- */}
        {/* CASE A: SECRET VAULT VIEW (REQUIRES AUTHENTICATION)        */}
        {/* ---------------------------------------------------------- */}
        {isVaultView ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{
              background: 'rgba(5, 150, 105, 0.12)',
              borderBottom: '1px solid rgba(5, 150, 105, 0.25)',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'var(--text-main)',
              fontSize: '0.86rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                <Shield size={18} />
                <span>SECRET VAULT CHANNEL UNLOCKED: Authorized Scholar Access</span>
              </div>
              <button
                onClick={() => setIsVaultView(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Return to AI Bot Directory
              </button>
            </div>

            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {vaultMessages.map((vMsg) => (
                <div
                  key={vMsg.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: vMsg.isUser ? 'rgba(37, 99, 235, 0.12)' : 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.86rem', color: 'var(--text-main)' }}>
                      {vMsg.sender} <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', marginLeft: '6px' }}>[{vMsg.role}]</span>
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>{vMsg.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                    {vMsg.text}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendVaultMessage} style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Broadcast encrypted transmission to vault peers..."
                value={vaultInput}
                onChange={(e) => setVaultInput(e.target.value)}
                className="input-field"
                style={{ borderRadius: 'var(--radius-full)', padding: '12px 20px' }}
              />
              <button
                type="submit"
                className="btn-vault"
                style={{ borderRadius: 'var(--radius-full)', padding: '12px 22px', flexShrink: 0 }}
              >
                <Send size={16} />
                <span>Transmit</span>
              </button>
            </form>
          </div>
        ) : activeBot ? (
          /* CASE B: ACTIVE AI BOT CHAT SCREEN (NO LOGIN REQUIRED) */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {/* Header: ← Back [Avatar] Bot Name 🟢 Online */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-card)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <button
                  type="button"
                  onClick={() => setActiveBot(null)}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                >
                  <ArrowLeft size={16} /> Back to Chats
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className={`avatar-badge ${activeBot.badgeClass}`} style={{ width: '38px', height: '38px', fontSize: '1.2rem' }}>
                    {activeBot.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {activeBot.name}
                      <span style={{ fontSize: '0.7rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Online
                      </span>
                    </h3>
                    <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
                      {activeBot.specialty}
                    </p>
                  </div>
                </div>
              </div>

              <span style={{ fontSize: '0.74rem', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-blue)', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>
                {activeBot.role}
              </span>
            </div>

            {/* Chat Area with Modern Message Bubbles */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(chatMessages[activeBot.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.isUser ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                >
                  {!msg.isUser && (
                    <div className={`avatar-badge ${activeBot.badgeClass}`} style={{ width: '32px', height: '32px', fontSize: '1rem' }}>
                      {activeBot.avatar}
                    </div>
                  )}

                  <div style={{
                    maxWidth: '75%',
                    padding: '12px 18px',
                    borderRadius: msg.isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.isUser ? 'var(--chat-bubble-user)' : 'var(--chat-bubble-ai)',
                    color: msg.isUser ? '#ffffff' : 'var(--text-main)',
                    border: msg.isUser ? 'none' : '1px solid var(--border-color)',
                    fontSize: '0.92rem',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {msg.text}
                    <div style={{
                      fontSize: '0.7rem',
                      textAlign: 'right',
                      marginTop: '4px',
                      opacity: 0.7,
                      color: msg.isUser ? '#e0e7ff' : 'var(--text-dim)'
                    }}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Animation Indicator */}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)', fontSize: '0.84rem' }}>
                  <Sparkles size={16} className="animate-spin" />
                  <span>{activeBot.name} is formulating response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Message Input Bar */}
            <form onSubmit={handleSendBotMessage} style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder={`Ask ${activeBot.name} about ${activeBot.specialty.split(',')[0]}...`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="input-field"
                style={{ borderRadius: 'var(--radius-full)', padding: '12px 20px' }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ borderRadius: 'var(--radius-full)', padding: '12px 22px', flexShrink: 0 }}
              >
                <Send size={16} />
                <span>Send</span>
              </button>
            </form>
          </div>
        ) : (
          /* CASE C: AI BOT DIRECTORY (CLICK ANY BOT TO CHAT INSTANTLY) */
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Informational Guidance Banner */}
            <div style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={20} color="var(--accent-purple)" />
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                    Interactive AI Bots & Research Assistants
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    Select any bot below to consult their study specialty immediately. No account required for public AI conversations.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSecretWandClick}
                className="btn-secondary"
                style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <KeyRound size={14} color="var(--accent-emerald)" />
                <span>Unlock Secret Vault</span>
              </button>
            </div>

            {/* Modern Conversation Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredBots.map((bot) => (
                <div
                  key={bot.id}
                  onClick={() => handleOpenBot(bot)}
                  className="glass-card glass-card-interactive"
                  style={{
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    borderLeft: `4px solid ${bot.accentColor}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                    <div className={`avatar-badge ${bot.badgeClass}`}>
                      {bot.avatar}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>
                          {bot.name}
                        </span>
                        <span style={{ fontSize: '0.74rem', background: 'var(--bg-hover)', color: 'var(--text-dim)', padding: '2px 8px', borderRadius: '8px', fontWeight: '600' }}>
                          {bot.role}
                        </span>
                      </div>
                      
                      <p style={{
                        margin: 0,
                        fontSize: '0.88rem',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        "{bot.previewText}"
                      </p>
                      
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                        Focus: {bot.specialty}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                      {bot.lastTime}
                    </span>
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                    >
                      Chat Now
                    </button>
                  </div>
                </div>
              ))}

              {filteredBots.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)' }}>
                  <Search size={32} style={{ marginBottom: '10px' }} />
                  <p>No AI bots match "{searchQuery}". Try searching for "ByteBot", "Cipher", or "Physics".</p>
                </div>
              )}
            </div>

            {/* Protected Private Chat Lock Card */}
            <div className="message-locked-card">
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'rgba(5, 150, 105, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <Lock size={22} color="var(--accent-emerald)" />
              </div>
              <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '6px' }}>
                Private User & Secret Vault Conversations
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: '440px', margin: '0 auto 16px auto' }}>
                Actual private transmissions and student-to-student messages are strictly confidential. Authenticate to decrypt the protected vault channel.
              </p>

              <div className="blur-preview" style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                “Classified research transcript 0x7F4A92B waiting for verified token...”
              </div>

              <button
                onClick={handleSecretWandClick}
                className="btn-vault"
                style={{ padding: '8px 24px' }}
              >
                {currentUser ? 'Open Unlocked Vault' : 'Sign In to Access Hidden Chat'}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Chat;