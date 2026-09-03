import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments = [], currentUser, onDeleteComment }) => {
  if (!comments || comments.length === 0) {
    return (
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', margin: '16px 0' }}>
        No comments yet. Be the first to comment!
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '8px 0' }}>
      {comments.map((comment, index) => (
        <CommentItem
          key={comment.id || index}
          comment={comment}
          currentUser={currentUser}
          onDelete={onDeleteComment}
        />
      ))}
    </div>
  );
};

export default CommentList;
