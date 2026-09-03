import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, UserPlus, Bell } from 'lucide-react';
import formatDate from '../../utils/formatDate';

const NotificationItem = ({ notification }) => {
  const senderName = notification.sender?.username || 'User';
  const senderPic = notification.sender?.profile_image || notification.sender?.profilePic;

  const getIcon = () => {
    if (notification.type === 'like' || notification.message?.includes('liked')) {
      return <Heart size={14} color="#ed4956" fill="#ed4956" />;
    }
    if (notification.type === 'comment' || notification.message?.includes('commented')) {
      return <MessageCircle size={14} color="#0095f6" />;
    }
    if (notification.type === 'follow' || notification.message?.includes('followed')) {
      return <UserPlus size={14} color="#a855f7" />;
    }
    return <Bell size={14} color="#3b82f6" />;
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      padding: '12px 16px',
      borderRadius: 'var(--radius-sm)',
      background: notification.isRead ? 'transparent' : 'rgba(0, 149, 246, 0.08)',
      borderBottom: '1px solid var(--border-color)',
      transition: 'background 0.2s ease'
    }}>
      <div style={{ position: 'relative' }}>
        <Link to={`/profile/${senderName}`}>
          {senderPic ? (
            <img src={senderPic} alt="avatar" style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '42px', height: '42px', background: 'var(--accent-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
              {senderName[0].toUpperCase()}
            </div>
          )}
        </Link>
        <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: 'var(--bg-primary)', borderRadius: '50%', padding: '2px' }}>
          {getIcon()}
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#fff', lineHeight: '1.4' }}>
          <Link to={`/profile/${senderName}`} style={{ fontWeight: '700', color: '#fff', textDecoration: 'none', marginRight: '6px' }}>
            {senderName}
          </Link>
          {notification.message}
        </p>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {formatDate(notification.created_at || notification.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;
