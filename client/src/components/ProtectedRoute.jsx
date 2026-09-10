import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const agentToken = localStorage.getItem('agentToken');

    if (!agentToken) {
    return <Navigate to="/agent-login" replace />;
  }

  return children;
}