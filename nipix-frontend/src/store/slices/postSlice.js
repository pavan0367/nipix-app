import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeed, toggleLike, toggleSave } from '../../services/postService';

export const fetchFeed = createAsyncThunk('post/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const res = await getFeed();
    const data = res.data?.feed || res.data?.posts || (Array.isArray(res.data) ? res.data : []);
    return Array.isArray(data) ? data : [];
  } catch (err) { return rejectWithValue(err.response?.data || { message: err.message }); }
});

const postSlice = createSlice({
  name: 'post',
  initialState: { feed: [], loading: false, error: null },
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
      .addCase(fetchFeed.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.feed = [];
        state.error = action.payload;
      });
  }
});

export const { updatePostLike } = postSlice.actions;
export default postSlice.reducer;