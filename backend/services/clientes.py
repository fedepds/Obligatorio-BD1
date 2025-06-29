from backend.dominio import Cliente
from backend.connection import DatabaseConnection

def agregar_cliente(cliente):
 
 #   if not validador_cliente.es_valido(cliente):
  #      raise ValueError("El cliente no es válido")

    query = """INSERT INTO clientes (id,rut, nombre, direccion, telefono, correo) 
               VALUES (%s, %s, %s, %s, %s, %s)"""
    values = (cliente.id, cliente.rut, cliente.nombre, cliente.direccion, cliente.telefono, cliente.correo)

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
    query = """UPDATE clientes SET nombre = %s, direccion = %s, telefono = %s, correo = %s 
               WHERE id = %s"""
    values = (nuevos_datos.nombre, nuevos_datos.direccion, nuevos_datos.telefono, nuevos_datos.correo, cliente.id)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()
