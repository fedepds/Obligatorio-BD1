from backend.dominio import tecnico
from backend.connection import DatabaseConnection

def agregar_tecnico(tecnico):
    query = """INSERT INTO tecnicos (ci, nombre, apellido, direccion, fecha_nacimiento, telefono, correo_electronico) 
               VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    values = (tecnico.ci, tecnico.nombre, tecnico.apellido, tecnico.direccion,
              tecnico.fecha_nacimiento, tecnico.telefono, tecnico.correo)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def eliminar_tecnico(ci):
    query = """DELETE FROM tecnicos WHERE ci = %s"""
    values = (ci,)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()


def modificar_tecnico(tecnico,nuevos_datos_tecnico):
    query = """UPDATE tecnicos SET nombre = %s, apellido = %s, direccion = %s, fecha_nacimiento = %s, telefono = %s, correo_electronico = %s
               WHERE ci = %s"""
    values = (nuevos_datos_tecnico.nombre, nuevos_datos_tecnico.apellido, nuevos_datos_tecnico.direccion,
              nuevos_datos_tecnico.fecha_nacimiento, nuevos_datos_tecnico.telefono, nuevos_datos_tecnico.correo, tecnico.ci)

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()