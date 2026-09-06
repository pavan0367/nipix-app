import React from 'react';
import NipixLogo from '../NipixLogo';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: 'var(--text-muted)',
      gap: '14px'
    }}>
      <NipixLogo size={48} style={{ borderRadius: '12px' }} glow />
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#fff', fontWeight: '500' }}>{text}</p>
    </div>
  );
};

export default Loader;
