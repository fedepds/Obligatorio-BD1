import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginFinal from "./pages/Login";
import Dashboard from "./pages/DashboardADM";

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" elemen={<LoginFinal/>}></Route>

      <Route path="dashboardADM"element={<Dashboard></Dashboard>}></Route>
      <Route path="dashboardUser" element={<DashboardUser></DashboardUser>}></Route>
      
    </Routes>
    </BrowserRouter>
  )
}

export default App;