from datetime import datetime, date
class clientes:
    def __init__(self,ci,nombre,apellido,direccion,fecha_nacimiento,telefono,correo_electronico):

        self.ci = ci
        self.nombre=nombre
        self.apellido=apellido
        self.direccion=direccion
        self.fecha_nacimiento=fecha_nacimiento
        self.telefono=telefono
        self.correo=correo_electronico
    
    #Valido que mis clientes tengan +18 años, si no es un requerimiento en nuestro sistema lo eliminamos , Validar con el equipo.
    def es_mayor_de_edad(self):
        return (date.today().year - self.fecha_nacimiento.year) >= 18
   

    def __repr__(self):
        return (f"cliente(ci={self.ci}, nombre={self.nombre}, apellido={self.apellido}, "
                f"fecha_nacimiento={self.fecha_nacimiento}, telefono={self.telefono}, "
                f"correo_electronico={self.correo})")