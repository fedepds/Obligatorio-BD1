import React from "react";
import BackButton from "./components/BackButton";
import ClienteButton from "../components/ClienteButton";
import InsumosButton from "../components/InsumosButton";
import MantenimientoButton from "../components/MantenimientoButton";
import MaquinasButton from "../components/MaquinasButton"


const DashboardUser = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <BackButton />
      <ClienteButton />
      <InsumosButton> </InsumosButton>
      <MantenimientoButton></MantenimientoButton>
      <MaquinasButton></MaquinasButton>
      
    </div>
  );
};

export default DashboardUser;
