const API_URL = "http://127.0.0.1:5000";

const getToken = () => localStorage.getItem('token');
// Función genérica peticiones API
const peticionAPI = async (endpoint, method = "GET", body = null) => {
  try {
    const options = {
      method,
      headers: {},
    };

    // Agregar token
    const token = getToken();
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    if (body) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);

    // Si hay error 401 (no autorizado) o 403 (prohibido), redirigir al login
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
      throw new Error('Sesión expirada o sin permisos');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Error en la petición ${method} ${endpoint}`
      );
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en peticionAPI (${method} ${endpoint}):`, error);
    throw error;
  }
};




// ---------------- USUARIOS ----------------

export const registrarUsuario = (correo, password, es_administrador = false) =>
  peticionAPI("/api/usuarios", "POST", {
    correo,
    password,
    es_administrador,
  });

export const loginUsuario = async (correo, password) => {
  const respuesta = await peticionAPI("/api/usuarios/login", "POST", { correo, password });
  // Guardar token y datos
  localStorage.setItem('token', respuesta.token);
  localStorage.setItem('usuario', JSON.stringify(respuesta.usuario));
  return respuesta;
};
export const cerrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/login';
};

export const obtenerUsuarios = () => peticionAPI("/api/usuarios");

// ---------------- CLIENTES ----------------

export const obtenerClientes = () => peticionAPI("/api/clientes");

export const agregarCliente = (cliente) =>
  peticionAPI("/api/clientes", "POST", cliente);

export const modificarCliente = (ci, nuevosDatos) =>
  peticionAPI(`/api/clientes/${ci}`, "PUT", nuevosDatos);

export const eliminarCliente = (ci) =>
  peticionAPI(`/api/clientes/${ci}`, "DELETE");

// ---------------- PROVEEDORES ----------------

export const obtenerProveedores = () => peticionAPI("/api/proveedores");

export const agregarProveedor = (proveedor) =>
  peticionAPI("/api/proveedores", "POST", proveedor);

export const modificarProveedor = (id, nuevosDatos) =>
  peticionAPI(`/api/proveedores/${id}`, "PUT", nuevosDatos);

export const eliminarProveedor = (id) =>
  peticionAPI(`/api/proveedores/${id}`, "DELETE");

// ---------------- INSUMOS ----------------

export const obtenerInsumos = () => peticionAPI("/api/insumos");

export const agregarInsumo = (insumo) =>
  peticionAPI("/api/insumos", "POST", insumo);

export const modificarInsumo = (codigo, nuevosDatos) =>
  peticionAPI(`/api/insumos/${codigo}`, "PUT", nuevosDatos);

export const eliminarInsumo = (codigo) =>
  peticionAPI(`/api/insumos/${codigo}`, "DELETE");

// ---------------- TÉCNICOS ----------------

export const obtenerTecnicos = () => peticionAPI("/api/tecnicos");

export const agregarTecnico = (tecnico) =>
  peticionAPI("/api/tecnicos", "POST", tecnico);

export const modificarTecnico = (id, nuevosDatos) =>
  peticionAPI(`/api/tecnicos/${id}`, "PUT", nuevosDatos);

export const eliminarTecnico = (id) =>
  peticionAPI(`/api/tecnicos/${id}`, "DELETE");

// ---------------- MANTENIMIENTOS ----------------

export const obtenerMantenimientos = () => peticionAPI("/api/mantenimientos");

export const agregarMantenimiento = (mantenimiento) =>
  peticionAPI("/api/mantenimientos", "POST", mantenimiento);

export const modificarMantenimiento = (id, nuevosDatos) =>
  peticionAPI(`/api/mantenimientos/${id}`, "PUT", nuevosDatos);

export const eliminarMantenimiento = (id) =>
  peticionAPI(`/api/mantenimientos/${id}`, "DELETE");

// ---------------- REGISTRO CONSUMO ----------------

export const obtenerRegistrosConsumo = () => peticionAPI("/api/registro-consumo");

export const agregarRegistroConsumo = (registro) =>
  peticionAPI("/api/registro-consumo", "POST", registro);

export const modificarRegistroConsumo = (id, nuevosDatos) =>
  peticionAPI(`/api/registro-consumo/${id}`, "PUT", nuevosDatos);

export const eliminarRegistroConsumo = (id) =>
  peticionAPI(`/api/registro-consumo/${id}`, "DELETE");

// ---------------- MÁQUINAS ----------------

export const obtenerMaquinas = () => peticionAPI("/api/maquinas");

export const agregarMaquina = (maquina) =>
  peticionAPI("/api/maquinas", "POST", maquina);

export const modificarMaquina = (id, nuevosDatos) =>
  peticionAPI(`/api/maquinas/${id}`, "PUT", nuevosDatos);

export const eliminarMaquina = (id) =>
  peticionAPI(`/api/maquinas/${id}`, "DELETE");

// ---------------- REPORTES ----------------

export const obtenerReporteMantenimientosPorTecnico = () =>
  peticionAPI("/api/reportes/mantenimientos-por-tecnico");

export const obtenerReporteConsumoPorMaquina = () =>
  peticionAPI("/api/reportes/consumo-por-maquina");