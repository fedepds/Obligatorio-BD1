from backend.dominio import Mantenimiento
from backend.connection import DatabaseConnection

def agregar_mantenimiento(mantenimiento):
    query = """INSERT INTO mantenimientos (id_maquina,id_tecnico,tipo,fecha,observaciones) 
               VALUES (%s, %s, %s, %s, %s)"""
    values = (mantenimiento.maquina_id, mantenimiento.tecnico_id, mantenimiento.tipo, mantenimiento.fecha, mantenimiento.observaciones)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

        
def eliminar_mantenimiento(mantenimiento_id):
    query = """DELETE FROM mantenimientos WHERE id_mantenimiento = %s"""
    values = (mantenimiento_id,)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()


def modificar_mantenimiento(mantenimiento):
    query = """UPDATE mantenimientos SET fecha = %s, descripcion = %s, tecnico_id = %s, maquina_id = %s 
               WHERE id = %s"""
    values = (mantenimiento.fecha, mantenimiento.descripcion, mantenimiento.tecnico_id, mantenimiento.maquina_id, mantenimiento.id)
    
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