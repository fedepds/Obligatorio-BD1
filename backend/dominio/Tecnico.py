class Tecnico:
    def __init__(self, id, nombre, contacto):
        self.id = id
        self.nombre = nombre
        self.contacto = contacto

    def __repr__(self):
        return f"Tecnico(id={self.id}, nombre={self.nombre}, contacto={self.contacto})"