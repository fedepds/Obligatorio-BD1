import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, requiereAdmin = false }) => {
  // Ya no verificamos un token, solo verificamos que exista usuario en localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  // Si no hay información de usuario, redirigir al login
  if (!usuario || !usuario.correo) {
    return <Navigate to="/" replace />;
  }

  // Cuando se requiere administrador, verificamos si el usuario es administrador
  if (requiereAdmin && !usuario.es_administrador) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return children;
};