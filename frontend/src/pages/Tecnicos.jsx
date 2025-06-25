import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  agregarTecnico,
  obtenerTecnicos,
  modificarTecnico,
  eliminarTecnico,
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
import { Add, Edit, Delete, Engineering } from "@mui/icons-material";

const Tecnicos = () => {
  const navigate = useNavigate();
  const [tecnicos, setTecnicos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("agregar"); // "agregar" o "modificar"
  const [tecnicoActual, setTecnicoActual] = useState({
    ci: "",
    nombre: "",
    especialidad: "",
    telefono: "",
  });

  useEffect(() => {
    const fetchTecnicos = async () => {
      const tecnicosData = await obtenerTecnicos();
      setTecnicos(tecnicosData);
    };
    fetchTecnicos();
  }, []);

  const handleAgregar = async (nuevoTecnico) => {
    await agregarTecnico(nuevoTecnico);
    const data = await obtenerTecnicos();
    setTecnicos(data);
  };

  const handleModificar = async (ci, nuevosDatos) => {
    await modificarTecnico(ci, nuevosDatos);
    const data = await obtenerTecnicos();
    setTecnicos(data);
  };

  const handleEliminar = async (ci) => {
    await eliminarTecnico(ci);
    setTecnicos(tecnicos.filter((t) => t.ci !== ci));
  };

  const abrirModalAgregar = () => {
    setTecnicoActual({
      ci: "",
      nombre: "",
      especialidad: "",
      telefono: "",
    });
    setModalMode("agregar");
    setShowModal(true);
  };

  const abrirModalModificar = (tecnico) => {
    setTecnicoActual(tecnico);
    setModalMode("modificar");
    setShowModal(true);
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
    if (modalMode === "agregar") {
      await handleAgregar(tecnicoActual);
    } else {
      await handleModificar(tecnicoActual.ci, tecnicoActual);
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
            Gestión de Técnicos
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Engineering />}
            onClick={abrirModalAgregar}
          >
            Agregar Técnico
          </Button>
        </Box>

        <Grid container spacing={2}>
          {tecnicos.map((tecnico) => (
            <Grid item xs={12} sm={6} md={4} key={tecnico.ci}>
              <Card elevation={2} sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {tecnico.nombre}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    CI: {tecnico.ci}
                  </Typography>
                  <Typography color="text.secondary">
                    Especialidad: {tecnico.especialidad}
                  </Typography>
                  <Typography color="text.secondary">
                    Teléfono: {tecnico.telefono}
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
                      onClick={() => abrirModalModificar(tecnico)}
                    >
                      Modificar
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Delete />}
                      variant="outlined"
                      color="error"
                      onClick={() => handleEliminar(tecnico.ci)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Dialog para agregar/modificar técnico */}
        <Dialog open={showModal} onClose={cerrarModal} fullWidth maxWidth="sm">
          <DialogTitle>
            {modalMode === "agregar" ? "Agregar Técnico" : "Modificar Técnico"}
          </DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}
              >
                <TextField
                  label="CI"
                  name="ci"
                  value={tecnicoActual.ci}
                  onChange={handleChange}
                  disabled={modalMode === "modificar"}
                  required
                  fullWidth
                  variant="outlined"
                  margin="dense"
                />
                <TextField
                  label="Nombre"
                  name="nombre"
                  value={tecnicoActual.nombre}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  margin="dense"
                />
                <TextField
                  label="Especialidad"
                  name="especialidad"
                  value={tecnicoActual.especialidad}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  margin="dense"
                />
                <TextField
                  label="Teléfono"
                  name="telefono"
                  value={tecnicoActual.telefono}
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

        {/* Mensaje cuando no hay técnicos */}
        {tecnicos.length === 0 && (
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
      </Paper>
    </Container>
  );
};

export default Tecnicos;
