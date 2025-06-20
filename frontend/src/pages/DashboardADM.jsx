
import React from "react";
import { Grid, Typography, Container, Box } from "@mui/material";
import DashboardCard from "../components/dashboardCard";
import BackButton from "../components/BackButton";

import PeopleIcon from "@mui/icons-material/People";
import BuildIcon from "@mui/icons-material/Build";
import HandymanIcon from "@mui/icons-material/Handyman";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";


const dashboardItems = [
  {
    icon: PeopleIcon,
    title: "Clientes",
    description: "Gestiona la información y el historial de tus clientes.",
    to: "/clientes",
  },
  {
    icon: BuildIcon,
    title: "Insumos",
    description: "Controla el stock y el uso de insumos y repuestos.",
    to: "/insumos",
  },
  {
    icon: HandymanIcon,
    title: "Mantenimiento",
    description: "Agenda y registra las tareas de mantenimiento.",
    to: "/mantenimiento",
  },
  {
    icon: LocalShippingIcon,
    title: "Proveedores",
    description: "Administra la lista y los pedidos a proveedores.",
    to: "/proveedores",
  },
  {
    icon: EngineeringIcon,
    title: "Técnicos",
    description: "Consulta la información y asignaciones de los técnicos.",
    to: "/tecnicos",
  },
  {
    icon: PrecisionManufacturingIcon,
    title: "Máquinas",
    description: "Visualiza el parque de máquinas y su estado actual.",
    to: "/maquinas",
  },
];

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Panel de Control Principal
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Selecciona una sección para comenzar a trabajar
        </Typography>
      </Box>


      <Grid container spacing={4}>
        
        {dashboardItems.map((item, index) => (
          <DashboardCard
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            to={item.to}
          />
        ))}
      </Grid>
      <button ></button>
    </Container>
  );
};

export default Dashboard;
