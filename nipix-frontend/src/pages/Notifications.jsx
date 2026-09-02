import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, clearUnread } from '../store/slices/notificationSlice';

const Notifications = () => {
  const dispatch = useDispatch();
  const list = useSelector((state) => state.notification?.list) || [];

  useEffect(() => {
    dispatch(fetchNotifications());
    dispatch(clearUnread());
  }, [dispatch]);

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px' }}>
      <h2>Notifications</h2>
      {list.length === 0 ? <p>No notifications yet.</p> : list.map(notif => (
        <div key={notif.id || Math.random()} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 0', borderBottom: '1px solid #efefef', background: notif.isRead ? 'transparent' : '#f0f8ff' }}>
          <img src={notif.sender?.profile_image || 'https://via.placeholder.com/40'} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <p style={{ margin: 0 }}>
            <strong>{notif.sender?.username}</strong> {notif.message}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;