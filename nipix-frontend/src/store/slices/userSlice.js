import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile, toggleFollow } from '../../services/userService';

export const fetchProfile = createAsyncThunk('user/fetchProfile', async (id, { rejectWithValue }) => {
  try {
    const res = await getProfile(id);
    return res.data?.user || res.data;
  } catch (err) { return rejectWithValue(err.response?.data || { message: err.message }); }
});

export const followUser = createAsyncThunk('user/followUser', async (id, { rejectWithValue }) => {
  try {
    const res = await toggleFollow(id);
    return { id, action: res.data?.action };
  } catch (err) { return rejectWithValue(err.response?.data || { message: err.message }); }
});

const userSlice = createSlice({
  name: 'user',
  initialState: { profile: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(followUser.fulfilled, (state, action) => { 
        if (state.profile && state.profile.id === action.payload.id) {
          state.profile.isFollowing = action.payload.action === 'followed';
          state.profile.followersCount += action.payload.action === 'followed' ? 1 : -1;
        }
      });
  }
});

export default userSlice.reducer;