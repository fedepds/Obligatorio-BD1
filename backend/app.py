from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import mysql.connector
from dotenv import load_dotenv 
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
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    return conn

# ----------------------------- USUARIOS ---------------------------------
@app.route('/api/usuarios', methods=['POST'])
def registrar_usuario_route():
    data = request.get_json()
    correo = data.get('correo')
    contraseña = data.get('contraseña')
    es_administrador = data.get('es_administrador', False)
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "INSERT INTO login (correo, contraseña, es_administrador) VALUES (%s, %s, %s)"
        cursor.execute(query, (correo, contraseña, es_administrador))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'message': 'Usuario registrado con éxito'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/usuarios/login', methods=['POST'])
def login_usuario():
    data = request.get_json()
    correo = data.get('correo')
    contraseña = data.get('contraseña')
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "SELECT * FROM login WHERE correo = %s AND contraseña = %s"
        cursor.execute(query, (correo, contraseña))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if result:
            return jsonify({'message': 'Autenticación exitosa'}), 200
        else:
            return jsonify({'error': 'Credenciales incorrectas'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/usuarios', methods=['GET'])
def obtener_usuarios():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM login")
        usuarios = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(usuarios), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# ----------------------------- CLIENTES ---------------------------------
@app.route('/api/clientes', methods=['POST'])
def agregar_cliente_route():
    data = request.get_json()
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """INSERT INTO clientes (ci, nombre, apellido, direccion, fecha_nacimiento, telefono, correo_electronico) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        values = (data['ci'], data['nombre'], data['apellido'], data['direccion'], 
                 data['fecha_nacimiento'], data['telefono'], data['correo_electronico'])
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
            SELECT t.nombre, t.contacto, COUNT(m.id) as total_mantenimientos
            FROM tecnicos t
            LEFT JOIN mantenimientos m ON t.id = m.tecnico_id
            GROUP BY t.id, t.nombre, t.contacto
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
            SELECT m.nombre as maquina, SUM(rc.cantidad_usada) as total_consumo
            FROM maquinas m
            LEFT JOIN registro_consumo rc ON m.id = rc.id_maquina
            GROUP BY m.id, m.nombre
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