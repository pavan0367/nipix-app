import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, clearUnread } from '../store/slices/notificationSlice';
import { Link } from 'react-router-dom';
import { Bell, Heart, MessageCircle, UserPlus, CheckCheck } from 'lucide-react';

const Notifications = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.notification?.list) || [];
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(clearUnread());
  }, [dispatch]);

  const filteredList = list.filter(notif => {
    if (filter === 'likes') return notif.type === 'like' || notif.message?.includes('liked');
    if (filter === 'comments') return notif.type === 'comment' || notif.message?.includes('commented');
    if (filter === 'follows') return notif.type === 'follow' || notif.message?.includes('followed');
    return true;
  });

  const getNotificationIcon = (notif) => {
    if (notif.type === 'like' || notif.message?.includes('liked')) return <Heart size={16} color="#ed4956" fill="#ed4956" />;
    if (notif.type === 'comment' || notif.message?.includes('commented')) return <MessageCircle size={16} color="#0095f6" />;
    if (notif.type === 'follow' || notif.message?.includes('followed')) return <UserPlus size={16} color="#a855f7" />;
    return <Bell size={16} color="#3b82f6" />;
  };

  return (
    <div style={{ maxWidth: '640px', margin: '30px auto', padding: '0 16px' }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={24} color="var(--accent-blue)" /> Notifications
          </h2>
          <button
            onClick={() => dispatch(clearUnread())}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', 'likes', 'comments', 'follows'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid var(--border-color)',
                background: filter === t ? 'var(--accent-blue)' : 'rgba(255,255,255,0.05)',
                color: filter === t ? '#fff' : 'var(--text-muted)',
                fontSize: '0.82rem',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="glass-card" style={{ padding: '8px' }}>
        {filteredList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
            <Bell size={40} color="var(--text-muted)" style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ fontSize: '0.95rem', margin: 0 }}>No notifications yet</p>
            <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Activity from your followers and likes will show up here.</p>
          </div>
        ) : (
          filteredList.map((notif, index) => {
            const senderName = notif.sender?.username || 'User';
            const senderPic = notif.sender?.profile_image || notif.sender?.profilePic;

            return (
              <div
                key={notif.id || notif._id || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  borderRadius: 'var(--radius-sm)',
                  background: notif.isRead ? 'transparent' : 'rgba(0, 149, 246, 0.08)',
                  borderBottom: index !== filteredList.length - 1 ? '1px solid var(--border-color)' : 'none',
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Link to={`/profile/${senderName}`}>
                    {senderPic ? (
                      <img src={senderPic} alt="avatar" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '44px', height: '44px', background: 'var(--accent-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                        {senderName[0].toUpperCase()}
                      </div>
                    )}
                  </Link>
                  <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', background: 'var(--bg-primary)', borderRadius: '50%', padding: '2px' }}>
                    {getNotificationIcon(notif)}
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#fff', lineHeight: '1.4' }}>
                    <Link to={`/profile/${senderName}`} style={{ fontWeight: '700', color: '#fff', textDecoration: 'none', marginRight: '6px' }}>
                      {senderName}
                    </Link>
                    {notif.message || 'interacted with your post.'}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

export default Notifications;