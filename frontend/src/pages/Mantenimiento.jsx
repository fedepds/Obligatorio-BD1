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
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, Build } from "@mui/icons-material";

const Mantenimiento = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMantenimientos = async () => {
      const data = await obtenerMantenimientos();
      setMantenimientos(data);
    };
    fetchMantenimientos();
  }, []);

  const handleAgregar = async (nuevoMantenimiento) => {
    await agregarMantenimiento(nuevoMantenimiento);
    const data = await obtenerMantenimientos();
    setMantenimientos(data);
  };

  const handleModificar = async (id, cambios) => {
    await modificarMantenimiento(id, cambios);
    const data = await obtenerMantenimientos();
    setMantenimientos(data);
  };

  const handleEliminar = async (id) => {
    await eliminarMantenimiento(id);
    setMantenimientos(mantenimientos.filter((m) => m.id !== id));
  };

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ nombre: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const openAgregarModal = () => {
    setModalData({ nombre: "" });
    setIsEditing(false);
    setShowModal(true);
  };

  const openModificarModal = (mantenimiento) => {
    setModalData({ nombre: mantenimiento.nombre });
    setIsEditing(true);
    setEditId(mantenimiento.id);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setModalData({ ...modalData, [e.target.name]: e.target.value });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await handleModificar(editId, modalData);
    } else {
      await handleAgregar(modalData);
    }
    setShowModal(false);
  };

  const handleModalClose = () => {
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
            Gestión de Mantenimientos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Build />}
            onClick={openAgregarModal}
          >
            Agregar Mantenimiento
          </Button>
        </Box>

        <Grid container spacing={2}>
          {mantenimientos.map((mantenimiento) => (
            <Grid item xs={12} sm={6} md={4} key={mantenimiento.id}>
              <Card elevation={2} sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {mantenimiento.nombre}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 2,
                      gap: 1,
                    }}
                  >
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      variant="outlined"
                      onClick={() => openModificarModal(mantenimiento)}
                    >
                      Modificar
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      variant="outlined"
                      color="error"
                      onClick={() => handleEliminar(mantenimiento.id)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Dialog para agregar/modificar mantenimiento */}
        <Dialog
          open={showModal}
          onClose={handleModalClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {isEditing ? "Modificar Mantenimiento" : "Agregar Mantenimiento"}
          </DialogTitle>
          <form onSubmit={handleModalSubmit}>
            <DialogContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
              >
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={modalData.nombre}
                  onChange={handleModalChange}
                  required
                  fullWidth
                  variant="outlined"
                  margin="dense"
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleModalClose} color="inherit">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {isEditing ? "Guardar Cambios" : "Agregar"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Mensaje cuando no hay mantenimientos */}
        {mantenimientos.length === 0 && (
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
              onClick={openAgregarModal}
              sx={{ mt: 2 }}
            >
              Agregar nuevo mantenimiento
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Mantenimiento;
