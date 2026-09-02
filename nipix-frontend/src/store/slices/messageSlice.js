import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMessages = createAsyncThunk('message/fetchMessages', async (conversationId) => {
  const res = await api.get(`/messages/${conversationId}`);
  return res.data.messages;
});

export const sendMessage = createAsyncThunk('message/sendMessage', async ({ conversationId, text }) => {
  const res = await api.post('/messages', { conversationId, text });
  return res.data.message;
});

const messageSlice = createSlice({
  name: 'message',
  initialState: { messages: [], loading: false },
  reducers: {
    addRealtimeMessage: (state, action) => {
      state.messages.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.fulfilled, (state, action) => { state.messages = action.payload; })
      .addCase(sendMessage.fulfilled, (state, action) => { state.messages.push(action.payload); });
  }
});

export const { addRealtimeMessage } = messageSlice.actions;
export default messageSlice.reducer;