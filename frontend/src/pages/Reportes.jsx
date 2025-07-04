import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Assessment,
  PictureAsPdf,
  GetApp,
  Build,
  TrendingUp,
  People,
  Inventory,
  AttachMoney,
} from "@mui/icons-material";
import {
  obtenerReporteMantenimientosPorTecnico,
  obtenerReporteConsumoPorMaquina,
  obtenerReporteTotalMensualPorCliente,
  obtenerReporteInsumosMayorConsumo,
  obtenerReporteClientesConMasMaquinas
} from "../api";

const Reportes = () => {
  const [reporteSeleccionado, setReporteSeleccionado] = useState("");
  const [datosReporte, setDatosReporte] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const tiposReporte = [
    { 
      id: "mantenimientos-por-tecnico", 
      nombre: "Mantenimientos por Técnico",
      descripcion: "Muestra el total de mantenimientos realizados por cada técnico",
      icono: <Build />
    },
    { 
      id: "consumo-por-maquina", 
      nombre: "Consumo por Máquina",
      descripcion: "Muestra el total de consumo de insumos por máquina",
      icono: <TrendingUp />
    },
    { 
      id: "total-mensual-por-cliente", 
      nombre: "Total Mensual por Cliente",
      descripcion: "Muestra el total mensual (alquiler + consumos) por cliente",
      icono: <AttachMoney />
    },
    { 
      id: "insumos-mayor-consumo", 
      nombre: "Insumos de Mayor Consumo",
      descripcion: "Muestra los insumos más consumidos y su valor total",
      icono: <Inventory />
    },
    { 
      id: "clientes-mas-maquinas", 
      nombre: "Clientes con Más Máquinas",
      descripcion: "Muestra los clientes que tienen más máquinas alquiladas",
      icono: <People />
    },
  ];

const generarReporte = async () => {
  if (!reporteSeleccionado) {
    setError("Por favor selecciona un tipo de reporte");
    return;
  }

  setLoading(true);
  setError("");

  try {
    let data;

    switch(reporteSeleccionado) {
      case "mantenimientos-por-tecnico":
        data = await obtenerReporteMantenimientosPorTecnico();
        break;
      case "consumo-por-maquina":
        data = await obtenerReporteConsumoPorMaquina();
        break;
      case "total-mensual-por-cliente":
        data = await obtenerReporteTotalMensualPorCliente();
        break;
      case "insumos-mayor-consumo":
        data = await obtenerReporteInsumosMayorConsumo();
        break;
      case "clientes-mas-maquinas":
        data = await obtenerReporteClientesConMasMaquinas();
        break;
      default:
        throw new Error("Tipo de reporte no válido");
    }

    setDatosReporte(data);
  } catch (error) {
    console.error("Error al generar reporte:", error);
    setError("Error al generar reporte: " + error.message);
    setDatosReporte([]);
  } finally {
    setLoading(false);
  }
};
  const renderTablaReporte = () => {
    if (datosReporte.length === 0) return null;

    // Definir columnas según el tipo de reporte
    const getColumnas = () => {
      switch (reporteSeleccionado) {
        case "mantenimientos-por-tecnico":
          return [
            { key: "nombre", label: "Técnico" },
            { key: "contacto", label: "Contacto" },
            { key: "total_mantenimientos", label: "Total Mantenimientos" },
          ];
        case "consumo-por-maquina":
          return [
            { key: "maquina", label: "Máquina" },
            { key: "total_consumo", label: "Total Consumo" },
          ];
        case "total-mensual-por-cliente":
          return [
            { key: "id", label: "ID Cliente" },
            { key: "nombre", label: "Cliente" },
            { key: "total_mensual", label: "Total Mensual ($)" },
          ];
        case "insumos-mayor-consumo":
          return [
            { key: "id", label: "ID Insumo" },
            { key: "nombre", label: "Insumo" },
            { key: "total_consumido", label: "Total Consumido" },
            { key: "valor_total", label: "Valor Total ($)" },
          ];
        case "clientes-mas-maquinas":
          return [
            { key: "id", label: "ID Cliente" },
            { key: "nombre", label: "Cliente" },
            { key: "total_maquinas", label: "Total Máquinas" },
          ];
        default:
          return [];
      }
    };

    const columnas = getColumnas();

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columnas.map((col) => (
                <TableCell key={col.key} sx={{ fontWeight: 'bold' }}>
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {datosReporte.map((row, index) => (
              <TableRow key={index}>
                {columnas.map((col) => (
                  <TableCell key={col.key}>
                    {col.key.includes('total_mensual') || col.key.includes('valor_total') 
                      ? `$${parseFloat(row[col.key] || 0).toFixed(2)}`
                      : row[col.key] || 0
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const getReporteActual = () => {
    return tiposReporte.find(r => r.id === reporteSeleccionado);
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
            Reportes y Análisis
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Volver
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Panel de selección */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Seleccionar Reporte
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Reporte</InputLabel>
                    <Select
                      value={reporteSeleccionado}
                      label="Tipo de Reporte"
                      onChange={(e) => setReporteSeleccionado(e.target.value)}
                    >
                      {tiposReporte.map((tipo) => (
                        <MenuItem key={tipo.id} value={tipo.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {tipo.icono}
                            {tipo.nombre}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {reporteSeleccionado && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        {getReporteActual()?.descripcion}
                      </Typography>
                    </Alert>
                  )}

                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : <Assessment />}
                    onClick={generarReporte}
                    disabled={loading || !reporteSeleccionado}
                    fullWidth
                  >
                    {loading ? "Generando..." : "Generar Reporte"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Panel de resultados */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resultados
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 200,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : datosReporte.length > 0 ? (
                  <>
                    {renderTablaReporte()}
                    <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<PictureAsPdf />}
                        size="small"
                        onClick={() => alert("Funcionalidad de exportar PDF próximamente")}
                      >
                        Exportar PDF
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<GetApp />}
                        size="small"
                        onClick={() => alert("Funcionalidad de exportar Excel próximamente")}
                      >
                        Exportar Excel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: 200,
                      color: "text.secondary",
                    }}
                  >
                    <Typography>
                      Selecciona un tipo de reporte y haz clic en "Generar Reporte"
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Reportes;