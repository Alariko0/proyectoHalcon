# proyectoHalcon
@"
# Proyecto Halcón - Sistema de Vigilancia IA

Sistema de vigilancia y control de drones impulsado por IA. El proyecto está estructurado como un monorepo que incluye aplicaciones web, backend, nodos perimetrales y servicios de control en Python.

## 📋 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:
- **Node.js** (v20 o superior)
- **pnpm** (v9 o superior) - *Si no lo tienes, instálalo con `npm install -g pnpm`*
- **Python** (v3.10 o superior)
- **Git**

## 🚀 Configuración del Entorno (Después de clonar)

### 1. Clonar el repositorio
\`\`\`bash
git clone https://github.com/Alariko0/proyectoHalcon.git
cd proyectoHalcon
\`\`\`

### 2. Configurar variables de entorno
Crea un archivo \`.env\` en la raíz del proyecto (y en las carpetas que lo requieran, como \`packages/web\` o \`packages/backend\`). Puedes guiarte por el archivo \`.env.example\` si está disponible.
\`\`\`bash
# Ejemplo de .env
SUPABASE_URL=tu_url_aqui
SUPABASE_ANON_KEY=tu_clave_aqui
\`\`\`

### 3. Instalar dependencias de Node.js (Frontend y Backend)
Este proyecto utiliza **pnpm workspaces**. Un solo comando en la raíz instalará las dependencias de todos los paquetes (\`packages/web\`, \`packages/backend\`, etc.).
\`\`\`bash
pnpm install
\`\`\`

### 4. Configurar el servicio de Python (Drone Control)
El servicio de control de drones está construido en Python (FastAPI). Es altamente recomendable usar un entorno virtual (\`venv\`).

\`\`\`bash
# Navegar al directorio del servicio
cd services/drone-control

# Crear el entorno virtual
python -m venv venv

# Activar el entorno virtual
# En Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# En Linux/Mac:
source venv/bin/activate

# Instalar las dependencias
pip install -r requirements.txt

# Volver a la raíz del proyecto
cd ../..
\`\`\`

## 🏃‍♂️ Cómo ejecutar el proyecto

### Ejecutar todo el ecosistema (Node.js)
Desde la raíz del proyecto:
\`\`\`bash
# Iniciar el servidor de desarrollo (Frontend y Backend en modo watch)
pnpm dev
\`\`\`

### Ejecutar el servicio de drones (Python)
En una terminal separada, asegúrate de que el entorno virtual esté activado:
\`\`\`bash
cd services/drone-control
# Activar venv si no lo has hecho
.\venv\Scripts\Activate.ps1
# Iniciar el servidor FastAPI
uvicorn main:app --reload --port 8000
\`\`\`

## 📂 Estructura del Proyecto

- \`packages/\`: Monorepo con el código TypeScript/React.
  - \`web/\`: Aplicación frontend (React, Vite, Tailwind).
  - \`backend/\`: API y lógica de negocio (Node.js, Supabase).
  - \`core/\`: Lógica compartida.
  - \`edge-node/\`: Código para los nodos perimetrales.
  - \`ai-client/\`: Cliente para interactuar con los modelos de IA.
- \`services/\`: Servicios externos.
  - \`drone-control/\`: Servicio en Python (FastAPI) para controlar los drones vía MAVSDK.

## 🛠️ Herramientas de Desarrollo
- **ESLint + Prettier**: Configurados para mantener el estilo del código.
- **Husky + lint-staged**: Los commits pasan por un filtro de calidad antes de guardarse.
"@ | Set-Content README.md -Encoding UTF8
