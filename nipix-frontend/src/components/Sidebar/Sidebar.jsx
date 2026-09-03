import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Newspaper,
  Film,
  Compass,
  MessageSquare,
  Bookmark,
  Settings,
  User,
  LogOut,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';

const Sidebar = ({ currentUser, onLogout }) => {
  return (
    <aside className="sidebar">
      <div>
        {/* Brand Header */}
        <div style={{ marginBottom: '28px', padding: '0 8px' }}>
          <Link to="/home" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'var(--scholar-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 242, 254, 0.35)'
            }}>
              <Sparkles size={20} color="#041421" />
            </div>
            <div>
              <span className="brand-logo" style={{ fontSize: '1.25rem', lineHeight: '1.2' }}>Nipix</span>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                AI Learning Hub
              </p>
            </div>
          </Link>
        </div>

        {/* Academic Learning Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Home size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/study" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <BookOpen size={20} />
            <span>Study Materials</span>
          </NavLink>

          <NavLink to="/news" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Newspaper size={20} />
            <span>Tech & News</span>
          </NavLink>

          <NavLink to="/youtube" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Film size={20} />
            <span>Video Lectures</span>
          </NavLink>

          <NavLink to="/explore" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Compass size={20} />
            <span>Explore Science</span>
          </NavLink>

          <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={20} />
            <span>AI & Chat</span>
          </NavLink>

          <NavLink to="/saved" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Bookmark size={20} />
            <span>Saved Notes</span>
          </NavLink>

          {currentUser && (
            <NavLink to={`/profile/${currentUser?.username || currentUser?.id}`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <User size={20} />
              <span>Scholar Profile</span>
            </NavLink>
          )}

          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* User / Auth Bottom Profile Area */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
        {currentUser ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '6px 10px', marginBottom: '8px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
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
                <p style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', margin: 0 }}>Active Learner</p>
              </div>
            </div>

            <button onClick={onLogout} className="nav-item" style={{ color: '#ef4444' }}>
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="btn-primary" style={{ width: '100%' }}>
            Sign In to Account
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
