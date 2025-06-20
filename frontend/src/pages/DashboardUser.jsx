
import React from "react";
import { Grid, Typography, Container, Box } from "@mui/material";
import DashboardCard from "../components/dashboardCard"; 

import PeopleIcon from "@mui/icons-material/People";
import BuildIcon from "@mui/icons-material/Build";
import HandymanIcon from "@mui/icons-material/Handyman";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";

const userDashboardItems = [
  {
    icon: PeopleIcon,
    title: "Clientes",
    description: "Consulta la información y el historial de tus clientes.",
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
    icon: PrecisionManufacturingIcon,
    title: "Máquinas",
    description: "Visualiza el parque de máquinas y su estado actual.",
    to: "/maquinas",
  },
];

const DashboardUser = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Título de la página */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Panel de Usuario
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Bienvenido. Selecciona una sección para continuar.
        </Typography>
      </Box>

     
      <Grid container spacing={4}>
        {userDashboardItems.map((item, index) => (
          <DashboardCard
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            to={item.to}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default DashboardUser;
