import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import time

# Carga las variables del archivo .env
load_dotenv()

print("Configuración de conexión:")
print("HOST:", os.getenv('DB_HOST'))
print("PORT:", os.getenv('DB_PORT'))
print("DATABASE:", os.getenv('DB_NAME'))
print("USER:", os.getenv('DB_USER'))
print("PASS:", "****" if os.getenv('DB_PASS') else "No definida")


def get_db_connection(max_retries=3, retry_delay=2):
    """
    Establece conexión a la base de datos con reintentos automáticos
    """
    for attempt in range(max_retries):
        try:
            connection = mysql.connector.connect(
                host=os.getenv('DB_HOST'),
                port=int(os.getenv('DB_PORT')),
                database=os.getenv('DB_NAME'),
                user=os.getenv('DB_USER'),
                password=os.getenv('DB_PASS'),
                autocommit=False,  # Control manual de transacciones
                charset='utf8mb4',
                collation='utf8mb4_unicode_ci'
            )

            if connection.is_connected():
                print(f"✅ Conexión exitosa (intento {attempt + 1})")
                return connection

        except Error as e:
            print(f"❌ Error en intento {attempt + 1}: {e}")
            if attempt < max_retries - 1:
                print(f"Reintentando en {retry_delay} segundos...")
                time.sleep(retry_delay)
            else:
                print("❌ Agotados todos los intentos de conexión")
                raise e
        except Exception as e:
            print(f"❌ Error inesperado: {e}")
            raise e

    return None


class DatabaseConnection:
    """
    Context manager para manejo automático de conexiones
    """

    def __init__(self):
        self.connection = None
        self.cursor = None

    def __enter__(self):
        self.connection = get_db_connection()
        self.cursor = self.connection.cursor(dictionary=True)  # Devuelve resultados como diccionarios
        return self.cursor

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type is not None:
            # Si hubo una excepción, hacer rollback
            if self.connection:
                self.connection.rollback()
                print("🔄 Rollback realizado por error")
        else:
            # Si todo salió bien, hacer commit
            if self.connection:
                self.connection.commit()
                print("✅ Commit realizado exitosamente")

        # Cerrar cursor y conexión
        if self.cursor:
            self.cursor.close()
        if self.connection and self.connection.is_connected():
            self.connection.close()
            print("🔐 Conexión cerrada")


def test_connection():
    """
    Función para probar la conexión y mostrar información de la base de datos
    """
    try:
        with DatabaseConnection() as cursor:
            # Probar consulta simple
            cursor.execute("SELECT VERSION()")
            version = cursor.fetchone()
            print(f"✅ Versión de MySQL: {version['VERSION()']}")

            # Mostrar tablas disponibles
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            if tables:
                print("📋 Tablas disponibles:")
                for table in tables:
                    table_name = list(table.values())[0]
                    print(f"  - {table_name}")
            else:
                print("⚠️  No se encontraron tablas en la base de datos")

    except Error as e:
        print(f"❌ Error al probar la conexión: {e}")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

    return True


# Prueba rápida de conexión
if __name__ == "__main__":
    print("🔍 Iniciando prueba de conexión...")
    print("-" * 50)

    success = test_connection()

    print("-" * 50)
    if success:
        print("🎉 ¡Prueba de conexión completada exitosamente!")
    else:
        print("💥 La prueba de conexión falló")
        print("\n🔧 Posibles soluciones:")
        print("1. Verificar que Docker esté ejecutándose")
        print("2. Ejecutar: docker-compose up -d")
        print("3. Verificar los puertos en docker-compose.yml y .env")
        print("4. Esperar unos segundos para que MySQL se inicialice")