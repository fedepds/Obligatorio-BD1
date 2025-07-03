class Tecnico:
    def __init__(self, id, nombre, telefono):
        self.id = id
        self.nombre = nombre
        self.telefono = telefono

    def __repr__(self):
        return f"Tecnico(id={self.id}, nombre={self.nombre}, telefono={self.telefono})"