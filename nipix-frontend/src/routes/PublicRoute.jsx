import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublicRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);

  if (token && user) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
