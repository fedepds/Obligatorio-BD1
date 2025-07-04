# Sistema de Gestión para Cafés Marloy

## Descripción
Sistema web para la gestión integral de máquinas expendedoras de café, administración de insumos, técnicos, clientes y proveedores. Permite el seguimiento de mantenimientos, registro de consumo y generación de reportes para la empresa "Cafés Marloy".

## Contexto del Negocio
Cafés Marloy es una empresa dedicada a la instalación y mantenimiento de máquinas expendedoras de café en diversos clientes. El sistema permite gestionar:
- Máquinas expendedoras instaladas en diferentes ubicaciones de clientes
- Proveedores de insumos (leche en polvo, canela, chocolate, café)
- Control de inventario y consumo de insumos
- Mantenimientos preventivos y correctivos realizados por técnicos
- Facturación mensual a clientes (alquiler fijo + consumo)

## Tecnologías Utilizadas
- **Frontend**: React, JavaScript
- **Backend**: Python (Flask)
- **Base de datos**: MySQL
- **Autenticación**: JWT (JSON Web Tokens)
- **Contenerización**: Docker y Docker Compose


## Modelo de Datos
El sistema implementa las siguientes entidades principales:
- **login**: Gestión de usuarios (correo, contraseña, es_administrador)
- **proveedores**: Proveedores de insumos
- **insumos**: Productos utilizados por las máquinas
- **clientes**: Empresas donde se instalan las máquinas
- **maquinas**: Equipos expendedores instalados
- **registro_consumo**: Control de consumos por máquina y fecha
- **tecnicos**: Personal de mantenimiento
- **mantenimientos**: Registro de intervenciones técnicas

## Requisitos Previos
- **Docker**: Para ejecutar el sistema completo en contenedores
- **Docker Compose**: Para orquestar los contenedores
- **Node.js**: Necesario para ejecutar npm (mínimo v14.x recomendado)
- **npm**: Gestor de paquetes para JavaScript
- **Python 3.x**: Lenguaje del backend


### Instalación 

#### Backend
```bash
# Clonar repositorio
git clone https://github.com/fedepds/Obligatorio-BD1.git

# Levantar los contenedores
docker-compose up -d

cd cafes-marloy/backend
# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt


# Iniciar servidor
python app.py
```


#### Frontend
```bash
cd ../frontend

# Instalar dependencias
npm install

# Iniciar aplicación
npm start
```
La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
  
## Sistema de Usuarios y Permisos

El sistema implementa dos niveles de acceso:


Administrador: Acceso total al sistema, pueden gestionar todos los recursos incluyendo proveedores, máquinas y técnicos
Usuario básico: Acceso limitado, pueden gestionar:
Insumos
Clientes
Mantenimientos
Registros de consumo
Consultar reportes
## Reportes Disponibles

El sistema genera los siguientes informes:

- **Facturación mensual por cliente**: Suma de alquiler fijo de máquinas más costo de insumos consumidos
- **Análisis de consumo de insumos**: Detalle de insumos más utilizados y su costo
- **Rendimiento de técnicos**: Técnicos con mayor número de mantenimientos realizados
- **Distribución de máquinas**: Clientes con mayor cantidad de máquinas instaladas

## Seguridad
- Autenticación mediante JWT con expiración de tokens
- Control de acceso basado en roles y permisos
- Validación de sesiones activas
- Comunicación segura entre cliente y servidor
