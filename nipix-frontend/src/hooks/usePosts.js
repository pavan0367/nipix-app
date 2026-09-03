import { useSelector, useDispatch } from 'react-redux';
import { fetchFeed, updatePostLike } from '../store/slices/postSlice';
import { toggleLike, addComment } from '../services/postService';

export const usePosts = () => {
  const dispatch = useDispatch();
  const { feed, loading } = useSelector((state) => state.post);

  const getFeed = () => dispatch(fetchFeed());

  const handleLike = async (postId) => {
    try {
      const res = await toggleLike(postId);
      dispatch(updatePostLike({ postId, action: res.data?.action }));
      return res.data;
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (postId, text) => {
    try {
      return await addComment(postId, text);
    } catch (err) {
      console.error('Error commenting on post:', err);
    }
  };

  return {
    feed,
    loading,
    getFeed,
    likePost: handleLike,
    commentPost: handleComment,
  };
};

export default usePosts;
