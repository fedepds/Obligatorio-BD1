import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { agregarCliente, obtenerClientes, modificarCliente, eliminarCliente } from "../api";
import {
  Button,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, MoreVert, Person } from "@mui/icons-material";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("agregar");
  const [clienteActual, setClienteActual] = useState({
    rut: "",
    nombre: "",
    direccion: "",
    fecha_nacimiento: "",
    telefono: "",
    correo: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await obtenerClientes();
      setClientes(data);
    } catch (error) {
      mostrarSnackbar("Error al cargar clientes: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const mostrarSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const cerrarSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const abrirModalAgregar = () => {
    setClienteActual({
      rut: "",
      nombre: "",
      direccion: "",
      fecha_nacimiento: "",
      telefono: "",
      correo: "",
    });
    setModalMode("agregar");
    setShowModal(true);
  };

  const abrirModalModificar = (cliente) => {
    setClienteActual({
      ...cliente,
      rut: cliente.rut,
      correo: cliente.correo || cliente.correo_electronico,
      rut_original: cliente.rut,
      fecha_nacimiento: cliente.fecha_nacimiento
        ? new Date(cliente.fecha_nacimiento).toISOString().split('T')[0]
        : "",
    });
    setModalMode("modificar");
    setShowModal(true);
    handleCloseMenu();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modalMode === "agregar") {
        const clienteData = {
          ...clienteActual,
        };
        await agregarCliente(clienteData);
        mostrarSnackbar("Cliente agregado exitosamente");
      } else {
        const clienteData = {
          ...clienteActual,
        };
        await modificarCliente(clienteActual.rut_original, clienteData);
        mostrarSnackbar("Cliente modificado exitosamente");
      }

      setShowModal(false);
      await fetchClientes();
    } catch (error) {
      mostrarSnackbar(
        `Error al ${modalMode === "agregar" ? "agregar" : "modificar"} cliente: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (cliente) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        setLoading(true);
        await eliminarCliente(cliente.rut);
        mostrarSnackbar("Cliente eliminado exitosamente");
        await fetchClientes();
      } catch (error) {
        mostrarSnackbar("Error al eliminar cliente: " + error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    handleCloseMenu();
  };

  const handleMenuClick = (event, cliente) => {
    setAnchorEl(event.currentTarget);
    setSelectedCliente(cliente);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedCliente(null);
  };

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
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              disabled={loading}
            >
              Agregar Cliente
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Volver
            </Button>
          </Box>
        </Box>

        {loading && clientes.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography>Cargando clientes...</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {clientes.map((cliente) => (
              <Grid item xs={12} sm={6} md={4} key={cliente.rut}>
                <Card elevation={2} sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {cliente.nombre}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, cliente)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Person fontSize="small" />
                      <strong>RUT:</strong> {cliente.rut}
                    </Typography>
                    {cliente.correo && (
                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                        <strong>Email:</strong> {cliente.correo}
                      </Typography>
                    )}
                    {cliente.telefono && (
                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                        <strong>Teléfono:</strong> {cliente.telefono}
                      </Typography>
                    )}
                    {cliente.direccion && (
                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                        <strong>Dirección:</strong> {cliente.direccion}
                      </Typography>
                    )}
                    {cliente.fecha_nacimiento && (
                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                        <strong>Fecha Nac:</strong> {new Date(cliente.fecha_nacimiento).toLocaleDateString()}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Menú contextual */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => abrirModalModificar(selectedCliente)}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Modificar
          </MenuItem>
          <MenuItem
            onClick={() => handleEliminar(selectedCliente)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Dialog para agregar/modificar cliente */}
        <Dialog open={showModal} onClose={cerrarModal} fullWidth maxWidth="md">
          <DialogTitle>
            {modalMode === "agregar" ? "Agregar Cliente" : "Modificar Cliente"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2} sx={{ pt: 1 }}>
                {modalMode === "agregar" && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="RUT"
                      name="rut"
                      value={clienteActual.rut}
                      onChange={handleChange}
                      required
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={modalMode === "agregar" ? 6 : 12}>
                  <TextField
                    label="Nombre"
                    name="nombre"
                    value={clienteActual.nombre}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Teléfono"
                    name="telefono"
                    value={clienteActual.telefono}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Correo"
                    name="correo"
                    type="email"
                    value={clienteActual.correo}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Fecha de Nacimiento"
                    name="fecha_nacimiento"
                    type="date"
                    value={clienteActual.fecha_nacimiento}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Dirección"
                    name="direccion"
                    value={clienteActual.direccion}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={cerrarModal} color="inherit" disabled={loading}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading
                  ? (modalMode === "agregar" ? "Agregando..." : "Modificando...")
                  : (modalMode === "agregar" ? "Agregar" : "Modificar")
                }
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Mensaje cuando no hay clientes */}
        {!loading && clientes.length === 0 && (
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

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={cerrarSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={cerrarSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Clientes;