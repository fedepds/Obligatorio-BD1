from backend.dominio.cliente import clientes
from backend.connection import DatabaseConnection
from backend.validadors import validador_cliente
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

def modificar_cliente(cliente):
    query = """UPDATE clientes SET nombre = %s, apellido = %s, direccion = %s, telefono = %s, correo_electronico = %s 
               WHERE ci = %s"""
    values = (cliente.nombre, cliente.apellido, cliente.direccion, cliente.telefono, cliente.correo, cliente.ci)
    
    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query, values)
        connection.commit()