import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Bookmark, Lock, Image as ImageIcon } from 'lucide-react';
import NipixLogo from '../../components/NipixLogo';

const Saved = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const res = await api.get('/users/me/saved');
        const data = Array.isArray(res.data) ? res.data : (res.data?.saved || []);
        setSavedPosts(data);
      } catch (err) {
        // Fallback: query feed or empty
        console.warn('Could not fetch saved posts:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  return (
    <div style={{ maxWidth: '935px', margin: '30px auto', padding: '0 16px' }}>
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <NipixLogo size={42} style={{ borderRadius: '10px' }} glow />
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#fff', margin: 0 }}>Saved Notes & Posts</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>Only you can see study materials and posts you have saved on Nipix.</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          <Lock size={14} /> Private
        </div>
      </div>

      {savedPosts.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
          <NipixLogo size={64} style={{ borderRadius: '14px', marginBottom: '16px' }} glow />
          <h3 style={{ color: '#fff', marginBottom: '8px' }}>Save Notes for Later</h3>
          <p style={{ fontSize: '0.9rem' }}>When you bookmark a post or study note, it will be stored securely here in your private Nipix collection.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {savedPosts.map((post) => (
            <div
              key={post.id}
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
                alt="Saved post"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
