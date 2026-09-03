import React from 'react';
import { Link } from 'react-router-dom';
import FollowButton from '../FollowButton';

const UserCard = ({ user, onFollowToggle, showFollow = true }) => {
  const username = user?.username || 'user';
  const fullName = user?.full_name || user?.name || '';
  const profilePic = user?.profile_image || user?.profilePic;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderRadius: 'var(--radius-sm)',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px solid var(--border-color)'
    }}>
      <Link to={`/profile/${username}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#fff' }}>
        <div className="story-ring" style={{ padding: '2px' }}>
          {profilePic ? (
            <img src={profilePic} alt={username} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '40px', height: '40px', background: 'var(--accent-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
              {username[0].toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: 0 }}>@{username}</p>
          {fullName && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>{fullName}</p>}
        </div>
      </Link>

      {showFollow && (
        <FollowButton
          isFollowing={user?.isFollowing}
          onToggle={(val) => onFollowToggle && onFollowToggle(user.id, val)}
          size="small"
        />
      )}
    </div>
  );
};

export default UserCard;
