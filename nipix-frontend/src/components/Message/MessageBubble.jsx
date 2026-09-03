import React from 'react';

const MessageBubble = ({ message, isCurrentUser }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
      marginBottom: '6px'
    }}>
      <div style={{
        maxWidth: '65%',
        padding: '10px 16px',
        borderRadius: isCurrentUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isCurrentUser ? 'var(--accent-blue)' : 'var(--bg-input)',
        color: '#fff',
        fontSize: '0.9rem',
        lineHeight: '1.4',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        {message.messageText || message.text}
      </div>
    </div>
  );
};

export default MessageBubble;
