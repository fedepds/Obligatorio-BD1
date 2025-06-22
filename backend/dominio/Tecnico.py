class Tecnico:
    def _init_(self, id, nombre, contacto):
        self.id = id
        self.nombre = nombre
        self.contacto = contacto

    def _repr_(self):
        return f"Tecnico(id={self.id}, nombre={self.nombre}, contacto={self.contacto})"