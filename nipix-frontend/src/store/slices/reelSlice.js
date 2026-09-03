import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getReels, uploadReel, toggleLikeReel } from '../../services/reelService';

export const fetchReels = createAsyncThunk('reel/fetchReels', async (_, { rejectWithValue }) => {
  try {
    const res = await getReels();
    return res.data.reels || [];
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const addReel = createAsyncThunk('reel/add', async (formData, { rejectWithValue }) => {
  try {
    const res = await uploadReel(formData);
    return res.data.reel;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

export const likeReel = createAsyncThunk('reel/like', async (id, { rejectWithValue }) => {
  try {
    const res = await toggleLikeReel(id);
    return { id, action: res.data.action };
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

const reelSlice = createSlice({
  name: 'reel',
  initialState: { reels: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReels.pending, (state) => { state.loading = true; })
      .addCase(fetchReels.fulfilled, (state, action) => {
        state.loading = false;
        state.reels = action.payload;
      })
      .addCase(fetchReels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addReel.fulfilled, (state, action) => {
        state.reels.unshift(action.payload);
      });
  },
});

export default reelSlice.reducer;
