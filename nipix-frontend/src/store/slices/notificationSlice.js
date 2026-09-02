import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchNotifications = createAsyncThunk('notification/fetch', async () => {
  const res = await api.get('/notifications');
  return res.data.notifications;
});

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { list: [], unreadCount: 0 },
  reducers: {
    addRealtimeNotification: (state, action) => {
      state.list.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearUnread: (state) => { state.unreadCount = 0; }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.list = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    });
  }
});

export const { addRealtimeNotification, clearUnread } = notificationSlice.actions;
export default notificationSlice.reducer;