import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Add, Edit, Delete, Inventory } from "@mui/icons-material";

const Insumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("agregar");
  const [insumoActual, setInsumoActual] = useState({
    descripcion: "",
    tipo: "",
    precio_unitario: "",
    id_proveedor: "",
    id: "",
  });

  useEffect(() => {
    const fetchInsumos = async () => {
      const data = await obtenerInsumos();
      setInsumos(data);
    };
    fetchInsumos();
  }, []);

  const abrirModalAgregar = () => {
    setInsumoActual({
      descripcion: "",
      tipo: "",
      precio_unitario: "",
      id_proveedor: "",
      id: "",
    });
    setModalMode("agregar");
    setShowModal(true);
  };

  const abrirModalModificar = (insumo) => {
    setInsumoActual(insumo);
    setModalMode("modificar");
    setShowModal(true);
  };

  const cerrarModal = () => setShowModal(false);

  const handleChange = (e) => {
    setInsumoActual({
      ...insumoActual,
      [e.target.name]: e.target.value,
    });
  };

  const handleAgregar = async (nuevoInsumo) => {
    await agregarInsumo(nuevoInsumo);
    setInsumos(await obtenerInsumos());
  };

  const handleModificar = async (id, nuevosDatos) => {
    await modificarInsumo(id, nuevosDatos);
    setInsumos(await obtenerInsumos());
  };

  const handleEliminar = async (id) => {
    await eliminarInsumo(id);
    setInsumos(await obtenerInsumos());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modalMode === "agregar") {
      await handleAgregar(insumoActual);
    } else {
      await handleModificar(insumoActual.id, {
        descripcion: insumoActual.descripcion,
        tipo: insumoActual.tipo,
        precio_unitario: insumoActual.precio_unitario,
        id_proveedor: insumoActual.id_proveedor,
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
            Gestión de Insumos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Inventory />}
            onClick={abrirModalAgregar}
          >
            Agregar Insumo
          </Button>
        </Box>

        <Grid container spacing={2}>
          {insumos.map((insumo) => (
            <Grid item key={insumo.id} xs={12} sm={6} md={4}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6">{insumo.descripcion}</Typography>
                  <Typography color="text.secondary">
                    Tipo: {insumo.tipo}
                  </Typography>
                  <Typography color="text.secondary">
                    Precio: {insumo.precio_unitario}
                  </Typography>
                  <Typography color="text.secondary">
                    Proveedor: {insumo.id_proveedor}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      variant="outlined"
                      onClick={() => abrirModalModificar(insumo)}
                    >
                      Modificar
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      variant="outlined"
                      color="error"
                      onClick={() => handleEliminar(insumo.id)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Modal para agregar/modificar insumo */}
        <Dialog open={showModal} onClose={cerrarModal} fullWidth maxWidth="sm">
          <DialogTitle>
            {modalMode === "agregar" ? "Agregar Insumo" : "Modificar Insumo"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                {modalMode === "modificar" && (
                  <TextField
                    label="ID"
                    name="id"
                    value={insumoActual.id}
                    InputProps={{ readOnly: true }}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                  />
                )}
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
                <TextField
                  label="ID Proveedor"
                  name="id_proveedor"
                  type="number"
                  value={insumoActual.id_proveedor}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  inputProps={{ min: 0 }}
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

        {/* Mensaje cuando no hay insumos */}
        {insumos.length === 0 && (
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
      </Paper>
    </Container>
  );
};

export default Insumos;