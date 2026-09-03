import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Send,
  Sparkles,
  Lock,
  Unlock,
  KeyRound,
  Shield,
  Eye,
  Bot,
  User as UserIcon,
  HelpCircle,
  FileCode,
  CheckCircle2,
  Terminal,
  Clock
} from 'lucide-react';

// BiteMoji / Character Avatars for mysterious prompts
const BITMOJI_CHARACTERS = [
  {
    id: 'cipher',
    name: 'Cipher_09',
    avatar: '🔮',
    badgeClass: 'badge-cipher',
    text: 'Someone left an encrypted note in the repository...',
    time: 'Yesterday at 03:14 AM'
  },
  {
    id: 'bytebot',
    name: 'ByteBot AI',
    avatar: '🤖',
    badgeClass: 'badge-bytebot',
    text: 'Are you sure you want to open this private channel?',
    time: 'Today at 08:42 AM'
  },
  {
    id: 'spark',
    name: 'Spark_X',
    avatar: '⚡',
    badgeClass: 'badge-spark',
    text: 'I was waiting for you to find the frequency.',
    time: '2 hours ago'
  },
  {
    id: 'mentor',
    name: 'Archivist',
    avatar: '🦉',
    badgeClass: 'badge-mentor',
    text: "There's something in the vault you haven't seen yet.",
    time: 'Just now'
  }
];

// Secret / Hidden Chat Authorized Conversations
const HIDDEN_VAULT_CONVERSATIONS = [
  {
    id: 'h-1',
    sender: 'Lead Researcher (Dr. K. Vance)',
    role: 'Quantum Architect',
    time: '11:45 AM',
    text: 'Decrypted Channel Active: The topological qubit test benchmarks have matched theoretical parity. Access token for Shard 4 is 0x7F4A92B.',
    isPrivate: true
  },
  {
    id: 'h-2',
    sender: 'Cipher_09',
    role: 'Security Fellow',
    time: '12:10 PM',
    text: 'Verified: Multi-agent consensus protocol verified for distributed study graph. All private transcripts are locked to authenticated keys.',
    isPrivate: true
  },
  {
    id: 'h-3',
    sender: 'ByteBot Mentor',
    role: 'AI Core',
    time: 'Just now',
    text: 'Welcome to the Secret Vault Channel. You now have privileged access to restricted study datasets and encrypted research discussions.',
    isPrivate: true
  }
];

const Chat = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user came from successful login with ?view=hidden
  const searchParams = new URLSearchParams(location.search);
  const requestedHiddenView = searchParams.get('view') === 'hidden';

  // Active view: 'normal' | 'hidden'
  const [activeTab, setActiveTab] = useState(requestedHiddenView ? 'hidden' : 'normal');

  // Messages state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Hidden chat state
  const [vaultMessages, setVaultMessages] = useState(HIDDEN_VAULT_CONVERSATIONS);
  const [vaultInput, setVaultInput] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (requestedHiddenView && currentUser) {
      setActiveTab('hidden');
    }
  }, [requestedHiddenView, currentUser]);

  useEffect(() => {
    if (currentUser && messages.length === 0) {
      setMessages([
        {
          id: 'ai-init',
          sender: 'Nipix Study AI',
          isAi: true,
          text: `Hello Scholar ${currentUser.username || ''}! I am your AI study mentor. Ask me about algorithms, math proofs, or research topics.`,
          time: 'Online'
        }
      ]);
    }
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, vaultMessages, isAiThinking]);

  // Click Secret Chat / Hidden Chat icon on the side
  const handleSecretChatClick = () => {
    if (!currentUser) {
      // 1. Open login screen, clearly communicating that authentication is required
      navigate('/login?redirect=hidden-chat');
    } else {
      // User is already logged in: toggle or go straight to hidden chat
      setActiveTab(activeTab === 'hidden' ? 'normal' : 'hidden');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!currentUser) {
      navigate('/login?redirect=hidden-chat');
      return;
    }

    const userMsg = {
      id: Date.now().toString(),
      sender: currentUser.username || 'You',
      text: inputValue,
      isUser: true,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsAiThinking(true);

    setTimeout(() => {
      let reply = `Here is a study breakdown for: "${userMsg.text}".\n\n• Key Concept: Ensure you grasp the fundamental axioms.\n• Practice: Work through 2-3 sample problems in the Study Materials hub.\n• Inquiry: Feel free to ask for a code sample or formula derivation!`;
      
      if (userMsg.text.toLowerCase().includes('secret') || userMsg.text.toLowerCase().includes('vault')) {
        reply = "Looking for the hidden conversations? Click the secret keyhole glyph on the top-right side of this terminal.";
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'Nipix Study AI',
          isAi: true,
          text: reply,
          time: 'Just now'
        }
      ]);
      setIsAiThinking(false);
    }, 800);
  };

  const handleSendVaultMessage = (e) => {
    e.preventDefault();
    if (!vaultInput.trim()) return;

    const newVMsg = {
      id: Date.now().toString(),
      sender: currentUser?.username || 'Authorized Scholar',
      role: 'Verified Researcher',
      time: 'Just now',
      text: vaultInput,
      isUser: true
    };

    setVaultMessages(prev => [...prev, newVMsg]);
    setVaultInput('');
  };

  return (
    <div className="page-theme-chat" style={{ minHeight: '100vh', padding: '24px 20px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Header bar of Chat Area */}
      <div className="glass-card" style={{
        maxWidth: '920px',
        margin: '0 auto 18px auto',
        width: '100%',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: activeTab === 'hidden' ? 'var(--vault-gradient)' : 'var(--mystic-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {activeTab === 'hidden' ? <Shield size={22} /> : <Bot size={22} />}
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              {activeTab === 'hidden' ? 'Encrypted Hidden Vault' : 'AI Scholar Study Terminal'}
              <span style={{
                fontSize: '0.72rem',
                background: activeTab === 'hidden' ? 'rgba(5, 150, 105, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                color: activeTab === 'hidden' ? 'var(--accent-emerald)' : '#16a34a',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                fontWeight: '700'
              }}>
                {activeTab === 'hidden' ? 'Classified' : 'Online'}
              </span>
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              {activeTab === 'hidden' ? 'Authorized private transmissions' : 'AI Study Assistant & Research Companion'}
            </p>
          </div>
        </div>

        {/* SECRET CHAT / HIDDEN CHAT ICON ON THE SIDE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleSecretChatClick}
            className="secret-glyph-btn"
            title={currentUser ? (activeTab === 'hidden' ? "Switch to Normal AI Chat" : "Open Hidden Secret Chat") : "Secret Chat: Login Required"}
            aria-label="Secret Chat"
          >
            {currentUser && activeTab === 'hidden' ? <Unlock size={17} /> : <KeyRound size={17} />}
          </button>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <div className="glass-card" style={{
        maxWidth: '920px',
        margin: '0 auto',
        width: '100%',
        flex: 1,
        minHeight: '68vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>

        {/* ========================================================== */}
        {/* VIEW 1: HIDDEN CHAT / SECRET CHAT (AUTHORIZED USERS ONLY)   */}
        {/* ========================================================== */}
        {currentUser && activeTab === 'hidden' ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {/* Vault Banner */}
            <div style={{
              background: 'rgba(5, 150, 105, 0.12)',
              borderBottom: '1px solid rgba(5, 150, 105, 0.25)',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: 'var(--text-main)',
              fontSize: '0.84rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: '700' }}>
                <Shield size={16} />
                <span>SECRET CHAT AREA UNLOCKED: Authorized Scholar Access</span>
              </div>
              <button
                onClick={() => setActiveTab('normal')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Return to AI Terminal
              </button>
            </div>

            {/* Hidden Messages Stream */}
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

            {/* Hidden Vault Input Bar */}
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
                placeholder="Broadcast transmission into the secret channel..."
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
                <span>Send</span>
              </button>
            </form>
          </div>
        ) : (

          /* ========================================================== */
          /* VIEW 2: STANDARD AI CHAT / LOCKED PUBLIC PREVIEW          */
          /* ========================================================== */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* If user is NOT authenticated: Show BiteMoji mysterious prompts & locked privacy indicators */}
              {!currentUser && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
                  <div style={{
                    background: 'rgba(79, 70, 229, 0.08)',
                    border: '1px solid rgba(79, 70, 229, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: 'var(--text-main)',
                    fontSize: '0.84rem'
                  }}>
                    <Sparkles size={18} color="var(--accent-purple)" />
                    <span>Recent archived transmissions detected in this terminal. Some conversations remain encrypted.</span>
                  </div>

                  {/* Mysterious BiteMoji Character Prompts */}
                  {BITMOJI_CHARACTERS.map((char) => (
                    <div
                      key={char.id}
                      onClick={() => navigate('/login?redirect=hidden-chat')}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '12px 16px',
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      className="glass-card-interactive"
                    >
                      <div className={`avatar-badge ${char.badgeClass}`}>
                        {char.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}>{char.name}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{char.time}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          "{char.text}"
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Locked Privacy Card */}
                  <div className="message-locked-card">
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(37, 99, 235, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px auto'
                    }}>
                      <Lock size={22} color="var(--accent-blue)" />
                    </div>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', marginBottom: '6px' }}>Private Conversations Locked</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: '420px', margin: '0 auto 16px auto' }}>
                      You have incoming student & AI peer discussions waiting. In accordance with platform privacy, message content is protected until you sign in.
                    </p>

                    <div className="blur-preview" style={{ marginBottom: '16px', fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                      “Hey, I left the solutions for the discrete mathematics worksheet in the secret vault...”
                    </div>

                    <button
                      onClick={() => navigate('/login?redirect=hidden-chat')}
                      className="btn-primary"
                      style={{ padding: '8px 24px' }}
                    >
                      Unlock & Sign In to Chat
                    </button>
                  </div>
                </div>
              )}

              {/* Authenticated AI Messages */}
              {currentUser && messages.map((msg) => (
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
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--mystic-gradient)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      color: '#fff'
                    }}>
                      🤖
                    </div>
                  )}
                  <div style={{
                    maxWidth: '75%',
                    padding: '12px 18px',
                    borderRadius: msg.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.isUser ? 'var(--scholar-gradient)' : 'var(--bg-input)',
                    border: msg.isUser ? 'none' : '1px solid var(--border-color)',
                    color: msg.isUser ? '#ffffff' : 'var(--text-main)',
                    fontSize: '0.92rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-blue)', fontSize: '0.84rem' }}>
                  <Sparkles size={16} className="animate-spin" />
                  <span>Nipix AI Scholar is synthesizing response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder={currentUser ? "Ask AI study assistant or consult research..." : "Sign in to send messages..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="input-field"
                style={{ borderRadius: 'var(--radius-full)', padding: '12px 20px' }}
              />
              <button
                type="submit"
                className="btn-primary"
                style={{ borderRadius: 'var(--radius-full)', padding: '12px 20px', flexShrink: 0 }}
              >
                <Send size={16} />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default Chat;