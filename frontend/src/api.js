const API_URL = "http://127.0.0.1:5000";

// Función genérica peticiones API
const peticionAPI = async (endpoint, method = "GET", body = null) => {
  try {
    const options = {
      method,
      headers: {},
    };
    if (body) {
      options.headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
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

// ---------------- CLIENTES ----------------

export const obtenerClientes = () => peticionAPI("/clientes");

export const agregarCliente = (cliente) =>
  peticionAPI("/clientes/agregar", "POST", cliente);

// ---------------- INSUMOS ----------------

export const obtenerInsumos = () => peticionAPI("/insumo");

export const agregarInsumo = (insumo) =>
  peticionAPI("/insumos", "POST", insumo);

export const modificarInsumo = (id, nuevosDatos) =>
  peticionAPI(`/insumos/${id}`, "PUT", nuevosDatos);

export const eliminarInsumo = (id) => peticionAPI(`/insumos/${id}`, "DELETE");

// ---------------- USUARIOS ----------------

export const registrarUsuario = (
  correo,
  contraseña,
  es_administrador = false
) =>
  peticionAPI("/login/registrar", "POST", {
    correo,
    contraseña,
    es_administrador,
  });

  export const loginUsuario = async (correo, contraseña) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo, contraseña }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Credenciales incorrectas");
      }

      // Guardar el token en el almacenamiento local después del login
      const data = await response.json();
      localStorage.setItem("token", data.token);
      return data;
    } catch (error) {
      console.error("Error en loginUsuario:", error);
      throw error;
    }
  };

// ---------------- MANTENIMIENTOS ----------------

export const obtenerMantenimientos = () => peticionAPI("/mantenimiento");

export const agregarMantenimiento = (mantenimiento) =>
  peticionAPI("/mantenimientos", "POST", mantenimiento);

export const modificarMantenimiento = (id, nuevosDatos) =>
  peticionAPI(`/mantenimientos/${id}`, "PUT", nuevosDatos);

export const eliminarMantenimiento = (id) =>
  peticionAPI(`/mantenimientos/${id}`, "DELETE");

// ---------------- PROVEEDORES ----------------

export const obtenerProveedores = () => peticionAPI("/proveedores");

export const agregarProveedor = (proveedor) =>
  peticionAPI("/proveedores", "POST", proveedor);

export const modificarProveedor = (ci, nuevosDatos) =>
  peticionAPI(`/proveedores/${ci}`, "PUT", nuevosDatos);

export const eliminarProveedor = (ci) =>
  peticionAPI(`/proveedores/${ci}`, "DELETE");

// ---------------- REGISTRO CONSUMO ----------------

export const obtenerRegistrosConsumo = () => peticionAPI("/registro_consumo");

export const agregarRegistroConsumo = (registro) =>
  peticionAPI("/registro_consumo", "POST", registro);

export const modificarRegistroConsumo = (id, nuevosDatos) =>
  peticionAPI(`/registro_consumo/${id}`, "PUT", nuevosDatos);

export const eliminarRegistroConsumo = (id) =>
  peticionAPI(`/registro_consumo/${id}`, "DELETE");

// ---------------- TÉCNICOS ----------------

export const obtenerTecnicos = () => peticionAPI("/tecnicos");

export const agregarTecnico = (tecnico) =>
  peticionAPI("/tecnicos", "POST", tecnico);

export const modificarTecnico = (ci, nuevosDatos) =>
  peticionAPI(`/tecnicos/${ci}`, "PUT", nuevosDatos);

export const eliminarTecnico = (ci) => peticionAPI(`/tecnicos/${ci}`, "DELETE");
