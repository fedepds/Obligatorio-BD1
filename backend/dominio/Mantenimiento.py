class Mantenimiento:
    def __init__(self, id_maquina, ci_tecnico, tipo, fecha, observaciones):
        self.id_maquina = id_maquina
        self.ci_tecnico = ci_tecnico
        self.tipo = tipo
        self.fecha = fecha
        self.observaciones = observaciones

    def __str__(self):
        return f"Mantenimiento(id_maquina={self.id_maquina}, ci_tecnico={self.ci_tecnico}, tipo={self.tipo}, fecha={self.fecha}, observaciones={self.observaciones})"

