import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { agregarTecnico, obtenerTecnicos, modificarTecnico, eliminarTecnico } from "../api";
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
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Person,
  Build,
} from "@mui/icons-material";

const Tecnicos = () => {
  const [tecnicos, setTecnicos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("agregar");
  const [tecnicoActual, setTecnicoActual] = useState({
    id: "",
    nombre: "",
    contacto: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTecnico, setSelectedTecnico] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTecnicos();
  }, []);

  const fetchTecnicos = async () => {
    try {
      setLoading(true);
      const data = await obtenerTecnicos();
      setTecnicos(data);
    } catch (error) {
      mostrarSnackbar("Error al cargar técnicos: " + error.message, "error");
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
    setTecnicoActual({
      id: "",
      nombre: "",
      contacto: "",
    });
    setModalMode("agregar");
    setShowModal(true);
  };

  const abrirModalModificar = (tecnico) => {
    setTecnicoActual({
      ...tecnico,
    });
    setModalMode("modificar");
    setShowModal(true);
    handleCloseMenu();
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setTecnicoActual({
      ...tecnicoActual,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modalMode === "agregar") {
        await agregarTecnico(tecnicoActual);
        mostrarSnackbar("Técnico agregado exitosamente");
      } else {
        await modificarTecnico(tecnicoActual.id, tecnicoActual);
        mostrarSnackbar("Técnico modificado exitosamente");
      }

      setShowModal(false);
      await fetchTecnicos();
    } catch (error) {
      mostrarSnackbar(
        `Error al ${modalMode === "agregar" ? "agregar" : "modificar"} técnico: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este técnico?")) {
      try {
        setLoading(true);
        await eliminarTecnico(id);
        mostrarSnackbar("Técnico eliminado exitosamente");
        await fetchTecnicos();
      } catch (error) {
        mostrarSnackbar("Error al eliminar técnico: " + error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    handleCloseMenu();
  };

  const handleMenuClick = (event, tecnico) => {
    setAnchorEl(event.currentTarget);
    setSelectedTecnico(tecnico);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedTecnico(null);
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
            Gestión de Técnicos
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              disabled={loading}
            >
              Agregar Técnico
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

        {loading && tecnicos.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography>Cargando técnicos...</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {tecnicos.map((tecnico) => {
              return (
                <Grid item xs={12} sm={6} md={4} key={tecnico.id}>
                  <Card elevation={2} sx={{ height: "100%" }}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Typography variant="h6" component="div">
                          {tecnico.nombre || "Sin nombre"}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, tecnico)}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>

                      <Typography color="text.secondary" variant="body2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                        <strong>Contacto:</strong> {tecnico.contacto}
                      </Typography>
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
          <MenuItem onClick={() => abrirModalModificar(selectedTecnico)}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Modificar
          </MenuItem>
          <MenuItem
            onClick={() => handleEliminar(selectedTecnico?.id)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Dialog para agregar/modificar técnico */}
        <Dialog open={showModal} onClose={cerrarModal} fullWidth maxWidth="md">
          <DialogTitle>
            {modalMode === "agregar" ? "Agregar Técnico" : "Modificar Técnico"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre"
                    name="nombre"
                    value={tecnicoActual.nombre}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    placeholder="Ej: Juan Pérez"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Teléfono"
                    name="contacto"
                    value={tecnicoActual.contacto}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    placeholder="099123456"
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

        {/* Mensaje cuando no hay técnicos */}
        {!loading && tecnicos.length === 0 && (
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
              No hay técnicos registrados
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              sx={{ mt: 2 }}
            >
              Agregar nuevo técnico
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

export default Tecnicos;