import React from 'react';
import { Sparkles } from 'lucide-react';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      color: 'var(--text-muted)',
      gap: '12px'
    }}>
      <Sparkles size={28} className="animate-spin" color="var(--accent-blue)" />
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#fff' }}>{text}</p>
    </div>
  );
};

export default Loader;
