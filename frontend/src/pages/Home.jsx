import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Stack,
  Container,
  Paper,
  Divider,
} from "@mui/material";
import {
  Engineering,
  Business,
  Handyman,
  Person,
  Inventory,
  Receipt,
} from "@mui/icons-material";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          p: { xs: 3, sm: 5 },
          textAlign: "center",
          borderRadius: 2,
          background: "linear-gradient(to bottom, #ffffff, #f5f5f5)",
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "primary.main",
          }}
        >
          Bienvenido
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ mb: 3, fontWeight: 500 }}
        >
          Selecciona una opción para continuar:
        </Typography>

        <Stack spacing={2} mt={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/tecnicos")}
            startIcon={<Engineering />}
            size="large"
            sx={{ py: 1.5 }}
          >
            Gestión de Técnicos
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/proveedores")}
            startIcon={<Business />}
            size="large"
            sx={{ py: 1.5 }}
          >
            Gestión de Proveedores
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/maquinas")}
            startIcon={<Handyman />}
            size="large"
            sx={{ py: 1.5 }}
          >
            Gestión de Máquinas
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/clientes")}
            startIcon={<Person />}
            size="large"
            sx={{ py: 1.5 }}
          >
            Gestión de Clientes
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/insumos")}
            startIcon={<Inventory />}
            size="large"
            sx={{ py: 1.5 }}
          >
            Gestión de Insumos
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/registro-de-consumos")}
            startIcon={<Receipt />}
            size="large"
            sx={{ py: 1.5 }}
          >
            Registro de consumos
          </Button>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/mantenimiento")}
            startIcon={<Handyman />}
            size="large"
            sx={{ py: 1.5 }}
          >
            Gestión de Mantenimiento
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Home;
