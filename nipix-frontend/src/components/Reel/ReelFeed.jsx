import React from 'react';
import ReelCard from './ReelCard';
import { Film } from 'lucide-react';

const ReelFeed = ({ reels = [], onLike, onComment }) => {
  if (!reels || reels.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px', maxWidth: '420px', margin: '40px auto', color: 'var(--text-muted)' }}>
        <Film size={48} color="var(--accent-pink)" style={{ marginBottom: '16px' }} />
        <h3 style={{ color: '#fff', marginBottom: '8px' }}>No Reels Available</h3>
        <p style={{ fontSize: '0.9rem' }}>Be the first to share short-form videos with the Nipix community.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      {reels.map(reel => (
        <ReelCard key={reel.id} reel={reel} onLike={onLike} onComment={onComment} />
      ))}
    </div>
  );
};

export default ReelFeed;
