import React from "react";
import BackButton from "./components/BackButton";
import ClienteButton from "../components/ClienteButton";
import InsumosButton from "../components/InsumosButton"
import MantenimientoButton from "../components/MantenimientoButton";
import ProveedoresButton from "../components/ProveedoresButton";
import TecnicosButton from "../components/TecnicosButton"
import MaquinasButton from "../components/MaquinasButton";



const Dashboard = () => {
    return (
      <div>
        <h1>Dashboard</h1>
        <BackButton />
        <ClienteButton />
        <InsumosButton> </InsumosButton>
        <MantenimientoButton></MantenimientoButton>
        <ProveedoresButton></ProveedoresButton>
        <TecnicosButton></TecnicosButton>
        <MaquinasButton></MaquinasButton>
      </div>
    );
};

export default Dashboard;