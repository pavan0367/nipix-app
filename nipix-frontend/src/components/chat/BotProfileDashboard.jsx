import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  Search,
  Bell,
  BellOff,
  MoreHorizontal,
  Palette,
  Sliders,
  ShieldCheck,
  Tag,
  Users,
  ChevronRight,
  Check,
  X,
  Sparkles,
  Trash2,
  Info,
  Lock,
  MessageSquare
} from 'lucide-react';
import NipixLogo from '../NipixLogo';

/**
 * Nipix Bot Profile Dashboard
 * Matches modern Messenger / Instagram DM Chat Profile & Details layout.
 */
const BotProfileDashboard = ({
  bot,
  onBack,
  onClearChat,
  onOpenSearch,
  customNickname,
  onUpdateNickname,
  activeTheme,
  onSelectTheme,
  streamingEnabled,
  onToggleStreaming
}) => {
  // State for interactive modals and action controls
  const [isMuted, setIsMuted] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'theme' | 'controls' | 'privacy' | 'nicknames' | 'group' | 'about'
  const [nicknameInput, setNicknameInput] = useState(customNickname || '');
  const [codeFirstAnswers, setCodeFirstAnswers] = useState(true);
  const [responseStyle, setResponseStyle] = useState('balanced'); // 'concise' | 'balanced' | 'comprehensive'
  const [selectedGroupBots, setSelectedGroupBots] = useState(bot ? [bot.id] : []);
  const [groupSuccessMessage, setGroupSuccessMessage] = useState('');

  useEffect(() => {
    setNicknameInput(customNickname || '');
    if (bot) {
      setSelectedGroupBots([bot.id]);
    }
  }, [customNickname, bot?.id]);

  if (!bot) return null;

  const username = `@${bot.id}`;
  const category = bot.role || 'AI Assistant';
  const displayName = customNickname || bot.name;

  const themes = [
    { id: 'cyber', name: 'Cyber Indigo (Default)', color: '#3b82f6', bg: '#0b0f19' },
    { id: 'neon', name: 'Midnight Violet', color: '#8b5cf6', bg: '#090814' },
    { id: 'emerald', name: 'Scholar Emerald', color: '#10b981', bg: '#06140e' },
    { id: 'amber', name: 'Solar Circuit', color: '#f59e0b', bg: '#140f06' },
    { id: 'obsidian', name: 'Obsidian Minimal', color: '#94a3b8', bg: '#050507' }
  ];

  const allPeerBots = [
    { id: 'bytebot_ai', name: 'ByteBot AI', avatar: '🤖', role: 'Programming' },
    { id: 'cipher_09', name: 'Cipher_09', avatar: '🔮', role: 'Cryptography' },
    { id: 'spark_x', name: 'Spark_X', avatar: '⚡', role: 'Electrical / Physics' },
    { id: 'archivist', name: 'Archivist', avatar: '📚', role: 'Research / History' },
    { id: 'novamind', name: 'NovaMind', avatar: '🧠', role: 'Mathematics' },
    { id: 'aether', name: 'Aether', avatar: '🌌', role: 'Innovation / Future Tech' }
  ];

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSaveNickname = (e) => {
    if (e) e.preventDefault();
    onUpdateNickname(nicknameInput.trim());
    setActiveModal(null);
  };

  const handleResetNickname = () => {
    setNicknameInput('');
    onUpdateNickname('');
    setActiveModal(null);
  };

  const toggleGroupBotSelection = (peerId) => {
    if (selectedGroupBots.includes(peerId)) {
      if (selectedGroupBots.length > 1) {
        setSelectedGroupBots(selectedGroupBots.filter((id) => id !== peerId));
      }
    } else {
      setSelectedGroupBots([...selectedGroupBots, peerId]);
    }
  };

  const handleCreateGroupChat = () => {
    setGroupSuccessMessage(`Group session initiated with ${selectedGroupBots.length} scholars!`);
    setTimeout(() => {
      setGroupSuccessMessage('');
      setActiveModal(null);
    }, 1800);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        background: '#090d16',
        color: '#f8fafc',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* ---------------------------------------------------- */}
      {/* TOP APP BAR / BACK NAVIGATION                        */}
      {/* ---------------------------------------------------- */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          background: 'rgba(11, 15, 25, 0.95)',
          backdropFilter: 'blur(10px)',
          flexShrink: 0,
          zIndex: 10
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '9999px',
            padding: '7px 14px',
            color: '#e2e8f0',
            fontSize: '0.82rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)')}
          title="Back to Chat"
        >
          <ArrowLeft size={16} />
          <span>Chat</span>
        </button>

        <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.5px' }}>
          Details
        </span>

        {/* Top Right Options Menu Button */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title="Options"
          >
            <MoreHorizontal size={18} />
          </button>

          {/* Options Dropdown Popup Menu */}
          {showOptionsDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '44px',
                right: '0',
                width: '180px',
                background: '#151b2b',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '6px',
                boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                zIndex: 50
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowOptionsDropdown(false);
                  setActiveModal('about');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#e2e8f0',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Info size={15} color="#38bdf8" />
                <span>About Bot</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowOptionsDropdown(false);
                  setActiveModal('theme');
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#e2e8f0',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Palette size={15} color="#c084fc" />
                <span>Theme</span>
              </button>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '4px 0' }} />

              <button
                type="button"
                onClick={() => {
                  setShowOptionsDropdown(false);
                  if (window.confirm(`Clear entire conversation with ${bot.name}?`)) {
                    onClearChat();
                    onBack();
                  }
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'transparent',
                  color: '#f87171',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <Trash2 size={15} />
                <span>Clear Chat</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SCROLLABLE PROFILE CONTENT                           */}
      {/* ---------------------------------------------------- */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px 20px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{ width: '100%', maxWidth: '520px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* 1. Large Circular Avatar + Online Dot */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <div
              className={`avatar-badge ${bot.badgeClass}`}
              style={{
                width: '92px',
                height: '92px',
                fontSize: '2.8rem',
                border: `3px solid ${bot.accentColor || '#3b82f6'}`,
                boxShadow: `0 0 24px ${bot.accentColor ? bot.accentColor + '40' : 'rgba(59, 130, 246, 0.3)'}`
              }}
            >
              {bot.avatar}
            </div>
            {/* Active Green Dot */}
            <div
              style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#10b981',
                border: '3px solid #090d16',
                boxShadow: '0 0 8px #10b981'
              }}
            />
          </div>

          {/* 2. Bot Name & Username */}
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#ffffff', margin: '0 0 4px 0', textAlign: 'center' }}>
            {displayName}
          </h2>

          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '6px', fontWeight: '500' }}>
            {username}
          </div>

          {/* 3. Category / Subject */}
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: '600',
              color: '#38bdf8',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '4px 14px',
              borderRadius: '9999px',
              marginBottom: '12px',
              textAlign: 'center'
            }}
          >
            {category}
          </div>

          {/* Online status indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#10b981', marginBottom: '6px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
            <span>Active now</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '24px' }}>
            <NipixLogo size={14} style={{ borderRadius: '3px' }} />
            <span>Official Nipix AI Specialist</span>
          </div>

          {/* ---------------------------------------------------- */}
          {/* TOP ACTION BUTTONS (4 Circular Buttons in Row)       */}
          {/* 1. Profile  2. Search  3. Mute  4. Options          */}
          {/* ---------------------------------------------------- */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '26px',
              width: '100%',
              marginBottom: '32px'
            }}
          >
            {/* 1. Profile Button */}
            <button
              type="button"
              onClick={() => setActiveModal('about')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#e2e8f0'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              >
                <User size={20} />
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: '600', color: '#94a3b8' }}>Profile</span>
            </button>

            {/* 2. Search Button */}
            <button
              type="button"
              onClick={() => {
                onBack();
                onOpenSearch?.();
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#e2e8f0'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              >
                <Search size={20} />
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: '600', color: '#94a3b8' }}>Search</span>
            </button>

            {/* 3. Mute Button */}
            <button
              type="button"
              onClick={handleToggleMute}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#e2e8f0'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: isMuted ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255, 255, 255, 0.08)',
                  border: isMuted ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isMuted ? '#f87171' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = isMuted ? 'rgba(239,68,68,0.25)' : 'rgba(255, 255, 255, 0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = isMuted ? 'rgba(239,68,68,0.18)' : 'rgba(255, 255, 255, 0.08)')}
              >
                {isMuted ? <BellOff size={20} /> : <Bell size={20} />}
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: '600', color: isMuted ? '#f87171' : '#94a3b8' }}>
                {isMuted ? 'Muted' : 'Mute'}
              </span>
            </button>

            {/* 4. Options Button */}
            <button
              type="button"
              onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#e2e8f0'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
              >
                <MoreHorizontal size={20} />
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: '600', color: '#94a3b8' }}>Options</span>
            </button>
          </div>

          {/* ---------------------------------------------------- */}
          {/* PROFILE OPTIONS LIST CONTAINER                       */}
          {/* ---------------------------------------------------- */}
          <div
            style={{
              width: '100%',
              background: '#111726',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Item 1: Theme (AI theme) */}
            <div
              onClick={() => setActiveModal('theme')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c084fc'
                  }}
                >
                  <Palette size={19} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#f1f5f9' }}>Theme</div>
                  <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: '1px' }}>AI theme</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: bot.accentColor || '#3b82f6',
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}
                />
                <ChevronRight size={18} color="#64748b" />
              </div>
            </div>

            {/* Item 2: Chat controls */}
            <div
              onClick={() => setActiveModal('controls')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#60a5fa'
                  }}
                >
                  <Sliders size={19} />
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#f1f5f9' }}>Chat controls</div>
              </div>

              <ChevronRight size={18} color="#64748b" />
            </div>

            {/* Item 3: Privacy & safety */}
            <div
              onClick={() => setActiveModal('privacy')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#34d399'
                  }}
                >
                  <ShieldCheck size={19} />
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#f1f5f9' }}>Privacy & safety</div>
              </div>

              <ChevronRight size={18} color="#64748b" />
            </div>

            {/* Item 4: Nicknames */}
            <div
              onClick={() => {
                setNicknameInput(customNickname || '');
                setActiveModal('nicknames');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fbbf24'
                  }}
                >
                  <Tag size={19} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#f1f5f9' }}>Nicknames</div>
                  {customNickname && (
                    <div style={{ fontSize: '0.74rem', color: '#fbbf24', marginTop: '1px' }}>
                      Active: {customNickname}
                    </div>
                  )}
                </div>
              </div>

              <ChevronRight size={18} color="#64748b" />
            </div>

            {/* Item 5: Create a group chat */}
            <div
              onClick={() => setActiveModal('group')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 18px',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(236, 72, 153, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f472b6'
                  }}
                >
                  <Users size={19} />
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#f1f5f9' }}>Create a group chat</div>
              </div>

              <ChevronRight size={18} color="#64748b" />
            </div>
          </div>

        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MODAL / BOTTOM SHEET POPUPS                          */}
      {/* ---------------------------------------------------- */}

      {/* 1. Theme Modal */}
      {activeModal === 'theme' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 100
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '400px',
              background: '#151b2b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '18px',
              padding: '22px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={20} color="#c084fc" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>AI Theme</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 16px' }}>
              Select a custom color palette for {bot.name}'s conversation view:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {themes.map((t) => (
                <div
                  key={t.id}
                  onClick={() => {
                    onSelectTheme?.(t.id);
                    setActiveModal(null);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: t.color,
                        boxShadow: `0 0 10px ${t.color}80`
                      }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>{t.name}</span>
                  </div>
                  {activeTheme === t.id && <Check size={18} color="#10b981" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Chat Controls Modal */}
      {activeModal === 'controls' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 100
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#151b2b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '18px',
              padding: '22px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={20} color="#60a5fa" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Chat Controls</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Control 1: Streaming Mode */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Real-time Streaming</div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Stream AI responses token-by-token</div>
              </div>
              <input
                type="checkbox"
                checked={streamingEnabled !== false}
                onChange={() => onToggleStreaming?.()}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            {/* Control 2: Code First Answers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>Code-First Output</div>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8' }}>Present working code snippets before explanation</div>
              </div>
              <input
                type="checkbox"
                checked={codeFirstAnswers}
                onChange={() => setCodeFirstAnswers(!codeFirstAnswers)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
            </div>

            {/* Control 3: Response Depth Style */}
            <div style={{ padding: '14px 0 6px' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '8px' }}>Response Length Style</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {['concise', 'balanced', 'detailed'].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => setResponseStyle(style)}
                    style={{
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: responseStyle === style ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                      background: responseStyle === style ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.04)',
                      color: responseStyle === style ? '#93c5fd' : '#94a3b8',
                      fontSize: '0.78rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              style={{
                width: '100%',
                marginTop: '18px',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: '#3b82f6',
                color: '#ffffff',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 3. Privacy & Safety Modal */}
      {activeModal === 'privacy' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 100
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#151b2b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '18px',
              padding: '22px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#34d399" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Privacy & Safety</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.84rem' }}>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ fontWeight: '700', color: '#34d399', marginBottom: '4px' }}>Client-Side Privacy</div>
                <div style={{ color: '#cbd5e1', lineHeight: '1.4' }}>
                  Your chat transcripts with {bot.name} are stored securely in your browser's local sandbox storage. No secret keys or credentials are leaked to third parties.
                </div>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontWeight: '700', color: '#f8fafc', marginBottom: '4px' }}>AI Safety Protocols</div>
                <div style={{ color: '#94a3b8', lineHeight: '1.4' }}>
                  Safety filters are configured to uphold academic integrity, secure coding standards, and verify logical reasoning without biased hallucination.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              style={{
                width: '100%',
                marginTop: '18px',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: '#10b981',
                color: '#ffffff',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 4. Nicknames Modal */}
      {activeModal === 'nicknames' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 100
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '380px',
              background: '#151b2b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '18px',
              padding: '22px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={20} color="#fbbf24" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Edit Nickname</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 14px' }}>
              Customize {bot.name}'s display name for your chat sessions:
            </p>

            <form onSubmit={handleSaveNickname}>
              <input
                type="text"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder={bot.name}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'rgba(0,0,0,0.3)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  marginBottom: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleResetNickname}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'transparent',
                    color: '#94a3b8',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#f59e0b',
                    color: '#ffffff',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Create Group Chat Modal */}
      {activeModal === 'group' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 100
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#151b2b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '18px',
              padding: '22px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={20} color="#f472b6" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>Create Group Session</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: '0 0 14px' }}>
              Invite peer scholars to join {bot.name} in a collaborative session:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto', marginBottom: '16px' }}>
              {allPeerBots.map((peer) => {
                const isSelected = selectedGroupBots.includes(peer.id);
                return (
                  <div
                    key={peer.id}
                    onClick={() => toggleGroupBotSelection(peer.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      background: isSelected ? 'rgba(236, 72, 153, 0.12)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid rgba(236, 72, 153, 0.35)' : '1px solid rgba(255,255,255,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.3rem' }}>{peer.avatar}</span>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>{peer.name}</div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{peer.role}</div>
                      </div>
                    </div>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.2)',
                        background: isSelected ? '#ec4899' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {isSelected && <Check size={14} color="#ffffff" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {groupSuccessMessage && (
              <div style={{ color: '#34d399', fontSize: '0.82rem', textAlign: 'center', marginBottom: '10px' }}>
                {groupSuccessMessage}
              </div>
            )}

            <button
              type="button"
              onClick={handleCreateGroupChat}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                color: '#ffffff',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Start Group Session ({selectedGroupBots.length})
            </button>
          </div>
        </div>
      )}

      {/* 6. About Bot Modal */}
      {activeModal === 'about' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            zIndex: 100
          }}
          onClick={() => setActiveModal(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#151b2b',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '18px',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <NipixLogo size={24} style={{ borderRadius: '6px' }} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800' }}>About {bot.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.84rem' }}>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.74rem', marginBottom: '2px' }}>Role & Focus</div>
                <div style={{ fontWeight: '700', color: '#f8fafc' }}>{bot.role}</div>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.74rem', marginBottom: '2px' }}>Domain Specialty</div>
                <div style={{ color: '#cbd5e1', lineHeight: '1.4' }}>{bot.specialty}</div>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.74rem', marginBottom: '2px' }}>Engine & Capabilities</div>
                <div style={{ color: '#38bdf8', fontWeight: '600' }}>Google Gemini (gemini-3.5-flash-lite) + Groq Fallback</div>
                <div style={{ color: '#94a3b8', fontSize: '0.74rem', marginTop: '2px' }}>Full markdown, code formatting, multi-turn context retention</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              style={{
                width: '100%',
                marginTop: '18px',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: '#3b82f6',
                color: '#ffffff',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BotProfileDashboard;
