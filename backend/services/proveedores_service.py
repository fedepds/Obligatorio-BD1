#Vamos a utilizar la misma estructura de clientes ? puedo crear una estructura para proveedores ya que tienen distintos campos
from backend.dominio import proveedores
from backend.connection import DatabaseConnection
def agregar_proveedores(clientes):
    query = """INSERT INTO proveedores (ci, nombre, apellido, direccion, fecha_nacimiento, telefono, correo_electronico) 
               VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    values = (clientes.ci, clientes.nombre, clientes.apellido, clientes.direccion,
              clientes.fecha_nacimiento, clientes.telefono, clientes.correo)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def eliminar_proveedor(ci):
    query = """DELETE FROM proveedores Where ci = %s"""
    values = (ci,)
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def modificar_proveedores(clientes):
    query= """UPDATE proveedores SET nombre = %s, apellido = %s, direccion = %s, fecha_nacimiento = %s, telefono = %s, correo_electronico = %s
              WHERE ci = %s"""
    values= (clientes.nombre, clientes.apellido, clientes.direccion,
              clientes.fecha_nacimiento, clientes.telefono, clientes.correo, clientes.ci)
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def obtener_proveedores(): ##revisar
    query = """SELECT * FROM proveedores"""
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        proveedores_list = []
        for row in rows:
            proveedor = proveedores.Proveedor(
                ci=row[0],
                nombre=row[1],
                apellido=row[2],
                direccion=row[3],
                fecha_nacimiento=row[4],
                telefono=row[5],
                correo=row[6]
            )
            proveedores_list.append(proveedor)
        return proveedores_list