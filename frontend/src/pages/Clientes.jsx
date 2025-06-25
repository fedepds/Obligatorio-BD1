import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { agregarCliente, obtenerClientes } from "../api";
import {
  Button,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Box,
  Grid,
  IconButton,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { Add, Edit, PersonAdd } from "@mui/icons-material";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("agregar"); // "agregar" o "modificar"
  const [clienteActual, setClienteActual] = useState({
    ci: "",
    nombre: "",
    email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      const data = await obtenerClientes();
      setClientes(data);
    };
    fetchClientes();
  }, []);

  const abrirModalAgregar = () => {
    setClienteActual({
      ci: "",
      nombre: "",
      email: "",
    });
    setModalMode("agregar");
    setShowModal(true);
  };

  const abrirModalModificar = (cliente) => {
    setClienteActual(cliente);
    setModalMode("modificar");
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setClienteActual({
      ...clienteActual,
      [e.target.name]: e.target.value,
    });
  };

  const handleAgregar = async (nuevoCliente) => {
    await agregarCliente(nuevoCliente);
    const data = await obtenerClientes();
    setClientes(data);
  };

  // Si tienes una función handleModificar, agrégala aquí
  // const handleModificar = async (ci, clienteModificado) => { ... }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Gestión de Clientes
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAdd />}
            onClick={abrirModalAgregar}
          >
            Agregar Cliente
          </Button>
        </Box>

        <Grid container spacing={2}>
          {clientes.map((cliente) => (
            <Grid item xs={12} sm={6} md={4} key={cliente.ci}>
              <Card elevation={2} sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {cliente.nombre}
                  </Typography>
                  <Typography color="text.secondary">
                    CI: {cliente.ci}
                  </Typography>
                  <Typography color="text.secondary">
                    Email: {cliente.email}
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      variant="outlined"
                      onClick={() => abrirModalModificar(cliente)}
                    >
                      Modificar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Dialog para agregar/modificar cliente */}
        <Dialog open={showModal} onClose={cerrarModal} fullWidth maxWidth="sm">
          <DialogTitle>
            {modalMode === "agregar" ? "Agregar Cliente" : "Modificar Cliente"}
          </DialogTitle>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (modalMode === "agregar") {
                await handleAgregar(clienteActual);
              } else {
                // await handleModificar(clienteActual.ci, clienteActual);
              }
              setShowModal(false);
              const data = await obtenerClientes();
              setClientes(data);
            }}
          >
            <DialogContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
              >
                <TextField
                  label="CI"
                  name="ci"
                  value={clienteActual.ci}
                  onChange={handleChange}
                  disabled={modalMode === "modificar"}
                  required
                  fullWidth
                  variant="outlined"
                  margin="dense"
                />
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={clienteActual.nombre}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  margin="dense"
                />
                <TextField
                  label="Email"
                  name="email"
                  value={clienteActual.email}
                  onChange={handleChange}
                  required
                  type="email"
                  fullWidth
                  variant="outlined"
                  margin="dense"
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={cerrarModal} color="inherit">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {modalMode === "agregar" ? "Agregar" : "Modificar"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Mensaje cuando no hay clientes */}
        {clientes.length === 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              p: 4,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No hay clientes registrados
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              sx={{ mt: 2 }}
            >
              Agregar nuevo cliente
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Clientes;
