import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Home from '../pages/Home';
import StudyMaterials from '../pages/StudyMaterials';
import NewsFeed from '../pages/News';
import YouTubeHub from '../pages/YouTube';
import Explore from '../pages/Explore';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import Saved from '../pages/Saved';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Study & Content Routes (Open for Public Learning) */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/study" element={<StudyMaterials />} />
      <Route path="/news" element={<NewsFeed />} />
      <Route path="/youtube" element={<YouTubeHub />} />
      <Route path="/explore" element={<Explore />} />

      {/* Chat Route: Open to preview with locked privacy previews, interactive for auth */}
      <Route path="/chat" element={<Chat />} />

      {/* Auth Entry Routes */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected Scholar Routes (Require Authentication) */}
      <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/profile/id/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
