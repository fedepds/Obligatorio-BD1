from backend.dominio import Mantenimiento
from backend.connection import DatabaseConnection

def agregar_mantenimiento(mantenimiento):
    query = """INSERT INTO mantenimientos (id, id_maquina, id_tecnico, tipo, fecha, observaciones) 
               VALUES (%s, %s, %s, %s, %s, %s)"""
    values = (mantenimiento.id, mantenimiento.id_maquina, mantenimiento.id_tecnico, mantenimiento.tipo, mantenimiento.fecha, mantenimiento.observaciones)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

        
def eliminar_mantenimiento(mantenimiento_id):
    query = """DELETE FROM mantenimientos WHERE id = %s"""
    values = (mantenimiento_id,)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()


def modificar_mantenimiento(mantenimiento):
    query = """UPDATE mantenimientos SET id_maquina = %s, id_tecnico = %s, tipo = %s, fecha = %s, observaciones = %s 
               WHERE id = %s"""
    values = (mantenimiento.id_maquina, mantenimiento.id_tecnico, mantenimiento.tipo, mantenimiento.fecha, mantenimiento.observaciones, mantenimiento.id)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def obtener_mantenimientos():
    query = """SELECT * FROM mantenimientos"""
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        return rows