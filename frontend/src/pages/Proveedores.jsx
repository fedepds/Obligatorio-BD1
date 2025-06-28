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
} from "@mui/material";
import { Add, Edit, Delete, Business } from "@mui/icons-material";

const Proveedores = () => {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("agregar");
  const [proveedorActual, setProveedorActual] = useState({
    nombre: "",
    contacto: "",
    id: "", // solo para uso interno
  });

  useEffect(() => {
    const fetchProveedores = async () => {
      const proveedoresData = await obtenerProveedores();
      setProveedores(proveedoresData);
    };
    fetchProveedores();
  }, []);

  const abrirModalAgregar = () => {
    setProveedorActual({
      nombre: "",
      contacto: "",
      id: "",
    });
    setModalMode("agregar");
    setShowModal(true);
  };

  const abrirModalModificar = (proveedor) => {
    setProveedorActual(proveedor);
    setModalMode("modificar");
    setShowModal(true);
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

  const handleAgregar = async (nuevoProveedor) => {
    await agregarProveedor(nuevoProveedor);
    const proveedoresData = await obtenerProveedores();
    setProveedores(proveedoresData);
  };

  const handleModificar = async (id, nuevosDatos) => {
    await modificarProveedor(id, nuevosDatos);
    const proveedoresData = await obtenerProveedores();
    setProveedores(proveedoresData);
  };

  const handleEliminar = async (id) => {
    await eliminarProveedor(id);
    const proveedoresData = await obtenerProveedores();
    setProveedores(proveedoresData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === "agregar") {
      await handleAgregar({
        nombre: proveedorActual.nombre,
        contacto: proveedorActual.contacto,
      });
    } else {
      await handleModificar(proveedorActual.id, {
        nombre: proveedorActual.nombre,
        contacto: proveedorActual.contacto,
      });
    }
    setShowModal(false);
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
          <Button
            variant="contained"
            color="primary"
            startIcon={<Business />}
            onClick={abrirModalAgregar}
          >
            Agregar Proveedor
          </Button>
        </Box>

        <Grid container spacing={2}>
          {proveedores.map((proveedor) => (
            <Grid key={proveedor.id}>
              <Card elevation={2} sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {proveedor.nombre}
                  </Typography>
                  <Typography color="text.secondary">
                    Contacto: {proveedor.contacto}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      variant="outlined"
                      onClick={() => abrirModalModificar(proveedor)}
                    >
                      Modificar
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      variant="outlined"
                      color="error"
                      onClick={() => handleEliminar(proveedor.id)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Dialog para agregar/modificar proveedor */}
        <Dialog open={showModal} onClose={cerrarModal} fullWidth maxWidth="sm">
          <DialogTitle>
            {modalMode === "agregar"
              ? "Agregar Proveedor"
              : "Modificar Proveedor"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
              >
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={proveedorActual.nombre}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  margin="dense"
                />
                <TextField
                  label="Contacto"
                  name="contacto"
                  value={proveedorActual.contacto}
                  onChange={handleChange}
                  required
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

        {/* Mensaje cuando no hay proveedores */}
        {proveedores.length === 0 && (
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
      </Paper>
    </Container>
  );
};

export default Proveedores;