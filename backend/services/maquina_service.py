from backend.dominio import Maquina
from backend.connection import get_db_connection

def agregar_maquina(maquina):
    query = """INSERT INTO maquinas (id, modelo, id_cliente, ubicacion_cliente, costo_alquiler_mensual) 
               VALUES (%s, %s, %s, %s, %s)"""
    values = (maquina.id, maquina.modelo, maquina.id_cliente, maquina.ubicacion_cliente, maquina.costo_alquiler_mensual)
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()

def eliminar_maquina(maquina_id):
    query = """DELETE FROM maquinas WHERE id = %s"""
    values = (maquina_id,)
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()

def modificar_maquina(maquina, nuevos_datos):
    query = """UPDATE maquinas SET modelo = %s, id_cliente = %s, ubicacion_cliente = %s, costo_alquiler_mensual = %s 
               WHERE id = %s"""
    values = (nuevos_datos.modelo, nuevos_datos.id_cliente, nuevos_datos.ubicacion_cliente, 
              nuevos_datos.costo_alquiler_mensual, maquina.id)
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query, values)
    connection.commit()
    cursor.close()
    connection.close()

def obtener_maquinas():
    query = """SELECT * FROM maquinas"""
    
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute(query)
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return rows