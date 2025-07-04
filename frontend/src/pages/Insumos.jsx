import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerInsumos,
  agregarInsumo,
  modificarInsumo,
  eliminarInsumo,
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
import { Add, Edit, Delete, MoreVert, Inventory } from "@mui/icons-material";

const Insumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("agregar");
  const [insumoActual, setInsumoActual] = useState({
    nombre: "",
    descripcion: "",
    tipo: "",
    precio_unitario: "",
    rut_proveedor: "",
    id: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedInsumo, setSelectedInsumo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInsumos();
  }, []);

  const fetchInsumos = async () => {
    try {
      setLoading(true);
      const data = await obtenerInsumos();
      setInsumos(data);
    } catch (error) {
      mostrarSnackbar("Error al cargar insumos: " + error.message, "error");
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
    setInsumoActual({
      nombre: "",
      descripcion: "",
      tipo: "",
      precio_unitario: "",
      rut_proveedor: "",
      id: "",
    });
    setModalMode("agregar");
    setShowModal(true);
  };

  const abrirModalModificar = (insumo) => {
    setInsumoActual(insumo);
    setModalMode("modificar");
    setShowModal(true);
    handleCloseMenu();
  };

  const cerrarModal = () => setShowModal(false);

  const handleChange = (e) => {
    setInsumoActual({
      ...insumoActual,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modalMode === "agregar") {
        await agregarInsumo(insumoActual);
        mostrarSnackbar("Insumo agregado exitosamente");
      } else {
        await modificarInsumo(insumoActual.id, {
          descripcion: insumoActual.descripcion,
          tipo: insumoActual.tipo,
          precio_unitario: insumoActual.precio_unitario,
          rut_proveedor: insumoActual.rut_proveedor,
        });
        mostrarSnackbar("Insumo modificado exitosamente");
      }
      setShowModal(false);
      await fetchInsumos();
    } catch (error) {
      mostrarSnackbar(
        `Error al ${modalMode === "agregar" ? "agregar" : "modificar"} insumo: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este insumo?")) {
      try {
        setLoading(true);
        await eliminarInsumo(id);
        mostrarSnackbar("Insumo eliminado exitosamente");
        await fetchInsumos();
      } catch (error) {
        mostrarSnackbar("Error al eliminar insumo: " + error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    handleCloseMenu();
  };

  const handleMenuClick = (event, insumo) => {
    setAnchorEl(event.currentTarget);
    setSelectedInsumo(insumo);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedInsumo(null);
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
            Gestión de Insumos
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              disabled={loading}
            >
              Agregar Insumo
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

        {loading && insumos.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography>Cargando insumos...</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {insumos.map((insumo) => (
              <Grid item xs={12} sm={6} md={4} key={insumo.id}>
                <Card elevation={2} sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {insumo.descripcion || "Sin descripción"}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, insumo)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                      <strong>ID:</strong> {insumo.id}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                      <strong>Tipo:</strong> {insumo.tipo}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                      <strong>Precio Unitario:</strong> {insumo.precio_unitario}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1 }}>
                      <strong>ID Proveedor:</strong> {insumo.rut_proveedor}
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
          <MenuItem onClick={() => abrirModalModificar(selectedInsumo)}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Modificar
          </MenuItem>
          <MenuItem
            onClick={() => handleEliminar(selectedInsumo?.id)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Dialog para agregar/modificar insumo */}
        <Dialog open={showModal} onClose={cerrarModal} fullWidth maxWidth="sm">
          <DialogTitle>
            {modalMode === "agregar" ? "Agregar Insumo" : "Modificar Insumo"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2} sx={{ pt: 1 }}>
                {modalMode === "modificar" && (
                  <><Grid item xs={12}>
                    <TextField
                      label="ID"
                      name="id"
                      value={insumoActual.id}
                      InputProps={{ readOnly: true }}
                      fullWidth
                      variant="outlined"
                      margin="dense" />

                  </Grid><Grid item xs={12}>
                      <TextField
                        label="Nombre"
                        name="nombre"
                        value={insumoActual.nombre}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="outlined"
                        margin="dense" />
                    </Grid></>
                )}
                <Grid item xs={12}>
                  <TextField
                    label="Descripción"
                    name="descripcion"
                    value={insumoActual.descripcion}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Tipo"
                    name="tipo"
                    value={insumoActual.tipo}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Precio Unitario"
                    name="precio_unitario"
                    type="number"
                    value={insumoActual.precio_unitario}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    inputProps={{ min: 0, step: "0.01" }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="RUT Proveedor"
                    name="rut_proveedor"
                    type="number"
                    value={insumoActual.rut_proveedor}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    inputProps={{ min: 0 }}
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

        {/* Mensaje cuando no hay insumos */}
        {!loading && insumos.length === 0 && (
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
              No hay insumos registrados
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              sx={{ mt: 2 }}
            >
              Agregar nuevo insumo
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

export default Insumos;