import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Safe initial user restoration from localStorage to prevent session loss on page refresh
let initialUser = null;
try {
  const saved = localStorage.getItem('nipix_user');
  initialUser = saved ? JSON.parse(saved) : null;
} catch (e) {
  initialUser = null;
}

// 1. Login Thunk
export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', credentials);
    if (res.data?.token) {
      localStorage.setItem('nipix_token', res.data.token);
    }
    if (res.data?.user) {
      localStorage.setItem('nipix_user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

// 2. Register Thunk
export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', userData);
    if (res.data?.token) {
      localStorage.setItem('nipix_token', res.data.token);
    }
    if (res.data?.user) {
      localStorage.setItem('nipix_user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

// 3. Verify Email OTP Thunk
export const verifyEmailThunk = createAsyncThunk('auth/verifyEmail', async ({ email, code }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/verify-email', { email, code });
    if (res.data?.token) {
      localStorage.setItem('nipix_token', res.data.token);
    }
    if (res.data?.user) {
      localStorage.setItem('nipix_user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

// 4. Google Auth Thunk
export const googleAuthThunk = createAsyncThunk('auth/googleAuth', async (credential, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/google', { credential });
    if (res.data?.token) {
      localStorage.setItem('nipix_token', res.data.token);
    }
    if (res.data?.user) {
      localStorage.setItem('nipix_user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

// 5. Load Current User / Validate Session Thunk
export const loadUser = createAsyncThunk('auth/loadUser', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('nipix_token');
    if (!token) return null;
    const res = await api.get('/auth/me');
    if (res.data?.user) {
      localStorage.setItem('nipix_user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      localStorage.removeItem('nipix_token');
      localStorage.removeItem('nipix_user');
    }
    return rejectWithValue(err.response?.data || { message: err.message });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: initialUser,
    token: localStorage.getItem('nipix_token'),
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('nipix_token');
      localStorage.removeItem('nipix_user');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('nipix_user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('nipix_user');
      }
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.user) state.user = action.payload.user;
        if (action.payload?.token) state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Register cases
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.user) state.user = action.payload.user;
        if (action.payload?.token) state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      
      // Verify Email cases
      .addCase(verifyEmailThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyEmailThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.user) state.user = action.payload.user;
        if (action.payload?.token) state.token = action.payload.token;
      })
      .addCase(verifyEmailThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Google Auth cases
      .addCase(googleAuthThunk.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(googleAuthThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.user) state.user = action.payload.user;
        if (action.payload?.token) state.token = action.payload.token;
      })
      .addCase(googleAuthThunk.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Load user cases
      .addCase(loadUser.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(loadUser.rejected, (state) => {
        state.user = null;
        state.token = null;
      });
  }
});

export const { logout, setUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;