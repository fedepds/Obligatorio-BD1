import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginFinal from "./pages/Login"; 
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Mantenimiento from "./pages/Mantenimiento";
import Proveedores from "./pages/Proveedores";
import Tecnicos from "./pages/Tecnicos";
import Maquinas from "./pages/Maquinas";
import Reportes from "./pages/Reportes";
import Insumos from "./pages/Insumos";


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
        <Route path="/maquinas" element={<Maquinas/>}></Route>
        <Route path={"/reportes"} element={<Reportes/>}/>
        <Route path={"/insumos"} element={<Insumos/>}/>
        <Route path="*" element={<LoginFinal />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
