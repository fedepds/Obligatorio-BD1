from backend.dominio import maquinas
from backend.connection import get_db_connection

def agregar_maquina(maquina):
    query = """INSERT INTO maquinas (nombre, descripcion, cantidad, precio, proveedor_id) 
               VALUES (%s, %s, %s, %s, %s)"""
    values = (maquina.nombre, maquina.descripcion, maquina.cantidad, maquina.precio, maquina.proveedor_id)
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()

def eliminar_maquina(maquina_id):
    query = """DELETE FROM maquinas WHERE id = %s"""  # Definir si queremos eliminar por id o por nombre
    # Si queremos eliminar por nombre, cambiar a: query = """DELETE FROM maquinas WHERE nombre = %s"""
    values = (maquina_id,)
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()

def modificar_maquina(maquina):
    query = """UPDATE maquinas SET nombre = %s, descripcion = %s, cantidad = %s, precio = %s, proveedor_id = %s 
               WHERE id = %s"""
    values = (maquina.nombre, maquina.descripcion, maquina.cantidad, maquina.precio, maquina.proveedor_id, maquina.id)
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()