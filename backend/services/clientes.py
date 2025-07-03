from backend.dominio import Cliente
from backend.connection import DatabaseConnection

def agregar_cliente(cliente):
    query = """INSERT INTO clientes (rut, nombre, direccion, fecha_nacimiento, telefono, correo) 
               VALUES (%s, %s, %s, %s, %s, %s)"""
    values = (cliente.rut, cliente.nombre, cliente.direccion, cliente.fecha_nacimiento, cliente.telefono, cliente.correo)

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def eliminar_cliente(cliente_rut):
    query = """DELETE FROM clientes WHERE rut = %s"""
    values = (cliente_rut,)

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def modificar_cliente(cliente,nuevos_datos):
    query = """UPDATE clientes SET nombre = %s, direccion = %s, fecha_nacimiento = %s, telefono = %s, correo = %s 
               WHERE id = %s"""
    values = (nuevos_datos.nombre, nuevos_datos.direccion, nuevos_datos.fecha_nacimiento, nuevos_datos.telefono, nuevos_datos.correo, cliente.id)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()
