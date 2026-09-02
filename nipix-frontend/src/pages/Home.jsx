import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeed } from '../store/slices/postSlice';
import PostCard from '../components/Post/PostCard';

const Home = () => {
  const dispatch = useDispatch();
  const { feed, loading } = useSelector((state) => state.post);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Feed...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      {/* Stories Placeholder */}
      <div style={{ padding: '20px', border: '1px solid #dbdbdb', borderRadius: '8px', marginBottom: '20px', background: '#fff' }}>
        <p>Stories Component (Implemented in Part 4)</p>
      </div>

      {/* Feed */}
      {feed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#fff', border: '1px solid #dbdbdb', borderRadius: '8px' }}>
          <h3>Welcome to Nipix!</h3>
          <p>Follow people to see their posts here.</p>
        </div>
      ) : (
        feed.map(post => <PostCard key={post.id} post={post} currentUser={currentUser} />)
      )}
    </div>
  );
};

export default Home;