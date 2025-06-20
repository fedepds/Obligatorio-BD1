import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginFinal from "./pages/Login"; 
import DashboardADM from "./pages/DashboardADM";
import DashboardUser from "./pages/DashboardUser";

// --- 2. Crea componentes temporales
const ClientesPage = () => <h1>Página de Gestión de Clientes</h1>;
const InsumosPage = () => <h1>Página de Gestión de Insumos</h1>;
const MantenimientoPage = () => <h1>Página de Gestión de Mantenimiento</h1>;
const ProveedoresPage = () => <h1>Página de Gestión de Proveedores</h1>;
const TecnicosPage = () => <h1>Página de Gestión de Técnicos</h1>;
const MaquinasPage = () => <h1>Página de Gestión de Máquinas</h1>;
const NotFoundPage = () => <h1>404: Página no encontrada</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginFinal />} />
        <Route path="/dashboard-admin" element={<DashboardADM />} />


        <Route path="/dashboard-user" element={<DashboardUser />} />

        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/insumos" element={<InsumosPage />} />
        <Route path="/mantenimiento" element={<MantenimientoPage />} />
        <Route path="/proveedores" element={<ProveedoresPage />} />
        <Route path="/tecnicos" element={<TecnicosPage />} />
        <Route path="/maquinas" element={<MaquinasPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
