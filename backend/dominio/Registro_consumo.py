class Registro_consumo:
    def __init__(self,id,id_maquina,id_insumo,fecha,cantidad_usada):
        self.id = id
        self.id_maquina = id_maquina
        self.id_insumo = id_insumo
        self.fecha = fecha
        self.cantidad_usada = cantidad_usada

    def __repr__(self):
        return (f"Registro_consumo(id={self.id}, id_maquina={self.id_maquina}, id_insumo={self.id_insumo}, fecha={self.fecha}, cantidad_usada={self.cantidad_usada})")