class Maquina:
    def __init__(self, id, modelo,id_cliente,ubicacion_cliente,costo_alquiler_mensual):
        self.id = id
        self.modelo = modelo
        self.id_cliente = id_cliente
        self.ubicacion_cliente = ubicacion_cliente
        self.costo_alquiler_mensual = costo_alquiler_mensual

    def __str__(self):
        return (f"Maquina(id={self.id}, modelo={self.modelo}, id_cliente={self.id_cliente}, "
                f"ubicacion_cliente={self.ubicacion_cliente}, costo_alquiler_mensual={self.costo_alquiler_mensual})")
#*-- TABLA MAQUINAS
#CREATE TABLE IF NOT EXISTS maquinas (
#    id INT AUTO_INCREMENT PRIMARY KEY,
#    modelo VARCHAR(100) NOT NULL,
#    id_cliente INT,
#    ubicacion_cliente VARCHAR(100) NOT NULL,
#    costo_alquiler_mensual DECIMAL(10,2) NOT NULL,
#    FOREIGN KEY (id_cliente) REFERENCES clientes(id)
#); #el id lo definimos? porque es autoincremental , que pasa si el usuario crea el objeto maquinas con un id definido ? 