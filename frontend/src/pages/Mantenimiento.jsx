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
import { Add, Edit, Delete, MoreVert, Build, Event } from "@mui/icons-material";

const Mantenimiento = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("agregar");
  const [mantenimientoActual, setMantenimientoActual] = useState({
    id: "",
    id_maquina: "",
    id_tecnico: "",
    tipo: "",
    fecha: "",
    observaciones: "",
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
    setMantenimientoActual({
      id: "",
      id_maquina: "",
      id_tecnico: "",
      tipo: "",
      fecha: "",
      observaciones: "",
    });
    setModalMode("agregar");
    setShowModal(true);
  };

  const abrirModalModificar = (mantenimiento) => {
    // Formatear la fecha a YYYY-MM-DD para el input type="date"
    const fechaFormateada = mantenimiento.fecha ? new Date(mantenimiento.fecha).toISOString().split('T')[0] : "";
    setMantenimientoActual({ ...mantenimiento, fecha: fechaFormateada });
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
        await modificarMantenimiento(mantenimientoActual.id, {
          id_maquina: mantenimientoActual.id_maquina,
          id_tecnico: mantenimientoActual.id_tecnico,
          tipo: mantenimientoActual.tipo,
          fecha: mantenimientoActual.fecha,
          observaciones: mantenimientoActual.observaciones,
        });
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
                <Card elevation={2} sx={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                      <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                        {mantenimiento.tipo}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, mantenimiento)}
                        sx={{ mt: -1, mr: -1 }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                     <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Event sx={{ mr: 0.5 }} fontSize="small" />
                      {new Date(mantenimiento.fecha).toLocaleDateString()}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                      <Build fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                      <strong>ID:</strong> {mantenimiento.id}
                    </Typography>
                    <Typography variant="body2">
                      <strong>ID Máquina:</strong> {mantenimiento.id_maquina}
                    </Typography>
                    <Typography variant="body2">
                      <strong>ID Técnico:</strong> {mantenimiento.id_tecnico}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      <strong>Observaciones:</strong> {mantenimiento.observaciones}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ID Máquina"
                    name="id_maquina"
                    value={mantenimientoActual.id_maquina}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ID Técnico"
                    name="id_tecnico"
                    value={mantenimientoActual.id_tecnico}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Tipo"
                    name="tipo"
                    value={mantenimientoActual.tipo}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Fecha"
                    name="fecha"
                    type="date"
                    value={mantenimientoActual.fecha}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Observaciones"
                    name="observaciones"
                    value={mantenimientoActual.observaciones}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    multiline
                    rows={3}
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