import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  agregarMantenimiento,
  obtenerMantenimientos,
  modificarMantenimiento,
  eliminarMantenimiento,
} from "../api";
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
import { Add, Edit, Delete, MoreVert, Build } from "@mui/icons-material";

const Mantenimiento = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("agregar");
  const [mantenimientoActual, setMantenimientoActual] = useState({
    id: "",
    nombre: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMantenimientos();
  }, []);

  const fetchMantenimientos = async () => {
    try {
      setLoading(true);
      const data = await obtenerMantenimientos();
      setMantenimientos(data);
    } catch (error) {
      mostrarSnackbar("Error al cargar mantenimientos: " + error.message, "error");
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
    setMantenimientoActual({ id: "", nombre: "" });
    setModalMode("agregar");
    setShowModal(true);
  };

  const abrirModalModificar = (mantenimiento) => {
    setMantenimientoActual({ ...mantenimiento });
    setModalMode("modificar");
    setShowModal(true);
    handleCloseMenu();
  };

  const cerrarModal = () => setShowModal(false);

  const handleChange = (e) => {
    setMantenimientoActual({
      ...mantenimientoActual,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modalMode === "agregar") {
        await agregarMantenimiento(mantenimientoActual);
        mostrarSnackbar("Mantenimiento agregado exitosamente");
      } else {
        await modificarMantenimiento(mantenimientoActual.id, { nombre: mantenimientoActual.nombre });
        mostrarSnackbar("Mantenimiento modificado exitosamente");
      }
      setShowModal(false);
      await fetchMantenimientos();
    } catch (error) {
      mostrarSnackbar(
        `Error al ${modalMode === "agregar" ? "agregar" : "modificar"} mantenimiento: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este mantenimiento?")) {
      try {
        setLoading(true);
        await eliminarMantenimiento(id);
        mostrarSnackbar("Mantenimiento eliminado exitosamente");
        await fetchMantenimientos();
      } catch (error) {
        mostrarSnackbar("Error al eliminar mantenimiento: " + error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    handleCloseMenu();
  };

  const handleMenuClick = (event, mantenimiento) => {
    setAnchorEl(event.currentTarget);
    setSelectedMantenimiento(mantenimiento);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedMantenimiento(null);
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
            Gestión de Mantenimientos
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              disabled={loading}
            >
              Agregar Mantenimiento
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/home")}
              disabled={loading}
            >
              Volver
            </Button>
          </Box>
        </Box>

        {loading && mantenimientos.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography>Cargando mantenimientos...</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {mantenimientos.map((mantenimiento) => (
              <Grid item xs={12} sm={6} md={4} key={mantenimiento.id}>
                <Card elevation={2} sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {mantenimiento.nombre}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, mantenimiento)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                      <Build fontSize="small" />
                      <strong>ID:</strong> {mantenimiento.id}
                    </Typography>
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
          <MenuItem onClick={() => abrirModalModificar(selectedMantenimiento)}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Modificar
          </MenuItem>
          <MenuItem
            onClick={() => handleEliminar(selectedMantenimiento?.id)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Dialog para agregar/modificar */}
        <Dialog open={showModal} onClose={cerrarModal} fullWidth maxWidth="sm">
          <DialogTitle>
            {modalMode === "agregar" ? "Agregar Mantenimiento" : "Modificar Mantenimiento"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2} sx={{ pt: 1 }}>
                {modalMode === "modificar" && (
                  <Grid item xs={12}>
                    <TextField
                      label="ID"
                      name="id"
                      value={mantenimientoActual.id}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    label="Nombre"
                    name="nombre"
                    value={mantenimientoActual.nombre}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={cerrarModal} color="inherit" disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading
                  ? (modalMode === "agregar" ? "Agregando..." : "Modificando...")
                  : (modalMode === "agregar" ? "Agregar" : "Modificar")
                }
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Mensaje cuando no hay mantenimientos */}
        {!loading && mantenimientos.length === 0 && (
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
              No hay mantenimientos registrados
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              sx={{ mt: 2 }}
            >
              Agregar nuevo mantenimiento
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

export default Mantenimiento;