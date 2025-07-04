import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerRegistrosConsumo,
  agregarRegistroConsumo,
  modificarRegistroConsumo,
  eliminarRegistroConsumo,
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
import { Add, Edit, Delete, MoreVert } from "@mui/icons-material";

const RegistroConsumos = () => {
  const [registros, setRegistros] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("agregar");
  const [registroActual, setRegistroActual] = useState({
    id: "",
    id_maquina: "",
    id_insumo: "",
    cantidad_usada: "",
    fecha: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRegistro, setSelectedRegistro] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistros();
  }, []);

  const fetchRegistros = async () => {
    try {
      setLoading(true);
      const data = await obtenerRegistrosConsumo();
      setRegistros(data);
    } catch (error) {
      mostrarSnackbar("Error al cargar registros: " + error.message, "error");
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
    setRegistroActual({
      id: "",
      id_maquina: "",
      id_insumo: "",
      cantidad_usada: "",
      fecha: "",
    });
    setModalMode("agregar");
    setShowModal(true);
  };

  const abrirModalModificar = (registro) => {
    setRegistroActual({
      id: registro.id,
      id_maquina: registro.id_maquina,
      id_insumo: registro.id_insumo,
      cantidad_usada: registro.cantidad_usada,
      fecha: registro.fecha
        ? new Date(registro.fecha).toISOString().split('T')[0]
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
    setRegistroActual({
      ...registroActual,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modalMode === "agregar") {
        await agregarRegistroConsumo(registroActual);
        mostrarSnackbar("Registro agregado exitosamente");
      } else {
        await modificarRegistroConsumo(registroActual.id, registroActual);
        mostrarSnackbar("Registro modificado exitosamente");
      }

      setShowModal(false);
      await fetchRegistros();
    } catch (error) {
      mostrarSnackbar(
        `Error al ${modalMode === "agregar" ? "agregar" : "modificar"} registro: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      try {
        setLoading(true);
        await eliminarRegistroConsumo(id);
        mostrarSnackbar("Registro eliminado exitosamente");
        await fetchRegistros();
      } catch (error) {
        mostrarSnackbar("Error al eliminar registro: " + error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    handleCloseMenu();
  };

  const handleMenuClick = (event, registro) => {
    setAnchorEl(event.currentTarget);
    setSelectedRegistro(registro);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRegistro(null);
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
            Registro de Consumos
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              disabled={loading}
            >
              Agregar Registro
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

        {loading && registros.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography>Cargando registros...</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {registros.length > 0 && registros.map((registro) => (
              <Grid item xs={12} sm={6} md={4} key={registro.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Typography variant="h6" gutterBottom>
                        Registro #{registro.id}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, registro)}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Máquina ID:</strong> {registro.id_maquina}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Insumo ID:</strong> {registro.id_insumo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Cantidad:</strong> {registro.cantidad_usada}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fecha:</strong> {registro.fecha ? new Date(registro.fecha).toLocaleDateString() : 'No definida'}
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
          <MenuItem onClick={() => abrirModalModificar(selectedRegistro)}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Modificar
          </MenuItem>
          <MenuItem
            onClick={() => handleEliminar(selectedRegistro?.id)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Dialog para agregar/modificar registro */}
        <Dialog open={showModal} onClose={cerrarModal} fullWidth maxWidth="md">
          <DialogTitle>
            {modalMode === "agregar" ? "Agregar Registro" : "Modificar Registro"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2} sx={{ pt: 1 }}>
                {modalMode === "modificar" && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="ID"
                      name="id"
                      value={registroActual.id}
                      onChange={handleChange}
                      disabled
                      fullWidth
                      variant="outlined"
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ID Máquina"
                    name="id_maquina"
                    value={registroActual.id_maquina || ''}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ID Insumo"
                    name="id_insumo"
                    value={registroActual.id_insumo || ''}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cantidad"
                    name="cantidad_usada"
                    value={registroActual.cantidad_usada || ''}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    type="number"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Fecha"
                    name="fecha"
                    type="date"
                    value={registroActual.fecha}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
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

        {/* Mensaje cuando no hay registros */}
        {!loading && registros.length === 0 && (
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
              No hay registros de consumo
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              sx={{ mt: 2 }}
            >
              Agregar nuevo registro
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

export default RegistroConsumos;