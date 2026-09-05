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
  Paperclip
} from 'lucide-react';
import { sendAiChatMessage } from '../services/aiService';
import MarkdownMessage from '../components/chat/MarkdownMessage';

// Exactly 6 Fictional Nipix AI Bot Personas with Unique Specialties & Timestamps
const AI_BOTS = [
  {
    id: 'cipher_09',
    name: 'Cipher_09',
    role: 'Research, Cryptography & Cybersecurity',
    avatar: '🔮',
    badgeClass: 'badge-cipher',
    accentColor: '#8b5cf6',
    specialty: 'Research, Cryptography & Cybersecurity',
    previewText: 'Someone left an encrypted note in the vault...',
    ageText: '12 min ago',
    lastTime: '03:14 AM',
    initialMessages: [
      {
        id: 'c-1',
        sender: 'Cipher_09',
        isUser: false,
        text: 'Greetings, seeker of secrets. I specialize in cryptography, cybersecurity, and logical reasoning. Ask me any research question!',
        time: '03:14 AM'
      }
    ]
  },
  {
    id: 'bytebot_ai',
    name: 'ByteBot AI',
    role: 'Programming & Software Engineering',
    avatar: '🤖',
    badgeClass: 'badge-bytebot',
    accentColor: '#3b82f6',
    specialty: 'Programming, Software & Computer Science',
    previewText: 'Can you help me debug this algorithm?',
    ageText: '8 min ago',
    lastTime: '08:42 AM',
    initialMessages: [
      {
        id: 'b-1',
        sender: 'ByteBot AI',
        isUser: false,
        text: 'Hello developer! 👋 I am ByteBot AI, your software engineering assistant. Ask me questions in Python, JavaScript, Java, C++, React, or data structures.',
        time: '08:42 AM'
      }
    ]
  },
  {
    id: 'spark_x',
    name: 'Spark_X',
    role: 'Electrical Engineering & Physics',
    avatar: '⚡',
    badgeClass: 'badge-spark',
    accentColor: '#f59e0b',
    specialty: 'Electrical Engineering, Electronics & Physics',
    previewText: "Let's explore this circuit frequency...",
    ageText: '25 min ago',
    lastTime: '10:15 AM',
    initialMessages: [
      {
        id: 's-1',
        sender: 'Spark_X',
        isUser: false,
        text: 'Frequency locked! I am Spark_X, dedicated to electrical engineering, physics, and circuit theory. Ask me any science or engineering question!',
        time: '10:15 AM'
      }
    ]
  },
  {
    id: 'archivist',
    name: 'Archivist',
    role: 'History, Books & General Knowledge',
    avatar: '📚',
    badgeClass: 'badge-mentor',
    accentColor: '#10b981',
    specialty: 'History, Literature & General Knowledge',
    previewText: 'I found an interesting historical fact...',
    ageText: '1 hr ago',
    lastTime: '11:30 AM',
    initialMessages: [
      {
        id: 'a-1',
        sender: 'Archivist',
        isUser: false,
        text: 'Welcome scholar. I catalog literature, history, research synthesis, and general knowledge. What domain shall we study today?',
        time: '11:30 AM'
      }
    ]
  },
  {
    id: 'novamind',
    name: 'NovaMind',
    role: 'Mathematics & Analytical Science',
    avatar: '🧠',
    badgeClass: 'badge-cipher',
    accentColor: '#ec4899',
    specialty: 'Calculus, Algebra & Problem Solving',
    previewText: 'Ready for a math challenge today?',
    ageText: '15 min ago',
    lastTime: '01:05 PM',
    initialMessages: [
      {
        id: 'n-1',
        sender: 'NovaMind',
        isUser: false,
        text: 'Greetings! I am NovaMind, your mathematics and analytical tutor. Ask me about calculus, algebra, statistics, or scientific logic.',
        time: '01:05 PM'
      }
    ]
  },
  {
    id: 'aether',
    name: 'Aether',
    role: 'Artificial Intelligence & Future Tech',
    avatar: '🌌',
    badgeClass: 'badge-spark',
    accentColor: '#06b6d4',
    specialty: 'AI, Emerging Tech & Future Science',
    previewText: "There's something new in neural tech...",
    ageText: '5 min ago',
    lastTime: '02:20 PM',
    initialMessages: [
      {
        id: 'ae-1',
        sender: 'Aether',
        isUser: false,
        text: 'Hello visionary! I am Aether, dedicated to emerging technologies, AI architectures, and future innovation. What idea shall we explore?',
        time: '02:20 PM'
      }
    ]
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

  // Active Chat & UI States
  const [activeBot, setActiveBot] = useState(AI_BOTS[1]); // Default to ByteBot AI
  const [searchQuery, setSearchQuery] = useState('');
  
  // Persistent chat history across bot switching and page navigation
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('nipix_scholar_chat_history_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not load cached chat messages:', err);
    }
    const initialMap = {};
    AI_BOTS.forEach((bot) => {
      initialMap[bot.id] = [...bot.initialMessages];
    });
    return initialMap;
  });

  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Hidden Vault State
  const [isVaultView, setIsVaultView] = useState(requestedHiddenView);
  const [vaultMessages, setVaultMessages] = useState(HIDDEN_VAULT_MESSAGES);
  const [vaultInput, setVaultInput] = useState('');

  // Container refs for isolated internal message scrolling (NEVER scrolls window/page)
  const messagesContainerRef = useRef(null);
  const vaultContainerRef = useRef(null);

  // Keep localStorage in sync whenever messages update
  useEffect(() => {
    try {
      if (chatMessages && Object.keys(chatMessages).length > 0) {
        localStorage.setItem('nipix_scholar_chat_history_v2', JSON.stringify(chatMessages));
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

  // Scroll ONLY the internal messages container to the bottom (NEVER scrolls window or document)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping, activeBot]);

  useEffect(() => {
    if (vaultContainerRef.current) {
      vaultContainerRef.current.scrollTop = vaultContainerRef.current.scrollHeight;
    }
  }, [vaultMessages, isVaultView]);

  // Select an AI Bot (No login required, does NOT scroll the browser page)
  const handleSelectBot = (bot) => {
    setIsVaultView(false);
    setActiveBot(bot);
    setShowMobileChat(true);
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

  // Real AI Message Handler
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || !activeBot || isTyping) return;

    const userText = userInput.trim();
    const botId = activeBot.id;
    const currentHistory = chatMessages[botId] || [];

    const newUserMsg = {
      id: Date.now().toString(),
      sender: currentUser?.username || 'Learner',
      isUser: true,
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update frontend chat state immediately with user message
    setChatMessages((prev) => ({
      ...prev,
      [botId]: [...(prev[botId] || []), newUserMsg]
    }));

    setUserInput('');
    setIsTyping(true);

    try {
      // Call Backend / Intelligent AI Service
      const response = await sendAiChatMessage({
        botId,
        message: userText,
        history: [...currentHistory, newUserMsg]
      });

      const aiReplyText = response.reply || "I'm having trouble reaching the AI service right now. Please try again in a moment.";

      const newAiMsg = {
        id: (Date.now() + 1).toString(),
        sender: activeBot.name,
        isUser: false,
        text: aiReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages((prev) => ({
        ...prev,
        [botId]: [...(prev[botId] || []), newAiMsg]
      }));
    } catch (err) {
      console.error('[Nipix Chat] Error during message processing:', err);
      const fallbackMsg = {
        id: (Date.now() + 1).toString(),
        sender: activeBot.name,
        isUser: false,
        text: "I'm having trouble reaching the AI service right now. Please try again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages((prev) => ({
        ...prev,
        [botId]: [...(prev[botId] || []), fallbackMsg]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  // Support Shift+Enter for newline, Enter to send
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
    const hasMatchingMsg = botMsgs.some(m => m.text.toLowerCase().includes(query));
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
              const lastMsg = (chatMessages[bot.id] || []).slice(-1)[0];
              const previewText = lastMsg ? lastMsg.text : bot.previewText;

              return (
                <div
                  key={bot.id}
                  onClick={() => handleSelectBot(bot)}
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
                      {bot.name}
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
                    {bot.lastTime}
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
        {/* RIGHT PANEL: SELECTED AI CONVERSATION VIEW               */}
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
            <div className="chat-conversation">
              
              {/* Conversation Header: ← [Avatar ●] Bot Name (Active status ONLY as small green dot) */}
              <div className="chat-header">
                <button
                  type="button"
                  onClick={() => setShowMobileChat(false)}
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                >
                  <ArrowLeft size={16} />
                </button>

                {/* Profile Avatar + Overlapping Active Green Dot */}
                <div className="avatar-wrapper">
                  <div className={`avatar-badge ${activeBot.badgeClass}`} style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
                    {activeBot.avatar}
                  </div>
                  <div className="active-dot-badge" />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeBot.name}
                  </h3>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {activeBot.role}
                  </p>
                </div>
              </div>

              {/* Chat Messages Workspace (Independently Scrollable via container ref) */}
              <div ref={messagesContainerRef} className="chat-messages">
                {(chatMessages[activeBot.id] || []).map((msg) => (
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
                      background: msg.isUser ? 'var(--chat-bubble-user)' : 'var(--chat-bubble-ai)',
                      color: msg.isUser ? '#ffffff' : 'var(--text-main)',
                      border: msg.isUser ? 'none' : '1px solid var(--border-color)',
                      fontSize: '0.88rem',
                      lineHeight: '1.55',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <MarkdownMessage content={msg.text} isUser={msg.isUser} />
                      <div style={{
                        fontSize: '0.68rem',
                        textAlign: 'right',
                        marginTop: '4px',
                        opacity: 0.75,
                        color: msg.isUser ? '#e0e7ff' : 'var(--text-dim)'
                      }}>
                        {msg.time}
                      </div>
                    </div>
                  </div>
                ))}

                {/* REAL-TIME AI TYPING ANIMATION */}
                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', paddingLeft: '38px' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                    <span style={{ fontWeight: '600', color: 'var(--text-muted)' }}>{activeBot.name} is typing...</span>
                  </div>
                )}
              </div>

              {/* ALWAYS VISIBLE FIXED BOTTOM COMPOSER: [ 😊 Ask Bot Name anything... 📎 ➤ ] */}
              <form onSubmit={handleSendMessage} className="chat-composer">
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
                  placeholder={`Ask ${activeBot.name} anything...`}
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

                <button
                  type="submit"
                  disabled={!userInput.trim() || isTyping}
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
                    opacity: (!userInput.trim() || isTyping) ? 0.45 : 1,
                    cursor: (!userInput.trim() || isTyping) ? 'not-allowed' : 'pointer',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                    boxShadow: '0 2px 8px rgba(124, 58, 237, 0.35)'
                  }}
                  title="Send Message"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
              Select an AI bot to start chatting.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Chat;