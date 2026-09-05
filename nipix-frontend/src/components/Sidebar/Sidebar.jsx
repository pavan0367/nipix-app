import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Newspaper,
  Film,
  Atom,
  MessageSquare,
  Bookmark,
  Settings,
  User,
  LogOut,
  Sparkles,
  LogIn
} from 'lucide-react';

const Sidebar = ({ currentUser, onLogout }) => {
  return (
    <aside className="sidebar">
      <div>
        {/* Brand Header */}
        <div style={{ marginBottom: '28px', padding: '0 8px' }}>
          <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.4)',
              color: '#ffffff',
              fontSize: '1.4rem',
              fontWeight: 'bold'
            }}>
              ✦
            </div>
            <div>
              <span className="brand-logo" style={{ fontSize: '1.35rem', fontWeight: '800', lineHeight: '1.1', background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Nipix
              </span>
              <p style={{ fontSize: '0.74rem', color: 'var(--accent-blue)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '2px 0 0 0' }}>
                AI Scholar
              </p>
            </div>
          </Link>
        </div>

        {/* Academic Learning Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Home size={19} />
            <span>Home</span>
          </NavLink>

          <NavLink to="/study" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BookOpen size={19} />
            <span>Study Materials</span>
          </NavLink>

          <NavLink to="/news" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Newspaper size={19} />
            <span>Tech & News</span>
          </NavLink>

          <NavLink to="/youtube" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Film size={19} />
            <span>Video Lectures</span>
          </NavLink>

          <NavLink to="/explore" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Atom size={19} />
            <span>Explore Science</span>
          </NavLink>

          <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={19} />
            <span>AI & Chat</span>
          </NavLink>

          <NavLink to="/saved" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Bookmark size={19} />
            <span>Saved Notes</span>
          </NavLink>

          {currentUser && (
            <NavLink to={`/profile/${currentUser?.username || currentUser?.id}`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <User size={19} />
              <span>Scholar Profile</span>
            </NavLink>
          )}

          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={19} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* User / Auth Bottom Profile Area */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        {currentUser ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
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
                <p style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', margin: 0, fontWeight: '600' }}>Scholar Account</p>
              </div>
            </div>

            <button onClick={onLogout} className="nav-item" style={{ color: '#ef4444', width: '100%' }}>
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary" style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
            <LogIn size={18} />
            <span>Sign In to Account</span>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
