import React, { useState } from 'react';
import { Heart } from 'lucide-react';

const LikeButton = ({ isLiked: initialLiked = false, count = 0, onToggle, showCount = true, size = 24 }) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(count);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount(prev => nextLiked ? prev + 1 : prev - 1);
    if (onToggle) onToggle(nextLiked);
  };

  return (
    <button
      onClick={handleClick}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      <Heart
        size={size}
        className={isLiked ? 'heart-active' : ''}
        color={isLiked ? '#ed4956' : '#f3f4f6'}
        fill={isLiked ? '#ed4956' : 'none'}
      />
      {showCount && (
        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>
          {likesCount}
        </span>
      )}
    </button>
  );
};

export default LikeButton;
