import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage } from '../store/slices/messageSlice';
import useSocket from '../hooks/useSocket';

const Chat = ({ conversationId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message?.messages) || [];
  const currentUser = useSelector((state) => state.auth?.user);
  const [text, setText] = useState('');

  useSocket(currentUser?.id); // Initialize socket

  useEffect(() => {
    if (conversationId) dispatch(fetchMessages(conversationId));
  }, [dispatch, conversationId]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(sendMessage({ conversationId, text }));
    setText('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', border: '1px solid #dbdbdb', borderRadius: '8px', height: '500px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#fafafa' }}>
        {messages.map((msg) => (
          <div key={msg.id || Math.random()} style={{ 
            textAlign: msg.senderId === currentUser?.id ? 'right' : 'left', 
            marginBottom: '10px' 
          }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '10px 15px', 
              borderRadius: '20px', 
              background: msg.senderId === currentUser?.id ? '#0095f6' : '#efefef',
              color: msg.senderId === currentUser?.id ? 'white' : 'black'
            }}>
              {msg.messageText}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #dbdbdb' }}>
        <input 
          type="text" 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="Type a message..." 
          style={{ flex: 1, padding: '10px', border: '1px solid #dbdbdb', borderRadius: '20px' }} 
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px', background: '#0095f6', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>Send</button>
      </form>
    </div>
  );
};

export default Chat;