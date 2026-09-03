import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import formatDate from '../../utils/formatDate';

const CommentItem = ({ comment, currentUser, onDelete }) => {
  const authorName = comment.commenter?.username || comment.userId?.username || 'User';
  const authorPic = comment.commenter?.profile_image || comment.userId?.profilePic;
  const isOwner = currentUser && (currentUser.id === comment.userId || currentUser.username === authorName);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', padding: '8px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <Link to={`/profile/${authorName}`}>
          {authorPic ? (
            <img src={authorPic} alt={authorName} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>
              {authorName[0].toUpperCase()}
            </div>
          )}
        </Link>
        <div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#fff', lineHeight: '1.4' }}>
            <Link to={`/profile/${authorName}`} style={{ fontWeight: '700', color: '#fff', textDecoration: 'none', marginRight: '6px' }}>
              {authorName}
            </Link>
            <span style={{ color: '#e5e7eb' }}>{comment.comment_text || comment.commentText || comment.text}</span>
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {formatDate(comment.created_at || comment.createdAt)}
          </span>
        </div>
      </div>

      {isOwner && onDelete && (
        <button
          onClick={() => onDelete(comment.id)}
          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px', opacity: 0.7 }}
          title="Delete comment"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
};

export default CommentItem;
