import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const API_BASE = process.env.REACT_APP_SOCKET_URL || (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000');

const StoryViewer = ({ stories = [], user = {}, currentIndex = 0, onClose }) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(currentIndex || 0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!stories || stories.length === 0) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentStoryIndex < stories.length - 1) {
            setCurrentStoryIndex(currentStoryIndex + 1);
            return 0;
          } else {
            clearInterval(timer);
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentStoryIndex, stories.length, onClose]);

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setProgress(0);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.replace(/\\/g, '/');
    return `${API_BASE}/${cleanPath}`;
  };

  if (!stories || stories.length === 0) return null;

  const currentStory = stories[currentStoryIndex];
  const username = user?.username || 'user';
  const profilePic = user?.profilePic || user?.profile_image;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Progress Bars */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        right: '16px',
        display: 'flex',
        gap: '6px',
        maxWidth: '520px',
        margin: '0 auto',
        zIndex: 10
      }}>
        {stories.map((_, idx) => (
          <div key={idx} style={{
            flex: 1,
            height: '3px',
            background: 'rgba(255,255,255,0.25)',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: idx < currentStoryIndex ? '100%' : idx === currentStoryIndex ? `${progress}%` : '0%',
              height: '100%',
              background: '#fff',
              transition: 'width 0.1s linear'
            }} />
          </div>
        ))}
      </div>

      {/* User Info Header */}
      <div style={{
        position: 'absolute',
        top: '32px',
        left: '24px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 10
      }}>
        {profilePic ? (
          <img
            src={getImageUrl(profilePic)}
            alt={username}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--accent-blue)', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
            {username[0].toUpperCase()}
          </div>
        )}
        <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{username}</span>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '28px',
          right: '24px',
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          color: '#fff',
          borderRadius: '50%',
          padding: '8px',
          cursor: 'pointer',
          zIndex: 10
        }}
      >
        <X size={24} />
      </button>

      {/* Story Media */}
      <div style={{
        maxWidth: '480px',
        width: '100%',
        maxHeight: '82vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        <img
          src={getImageUrl(currentStory?.media_url || currentStory?.image || currentStory)}
          alt="Story"
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '16px' }}
        />
      </div>

      {/* Left/Right Buttons */}
      {currentStoryIndex > 0 && (
        <button
          onClick={prevStory}
          style={{ position: 'absolute', left: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', padding: '12px', cursor: 'pointer' }}
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {currentStoryIndex < stories.length - 1 && (
        <button
          onClick={nextStory}
          style={{ position: 'absolute', right: '20px', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', borderRadius: '50%', padding: '12px', cursor: 'pointer' }}
        >
          <ChevronRight size={24} />
        </button>
      )}
    </div>
  );
};

export default StoryViewer;
