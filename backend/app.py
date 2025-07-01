from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import mysql.connector
import jwt as pyjwt
from dotenv import load_dotenv
from functools import wraps
import os

# Cargar variables de entorno desde .env
load_dotenv()

# Configuración de la aplicación Flask
app = Flask(__name__)
CORS(app)

# Función para crear la conexión a la base de datos
def get_db_connection():
    conn = mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASS'),
        database=os.getenv('DB_NAME')
    )
    return conn
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'clave-secreta-temporal')


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(' ')[1]

        if not token:
            return jsonify({'error': 'Token no proporcionado'}), 401

        try:
            data = pyjwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            # Añadir información del usuario a la solicitud
            request.usuario = data
        except:
            return jsonify({'error': 'Token inválido o expirado'}), 401

        return f(*args, **kwargs)

    return decorated


def admin_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Primero verificamos el token
        token_result = token_required(lambda: None)()
        if isinstance(token_result, tuple):  # Es un error
            return token_result

        # Verificamos si es administrador
        if not request.usuario.get('es_administrador'):
            return jsonify({'error': 'Requiere privilegios de administrador'}), 403

        return f(*args, **kwargs)

    return decorated
# ----------------------------- USUARIOS ---------------------------------
@app.route('/api/usuarios/login', methods=['POST'])
def login_usuario():
    data = request.get_json()
    correo = data.get('correo')
    password = data.get('password')
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)  # Para obtener resultados como diccionario
        query = "SELECT * FROM login WHERE correo = %s AND password = %s"
        cursor.execute(query, (correo, password))
        result = cursor.fetchone()
        cursor.close()
        conn.close()

        if result:
            # Generar token JWT
            payload = {
                'correo': result['correo'],
                'es_administrador': bool(result['es_administrador']),
                'exp': datetime.utcnow() + timedelta(hours=3)
            }
            token = pyjwt.encode(payload, SECRET_KEY, algorithm='HS256')

            return jsonify({
                'token': token,
                'usuario': {
                    'correo': result['correo'],
                    'es_administrador': bool(result['es_administrador'])
                }
            }), 200
        else:
            return jsonify({'error': 'Credenciales incorrectas'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 400




# ----------------------------- CLIENTES ---------------------------------
@app.route('/api/clientes', methods=['POST'])
def agregar_cliente_route():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """INSERT INTO clientes (nombre, direccion, telefono, correo)
                   VALUES (%s, %s, %s, %s)"""
        values = (data['nombre'], data['direccion'], data['telefono'], data['correo'])
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Cliente agregado con éxito'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/clientes/<ci>', methods=['DELETE'])
def eliminar_cliente_route(ci):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "DELETE FROM clientes WHERE ci = %s"
        cursor.execute(query, (ci,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Cliente eliminado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/clientes', methods=['GET'])
def obtener_clientes_route():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM clientes")
        clientes = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(clientes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/clientes/<ci>', methods=['PUT'])
def modificar_cliente_route(ci):
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """UPDATE clientes SET nombre = %s, apellido = %s, direccion = %s, 
                   fecha_nacimiento = %s, telefono = %s, correo_electronico = %s 
                   WHERE ci = %s"""
        values = (data['nombre'], data['apellido'], data['direccion'], 
                 data['fecha_nacimiento'], data['telefono'], data['correo_electronico'], ci)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Cliente modificado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ----------------------------- PROVEEDORES ---------------------------------
@app.route('/api/proveedores', methods=['POST'])
@admin_required #sacar para realizar pruebas
def agregar_proveedor_route():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "INSERT INTO proveedores (id, nombre, contacto) VALUES (%s, %s, %s)"
        cursor.execute(query, (data['id'], data['nombre'], data['contacto']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Proveedor agregado con éxito'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/proveedores/<id>', methods=['DELETE'])
@admin_required #sacar para realizar pruebas
def eliminar_proveedor_route(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "DELETE FROM proveedores WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Proveedor eliminado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/proveedores/<id>', methods=['PUT'])
@admin_required #sacar para realizar pruebas
def modificar_proveedor_route(id):
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "UPDATE proveedores SET nombre = %s, contacto = %s WHERE id = %s"
        cursor.execute(query, (data['nombre'], data['contacto'], id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Proveedor modificado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/proveedores', methods=['GET'])
@admin_required #sacar para realizar pruebas
def obtener_proveedores_route():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM proveedores")
        proveedores = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(proveedores), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ----------------------------- INSUMOS ---------------------------------
@app.route('/api/insumos', methods=['POST'])
def agregar_insumo_route():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """INSERT INTO insumos (codigo, nombre, descripcion, cantidad, precio, proveedor_id) 
                   VALUES (%s, %s, %s, %s, %s, %s)"""
        values = (data['codigo'], data['nombre'], data['descripcion'], 
                 data['cantidad'], data['precio'], data['proveedor_id'])
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Insumo agregado con éxito'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/insumos/<codigo>', methods=['DELETE'])
def eliminar_insumo_route(codigo):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "DELETE FROM insumos WHERE codigo = %s"
        cursor.execute(query, (codigo,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Insumo eliminado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/insumos/<codigo>', methods=['PUT'])
def modificar_insumo_route(codigo):
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """UPDATE insumos SET nombre = %s, descripcion = %s, cantidad = %s, 
                   precio = %s, proveedor_id = %s WHERE codigo = %s"""
        values = (data['nombre'], data['descripcion'], data['cantidad'], 
                 data['precio'], data['proveedor_id'], codigo)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Insumo modificado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/insumos', methods=['GET'])
def obtener_insumos_route():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM insumos")
        insumos = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(insumos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ----------------------------- TECNICOS ---------------------------------
@app.route('/api/tecnicos', methods=['POST'])
@admin_required #sacar para realizar pruebas
def agregar_tecnico_route():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "INSERT INTO tecnicos (id, nombre, contacto) VALUES (%s, %s, %s)"
        cursor.execute(query, (data['id'], data['nombre'], data['contacto']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Técnico agregado con éxito'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/tecnicos/<id>', methods=['DELETE'])
@admin_required #sacar para realizar pruebas
def eliminar_tecnico_route(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "DELETE FROM tecnicos WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Técnico eliminado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/tecnicos/<id>', methods=['PUT'])
@admin_required #sacar para realizar pruebas
def modificar_tecnico_route(id):
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "UPDATE tecnicos SET nombre = %s, contacto = %s WHERE id = %s"
        cursor.execute(query, (data['nombre'], data['contacto'], id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Técnico modificado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/tecnicos', methods=['GET'])
@admin_required #sacar para realizar pruebas
def obtener_tecnicos_route():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tecnicos")
        tecnicos = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(tecnicos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ----------------------------- MANTENIMIENTOS ---------------------------------
@app.route('/api/mantenimientos', methods=['POST'])
def agregar_mantenimiento_route():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """INSERT INTO mantenimientos (fecha, descripcion, tecnico_id, maquina_id) 
                   VALUES (%s, %s, %s, %s)"""
        values = (data['fecha'], data['descripcion'], data['tecnico_id'], data['maquina_id'])
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Mantenimiento agregado con éxito'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/mantenimientos/<int:id>', methods=['DELETE'])
def eliminar_mantenimiento_route(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "DELETE FROM mantenimientos WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Mantenimiento eliminado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/mantenimientos/<int:id>', methods=['PUT'])
def modificar_mantenimiento_route(id):
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """UPDATE mantenimientos SET fecha = %s, descripcion = %s, 
                   tecnico_id = %s, maquina_id = %s WHERE id = %s"""
        values = (data['fecha'], data['descripcion'], data['tecnico_id'], data['maquina_id'], id)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Mantenimiento modificado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/mantenimientos', methods=['GET'])
def obtener_mantenimientos_route():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM mantenimientos")
        mantenimientos = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(mantenimientos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ----------------------------- REGISTRO CONSUMO ---------------------------------
@app.route('/api/registro-consumo', methods=['POST'])
def registrar_consumo_route():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """INSERT INTO registro_consumo (id_maquina, id_insumo, fecha, cantidad_usada) 
                   VALUES (%s, %s, %s, %s)"""
        values = (data['id_maquina'], data['id_insumo'], data['fecha'], data['cantidad_usada'])
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Registro de consumo agregado con éxito'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/registro-consumo/<int:id>', methods=['DELETE'])
def eliminar_registro_consumo_route(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "DELETE FROM registro_consumo WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Registro de consumo eliminado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/registro-consumo/<int:id>', methods=['PUT'])
def modificar_registro_consumo_route(id):
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """UPDATE registro_consumo SET id_maquina = %s, id_insumo = %s, 
                   fecha = %s, cantidad_usada = %s WHERE id = %s"""
        values = (data['id_maquina'], data['id_insumo'], data['fecha'], data['cantidad_usada'], id)
        cursor.execute(query, values)
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Registro de consumo modificado con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/registro-consumo', methods=['GET'])
def obtener_registro_consumo_route():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM registro_consumo")
        registros = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(registros), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ----------------------------- MAQUINAS ---------------------------------
@app.route('/api/maquinas', methods=['GET'])
@admin_required #sacar para realizar pruebas
def obtener_maquinas_route():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM maquinas")
        maquinas = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(maquinas), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/maquinas', methods=['POST'])
@admin_required #sacar para realizar pruebas
def agregar_maquina_route():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "INSERT INTO maquinas (nombre, descripcion, estado) VALUES (%s, %s, %s)"
        cursor.execute(query, (data['nombre'], data['descripcion'], data['estado']))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Máquina agregada con éxito'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/maquinas/<int:id>', methods=['DELETE'])
@admin_required #sacar para realizar pruebas
def eliminar_maquina_route(id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "DELETE FROM maquinas WHERE id = %s"
        cursor.execute(query, (id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Máquina eliminada con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/maquinas/<int:id>', methods=['PUT'])
@admin_required #sacar para realizar pruebas
def modificar_maquina_route(id):
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "UPDATE maquinas SET nombre = %s, descripcion = %s, estado = %s WHERE id = %s"
        cursor.execute(query, (data['nombre'], data['descripcion'], data['estado'], id))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Máquina modificada con éxito'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ----------------------------- REPORTES ---------------------------------
@app.route('/api/reportes/mantenimientos-por-tecnico', methods=['GET'])
def reporte_mantenimientos_por_tecnico():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT nombre, contacto, COUNT(id) as total_mantenimientos
            FROM tecnicos t
            LEFT JOIN mantenimientos ON id = tecnico_id
            GROUP BY id, nombre, contacto
        """
        cursor.execute(query)
        reportes = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(reportes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/reportes/consumo-por-maquina', methods=['GET'])
def reporte_consumo_por_maquina():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT nombre as maquina, SUM(rc.cantidad_usada) as total_consumo
            FROM maquinas 
            LEFT JOIN registro_consumo  ON id = id_maquina
            GROUP BY id, nombre
        """
        cursor.execute(query)
        reportes = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(reportes), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Ruta raíz de prueba
@app.route('/')
def home():
    return '¡API Flask funcionando!'

if __name__ == '__main__':
    app.run(debug=True)