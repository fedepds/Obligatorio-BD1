
from flask import Flask, jsonify
import mysql.connector
from dotenv import load_dotenv #de donde estas cargando esto fede?
import os

# Cargar variables de entorno desde .env
load_dotenv()

# Inicializar Flask
app = Flask(__name__)

# Función para crear la conexión a la base de datos
def get_db_connection():
    conn = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    return conn

# Ruta de prueba: obtener todos los clientes
@app.route('/clientes', methods=['GET'])
def obtener_clientes():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM clientes")
    clientes = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(clientes)

# Ruta raíz de prueba
@app.route('/')
def home():
    return '¡API Flask funcionando!'

if __name__ == '__main__':
    app.run(debug=True)