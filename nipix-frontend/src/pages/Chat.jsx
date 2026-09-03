import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage } from '../store/slices/messageSlice';
import useSocket from '../hooks/useSocket';
import { MessageSquare, Send, Paperclip, Smile, Search, Phone, Video, Info, User } from 'lucide-react';

const Chat = ({ conversationId: propConversationId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message?.messages) || [];
  const currentUser = useSelector((state) => state.auth?.user);
  const [text, setText] = useState('');
  const [activeChat, setActiveChat] = useState({
    id: propConversationId || 'conv-1',
    name: 'Nipix Community',
    username: 'community',
    online: true
  });
  const messagesEndRef = useRef(null);

  useSocket(currentUser?.id || currentUser?._id);

  const conversationList = [
    { id: 'conv-1', name: 'Nipix Support', username: 'support', avatar: null, online: true, lastMsg: 'Welcome to Nipix Messages!' },
    { id: 'conv-2', name: 'Alex Johnson', username: 'alex_j', avatar: null, online: false, lastMsg: 'Hey! Loved your recent post.' },
    { id: 'conv-3', name: 'Sarah Miller', username: 'sarah_m', avatar: null, online: true, lastMsg: 'Are we still meeting up later?' }
  ];

  useEffect(() => {
    if (activeChat.id) dispatch(fetchMessages(activeChat.id));
  }, [dispatch, activeChat.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(sendMessage({ conversationId: activeChat.id, text }));
    setText('');
  };

  const currentUserId = currentUser?.id || currentUser?._id;

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: 'calc(100vh - 140px)', minHeight: '540px' }}>
        
        {/* Left Sidebar: Conversations List */}
        <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <div style={{ padding: '18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={20} color="var(--accent-blue)" /> Messages
            </h3>
          </div>

          {/* Search Contacts */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search chats..."
                className="input-field"
                style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.85rem', borderRadius: '20px' }}
              />
            </div>
          </div>

          {/* Chat List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversationList.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  background: activeChat.id === chat.id ? 'var(--bg-hover)' : 'transparent',
                  borderLeft: activeChat.id === chat.id ? '3px solid var(--accent-blue)' : '3px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div className="story-ring" style={{ padding: '2px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--accent-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
                      {chat.name[0]}
                    </div>
                  </div>
                  {chat.online && (
                    <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', border: '2px solid var(--bg-primary)' }} />
                  )}
                </div>

                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#fff', margin: 0 }}>{chat.name}</p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {chat.lastMsg}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Active Direct Message Window */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          
          {/* Chat Room Header */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '38px', height: '38px', background: 'var(--accent-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
                  {activeChat.name[0]}
                </div>
                {activeChat.online && (
                  <div style={{ position: 'absolute', bottom: '0', right: '0', width: '9px', height: '9px', background: '#22c55e', borderRadius: '50%', border: '1.5px solid var(--bg-primary)' }} />
                )}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>{activeChat.name}</h4>
                <span style={{ fontSize: '0.75rem', color: activeChat.online ? '#22c55e' : 'var(--text-muted)' }}>
                  {activeChat.online ? 'Active now' : 'Offline'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
              <Phone size={18} style={{ cursor: 'pointer' }} />
              <Video size={18} style={{ cursor: 'pointer' }} />
              <Info size={18} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          {/* Messages Thread */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
                <MessageSquare size={36} color="var(--accent-blue)" style={{ marginBottom: '8px' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#fff' }}>Say hello to {activeChat.name} 👋</p>
                <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Send your first direct message.</p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isMe = (msg.senderId || msg.sender) === currentUserId;

                return (
                  <div
                    key={msg.id || msg._id || index}
                    style={{
                      display: 'flex',
                      justifyContent: isMe ? 'flex-end' : 'flex-start',
                      marginBottom: '4px'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '65%',
                        padding: '10px 16px',
                        borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isMe ? 'var(--accent-blue)' : 'var(--bg-input)',
                        color: '#fff',
                        fontSize: '0.9rem',
                        lineHeight: '1.4',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                      }}
                    >
                      {msg.messageText || msg.text || msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer Form */}
          <form onSubmit={handleSend} style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.01)' }}>
            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
              <Smile size={20} />
            </button>

            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Message..."
              className="input-field"
              style={{ flex: 1, padding: '10px 16px', borderRadius: '24px', fontSize: '0.9rem' }}
            />

            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}>
              <Paperclip size={20} />
            </button>

            <button
              type="submit"
              disabled={!text.trim()}
              className="btn-primary"
              style={{ padding: '10px 16px', borderRadius: '24px', opacity: text.trim() ? 1 : 0.5 }}
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Chat;