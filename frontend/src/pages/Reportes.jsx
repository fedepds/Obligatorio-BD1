import React, { useEffect, useState } from "react";
import {
  obtenerReporteMantenimientosPorTecnico,
  obtenerReporteConsumoPorMaquina,
} from "../api";
import {
  Container,
  Typography,
  Paper,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Button,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Reportes = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [consumo, setConsumo] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const mant = await obtenerReporteMantenimientosPorTecnico();
        setMantenimientos(mant);
        const cons = await obtenerReporteConsumoPorMaquina();
        setConsumo(cons);
      } catch (error) {
        // Manejo de error simple
      }
    };
    fetchReportes();
  }, []);

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
            Reportes
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ArrowBack />}
              onClick={() => navigate("/home")}
            >
              Volver
            </Button>
          </Box>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Mantenimientos por Técnico
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Contacto</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Máquina</TableCell>
                      <TableCell align="right">Total Mantenimientos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mantenimientos.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.nombre}</TableCell>
                        <TableCell>{row.contacto}</TableCell>
                        <TableCell>{row.tipo || "-"}</TableCell>
                        <TableCell>{row.maquina || "-"}</TableCell>
                        <TableCell align="right">{row.total_mantenimientos}</TableCell>
                      </TableRow>
                    ))}
                    {mantenimientos.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Sin datos
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Consumo por Máquina
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Máquina</TableCell>
                      <TableCell>Insumo</TableCell>
                      <TableCell align="right">Total Consumo</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {consumo.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{row.maquina}</TableCell>
                        <TableCell>{row.insumo || "-"}</TableCell>
                        <TableCell align="right">{row.total_consumo}</TableCell>
                      </TableRow>
                    ))}
                    {consumo.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          Sin datos
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Reportes;