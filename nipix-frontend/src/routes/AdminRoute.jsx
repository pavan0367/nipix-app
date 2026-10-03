import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  // If unauthenticated, redirect to login remembering the intended admin destination
  if (!token && !user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} replace />;
  }

  // If logged in but regular user, strictly deny access without rendering admin controls
  if (user && user.role !== 'admin' && user.role !== 'ADMIN') {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;
