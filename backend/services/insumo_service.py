from backend.dominio import Insumo
from backend.connection import DatabaseConnection


def agregar_insumo(insumo):
    query = """INSERT INTO insumos (id,nombre, descripcion, tipo, precio_unitario, rut_proveedor) 
               VALUES (%s, %s, %s, %s, %s, %s)"""
    values = (insumo.id, insumo.nombre, insumo.descripcion, insumo.tipo, insumo.precio_unitario, insumo.rut_proveedor)

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def eliminar_insumo(insumo_id):
    query = """DELETE FROM insumos WHERE id = %s""" #Definir si queremos eliminar por id o por nombre
    # Si queremos eliminar por nombre, cambiar a: query = """DELETE FROM insumos WHERE nombre = %s"""
    values = (insumo_id,)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def modificar_insumo(insumo,nuevos_datos_insumo):
    query = """UPDATE insumos SET nombre = %s, descripcion = %s, tipo = %s, precio_unitario = %s, rut_proveedor = %s
               WHERE id = %s"""
    values = (nuevos_datos_insumo.nombre, nuevos_datos_insumo.descripcion, nuevos_datos_insumo.tipo, nuevos_datos_insumo.precio_unitario, nuevos_datos_insumo.rut_proveedor, insumo.id)

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()
