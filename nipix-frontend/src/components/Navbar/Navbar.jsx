import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, MessageSquare, BookOpen, User, LogIn, Compass, Newspaper, Film, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ currentUser }) => {
  const location = useLocation();
  const { themeMode, activeTheme, changeTheme } = useTheme();

  // Cycle theme: light -> dark -> system -> light
  const handleCycleTheme = () => {
    if (themeMode === 'light') changeTheme('dark');
    else if (themeMode === 'dark') changeTheme('system');
    else changeTheme('light');
  };

  const getThemeIcon = () => {
    if (themeMode === 'system') return <Laptop size={17} title="Theme: Same as Device" />;
    if (themeMode === 'light') return <Sun size={17} title="Theme: Light Mode" />;
    return <Moon size={17} title="Theme: Dark Mode" />;
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 80,
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      {/* Brand & Scholar Level */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--scholar-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(37, 99, 235, 0.3)'
          }}>
            <Sparkles size={18} color="#ffffff" />
          </div>
          <span className="brand-logo" style={{ fontSize: '1.25rem' }}>
            Nipix <span style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 500, color: 'var(--text-dim)' }}>AI Scholar</span>
          </span>
        </Link>
      </div>

      {/* Center Quick Nav Pills (Desktop) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="desktop-quick-nav">
        <Link to="/study" className={`category-pill ${location.pathname === '/study' ? 'active' : ''}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BookOpen size={14} /> Study Materials
        </Link>
        <Link to="/news" className={`category-pill ${location.pathname === '/news' ? 'active' : ''}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Newspaper size={14} /> Tech News
        </Link>
        <Link to="/youtube" className={`category-pill ${location.pathname === '/youtube' ? 'active' : ''}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Film size={14} /> Lectures
        </Link>
      </div>

      {/* Right Controls: THEME TOGGLE & PROMINENT CHAT BUTTON in TOP-RIGHT CORNER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* 3-Option Theme Control (Light, Dark, Device) */}
        <div className="theme-segmented-control" title="Choose appearance theme">
          <button
            type="button"
            onClick={() => changeTheme('light')}
            className={`theme-segmented-btn ${themeMode === 'light' ? 'active' : ''}`}
            aria-label="Light Mode"
            title="Light Mode"
          >
            <Sun size={14} />
            <span className="theme-btn-text">Light</span>
          </button>
          <button
            type="button"
            onClick={() => changeTheme('dark')}
            className={`theme-segmented-btn ${themeMode === 'dark' ? 'active' : ''}`}
            aria-label="Dark Mode"
            title="Dark Mode"
          >
            <Moon size={14} />
            <span className="theme-btn-text">Dark</span>
          </button>
          <button
            type="button"
            onClick={() => changeTheme('system')}
            className={`theme-segmented-btn ${themeMode === 'system' ? 'active' : ''}`}
            aria-label="Device Theme"
            title="Same as Device"
          >
            <Laptop size={14} />
            <span className="theme-btn-text">Device</span>
          </button>
        </div>

        {/* Prominent Chat Option */}
        <Link to="/chat" className="top-chat-btn" title="Open AI & Secret Chat">
          <div className="pulse-dot" />
          <MessageSquare size={16} />
          <span>Chat</span>
        </Link>

        {currentUser ? (
          <Link to={`/profile/${currentUser.username || currentUser.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: '1px solid var(--border-color)'
            }}>
              {(currentUser.username || 'U')[0].toUpperCase()}
            </div>
          </Link>
        ) : (
          <Link to="/login" className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
            <LogIn size={14} /> Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
