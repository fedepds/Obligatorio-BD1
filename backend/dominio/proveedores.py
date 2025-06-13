from datetime import datetime, date
class proveedores:
    def __init__(self,nombre,contacto):

        self.nombre=nombre
        self.contacto=contacto
    

    def __repr__(self):
        return (f"Proveedor(nombre={self.nombre}, contacto={self.contacto})")