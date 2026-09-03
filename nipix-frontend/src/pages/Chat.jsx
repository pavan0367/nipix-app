import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Sparkles,
  Lock,
  Unlock,
  KeyRound,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  Clock,
  CheckCircle2,
  Terminal,
  Bot
} from 'lucide-react';
import { loginUser } from '../store/slices/authSlice';
import api from '../services/api';

// Bitmoji / Persona avatars for mysterious sample prompts
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

const Chat = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Chat conversation state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Secret Vault Modal State
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [vaultPassword, setVaultPassword] = useState('');
  const [vaultEmail, setVaultEmail] = useState('');
  const [vaultError, setVaultError] = useState('');
  const [vaultLoading, setVaultLoading] = useState(false);
  const [secretVaultUnlocked, setSecretVaultUnlocked] = useState(false);
  const [secretMessages, setSecretMessages] = useState([
    {
      id: 'sec-1',
      sender: 'Redacted Researcher',
      text: 'Project Nipix Neural weights v2.4 have been committed to shard 7.',
      timestamp: 'Classified'
    },
    {
      id: 'sec-2',
      sender: 'Cipher_09',
      text: 'Remember to verify the hash before deploying the study graph optimizer.',
      timestamp: 'Encrypted'
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    // If authenticated, load real welcome or user messages
    if (currentUser) {
      setMessages([
        {
          id: 'ai-welcome',
          sender: 'Nipix Study AI',
          isAi: true,
          text: `Welcome back, Scholar ${currentUser.username || ''}. How can I assist your studies today? You can ask me to explain algorithms, summarize notes, or solve math problems.`,
          time: 'Online'
        }
      ]);
    }
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiThinking]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (!currentUser) {
      // Prompt unauthenticated user to log in
      setShowVaultModal(true);
      return;
    }

    const userMsg = {
      id: Date.now().toString(),
      sender: currentUser.username || 'You',
      text: inputValue,
      isUser: true,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsAiThinking(true);

    // AI Study Assistant simulation response
    setTimeout(() => {
      let aiResponseText = `I have analyzed your query about: "${userMsg.text}". Here is the study breakdown:\n\n1. Core Principle: Focus on fundamental concepts.\n2. Application: Review practical implementation examples in the Study Materials hub.\n3. Summary: Keep exploring the connected topics!`;
      
      if (userMsg.text.toLowerCase().includes('secret') || userMsg.text.toLowerCase().includes('hidden')) {
        aiResponseText = "Looking for confidential files? Look closely at the encrypted rune symbol on the sidebar...";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'Nipix Study AI',
          isAi: true,
          text: aiResponseText,
          time: 'Just now'
        }
      ]);
      setIsAiThinking(false);
    }, 900);
  };

  // Authenticate from Secret Vault Modal
  const handleVaultLogin = async (e) => {
    e.preventDefault();
    setVaultLoading(true);
    setVaultError('');

    try {
      const result = await dispatch(loginUser({ email: vaultEmail, password: vaultPassword }));
      if (result.meta.requestStatus === 'fulfilled') {
        setSecretVaultUnlocked(true);
        setShowVaultModal(false);
      } else {
        setVaultError(result.payload?.message || 'Access Denied: Invalid Security Credentials');
      }
    } catch (err) {
      setVaultError('Failed to access secure channel.');
    } finally {
      setVaultLoading(false);
    }
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
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: 'var(--shadow-glow-purple)'
          }}>
            <Bot size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Nipix AI Scholar Terminal
              <span style={{ fontSize: '0.72rem', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', padding: '2px 8px', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.3)' }}>
                Online
              </span>
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Encrypted Study Channel & AI Research Mentor
            </p>
          </div>
        </div>

        {/* Secret Chat Concept: Small, subtle, clearly clickable hidden vault icon on side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setShowVaultModal(true)}
            className="secret-glyph-btn"
            title="Encrypted Secret Vault"
            aria-label="Secret Vault"
          >
            {secretVaultUnlocked ? <Unlock size={17} /> : <KeyRound size={17} />}
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="glass-card" style={{
        maxWidth: '920px',
        margin: '0 auto',
        width: '100%',
        flex: 1,
        minHeight: '68vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
        
        {/* Messages Scroll Area */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* 1. INITIAL EXPERIENCE FOR UNAUTHENTICATED OR NEW USERS: Bitmoji-Style Mysterious Messages */}
          {!currentUser && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#c7d2fe',
                fontSize: '0.84rem'
              }}>
                <Sparkles size={18} color="#a855f7" />
                <span>Recent archived transmissions detected in this terminal. Some conversations remain encrypted.</span>
              </div>

              {/* Bitmoji Character Prompt Bubbles */}
              {BITMOJI_CHARACTERS.map((char) => (
                <div
                  key={char.id}
                  onClick={() => setShowVaultModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
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
                      <span style={{ fontWeight: '700', fontSize: '0.85rem', color: '#fff' }}>{char.name}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{char.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#e2e8f0', fontStyle: 'italic' }}>
                      "{char.text}"
                    </p>
                  </div>
                </div>
              ))}

              {/* 2. CHAT PRIVACY RULE: Locked & Blurred Incoming Messages for Unauthenticated Users */}
              <div className="message-locked-card">
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(79, 172, 254, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto'
                }}>
                  <Lock size={22} color="var(--accent-cyan)" />
                </div>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '6px' }}>Private Conversations Locked</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', maxWidth: '420px', margin: '0 auto 16px auto' }}>
                  You have incoming student & AI peer discussions waiting. In accordance with platform privacy, message content is protected until you sign in.
                </p>

                {/* Blurred Content Preview */}
                <div className="blur-preview" style={{ marginBottom: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>
                  “Hey, I left the solutions for the discrete mathematics worksheet in the secret vault...”
                </div>

                <button
                  onClick={() => setShowVaultModal(true)}
                  className="btn-primary"
                  style={{ padding: '8px 24px' }}
                >
                  Unlock & Sign In
                </button>
              </div>
            </div>
          )}

          {/* Authenticated Messages Stream */}
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
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.9rem'
                }}>
                  🤖
                </div>
              )}
              <div style={{
                maxWidth: '75%',
                padding: '12px 18px',
                borderRadius: msg.isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: msg.isUser ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'rgba(255, 255, 255, 0.05)',
                border: msg.isUser ? 'none' : '1px solid var(--border-color)',
                color: '#fff',
                fontSize: '0.92rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {/* AI Thinking Indicator */}
          {isAiThinking && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontSize: '0.84rem' }}>
              <Sparkles size={16} className="animate-spin" />
              <span>Nipix AI Scholar is synthesizing response...</span>
            </div>
          )}

          {/* Secret Vault Revealed Section (When Unlocked) */}
          {secretVaultUnlocked && (
            <div style={{
              marginTop: '20px',
              padding: '18px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: '700', marginBottom: '12px' }}>
                <Shield size={18} />
                <span>SECRET VAULT CHANNEL UNLOCKED</span>
              </div>
              {secretMessages.map((sMsg) => (
                <div key={sMsg.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#6ee7b7' }}>
                    <span>From: {sMsg.sender}</span>
                    <span>{sMsg.timestamp}</span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#ecfdf5' }}>{sMsg.text}</p>
                </div>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} style={{
          padding: '14px 20px',
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(11, 12, 16, 0.95)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <input
            type="text"
            placeholder={currentUser ? "Ask AI study assistant or chat with peers..." : "Sign in to send messages..."}
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

      {/* ========================================================== */}
      {/* 3. SECRET CHAT CONCEPT: Protected Vault Login Modal        */}
      {/* ========================================================== */}
      {showVaultModal && (
        <div className="modal-backdrop" onClick={() => setShowVaultModal(false)}>
          <div className="glass-card" onClick={(e) => e.stopPropagation()} style={{
            maxWidth: '420px',
            width: '100%',
            padding: '32px',
            background: 'rgba(10, 11, 16, 0.95)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(16, 185, 129, 0.15)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px auto',
                border: '1px solid rgba(16, 185, 129, 0.4)'
              }}>
                <Lock size={24} color="#34d399" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', margin: '0 0 6px 0' }}>
                Secure Channel Authentication
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                Enter your scholar credentials to decrypt private transmissions and access the secret repository.
              </p>
            </div>

            {vaultError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '18px',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={16} />
                <span>{vaultError}</span>
              </div>
            )}

            <form onSubmit={handleVaultLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                  Email or Scholar ID
                </label>
                <input
                  type="email"
                  placeholder="scholar@nipix.edu"
                  value={vaultEmail}
                  onChange={(e) => setVaultEmail(e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: '600' }}>
                  Passcode / Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={vaultPassword}
                  onChange={(e) => setVaultPassword(e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={vaultLoading}
                className="btn-vault"
                style={{ width: '100%', padding: '12px', marginTop: '6px' }}
              >
                {vaultLoading ? 'Decrypting Credentials...' : 'Authenticate & Access'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={() => { setShowVaultModal(false); navigate('/login'); }}
                style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Standard Login Page
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Chat;