from backend.connection import DatabaseConnection


def obtener_total_mensual_por_cliente():
    query = """
    SELECT 
        clientes.id,
        clientes.nombre,
        SUM(maquinas.costo_alquiler_mensual) + SUM(registro_consumo.cantidad_usada * insumos.precio_unitario)
    FROM clientes
    LEFT JOIN maquinas ON clientes.id = maquinas.id_cliente
    LEFT JOIN registro_consumo ON registro_consumo.id_maquina = maquinas.id
    LEFT JOIN insumos ON registro_consumo.id_insumo = insumos.id
    GROUP BY clientes.id, clientes.nombre
    """

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query)
        return cursor.fetchall()



def obtener_insumos_mayor_consumo():
    query = """
    SELECT 
        insumos.id,
        insumos.nombre,
        SUM(registro_consumo.cantidad_usada),
        SUM(registro_consumo.cantidad_usada * insumos.precio_unitario)
    FROM insumos
    INNER JOIN registro_consumo ON insumos.id = registro_consumo.id_insumo
    GROUP BY insumos.id, insumos.nombre
    ORDER BY SUM(registro_consumo.cantidad_usada) DESC
    """

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query)
        return cursor.fetchall()



def obtener_tecnicos_con_mas_mantenimientos():
    query = """
    SELECT 
        tecnico.id,
        tecnico.nombre,
        COUNT(mantenimientos.id_maquina)
    FROM tecnico
    INNER JOIN mantenimientos ON tecnico.id = mantenimientos.ci_tecnico
    GROUP BY tecnico.id, tecnico.nombre
    ORDER BY COUNT(mantenimientos.id_maquina) DESC
    """

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query)
        return cursor.fetchall()



def obtener_clientes_con_mas_maquinas():
    query = """
    SELECT 
        clientes.id,
        clientes.nombre,
        COUNT(maquinas.id)
    FROM clientes
    INNER JOIN maquinas ON clientes.id = maquinas.id_cliente
    GROUP BY clientes.id, clientes.nombre
    ORDER BY COUNT(maquinas.id) DESC
    """

    with DatabaseConnection() as connection:
        cursor = connection.cursor()
        cursor.execute(query)
        return cursor.fetchall()