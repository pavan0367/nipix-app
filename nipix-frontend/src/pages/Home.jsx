import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeed } from '../store/slices/postSlice';
import PostCard from '../components/Post/PostCard';
import Stories from '../components/Stories';
import { Link } from 'react-router-dom';
import { Sparkles, Compass, UserPlus, Image as ImageIcon } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { feed, loading } = useSelector((state) => state.post || {});
  const currentUser = useSelector((state) => state.auth?.user);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const suggestions = [
    { username: 'creative_studio', full_name: 'Creative Studio', bio: 'Design & Visual Arts' },
    { username: 'tech_insider', full_name: 'Tech Insider', bio: 'Innovations & Future' },
    { username: 'travel_journal', full_name: 'Travel Journal', bio: 'Wanderlust Moments' }
  ];

  return (
    <div style={{ maxWidth: '935px', margin: '30px auto', padding: '0 16px', display: 'grid', gridTemplateColumns: '1fr 310px', gap: '32px' }}>
      
      {/* Main Feed Content Column */}
      <div>
        {/* Real Stories Bar */}
        <Stories />

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <Sparkles size={24} className="animate-spin" color="var(--accent-blue)" style={{ marginBottom: '8px' }} />
            <p style={{ margin: 0 }}>Loading latest updates...</p>
          </div>
        )}

        {/* Empty Feed State */}
        {!loading && (!Array.isArray(feed) || feed.length === 0) && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
            <ImageIcon size={48} color="var(--accent-blue)" style={{ marginBottom: '12px' }} />
            <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '0 0 8px 0' }}>Welcome to Nipix!</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Follow creators or share your first post to populate your home feed.</p>
            <Link to="/search" className="btn-primary">
              <Compass size={16} /> Explore Creators
            </Link>
          </div>
        )}

        {/* Posts Stream */}
        {!loading && Array.isArray(feed) && feed.length > 0 && (
          feed.map(post => (
            <PostCard key={post.id || post._id} post={post} currentUser={currentUser} />
          ))
        )}
      </div>

      {/* Right Sidebar Column: User Info & Suggestions */}
      <div>
        {currentUser && (
          <div className="glass-card" style={{ padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="story-ring" style={{ padding: '2px' }}>
                <div style={{ width: '48px', height: '48px', background: 'var(--accent-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '1.1rem' }}>
                  {(currentUser.username || 'U')[0].toUpperCase()}
                </div>
              </div>
              <div>
                <p style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff', margin: 0 }}>
                  @{currentUser.username || 'user'}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  {currentUser.full_name || 'Nipix Creator'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Accounts Card */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Suggested For You
            </span>
            <Link to="/search" style={{ fontSize: '0.8rem', color: '#fff', textDecoration: 'none', fontWeight: '600' }}>
              See All
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {suggestions.map((item) => (
              <div key={item.username} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', background: 'var(--bg-hover)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '0.85rem', border: '1px solid var(--border-color)' }}>
                    {item.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.85rem', color: '#fff', margin: 0 }}>@{item.username}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{item.bio}</p>
                  </div>
                </div>

                <button style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <UserPlus size={14} /> Follow
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Home;