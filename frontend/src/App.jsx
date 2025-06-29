import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Mantenimiento from "./pages/Mantenimiento";
import Proveedores from "./pages/Proveedores";
import Tecnicos from "./pages/Tecnicos";
import Maquinas from "./pages/Maquinas";
import Reportes from "./pages/Reportes";
import Insumos from "./pages/Insumos";
import { ProtectedRoute } from './components/ProtectedRoute';
import AccesoDenegado from './pages/AccesoDenegado';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/acceso-denegado" element={<AccesoDenegado />} />
        <Route path="/home" element={
          <ProtectedRoute requiereAdmin={true}>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/clientes" element={
          <ProtectedRoute>
            <Clientes />
          </ProtectedRoute>
        } />
        <Route path="/mantenimiento" element={
          <ProtectedRoute>
            <Mantenimiento />
          </ProtectedRoute>
        } />
        <Route path="/proveedores" element={
          <ProtectedRoute requiereAdmin={true}>
            <Proveedores />
          </ProtectedRoute>
        } />
        <Route path="/tecnicos" element={
          <ProtectedRoute requiereAdmin={true}>
            <Tecnicos />
          </ProtectedRoute>
        } />
        <Route path="/maquinas" element={
          <ProtectedRoute requiereAdmin={true}>
            <Maquinas />
          </ProtectedRoute>
        } />
        <Route path="/reportes" element={
          <ProtectedRoute>
            <Reportes />
          </ProtectedRoute>
        } />
        <Route path="/insumos" element={
          <ProtectedRoute>
            <Insumos />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;