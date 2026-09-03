import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReelCard = ({ reel, onLike, onComment }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(reel.likes?.length || 0);
  const [isMuted, setIsMuted] = useState(true);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    if (onLike) onLike(reel.id);
  };

  const username = reel.user?.username || 'user';
  const profilePic = reel.user?.profile_image;

  return (
    <div className="glass-card" style={{
      maxWidth: '420px',
      margin: '0 auto 32px auto',
      position: 'relative',
      borderRadius: '20px',
      overflow: 'hidden',
      aspectRatio: '9/16',
      background: '#000'
    }}>
      {/* Video element */}
      <video
        src={reel.video_url}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Mute toggle button */}
      <button
        onClick={() => setIsMuted(!isMuted)}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          color: '#fff',
          borderRadius: '50%',
          padding: '8px',
          cursor: 'pointer',
          zIndex: 5
        }}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* Right action bar */}
      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        zIndex: 5
      }}>
        <button
          onClick={handleLikeClick}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Heart size={28} className={isLiked ? 'heart-active' : ''} fill={isLiked ? '#ed4956' : 'none'} color={isLiked ? '#ed4956' : '#fff'} />
          <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{likesCount}</span>
        </button>

        <button
          onClick={() => onComment && onComment(reel.id)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <MessageCircle size={28} />
          <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{reel.comments?.length || 0}</span>
        </button>

        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <Share2 size={26} />
        </button>
      </div>

      {/* Bottom info overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '24px 20px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
        zIndex: 4
      }}>
        <Link to={`/profile/${username}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#fff', marginBottom: '8px' }}>
          {profilePic ? (
            <img src={profilePic} alt={username} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
              {username[0].toUpperCase()}
            </div>
          )}
          <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>@{username}</span>
        </Link>
        {reel.caption && (
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#e5e7eb', lineHeight: '1.4' }}>
            {reel.caption}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReelCard;
