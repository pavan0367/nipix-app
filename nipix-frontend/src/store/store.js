import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';
import userReducer from './slices/userSlice';
import messageReducer from './slices/messageSlice';
import notificationReducer from './slices/notificationSlice';
import storyReducer from './slices/storySlice';
import reelReducer from './slices/reelSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    user: userReducer,
    message: messageReducer,
    notification: notificationReducer,
    story: storyReducer,
    reel: reelReducer,
  },
});