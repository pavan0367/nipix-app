import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Compass, Heart, MessageCircle, Sparkles } from 'lucide-react';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExplorePosts = async () => {
      try {
        const res = await api.get('/posts/feed');
        const data = Array.isArray(res.data) ? res.data : (res.data?.feed || []);
        // Algorithmic explore ranking per SRS Section 30.2: Score = (Likes * 1) + (Comments * 2)
        const ranked = [...data].sort((a, b) => {
          const scoreA = (a.likes?.length || 0) * 1 + (a.comments?.length || 0) * 2;
          const scoreB = (b.likes?.length || 0) * 1 + (b.comments?.length || 0) * 2;
          return scoreB - scoreA;
        });
        setPosts(ranked);
      } catch (err) {
        console.error('Failed to load explore feed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExplorePosts();
  }, []);

  return (
    <div style={{ maxWidth: '935px', margin: '30px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{ padding: '20px 24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Compass size={24} color="var(--accent-blue)" />
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', margin: 0 }}>Explore & Discover</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Trending photos and videos from across the Nipix community.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          <Sparkles size={28} className="animate-spin" color="var(--accent-blue)" style={{ marginBottom: '8px' }} />
          <p>Discovering moments...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
          <Compass size={48} color="var(--accent-purple)" style={{ marginBottom: '16px' }} />
          <h3 style={{ color: '#fff', marginBottom: '8px' }}>Explore Is Quiet</h3>
          <p style={{ fontSize: '0.9rem' }}>New trending posts will appear here once users begin sharing.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {posts.map((post) => (
            <div
              key={post._id || post.id}
              className="glass-card"
              style={{
                position: 'relative',
                aspectRatio: '1',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <img
                src={post.image || post.mediaUrl}
                alt="Explore item"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '24px',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  color: '#fff',
                  fontWeight: '700'
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={20} fill="#fff" /> {post.likes?.length || 0}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MessageCircle size={20} fill="#fff" /> {post.comments?.length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
