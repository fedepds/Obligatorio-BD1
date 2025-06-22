class Maquina:
    def _init_(self, id, modelo,id_cliente,ubicacion_cliente,costo_alquiler_mensual):
        self.id = id
        self.modelo = modelo
        self.id_cliente = id_cliente
        self.ubicacion_cliente = ubicacion_cliente
        self.costo_alquiler_mensual = costo_alquiler_mensual

    def _str_(self):
        return (f"Maquina(id={self.id}, modelo={self.modelo}, id_cliente={self.id_cliente}, "
                f"ubicacion_cliente={self.ubicacion_cliente}, costo_alquiler_mensual={self.costo_alquiler_mensual})")