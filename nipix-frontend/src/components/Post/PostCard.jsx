import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleLike, addComment } from '../../services/postService';
import { updatePostLike } from '../../store/slices/postSlice';
import { Heart, MessageCircle, Send, Bookmark, User, Share2 } from 'lucide-react';

const API_BASE = process.env.REACT_APP_SOCKET_URL || (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace('/api', '') : 'http://localhost:5000');

const PostCard = ({ post, currentUser }) => {
  const [commentText, setCommentText] = useState('');
  const [commentsList, setCommentsList] = useState(post.comments || []);
  const [likesList, setLikesList] = useState(post.likes || []);
  const [isSaved, setIsSaved] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const dispatch = useDispatch();

  const currentUserId = currentUser?.id || currentUser?._id;
  const isLiked = Array.isArray(likesList) && likesList.some(like => (like.liker?.id || like.userId || like._id || like) === currentUserId);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return post.mediaUrl || '';
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.replace(/\\/g, '/');
    return `${API_BASE}/${cleanPath}`;
  };

  const handleLike = async () => {
    try {
      const res = await toggleLike(post.id || post._id);
      if (res.data?.action === 'liked') {
        setLikesList(prev => [...prev, { userId: currentUserId }]);
      } else if (res.data?.action === 'unliked') {
        setLikesList(prev => prev.filter(l => (l.userId || l._id || l) !== currentUserId));
      } else if (Array.isArray(res.data)) {
        setLikesList(res.data);
      }
      dispatch(updatePostLike({ postId: post.id || post._id, action: res.data?.action }));
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await addComment(post.id || post._id, commentText);
      const newCommentObj = res.data?.comment || {
        id: Date.now(),
        commenter: { username: currentUser?.username || 'You' },
        commentText: commentText,
        text: commentText
      };
      setCommentsList(prev => [...prev, newCommentObj]);
      setCommentText('');
    } catch (err) {
      console.error('Comment error:', err);
    }
  };

  const authorName = post.user?.username || post.userId?.username || 'Nipix User';
  const authorPic = post.user?.profile_image || post.userId?.profilePic;

  return (
    <article className="glass-card" style={{ marginBottom: '24px' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
        <Link to={`/profile/${authorName}`} style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: '#fff' }}>
          <div className="story-ring" style={{ padding: '2px' }}>
            {authorPic ? (
              <img src={getImageUrl(authorPic)} alt="avatar" className="story-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div className="story-avatar" style={{ width: '36px', height: '36px', background: 'var(--accent-purple)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '0.85rem' }}>
                {authorName[0].toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{authorName}</span>
            {post.location && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{post.location}</p>}
          </div>
        </Link>
      </div>

      {/* Media Image */}
      {(post.mediaUrl || post.image) && (
        <div style={{ background: '#050508', textAlign: 'center', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={getImageUrl(post.mediaUrl || post.image)}
            alt="post"
            style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Actions & Details */}
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
              <Heart size={24} className={isLiked ? 'heart-active' : ''} color={isLiked ? '#ed4956' : '#f3f4f6'} fill={isLiked ? '#ed4956' : 'none'} />
            </button>
            <button onClick={() => setShowAllComments(!showAllComments)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#f3f4f6' }}>
              <MessageCircle size={22} />
            </button>
            <button onClick={() => navigator.clipboard.writeText(window.location.href)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#f3f4f6' }}>
              <Share2 size={20} />
            </button>
          </div>

          <button onClick={() => setIsSaved(!isSaved)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#f3f4f6' }}>
            <Bookmark size={22} fill={isSaved ? '#fff' : 'none'} />
          </button>
        </div>

        {/* Likes Count */}
        <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px', color: '#fff' }}>
          {likesList.length} {likesList.length === 1 ? 'like' : 'likes'}
        </p>

        {/* Caption */}
        {post.caption && (
          <p style={{ fontSize: '0.95rem', lineHeight: '1.4', marginBottom: '10px', color: '#e5e7eb' }}>
            <Link to={`/profile/${authorName}`} style={{ fontWeight: '700', color: '#fff', textDecoration: 'none', marginRight: '8px' }}>
              {authorName}
            </Link>
            {post.caption}
          </p>
        )}

        {/* Comments section */}
        <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px' }}>
          {commentsList.length > 0 && !showAllComments && commentsList.length > 2 && (
            <button
              onClick={() => setShowAllComments(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', padding: 0, marginBottom: '8px' }}
            >
              View all {commentsList.length} comments
            </button>
          )}

          {(showAllComments ? commentsList : commentsList.slice(0, 2)).map((c, idx) => (
            <div key={c.id || idx} style={{ fontSize: '0.88rem', marginBottom: '6px', color: '#d1d5db', display: 'flex', gap: '6px' }}>
              <strong style={{ color: '#fff' }}>{c.commenter?.username || c.userId?.username || 'User'}:</strong>
              <span>{c.commentText || c.text}</span>
            </div>
          ))}

          {/* Add Comment Form */}
          <form onSubmit={handleComment} style={{ display: 'flex', gap: '10px', marginTop: '12px', alignItems: 'center' }}>
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="input-field"
              style={{ flex: 1, padding: '8px 14px', fontSize: '0.85rem', borderRadius: '20px' }}
            />
            <button type="submit" style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem' }}>
              Post
            </button>
          </form>
        </div>
      </div>
    </article>
  );
};

export default PostCard;