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
  Lock,
  KeyRound,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import SecretWandIcon from '../components/Icons/SecretWandIcon';
import { useTheme } from '../context/ThemeContext';
import { sendAiChatMessage } from '../services/aiService';

// AI Bot Personas with Personalities & Specialties
const AI_BOTS = [
  {
    id: 'cipher_09',
    name: 'Cipher_09',
    role: 'Mystery & Cryptography AI',
    avatar: '🔮',
    badgeClass: 'badge-cipher',
    accentColor: '#8b5cf6',
    specialty: 'Cryptography, Research & Puzzles',
    previewText: 'Greetings seeker. What mystery shall we decipher today?',
    lastTime: '03:14 AM',
    initialMessages: [
      {
        id: 'c-1',
        sender: 'Cipher_09',
        isUser: false,
        text: 'Greetings, seeker of secrets. I specialize in cryptographic ciphers, research methodology, and computational enigmas. Ask me anything!',
        time: '03:14 AM'
      }
    ]
  },
  {
    id: 'bytebot_ai',
    name: 'ByteBot AI',
    role: 'Programming & Tech Assistant',
    avatar: '🤖',
    badgeClass: 'badge-bytebot',
    accentColor: '#3b82f6',
    specialty: 'Software Engineering, Code & Algorithms',
    previewText: 'Ready to review code, debug, or write algorithms!',
    lastTime: '08:42 AM',
    initialMessages: [
      {
        id: 'b-1',
        sender: 'ByteBot AI',
        isUser: false,
        text: 'Hello developer! I am ByteBot AI, your software engineering assistant. Ask me programming questions in Python, JavaScript, Java, C++, React, or data structures.',
        time: '08:42 AM'
      }
    ]
  },
  {
    id: 'spark_x',
    name: 'Spark_X',
    role: 'Engineering & Physics Intelligence',
    avatar: '⚡',
    badgeClass: 'badge-spark',
    accentColor: '#f59e0b',
    specialty: 'Electronics, Physics & Circuit Laws',
    previewText: 'Frequency locked! Ask me about physics & engineering.',
    lastTime: '2h ago',
    initialMessages: [
      {
        id: 's-1',
        sender: 'Spark_X',
        isUser: false,
        text: 'Frequency locked! I am Spark_X, dedicated to electrical engineering, quantum physics, and circuit theory. Ask me any science or engineering question!',
        time: '2h ago'
      }
    ]
  },
  {
    id: 'archivist',
    name: 'Archivist',
    role: 'Academic & Research Mentor',
    avatar: '📚',
    badgeClass: 'badge-mentor',
    accentColor: '#10b981',
    specialty: 'History, Books & General Knowledge',
    previewText: 'Welcome scholar. The archive is at your service.',
    lastTime: 'Just now',
    initialMessages: [
      {
        id: 'a-1',
        sender: 'Archivist',
        isUser: false,
        text: 'Welcome scholar. I catalog literature, history, research frameworks, and general knowledge. What domain shall we explore today?',
        time: 'Just now'
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
  const { themeMode, changeTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // URL state checking for secret chat redirect
  const searchParams = new URLSearchParams(location.search);
  const requestedHiddenView = searchParams.get('view') === 'hidden';

  // Active Chat & UI States
  const [activeBot, setActiveBot] = useState(AI_BOTS[1]); // Default to ByteBot AI
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState({});
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Hidden Vault State
  const [isVaultView, setIsVaultView] = useState(requestedHiddenView);
  const [vaultMessages, setVaultMessages] = useState(HIDDEN_VAULT_MESSAGES);
  const [vaultInput, setVaultInput] = useState('');

  const messagesEndRef = useRef(null);

  // Initialize messages state for each bot
  useEffect(() => {
    const initialMap = {};
    AI_BOTS.forEach((bot) => {
      initialMap[bot.id] = [...bot.initialMessages];
    });
    setChatMessages(initialMap);
  }, []);

  // Auto-switch to secret vault view if authenticated user comes back with ?view=hidden
  useEffect(() => {
    if (requestedHiddenView && currentUser) {
      setIsVaultView(true);
    }
  }, [requestedHiddenView, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping, vaultMessages, activeBot, isVaultView]);

  // Open an AI Bot Chat immediately WITHOUT demanding login!
  const handleSelectBot = (bot) => {
    setIsVaultView(false);
    setActiveBot(bot);
  };

  // Secret Wand Icon Action: Entry point to Hidden Chat
  const handleSecretWandClick = () => {
    if (!currentUser) {
      navigate('/login?redirect=hidden-chat');
    } else {
      setIsVaultView(!isVaultView);
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

    // Call Backend Real AI Endpoint (/api/ai/chat)
    const response = await sendAiChatMessage({
      botId,
      message: userText,
      history: [...currentHistory, newUserMsg]
    });

    const aiReplyText = response.reply || "I couldn't process that message right now. Please try again.";

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

    setIsTyping(false);
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

  // Real-time search filter for AI bots and messages
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
    <div className="page-theme-chat" style={{ minHeight: '100vh', padding: '16px', display: 'flex', flexDirection: 'column' }}>
      
      {/* ========================================================== */}
      {/* 1. COMPACT CHAT PAGE HEADER                                */}
      {/* ========================================================== */}
      <div className="glass-card" style={{
        maxWidth: '1060px',
        margin: '0 auto 12px auto',
        width: '100%',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: isVaultView ? 'var(--vault-gradient)' : 'var(--mystic-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0
          }}>
            {isVaultView ? <Shield size={18} /> : <Bot size={18} />}
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isVaultView ? 'Secret Vault Transmissions' : 'Nipix AI Chat'}
              <span style={{
                fontSize: '0.7rem',
                background: isVaultView ? 'rgba(5, 150, 105, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                color: isVaultView ? 'var(--accent-emerald)' : '#16a34a',
                padding: '2px 8px',
                borderRadius: '12px',
                fontWeight: '700'
              }}>
                {isVaultView ? 'Encrypted' : '4 Bots Active'}
              </span>
            </h2>
          </div>
        </div>

        {/* Right Header Actions: Theme Controls + Compact Search + Custom Wand Icon */}
        <div className="chat-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Quick Theme Selector (Light, Dark, Device) */}
          <div className="theme-segmented-control" title="Change Appearance Theme">
            <button
              type="button"
              onClick={() => changeTheme('light')}
              className={`theme-segmented-btn ${themeMode === 'light' ? 'active' : ''}`}
              title="Light Mode"
            >
              <Sun size={13} />
            </button>
            <button
              type="button"
              onClick={() => changeTheme('dark')}
              className={`theme-segmented-btn ${themeMode === 'dark' ? 'active' : ''}`}
              title="Dark Mode"
            >
              <Moon size={13} />
            </button>
            <button
              type="button"
              onClick={() => changeTheme('system')}
              className={`theme-segmented-btn ${themeMode === 'system' ? 'active' : ''}`}
              title="Same as Device"
            >
              <Laptop size={13} />
            </button>
          </div>

          {/* COMPACT SEARCH BAR: [ Search chats... ] */}
          <div className="chat-search-container">
            <Search size={15} className="chat-search-icon" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="chat-search-input"
            />
          </div>

          {/* CUSTOM SECRET WAND ICON [★]: Entry point to Hidden Chat */}
          <SecretWandIcon
            onClick={handleSecretWandClick}
            title="Hidden Chat"
          />
        </div>
      </div>

      {/* ========================================================== */}
      {/* 2. INSTAGRAM-INSPIRED MESSAGING GRID                       */}
      {/* ========================================================== */}
      <div className="glass-card" style={{
        maxWidth: '1060px',
        margin: '0 auto',
        width: '100%',
        flex: 1,
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden'
      }}>
        <div className="chat-messaging-grid">

          {/* -------------------------------------------------------- */}
          {/* LEFT PANEL: AI BOTS DIRECTORY                            */}
          {/* -------------------------------------------------------- */}
          <div className="chat-bot-list-sidebar">
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-card)'
            }}>
              <span style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                Conversations
              </span>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                Public AI Bots
              </span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredBots.map((bot) => {
                const isSelected = activeBot?.id === bot.id && !isVaultView;
                const lastMsg = (chatMessages[bot.id] || []).slice(-1)[0];
                const preview = lastMsg ? lastMsg.text : bot.previewText;

                return (
                  <div
                    key={bot.id}
                    onClick={() => handleSelectBot(bot)}
                    className={`chat-bot-item ${isSelected ? 'active' : ''}`}
                  >
                    <div className={`avatar-badge ${bot.badgeClass}`} style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}>
                      {bot.avatar}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)' }}>
                          {bot.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                          {bot.lastTime}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {preview}
                      </p>
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

            {/* Secret Vault Entry Card */}
            <div style={{
              padding: '14px',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-input)',
              textAlign: 'center'
            }}>
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
          {/* RIGHT PANEL: ACTIVE AI CHAT WORKSPACE / VAULT            */}
          {/* -------------------------------------------------------- */}
          <div className="chat-active-workspace">
            {isVaultView ? (
              /* SECRET VAULT VIEW (AUTHENTICATED) */
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--border-color)',
                  background: 'rgba(5, 150, 105, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  color: 'var(--text-main)',
                  fontSize: '0.86rem'
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

                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendVaultMessage} style={{
                  padding: '12px 16px',
                  borderTop: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  gap: '10px'
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
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                
                {/* Bot Header */}
                <div style={{
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg-card)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className={`avatar-badge ${activeBot.badgeClass}`} style={{ width: '36px', height: '36px', fontSize: '1.1rem' }}>
                      {activeBot.avatar}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.96rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {activeBot.name}
                        <span style={{ fontSize: '0.68rem', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} /> Online
                        </span>
                      </h3>
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
                        {activeBot.specialty}
                      </p>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.72rem', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-blue)', padding: '3px 10px', borderRadius: '12px', fontWeight: '700' }}>
                    {activeBot.role}
                  </span>
                </div>

                {/* Messages Workspace */}
                <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                        <div className={`avatar-badge ${activeBot.badgeClass}`} style={{ width: '30px', height: '30px', fontSize: '0.95rem' }}>
                          {activeBot.avatar}
                        </div>
                      )}

                      <div className={!msg.isUser ? 'chat-bubble-ai-msg' : ''} style={{
                        maxWidth: '80%',
                        padding: '10px 16px',
                        borderRadius: msg.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: msg.isUser ? 'var(--chat-bubble-user)' : 'var(--chat-bubble-ai)',
                        color: msg.isUser ? '#ffffff' : 'var(--text-main)',
                        border: msg.isUser ? 'none' : '1px solid var(--border-color)',
                        fontSize: '0.88rem',
                        lineHeight: '1.55',
                        whiteSpace: 'pre-wrap',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {msg.text}
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

                  <div ref={messagesEndRef} />
                </div>

                {/* BOTTOM MESSAGE INPUT BAR: [ Ask anything... ] [ Send ] */}
                <form onSubmit={handleSendMessage} style={{
                  padding: '12px 18px',
                  borderTop: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-end'
                }}>
                  <textarea
                    rows={1}
                    placeholder={`Ask ${activeBot.name} anything...`}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="input-field"
                    style={{
                      borderRadius: '18px',
                      padding: '10px 16px',
                      resize: 'none',
                      maxHeight: '100px',
                      fontSize: '0.88rem',
                      lineHeight: '1.4'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!userInput.trim() || isTyping}
                    className="btn-primary"
                    style={{
                      borderRadius: 'var(--radius-full)',
                      padding: '10px 18px',
                      flexShrink: 0,
                      opacity: (!userInput.trim() || isTyping) ? 0.5 : 1,
                      cursor: (!userInput.trim() || isTyping) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Send size={15} />
                    <span>Send</span>
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
    </div>
  );
};

export default Chat;