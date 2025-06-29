import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  agregarProveedor,
  obtenerProveedores,
  modificarProveedor,
  eliminarProveedor,
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
import { Add, Edit, Delete, MoreVert, Business, ContactPhone } from "@mui/icons-material";

const Proveedores = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("agregar");
  const [proveedorActual, setProveedorActual] = useState({
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
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  useEffect(() => {
    fetchProveedores();
  }, []);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const data = await obtenerProveedores();
      setProveedores(data);
    } catch (error) {
      mostrarSnackbar("Error al cargar proveedores: " + error.message, "error");
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
    setProveedorActual({
      id: "",
      nombre: "",
      contacto: "",
    });
    setModalMode("agregar");
    setShowModal(true);
  };

  const abrirModalModificar = (proveedor) => {
    setProveedorActual({ ...proveedor });
    setModalMode("modificar");
    setShowModal(true);
    handleCloseMenu();
  };

  const cerrarModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    setProveedorActual({
      ...proveedorActual,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (modalMode === "agregar") {
        await agregarProveedor(proveedorActual);
        mostrarSnackbar("Proveedor agregado exitosamente");
      } else {
        await modificarProveedor(proveedorActual.id, proveedorActual);
        mostrarSnackbar("Proveedor modificado exitosamente");
      }
      setShowModal(false);
      await fetchProveedores();
    } catch (error) {
      mostrarSnackbar(
        `Error al ${modalMode === "agregar" ? "agregar" : "modificar"} proveedor: ${error.message}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
      try {
        setLoading(true);
        await eliminarProveedor(id);
        mostrarSnackbar("Proveedor eliminado exitosamente");
        await fetchProveedores();
      } catch (error) {
        mostrarSnackbar("Error al eliminar proveedor: " + error.message, "error");
      } finally {
        setLoading(false);
      }
    }
    handleCloseMenu();
  };

  const handleMenuClick = (event, proveedor) => {
    setAnchorEl(event.currentTarget);
    setSelectedProveedor(proveedor);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedProveedor(null);
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
            Gestión de Proveedores
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              disabled={loading}
            >
              Agregar Proveedor
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

        {loading && proveedores.length === 0 ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <Typography>Cargando proveedores...</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {proveedores.map((proveedor) => (
              <Grid item key={proveedor.id} xs={12} sm={6} md={4}>
                <Card elevation={2} sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {proveedor.nombre || "Sin nombre"}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, proveedor)}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Business fontSize="small" />
                      <strong>ID:</strong> {proveedor.id}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 0.5 }}>
                      <ContactPhone fontSize="small" />
                      <strong>Contacto:</strong> {proveedor.contacto}
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
          <MenuItem onClick={() => abrirModalModificar(selectedProveedor)}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Modificar
          </MenuItem>
          <MenuItem
            onClick={() => handleEliminar(selectedProveedor?.id)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Dialog para agregar/modificar proveedor */}
        <Dialog open={showModal} onClose={cerrarModal} fullWidth maxWidth="sm">
          <DialogTitle>
            {modalMode === "agregar"
              ? "Agregar Proveedor"
              : "Modificar Proveedor"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Nombre"
                    name="nombre"
                    value={proveedorActual.nombre}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    placeholder="Ej: Proveedor S.A."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Contacto"
                    name="contacto"
                    value={proveedorActual.contacto}
                    onChange={handleChange}
                    required
                    fullWidth
                    variant="outlined"
                    placeholder="Ej: 099123456"
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

        {/* Mensaje cuando no hay proveedores */}
        {!loading && proveedores.length === 0 && (
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
              No hay proveedores registrados
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={abrirModalAgregar}
              sx={{ mt: 2 }}
            >
              Agregar nuevo proveedor
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

export default Proveedores;