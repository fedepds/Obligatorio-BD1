import os
import mysql.connector
from dotenv import load_dotenv

# Carga las variables del archivo .env
load_dotenv()

def get_db_connection():
    connection = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT'),
        database=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS')
    )
    return connection

# Prueba rápida de conexión
if __name__ == "__main__":
    try:
        conn = get_db_connection()
        print("¡Conexión exitosa a la base de datos MySQL!")
        conn.close()
    except Exception as e:
        print("Error al conectar a la base de datos:", e)