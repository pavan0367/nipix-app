import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toggleLike, addComment } from '../../services/postService';
import { updatePostLike } from '../../store/slices/postSlice';

const PostCard = ({ post, currentUser }) => {
  const [comment, setComment] = useState('');
  const dispatch = useDispatch();
  const isLiked = post.likes.some(like => like.liker?.id === currentUser.id);

  const handleLike = async () => {
    try {
      const res = await toggleLike(post.id);
      dispatch(updatePostLike({ postId: post.id, action: res.data.action }));
    } catch (err) { console.error(err); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await addComment(post.id, comment);
      setComment('');
      // In a real app, dispatch an action to update comments in Redux
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ border: '1px solid #dbdbdb', borderRadius: '8px', marginBottom: '20px', background: '#fff' }}>
      {/* Header */}
      <div style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={post.user?.profile_image || 'https://via.placeholder.com/40'} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
        <strong>{post.user?.username}</strong>
      </div>

      {/* Media */}
      <img src={post.mediaUrl} alt="post" style={{ width: '100%', maxHeight: '600px', objectFit: 'cover' }} />

      {/* Actions */}
      <div style={{ padding: '10px', display: 'flex', gap: '15px', fontSize: '24px' }}>
        <button onClick={handleLike} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLiked ? 'red' : 'black' }}>
          {isLiked ? '❤️' : '🤍'}
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>💬</button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}></button>
      </div>

      {/* Likes & Caption */}
      <div style={{ padding: '0 10px 10px' }}>
        <p style={{ fontWeight: 'bold' }}>{post.likes.length} likes</p>
        <p><strong>{post.user?.username}</strong> {post.caption}</p>
      </div>

      {/* Comments */}
      <div style={{ padding: '0 10px 10px' }}>
        {post.comments.map(c => (
          <p key={c.id} style={{ fontSize: '14px' }}><strong>{c.commenter?.username}</strong> {c.commentText}</p>
        ))}
      </div>

      {/* Add Comment */}
      <form onSubmit={handleComment} style={{ display: 'flex', borderTop: '1px solid #efefef', padding: '10px' }}>
        <input 
          type="text" 
          value={comment} 
          onChange={e => setComment(e.target.value)} 
          placeholder="Add a comment..." 
          style={{ flex: 1, border: 'none', outline: 'none' }} 
        />
        <button type="submit" style={{ background: 'none', border: 'none', color: '#0095f6', fontWeight: 'bold', cursor: 'pointer' }}>Post</button>
      </form>
    </div>
  );
};

export default PostCard;