from backend.connection import DatabaseConnection
def registrar_usuario(correo,contrasenia,es_administrador): #Función que registra un usuario en la base de datos con su correo y contraseña, me permite la autenticacion de usuario
    query="""INSERT INTO login (correo,contrasenia,es_administrador) VALUES (%s,%s)"""
    values=(correo,contrasenia)
    
    with DatabaseConnection() as connection:
        cursor=connection.cursor()
        cursor.execute(query,values)
        connection.commit()

def autenticacion_de_usuario(correo,contrasenia,es_administrador):
    query="""SELECT * FROM login WHERE correo=%s AND contrasenia=%s"""
    values=(correo,contrasenia)
    
    with DatabaseConnection() as connection:
        cursor=connection.cursor()
        cursor.execute(query,values)
        result = cursor.fetchone() #Nos devuelve una tupla con los datos del usuario
    return result is not None #Si el usuario no es None, entonces el usuario existe en la base de datos
    
#eliminamos los usuarios? 
# def eliminar_usuario(correo):
#     query="""DELETE FROM login WHERE correo=%s"""
#     values=(correo,)
    
#     with DatabaseConnection() as connection:
#         cursor=connection.cursor()
#         cursor.execute(query,values)
#         connection.commit()