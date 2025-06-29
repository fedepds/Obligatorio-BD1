from datetime import datetime, date
class proveedores:
    def __init__(self,id,rut,nombre,contacto):

        self.id=id
        self.rut=rut
        self.nombre=nombre
        self.contacto=contacto
    

    def __repr__(self):
        return (f"Proveedor(id={self.id}, rut={self.rut}, nombre={self.nombre}, contacto={self.contacto})")
    #Podriamos agregar un metodo para validar que el rut sea valido ? Validar con el equipo.