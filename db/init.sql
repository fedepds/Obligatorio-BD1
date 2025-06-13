USE cafes_marloy;
-- TABLA LOGIN
CREATE TABLE IF NOT EXISTS login (
    correo VARCHAR(100) PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    es_administrador BOOLEAN NOT NULL DEFAULT 0
);


-- TABLA PROVEEDORES
CREATE TABLE IF NOT EXISTS proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    contacto VARCHAR(50) NOT NULL
);

-- TABLA INSUMOS
CREATE TABLE IF NOT EXISTS insumos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL, 
    precio_unitario DECIMAL(10,2) NOT NULL,
    id_proveedor INT NOT NULL,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id)
);


-- TABLA CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(200),
    telefono VARCHAR(20) UNIQUE,
    correo VARCHAR(100) UNIQUE
);

-- TABLA MAQUINAS
CREATE TABLE IF NOT EXISTS maquinas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo VARCHAR(100) NOT NULL,
    id_cliente INT,
    ubicacion_cliente VARCHAR(100) NOT NULL,
    costo_alquiler_mensual DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);


-- TABLA TECNICOS
CREATE TABLE IF NOT EXISTS tecnicos (
    ci VARCHAR(20) PRIMARY KEY NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) UNIQUE
);

-- TABLA MANTENIMIENTOS
CREATE TABLE IF NOT EXISTS mantenimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_maquina INT,
    ci_tecnico VARCHAR(20) NOT NULL, -- Fede no permitimos CI nulas, vamos a usarlas para eliminar a los técnicos
    tipo VARCHAR(50) NOT NULL, 
    fecha DATE, --cambio a date ya que la hora no nos sirve en este caso
    observaciones TEXT,
    FOREIGN KEY (id_maquina) REFERENCES maquinas(id),
    FOREIGN KEY (ci_tecnico) REFERENCES tecnicos(ci)
);

-- TABLA REGISTRO_CONSUMO
CREATE TABLE IF NOT EXISTS registro_consumo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_maquina INT,
    id_insumo INT,
    fecha DATE,
    cantidad_usada DECIMAL(10,2),
    FOREIGN KEY (id_maquina) REFERENCES maquinas(id),
    FOREIGN KEY (id_insumo) REFERENCES insumos(id)
);

--Insertamos datos de ejemplos 

INSERT INTO login (correo, password, es_administrador) VALUES
('admin@cafesmarloy.com', 'admin123', 1),
('soporte@cafesmarloy.com', 'soporte2024', 1),
('tecnico1@cafesmarloy.com', 'tec123', 0),
('cliente1@gmail.com', 'cli123', 0),
('usuario2@outlook.com', 'userpass', 0),
('gestion@cafesmarloy.com', 'gestion2024', 1);


INSERT INTO proveedores (nombre, contacto) VALUES
('Proveedora Latina', 'latina@proveedores.com'),
('Insumos del Sur', 'contacto@delsur.com'),
('Cafe y Cía', 'ventas@cafeycia.com'),
('Sabores Únicos', 'sabores@unicos.com'),
('Soluciones Bebidas', 'info@solbeb.com'),
('Distribuidora Oriental', 'oriental@dist.com');


INSERT INTO insumos (descripcion, tipo, precio_unitario, id_proveedor) VALUES
('Café molido premium', 'Café', 350.00, 1),
('Leche en polvo', 'Lácteo', 220.50, 2),
('Chocolate en polvo', 'Chocolate', 180.25, 4),
('Canela', 'Condimento', 55.00, 5),
('Azúcar', 'Endulzante', 40.00, 3),
('Vaso descartable 200ml', 'Descartable', 7.50, 6);

INSERT INTO clientes (nombre, direccion, telefono, correo) VALUES
('Empresa Uno S.A.', 'Av. Principal 123, Montevideo', '091234567', 'contacto@empresau1.com'),
('Edificio Centenario', 'Calle Falsa 456, Canelones', '092234455', 'edificio@centenario.com'),
('Hospital del Sur', 'Ruta 8 km 25, Maldonado', '095664477', 'info@hospitalsur.com'),
('Instituto Santa Ana', 'Bulevar Artigas 999, Salto', '098112233', 'santaana@instituto.com'),
('Colegio Moderno', 'Av. Italia 321, Montevideo', '096445566', 'info@colegiomoderno.edu.uy'),
('Residencial Los Pinos', 'Camino Rural 14, Florida', '097667788', 'pinos@residencial.com');


INSERT INTO maquinas (modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual) VALUES
('M200', 1, 'Hall principal', 2500.00),
('M300', 1, 'Cafetería', 2700.00),
('Eco100', 2, 'Recepción', 1800.00),
('Pro200', 3, 'Sala de espera', 2200.00),
('PlusX', 4, 'Comedor', 1950.00),
('M200', 5, 'Biblioteca', 2500.00);


INSERT INTO tecnicos (ci, nombre, apellido, telefono) VALUES
('35899012', 'Ana', 'Pérez', '099100200'),
('41222333', 'Luis', 'García', '098990011'),
('43322110', 'María', 'López', '091223344'),
('40111222', 'Diego', 'Fernández', '092344556'),
('42131415', 'Lucía', 'Rodríguez', '094556677'),
('38991231', 'Juan', 'Martínez', '096112233');

INSERT INTO mantenimientos (id_maquina, ci_tecnico, tipo, fecha, observaciones) VALUES
(1, '35899012', 'Preventivo', '2024-05-10 ', 'Cambio de filtros y limpieza general'),
(2, '40111222', 'Correctivo', '2024-05-12 ', 'Reemplazo de bomba de agua'),
(3, '43322110', 'Preventivo', '2024-05-18 ', 'Chequeo eléctrico y prueba de funcionamiento'),
(4, '41222333', 'Correctivo', '2024-05-22 ', 'Reparación de válvula de vapor'),
(5, '42131415', 'Preventivo', '2024-05-25 ', 'Limpieza y revisión de insumos'),
(6, '38991231', 'Correctivo', '2024-05-27 ', 'Ajuste de termostato y prueba final');

INSERT INTO registro_consumo (id_maquina, id_insumo, fecha, cantidad_usada) VALUES
(1, 1, '2024-05-01', 12.50),
(1, 2, '2024-05-01', 8.00),
(2, 3, '2024-05-01', 3.25),
(3, 5, '2024-05-02', 1.90),
(4, 1, '2024-05-03', 14.00),
(5, 4, '2024-05-03', 2.00);