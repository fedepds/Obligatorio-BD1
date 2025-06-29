
import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, requiereAdmin = false }) => {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // cuando se requiere administrador, verificamos si el usuario es administrador
  if (requiereAdmin && !usuario.es_administrador) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return children;
};