from connection import DatabaseConnection

def registrar_consumo(registro_consumo):
    query = """INSERT INTO registro_consumo (id_maquina, id_insumo, fecha, cantidad_usada) 
               VALUES (%s, %s, %s, %s)"""
    values = (registro_consumo.id_maquina, registro_consumo.id_insumo, registro_consumo.fecha, registro_consumo.cantidad_usada)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

