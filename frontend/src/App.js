import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginFinal from "./pages/Login"; 
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Mantenimiento from "./pages/Mantenimiento";
import Proveedores from "./pages/Proveedores";
import Tecnicos from "./pages/Tecnicos";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginFinal />} />
        <Route path="/home" element={<Home />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/mantenimiento" element={<Mantenimiento />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/tecnicos" element={<Tecnicos />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
