from backend.dominio import Tecnico
from backend.connection import DatabaseConnection

def agregar_tecnico(tecnico):
    query = """INSERT INTO tecnicos (nombre, contacto) 
               VALUES (%s, %s)"""
    values = (tecnico.nombre, tecnico.contacto)

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def eliminar_tecnico(tecnico_id):
    query = """DELETE FROM tecnicos WHERE id = %s"""
    values = (tecnico_id,)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def modificar_tecnico(tecnico, nuevos_datos_tecnico):
    query = """UPDATE tecnicos SET nombre = %s, contacto = %s 
               WHERE id = %s"""
    values = (nuevos_datos_tecnico.nombre, nuevos_datos_tecnico.contacto, tecnico.id)

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def obtener_tecnicos():
    query = """SELECT * FROM tecnicos"""
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        return rows