from backend.dominio import Tecnico
from backend.connection import get_db_connection

def agregar_tecnico(tecnico):
    query = """INSERT INTO tecnicos (id, nombre, contacto) 
               VALUES (%s, %s, %s)"""
    values = (tecnico.id, tecnico.nombre, tecnico.contacto)
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()

def eliminar_tecnico(tecnico_id):
    query = """DELETE FROM tecnicos WHERE id = %s"""
    values = (tecnico_id,)
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()

def modificar_tecnico(tecnico, nuevos_datos_tecnico):
    query = """UPDATE tecnicos SET nombre = %s, contacto = %s 
               WHERE id = %s"""
    values = (nuevos_datos_tecnico.nombre, nuevos_datos_tecnico.contacto, tecnico.id)

    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()

def obtener_tecnicos():
    query = """SELECT * FROM tecnicos"""
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return rows