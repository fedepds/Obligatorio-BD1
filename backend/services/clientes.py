from backend.dominio import Cliente
from backend.connection import DatabaseConnection

def agregar_cliente(cliente):
    
 #   if not validador_cliente.es_valido(cliente):
  #      raise ValueError("El cliente no es válido")

    query = """INSERT INTO clientes (ci, nombre, apellido, direccion, telefono, correo_electronico) 
               VALUES (%s, %s, %s, %s, %s, %s)"""
    values = (cliente.ci, cliente.nombre, cliente.apellido, cliente.direccion, cliente.telefono, cliente.correo)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def eliminar_cliente(cliente_ci):
    query = """DELETE FROM clientes WHERE ci = %s"""
    values = (cliente_ci,)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()

def modificar_cliente(cliente,nuevos_datos):
    query = """UPDATE clientes SET nombre = %s, apellido = %s, direccion = %s, telefono = %s, correo_electronico = %s 
               WHERE ci = %s"""
    values = (nuevos_datos.nombre, nuevos_datos.apellido, nuevos_datos.direccion, nuevos_datos.telefono, nuevos_datos.correo, cliente.ci)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()
