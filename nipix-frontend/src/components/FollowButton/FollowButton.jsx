import React, { useState } from 'react';
import { UserPlus, UserCheck } from 'lucide-react';

const FollowButton = ({ isFollowing: initialFollowing = false, onToggle, size = 'medium' }) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    if (onToggle) onToggle(!isFollowing);
  };

  const padding = size === 'small' ? '4px 12px' : '8px 20px';
  const fontSize = size === 'small' ? '0.78rem' : '0.85rem';

  return (
    <button
      onClick={handleClick}
      className={isFollowing ? "btn-secondary" : "btn-primary"}
      style={{ padding, fontSize, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
    >
      {isFollowing ? (
        <>
          <UserCheck size={14} /> Following
        </>
      ) : (
        <>
          <UserPlus size={14} /> Follow
        </>
      )}
    </button>
  );
};

export default FollowButton;
