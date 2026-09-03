import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReels, likeReel } from '../../store/slices/reelSlice';
import ReelFeed from '../../components/Reel/ReelFeed';
import { Film, Sparkles } from 'lucide-react';

const Reels = () => {
  const dispatch = useDispatch();
  const { reels, loading } = useSelector((state) => state.reel || {});

  useEffect(() => {
    dispatch(fetchReels());
  }, [dispatch]);

  const handleLike = (reelId) => {
    dispatch(likeReel(reelId));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Film size={22} color="var(--accent-pink)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', margin: 0 }}>Nipix Reels</h2>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <Sparkles size={28} className="animate-spin" color="var(--accent-pink)" style={{ marginBottom: '8px' }} />
          <p>Loading short videos...</p>
        </div>
      ) : (
        <ReelFeed reels={reels} onLike={handleLike} />
      )}
    </div>
  );
};

export default Reels;
