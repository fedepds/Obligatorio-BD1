from backend.dominio import insumo
from backend.connection import DatabaseConnection

def agregar_insumo(insumo):
    query = """INSERT INTO insumos (nombre, descripcion, cantidad, precio, proveedor_id) 
               VALUES (%s, %s, %s, %s, %s)"""
    values = (insumo.nombre, insumo.descripcion, insumo.cantidad, insumo.precio, insumo.proveedor_id)
    
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
