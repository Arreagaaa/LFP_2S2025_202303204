# 🌉 JavaBridge - Traductor Java a Python

Proyecto 2 - Lenguajes Formales y de Programación  
Universidad de San Carlos de Guatemala  
Carnet: 202303204

## 📋 Descripción

JavaBridge es un traductor de código Java a Python que implementa:

- ✅ **Analizador léxico manual** (AFD sin regex)
- ✅ **Analizador sintáctico manual** (gramática libre de contexto)
- ✅ **Traducción Java → Python**
- ✅ **Reportes HTML** (tokens, errores)
- ✅ **Interfaz web moderna** (Vue.js + Tailwind)

## 🏗️ Estructura del Proyecto

```
JavaBridge/
├── backend/                  # Node.js + Express
│   ├── src/
│   │   ├── lexer/           # Analizador léxico (AFD manual)
│   │   ├── parser/          # Analizador sintáctico (Día 2)
│   │   ├── translator/      # Traducción Java → Python (Día 2)
│   │   ├── reports/         # Generación de reportes HTML
│   │   └── index.js         # Servidor Express
│   ├── package.json
│   └── README.md
│
├── frontend/                # Vue.js + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── Editor.vue
│   │   │   ├── Output.vue
│   │   │   ├── MenuBar.vue
│   │   │   └── ModalReport.vue
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   └── README.md
│
└── README.md                # Este archivo
```

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js v18 o superior
- npm v9 o superior

### 1. Clonar el repositorio

```bash
git clone https://github.com/Arreagaaa/LFP_2S2025_202303204.git
cd LFP_2S2025_202303204/Proyecto2
```

### 2. Instalar dependencias

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### 3. Ejecutar el proyecto

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
El backend correrá en `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
El frontend correrá en `http://localhost:5173`

### 4. Abrir en el navegador

Visita `http://localhost:5173` para usar la aplicación.

## 📖 Uso de la Aplicación

### Menú Archivo
- **Nuevo**: Crear un nuevo archivo
- **Abrir**: Cargar un archivo .java
- **Guardar**: Guardar código Java
- **Guardar Python como**: Guardar código Python traducido
- **Salir**: Cerrar aplicación

### Menú Traducir
- **Generar Traducción**: Analiza y traduce el código Java (F5)
- **Ver Tokens**: Muestra reporte HTML de tokens
- **Ver Errores**: Muestra reporte HTML de errores léxicos

### Menú Ayuda
- **Acerca de**: Información del proyecto

## 🔍 Analizador Léxico (Día 1)

El analizador léxico implementa un **AFD manual sin expresiones regulares**.

### Estados del AFD
1. **Estado Inicial**: Identifica el tipo de token
2. **Estado Identificador**: Reconoce palabras reservadas e identificadores
3. **Estado Número**: Reconoce números enteros y decimales
4. **Estado Cadena**: Reconoce cadenas entre comillas dobles
5. **Estado Carácter**: Reconoce caracteres entre comillas simples
6. **Estado Comentario**: Reconoce comentarios // y /* */
7. **Estado Símbolo**: Reconoce símbolos y operadores

### Tokens Reconocidos
- **Palabras reservadas**: public, class, static, void, main, String, int, double, char, boolean, true, false, if, else, for, while, System, out, println
- **Identificadores**: [A-Za-z_][A-Za-z0-9_]*
- **Números**: Enteros y decimales
- **Cadenas**: "..."
- **Caracteres**: '...'
- **Símbolos**: {, }, (, ), [, ], ;, ,, ., =, +, -, *, /, ==, !=, >, <, >=, <=, ++, --

### Errores Léxicos Detectados
- Caracteres no reconocidos
- Cadenas sin cerrar
- Caracteres mal formados
- Números decimales inválidos

## 📊 Reportes HTML

La aplicación genera dos tipos de reportes:

1. **Reporte de Tokens**: Tabla con todos los tokens reconocidos
2. **Reporte de Errores**: Lista de errores léxicos encontrados

Los reportes se pueden:
- Ver en un modal dentro de la aplicación
- Descargar como archivos HTML

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web
- **CORS**: Manejo de peticiones cross-origin
- **ES Modules**: Módulos modernos de JavaScript

### Frontend
- **Vue.js 3**: Framework progresivo
- **Tailwind CSS**: Framework de utilidades CSS
- **Vite**: Build tool rápido
- **Axios**: Cliente HTTP

## 📅 Plan de Desarrollo

### ✅ Día 1 - Análisis y configuración (COMPLETADO)
- [x] Configuración del workspace
- [x] Instalación de dependencias
- [x] Implementación del AFD del analizador léxico
- [x] API REST para análisis
- [x] Interfaz web básica
- [x] Generación de reportes HTML

### 🔄 Día 2 - Parser + Traducción (PENDIENTE)
- [ ] Diseño de la gramática libre de contexto
- [ ] Implementación del parser manual
- [ ] Reglas de traducción Java → Python
- [ ] Validación sintáctica
- [ ] Generación de archivos .py

### 🔄 Día 3 y 4 (PENDIENTE)
- Por definir...

## 📝 Ejemplo de Uso

1. Abre la aplicación en `http://localhost:5173`
2. Escribe o carga un archivo Java
3. Presiona "Analizar" o F5
4. Revisa el código Python generado
5. Ve los reportes de tokens o errores
6. Guarda el código Python si no hay errores

## 🐛 Solución de Problemas

### El backend no inicia
```bash
cd backend
npm install
npm start
```

### El frontend no carga
```bash
cd frontend
npm install
npm run dev
```

### Error de conexión
Asegúrate de que el backend esté corriendo en `http://localhost:3000`

## 👨‍💻 Autor

**Carnet**: 202303204  
**Curso**: Lenguajes Formales y de Programación  
**Sección**: A+  
**Proyecto**: 2  

## 📄 Licencia

Este proyecto es desarrollado con fines académicos para la Universidad de San Carlos de Guatemala.

## 🙏 Agradecimientos

- Facultad de Ingeniería - USAC
- Escuela de Ciencias y Sistemas
- Catedráticos de Lenguajes Formales y de Programación
