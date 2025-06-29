#Vamos a utilizar la misma estructura de clientes ? puedo crear una estructura para proveedores ya que tienen distintos campos
from logging import root
from backend.dominio import Proveedor
from backend.connection import DatabaseConnection

def agregar_proveedores(proveedor):
    query = """INSERT INTO proveedores (id, rut, nombre, contacto) 
               VALUES (%s, %s, %s, %s)"""
    values = (proveedor.id, proveedor.rut, proveedor.nombre, proveedor.contacto)

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def eliminar_proveedor(rut):
    query = """DELETE FROM proveedores Where rut = %s"""
    values = (rut, )
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def modificar_proveedores(proveedor, nuevos_datos_proveedor):
    query= """UPDATE proveedores SET nombre = %s, contacto = %s
              WHERE rut = %s"""
    values= (nuevos_datos_proveedor.nombre, nuevos_datos_proveedor.contacto, proveedor.rut)


    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def obtener_proveedores(): 
    query = """SELECT * FROM proveedores"""
    with DatabaseConnection() as cursor:
        cursor.execute(query)
        rows = cursor.fetchall()
        proveedores_list = []
        for row in rows:
            proveedor_obj = Proveedor(
                id=row[0],
                rut=row[1],
                nombre=row[2],
                contacto=row[3]
            )
            proveedores_list.append(proveedor_obj)
        return proveedores_list