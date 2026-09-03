import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageSquare, Search, PlusSquare } from 'lucide-react';

const Navbar = ({ currentUser, onOpenCreate }) => {
  return (
    <header style={{
      display: 'none',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(15, 15, 18, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 20px',
      justifyContent: 'space-between',
      alignItems: 'center'
    }} className="mobile-header">
      <Link to="/feed" className="brand-logo" style={{ fontSize: '1.8rem' }}>Nipix</Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={onOpenCreate} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <PlusSquare size={22} />
        </button>
        <Link to="/notifications" style={{ color: '#fff', textDecoration: 'none' }}>
          <Heart size={22} />
        </Link>
        <Link to="/chat" style={{ color: '#fff', textDecoration: 'none' }}>
          <MessageSquare size={22} />
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
