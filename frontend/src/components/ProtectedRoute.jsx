import React from 'react';
import { Navigate } from 'react-router-dom';
import { verificarToken } from '../api';

export const ProtectedRoute = ({ children, requiereAdmin = false }) => {
  // Verificar si el token es válido
  const tokenValido = verificarToken();

  // Si no hay token válido, redirigir al login
  if (!tokenValido) {
    return <Navigate to="/" replace />;
  }

  // Obtener información del usuario
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  // Si no hay información de usuario completa, redirigir al login
  if (!usuario || !usuario.correo) {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  // Cuando se requiere administrador, verificamos si el usuario es administrador
  if (requiereAdmin && !usuario.es_administrador) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return children;
};