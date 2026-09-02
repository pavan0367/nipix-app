import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeed, toggleLike, toggleSave } from '../../services/postService';

export const fetchFeed = createAsyncThunk('post/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const res = await getFeed();
    return res.data.feed;
  } catch (err) { return rejectWithValue(err.response.data); }
});

const postSlice = createSlice({
  name: 'post',
  initialState: { feed: [], loading: false },
  reducers: {
    updatePostLike: (state, action) => {
      const { postId, action: likeAction } = action.payload;
      const post = state.feed.find(p => p.id === postId);
      if (post) {
        if (likeAction === 'liked') post.likes.push({ userId: 1 }); // Simplified for UI
        else post.likes.pop();
      }
    },
    updatePostSave: (state, action) => {
      // Handle save state in UI
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => { state.loading = true; })
      .addCase(fetchFeed.fulfilled, (state, action) => { state.loading = false; state.feed = action.payload; });
  }
});

export const { updatePostLike } = postSlice.actions;
export default postSlice.reducer;