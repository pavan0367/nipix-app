import React from 'react';

const StoryCircle = ({ user, hasUnseen = true, onClick }) => {
  const username = user?.username || 'user';
  const profilePic = user?.profilePic || user?.profile_image;

  return (
    <div onClick={onClick} style={{ textAlign: 'center', cursor: 'pointer', flexShrink: 0 }}>
      <div className={hasUnseen ? "story-ring" : ""} style={{
        padding: hasUnseen ? '2.5px' : '0',
        borderRadius: '50%',
        display: 'inline-block'
      }}>
        {profilePic ? (
          <img
            src={profilePic}
            alt={username}
            className="story-avatar"
            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div
            className="story-avatar"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#fff',
              fontSize: '1.1rem'
            }}
          >
            {username[0].toUpperCase()}
          </div>
        )}
      </div>
      <p style={{ fontSize: '0.78rem', marginTop: '6px', maxWidth: '64px', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-muted)' }}>
        {username}
      </p>
    </div>
  );
};

export default StoryCircle;
