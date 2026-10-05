import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  MessageSquare,
  BookOpen,
  LogIn,
  LogOut,
  Newspaper,
  Film,
  Menu,
  X,
  Home,
  Atom,
  Bookmark,
  Settings,
  User,
  ShieldAlert,
  Languages
} from 'lucide-react';
import NipixLogo from '../NipixLogo';

const Navbar = ({ currentUser, onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer whenever location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 80,
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          padding: '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        {/* Brand & Scholar Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile Menu Toggle Button (Visible only <= 768px via CSS) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-toggle-btn"
            aria-label="Toggle navigation menu"
            title="Navigation Menu"
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-main)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <NipixLogo size={30} />
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

        {/* Right Controls: PROMINENT CHAT BUTTON & USER / SIGN IN */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                background: (currentUser.role === 'admin' || currentUser.role === 'ADMIN') ? 'linear-gradient(135deg, #ec4899, #be185d)' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
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

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            zIndex: 998
          }}
        >
          <div
            className="mobile-nav-drawer"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: 'min(300px, 82vw)',
              background: 'var(--bg-card)',
              borderRight: '1px solid var(--border-color)',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              padding: '20px 16px',
              overflowY: 'auto',
              boxShadow: '8px 0 30px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Drawer Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', paddingBottom: '14px', borderBottom: '1px solid var(--border-color)' }}>
              <Link to="/home" onClick={() => setMobileMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <NipixLogo size={32} />
                <div>
                  <span className="brand-logo" style={{ fontSize: '1.25rem', fontWeight: '800', lineHeight: '1.1' }}>
                    Nipix
                  </span>
                  <p style={{ fontSize: '0.72rem', color: 'var(--accent-blue)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                    AI Scholar
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
              <NavLink to="/home" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Home size={18} />
                <span>Home</span>
              </NavLink>

              <NavLink to="/study" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <BookOpen size={18} />
                <span>Study Materials</span>
              </NavLink>

              <NavLink to="/study/japanese" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Languages size={18} />
                <span>Japanese Track 🇯🇵</span>
              </NavLink>

              <NavLink to="/news" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Newspaper size={18} />
                <span>Tech & News</span>
              </NavLink>

              <NavLink to="/youtube" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Film size={18} />
                <span>Video Lectures</span>
              </NavLink>

              <NavLink to="/explore" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Atom size={18} />
                <span>Explore Science</span>
              </NavLink>

              <NavLink to="/chat" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <MessageSquare size={18} />
                <span>AI & Secret Chat</span>
              </NavLink>

              <NavLink to="/saved" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Bookmark size={18} />
                <span>Saved Notes</span>
              </NavLink>

              {currentUser && (
                <NavLink to={`/profile/${currentUser?.username || currentUser?.id}`} onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                  <User size={18} />
                  <span>Scholar Profile</span>
                </NavLink>
              )}

              {/* Admin Dashboard: Visible strictly to admins */}
              {currentUser && (currentUser.role === 'admin' || currentUser.role === 'ADMIN') && (
                <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} style={{ color: '#ec4899' }}>
                  <ShieldAlert size={18} color="#ec4899" />
                  <span style={{ fontWeight: '700' }}>Admin Dashboard</span>
                </NavLink>
              )}

              <NavLink to="/settings" onClick={() => setMobileMenuOpen(false)} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                <Settings size={18} />
                <span>Settings</span>
              </NavLink>
            </nav>

            {/* User Bottom Area */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '16px' }}>
              {currentUser ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', padding: '0 4px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: (currentUser.role === 'admin' || currentUser.role === 'ADMIN') ? 'linear-gradient(135deg, #ec4899, #be185d)' : 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}>
                      {(currentUser.username || 'U')[0].toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {currentUser.username}
                      </p>
                      <p style={{ fontSize: '0.72rem', color: (currentUser.role === 'admin' || currentUser.role === 'ADMIN') ? '#ec4899' : 'var(--accent-emerald)', margin: 0, fontWeight: '700' }}>
                        ● Scholar Online
                      </p>
                    </div>
                  </div>
                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="nav-item"
                      style={{ width: '100%', background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <LogOut size={18} color="#f87171" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', fontSize: '0.86rem', textDecoration: 'none' }}
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
