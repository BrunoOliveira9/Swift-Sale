import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/auth/auth-context.service.tsx';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return isAuthenticated ? <Navigate to="/inicio" /> : children;
};

export default PublicRoute;