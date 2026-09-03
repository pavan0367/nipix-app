import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  Search,
  Compass,
  Film,
  MessageSquare,
  Bell,
  PlusSquare,
  Bookmark,
  Settings,
  User,
  LogOut,
} from 'lucide-react';

const Sidebar = ({ currentUser, onLogout, onOpenCreate }) => {
  return (
    <aside className="sidebar">
      <div className="brand-container" style={{ marginBottom: '24px', paddingLeft: '8px' }}>
        <Link to="/home" className="brand-logo">Nipix</Link>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
        <NavLink to="/home" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={22} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Search size={22} />
          <span>Search</span>
        </NavLink>

        <NavLink to="/explore" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Compass size={22} />
          <span>Explore</span>
        </NavLink>

        <NavLink to="/reels" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Film size={22} />
          <span>Reels</span>
        </NavLink>

        <NavLink to="/messages" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <MessageSquare size={22} />
          <span>Messages</span>
        </NavLink>

        <NavLink to="/notifications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Bell size={22} />
          <span>Notifications</span>
        </NavLink>

        <button onClick={onOpenCreate} className="nav-item" style={{ cursor: 'pointer' }}>
          <PlusSquare size={22} color="var(--accent-blue)" />
          <span style={{ color: 'var(--accent-blue)' }}>Create</span>
        </button>

        <NavLink to="/saved" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Bookmark size={22} />
          <span>Saved</span>
        </NavLink>

        <NavLink to={`/profile/${currentUser?.username || currentUser?.id}`} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={22} />
          <span>Profile</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={22} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', marginBottom: '8px' }}>
          <div className="story-ring" style={{ padding: '2px' }}>
            <div className="story-avatar" style={{ width: '36px', height: '36px', background: 'var(--accent-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
              {(currentUser?.username || 'U')[0].toUpperCase()}
            </div>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', margin: 0 }}>
              {currentUser?.username || 'User'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>@{currentUser?.username || 'nipix'}</p>
          </div>
        </div>

        <button onClick={onLogout} className="nav-item" style={{ color: '#ef4444' }}>
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
