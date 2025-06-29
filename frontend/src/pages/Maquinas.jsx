import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { agregarMaquina, obtenerMaquinas, modificarMaquina, eliminarMaquina } from "../api";
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
  Select,
  FormControl,
  InputLabel,
  Chip,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  CheckCircle,
  Error,
  Build,
  Stop,
  LocationOn,
  AttachMoney,
  Person
} from "@mui/icons-material";

const Maquinas = () => {
  const [maquinas, setMaquinas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("agregar");
  const [maquinaActual, setMaquinaActual] = useState({
    id: "",
    modelo: "",
    costo_alquiler_mensual: "",
    id_cliente: "",
    ubicacion_cliente: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMaquina, setSelectedMaquina] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMaquinas();
  }, []);

  const fetchMaquinas = async () => {
    try {
      setLoading(true);
      const data = await obtenerMaquinas();
      setMaquinas(data);
    } catch (error) {
      mostrarSnackbar("Error al cargar máquinas: " + error.message, "error");
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
    setMaquinaActual({
      id: "",
      modelo: "",
      costo_alquiler_mensual: "",
      id_cliente: "",
      ubicacion_cliente: "",
    });
    setModalMode("agregar");
    setShowModal(true);
  };

  const abrirModalModificar = (maquina) => {
    setMaquinaActual({
      ...maquina,
    });
    setModalMode("modificar");
    setShowModal(true);
    handleCloseMenu();
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setMaquinaActual({
      ...maquinaActual,
      [e.target.modelo]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modalMode === "agregar") {
        await agregarMaquina(maquinaActual);
        mostrarSnackbar("Máquina agregada exitosamente");
      } else {
        await modificarMaquina(maquinaActual.id, maquinaActual);
        mostrarSnackbar("Máquina modificada exitosamente");
      }

      setShowModal(false);
      await fetchMaquinas();
    } catch (error) {
      mostrarSnackbar(
        `Error al ${modalMode === "agregar" ? "agregar" : "modificar"} máquina: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta máquina?")) {
      try {
        setLoading(true);
        await eliminarMaquina(id);
        mostrarSnackbar("Máquina eliminada exitosamente");
        await fetchMaquinas();
      } catch (error) {
        mostrarSnackbar("Error al eliminar máquina: " + error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    handleCloseMenu();
  };

  const handleMenuClick = (event, maquina) => {
    setAnchorEl(event.currentTarget);
    setSelectedMaquina(maquina);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedMaquina(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: 'UYU',
      minimumFractionDigits: 0,
    }).format(amount);
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
            Gestión de Máquinas
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={abrirModalAgregar}
            disabled={loading}
          >
            Agregar Máquina
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

        {loading && maquinas.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography>Cargando máquinas...</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {maquinas.map((maquina) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={maquina.id}>
                  <Card elevation={2} sx={{ height: "100%" }}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Typography variant="h6" component="div">
                          {maquina.modelo}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, maquina)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                        <strong>ID:</strong> {maquina.id}
                      </Typography>

                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AttachMoney fontSize="small" />
                        <strong>Alquiler mensual:</strong> {formatCurrency(maquina.costo_alquiler_mensual)}
                      </Typography>

                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Person fontSize="small" />
                        <strong>Cliente ID:</strong> {maquina.id_cliente}
                      </Typography>

                      {maquina.ubicacion_cliente && (
                        <Typography color="text.secondary" variant="body2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <LocationOn fontSize="small" />
                          <strong>Ubicación:</strong> {maquina.ubicacion_cliente}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Menú contextual */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
        >
          <MenuItem onClick={() => abrirModalModificar(selectedMaquina)}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Modificar
          </MenuItem>
          <MenuItem
            onClick={() => handleEliminar(selectedMaquina?.id)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Dialog para agregar/modificar máquina */}
        <Dialog open={showModal} onClose={cerrarModal} fullWidth maxWidth="md">
          <DialogTitle>
            {modalMode === "agregar" ? "Agregar Máquina" : "Modificar Máquina"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Modelo"
                    name="modelo"
                    value={maquinaActual.modelo}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    placeholder="Ej: Eco100"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Costo Alquiler Mensual"
                    name="costo_alquiler_mensual"
                    value={maquinaActual.costo_alquiler_mensual}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    type="number"
                    step="0.01"
                    placeholder="1800.00"
                    InputProps={{
                      startAdornment: <Typography color="text.secondary">$</Typography>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="ID Cliente"
                    name="id_cliente"
                    value={maquinaActual.id_cliente}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    type="number"
                    placeholder="2"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Ubicación Cliente"
                    name="ubicacion_cliente"
                    value={maquinaActual.ubicacion_cliente}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    placeholder="Ej: Recepción"
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

        {/* Mensaje cuando no hay máquinas */}
        {!loading && maquinas.length === 0 && (
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
              No hay máquinas registradas
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              sx={{ mt: 2 }}
            >
              Agregar nueva máquina
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

export default Maquinas;