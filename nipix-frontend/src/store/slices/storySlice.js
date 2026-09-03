import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStoriesFeed, uploadStory } from '../../services/storyService';

export const fetchStories = createAsyncThunk('story/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    const res = await getStoriesFeed();
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const addStory = createAsyncThunk('story/add', async (formData, { rejectWithValue }) => {
  try {
    const res = await uploadStory(formData);
    return res.data.story;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

const storySlice = createSlice({
  name: 'story',
  initialState: { stories: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStories.pending, (state) => { state.loading = true; })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addStory.fulfilled, (state, action) => {
        state.stories.unshift(action.payload);
      });
  },
});

export default storySlice.reducer;
