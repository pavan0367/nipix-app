import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AdminRoute from './AdminRoute';

import Login from '../pages/Login';
import Register from '../pages/Register';
import VerifyEmail from '../pages/Auth/VerifyEmail';
import ForgotPassword from '../pages/Auth/ForgotPassword';
import VerifyResetOtp from '../pages/Auth/VerifyResetOtp';
import ResetPassword from '../pages/Auth/ResetPassword';
import PasswordUpdated from '../pages/Auth/PasswordUpdated';
import Home from '../pages/Home';
import StudyMaterials from '../pages/StudyMaterials';
import NewsFeed from '../pages/News';
import YouTubeHub from '../pages/YouTube';
import Explore from '../pages/Explore';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Saved from '../pages/Saved';
import AdminDashboard from '../pages/Admin/AdminDashboard';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Study & Content Routes (Open for Public Learning) */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/study" element={<StudyMaterials />} />
      <Route path="/study/japanese" element={<StudyMaterials defaultCategory="Japanese 🇯🇵" />} />
      <Route path="/study-materials" element={<StudyMaterials />} />
      <Route path="/study-materials/japanese" element={<StudyMaterials defaultCategory="Japanese 🇯🇵" />} />
      <Route path="/news" element={<NewsFeed />} />
      <Route path="/youtube" element={<YouTubeHub />} />
      <Route path="/lectures" element={<YouTubeHub />} />
      <Route path="/explore" element={<Explore />} />

      {/* Chat Routes: Open for public AI bots, hidden-chat requires auth */}
      <Route path="/chat" element={<Chat />} />
      <Route path="/chat/:botId" element={<Chat />} />
      <Route path="/hidden-chat" element={<Chat />} />

      {/* Auth Entry Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/password-updated" element={<PasswordUpdated />} />

      {/* Protected Scholar Routes (Require Authentication) */}
      <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      {/* Admin Route (Strictly Admin Only) */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
