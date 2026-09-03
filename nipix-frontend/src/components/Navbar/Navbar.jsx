import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, MessageSquare, BookOpen, User, LogIn, Compass, Newspaper, Film } from 'lucide-react';

const Navbar = ({ currentUser }) => {
  const location = useLocation();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 80,
      background: 'rgba(11, 12, 16, 0.85)',
      backdropFilter: 'blur(16px)',
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
            boxShadow: '0 0 12px rgba(0, 242, 254, 0.3)'
          }}>
            <Sparkles size={18} color="#041421" />
          </div>
          <span className="brand-logo" style={{ fontSize: '1.25rem' }}>Nipix <span style={{ fontSize: '0.8rem', opacity: 0.7, fontWeight: 500 }}>AI Scholar</span></span>
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

      {/* Right Controls: PROMINENT CHAT BUTTON in TOP-RIGHT CORNER */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              border: '1px solid rgba(255,255,255,0.2)'
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
