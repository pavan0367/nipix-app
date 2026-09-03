import React from 'react';

const ConversationItem = ({ conversation, isActive, onClick }) => {
  const name = conversation.name || 'Conversation';
  const lastMsg = conversation.lastMsg || conversation.lastMessage || 'Start a conversation';
  const online = conversation.online;

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        cursor: 'pointer',
        background: isActive ? 'var(--bg-hover)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--accent-blue)' : '3px solid transparent',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{ width: '42px', height: '42px', background: 'var(--accent-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
          {name[0].toUpperCase()}
        </div>
        {online && (
          <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', border: '2px solid var(--bg-primary)' }} />
        )}
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#fff', margin: 0 }}>{name}</p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {lastMsg}
        </p>
      </div>
    </div>
  );
};

export default ConversationItem;
