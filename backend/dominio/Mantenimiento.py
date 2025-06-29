class Mantenimiento:
    def __init__(self, id_maquina, ci_tecnico, tipo, fecha, observaciones):
        self.id_maquina = id_maquina
        self.id_tecnico = id_tecnico
        self.tipo = tipo
        self.fecha = fecha
        self.observaciones = observaciones

    def __str__(self):
        return f"Mantenimiento(id_maquina={self.id_maquina}, id_tecnico={self.id_tecnico}, tipo={self.tipo}, fecha={self.fecha}, observaciones={self.observaciones})"

