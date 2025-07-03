from backend.dominio import Registro_consumo
from connection import DatabaseConnection

def registrar_consumo(registro_consumo):
    query = """INSERT INTO registro_consumo (id_maquina, id_insumo, fecha, cantidad_usada) 
               VALUES (%s,%s, %s, %s)"""
    values = (registro_consumo.id_maquina, registro_consumo.id_insumo, registro_consumo.fecha, registro_consumo.cantidad_usada)

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()


def eliminar_registro_consumo(registro_consumo_id):
    query = """DELETE FROM registro_consumo WHERE id = %s"""
    values = (registro_consumo_id,)


def modificar_registro_consumo(registro_consumo, nuevos_datos_registro_consumo):
    query = """UPDATE registro_consumo SET registro_consumo_id = %s, id_maquina = %s, id_insumo = %s, fecha = %s, cantidad_usada = %s 
               WHERE id = %s"""
    values = (nuevos_datos_registro_consumo.id,nuevos_datos_registro_consumo.id_maquinas, nuevos_datos_registro_consumo.id_maquina, nuevos_datos_registro_consumo.id_maquina,
              nuevos_datos_registro_consumo.id_insumo,nuevos_datos_registro_consumo.fecha,nuevos_datos_registro_consumo.cantidad_usada )
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def obtener_registros_consumo():
    query = """SELECT * FROM registro_consumo"""
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query)
        rows = cursor.fetchall()
        return rows