#Vamos a utilizar la misma estructura de clientes ? puedo crear una estructura para proveedores ya que tienen distintos campos
from logging import root
from backend.dominio import Proveedor
from backend.connection import DatabaseConnection

def agregar_proveedores(proveedor):
    query = """INSERT INTO proveedores (rut, nombre, contacto) 
               VALUES (%s, %s, %s)"""
    values = (proveedor.rut, proveedor.nombre, proveedor.contacto)

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

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        return rows