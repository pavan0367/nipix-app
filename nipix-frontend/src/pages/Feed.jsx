import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Stories from '../components/Stories'; // Real Stories Component
import { Heart, MessageCircle, Send, Trash2, User, Image as ImageIcon } from 'lucide-react';

const API_BASE = process.env.REACT_APP_SOCKET_URL || (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000');

const Feed = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [openComments, setOpenComments] = useState({});

  const fetchFeed = useCallback(async () => {
    try {
      const res = await axios.get('/posts/feed');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load feed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();

    const handlePostCreated = () => fetchFeed();
    window.addEventListener('postCreated', handlePostCreated);
    return () => window.removeEventListener('postCreated', handlePostCreated);
  }, [fetchFeed]);

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`/posts/${postId}/like`);
      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          return { ...post, likes: res.data };
        }
        return post;
      }));
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await axios.post(`/posts/${postId}/comment`, { text });
      setPosts(prevPosts => prevPosts.map(post => {
        if (post._id === postId) {
          return { ...post, comments: res.data };
        }
        return post;
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Comment failed:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await axios.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete post');
    }
  };

  const toggleComments = (postId) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.replace(/\\/g, '/');
    return `${API_BASE}/${cleanPath}`;
  };

  return (
    <div style={{ maxWidth: '620px', margin: '30px auto', padding: '0 16px' }}>
      
      {/* ✅ REAL STORIES COMPONENT REPLACES MOCK STORIES */}
      <Stories />

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          <p>Fetching posts...</p>
        </div>
      )}

      {/* Empty feed message */}
      {!loading && posts.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px', color: '#9ca3af' }}>
          <ImageIcon size={48} color="#0095f6" style={{ marginBottom: '12px' }} />
          <h3 style={{ color: '#fff', marginBottom: '8px', fontSize: '1.2rem' }}>No Posts Yet</h3>
          <p style={{ fontSize: '0.9rem' }}>Be the first to share a moment! Click "Create Post" in the sidebar.</p>
        </div>
      )}

      {/* Feed Posts */}
      {posts.map((post) => {
        const isLiked = post.likes?.includes(currentUser?._id || currentUser?.id);
        const isOwner = (post.userId?._id || post.userId?.id || post.userId) === (currentUser?._id || currentUser?.id);

        return (
          <article key={post._id} className="glass-card" style={{ marginBottom: '28px' }}>
            {/* Header */}
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color, rgba(255,255,255,0.1))' }}>
              <Link to={`/profile/${post.userId?.username}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#fff' }}>
                <div className="story-ring" style={{ padding: '2px' }}>
                  {post.userId?.profilePic ? (
                    <img src={post.userId.profilePic} alt="avatar" className="story-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div className="story-avatar" style={{ width: '36px', height: '36px', background: '#2e2e38', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={18} color="#9ca3af" />
                    </div>
                  )}
                </div>
                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{post.userId?.username || 'Nipix User'}</span>
              </Link>

              {isOwner && (
                <button
                  onClick={() => handleDeletePost(post._id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.8, padding: '4px' }}
                  title="Delete post"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {/* Post Image */}
            <div style={{ background: '#050508', textAlign: 'center', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={getImageUrl(post.image)}
                alt="post"
                style={{ width: '100%', maxHeight: '650px', objectFit: 'contain' }}
              />
            </div>

            {/* Content & Actions */}
            <div style={{ padding: '16px 18px' }}>
              {/* Action Icons */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                <button
                  onClick={() => handleLike(post._id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                >
                  <Heart size={26} className={isLiked ? 'heart-active' : ''} color={isLiked ? '#ed4956' : '#f3f4f6'} fill={isLiked ? '#ed4956' : 'none'} />
                </button>

                <button
                  onClick={() => toggleComments(post._id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#f3f4f6' }}
                >
                  <MessageCircle size={24} />
                </button>
              </div>

              {/* Likes Count */}
              <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px', color: '#fff' }}>
                {post.likes?.length || 0} {post.likes?.length === 1 ? 'like' : 'likes'}
              </p>

              {/* Caption */}
              {post.caption && (
                <p style={{ fontSize: '0.95rem', lineHeight: '1.4', marginBottom: '10px', color: '#e5e7eb' }}>
                  <Link to={`/profile/${post.userId?.username}`} style={{ fontWeight: '700', color: '#fff', textDecoration: 'none', marginRight: '8px' }}>
                    {post.userId?.username}
                  </Link>
                  {post.caption}
                </p>
              )}

              {/* Comments Section */}
              <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '10px' }}>
                {post.comments?.length > 0 && !openComments[post._id] && (
                  <button
                    onClick={() => toggleComments(post._id)}
                    style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '0.85rem', cursor: 'pointer', padding: 0, marginBottom: '8px' }}
                  >
                    View all {post.comments.length} comments
                  </button>
                )}

                {(openComments[post._id] || (post.comments && post.comments.length <= 2)) && post.comments?.map((comment, i) => (
                  <div key={i} style={{ fontSize: '0.88rem', marginBottom: '6px', color: '#d1d5db', display: 'flex', gap: '6px' }}>
                    <strong style={{ color: '#fff' }}>{comment.userId?.username || 'User'}:</strong>
                    <span>{comment.text}</span>
                  </div>
                ))}

                {/* Add Comment Form */}
                <form onSubmit={(e) => handleAddComment(e, post._id)} style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentInputs[post._id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                    className="input-field"
                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '8px 14px', background: 'transparent', border: 'none', color: '#0095f6', cursor: 'pointer', fontWeight: '600' }}>
                    Post
                  </button>
                </form>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default Feed;