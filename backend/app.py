
from flask import Flask, jsonify
import mysql.connector
from dotenv import load_dotenv 
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

@app.route('/insumo',methods=['GET'])
def obtener_insumos():
    conn=get_db_connection()
    cursor=conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM insumos")
    insumos=cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(insumos)

@app.route('/mantenimiento',methods=['GET'])
def obtener_mantenimientos():
    conn=get_db_connection()
    cursor=conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM mantenimientos")
    mantenimientos=cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(mantenimientos)
    
@app.route('/login',methods=['GET'])
def obtener_usuarios():
    conn=get_db_connection()
    cursor=conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM login")
    usuarios=cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(usuarios)

# Ruta para agregar un cliente (ejemplo)
@app.route('/clientes/agregar', methods=['POST'])
def agregar_cliente():


# Ruta raíz de prueba
@app.route('/')
def home():
    return '¡API Flask funcionando!'

if __name__ == '__main__':
    app.run(debug=True)