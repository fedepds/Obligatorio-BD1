from datetime import datetime, date
class Cliente:
    def __init__(self ,id,rut,nombre,direccion,fecha_nacimiento,telefono,correo):

        self.id = id
        self.rut = rut
        self.nombre=nombre
      
        self.direccion=direccion
        self.fecha_nacimiento=fecha_nacimiento
        self.telefono=telefono
        self.correo=correo
    
    #Valido que mis clientes tengan +18 años, si no es un requerimiento en nuestro sistema lo eliminamos , Validar con el equipo.
    def es_mayor_de_edad(self):
        return (date.today().year - self.fecha_nacimiento.year) >= 18
   

    def __repr__(self):
        return (f"Cliente(id={self.id}, rut={self.rut}, nombre={self.nombre}, direccion={self.direccion}, fecha_nacimiento={self.fecha_nacimiento}, telefono={self.telefono}, correo={self.correo})")