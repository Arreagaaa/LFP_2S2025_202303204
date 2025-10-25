# JavaBridge - Traductor de Java a Python

**Proyecto 2 - Lenguajes Formales y de Programación**  
Universidad de San Carlos de Guatemala  
Facultad de Ingeniería

---

## Información del Proyecto

- **Nombre:** JavaBridge - Traductor de Lenguajes Java a Python
- **Estudiante:** Christian Javier Rivas Arreaga
- **Carnet:** 202303204
- **Curso:** Lenguajes Formales y de Programación
- **Sección:** B
- **Semestre:** Segundo Semestre 2025
- **Repositorio:** [LFP_2S2025_202303204](https://github.com/Arreagaaa/LFP_2S2025_202303204)

---

## Descripción

JavaBridge es un traductor automático que convierte código Java a Python. Implementa análisis léxico mediante un Autómata Finito Determinista (AFD) de 37 estados y análisis sintáctico mediante parser manual recursivo descendente, sin usar expresiones regulares ni librerías de parsing externas.

### Características Principales

- **Análisis Léxico Manual:** AFD con 37 estados, sin regex
- **Análisis Sintáctico Manual:** Parser recursivo descendente
- **Traducción Java a Python:** Preserva semántica del código
- **Reportes HTML:** Tokens, errores léxicos y sintácticos
- **Simulación de Ejecución:** Visualización de salidas print()
- **Interfaz Web Moderna:** Vue 3 + Tailwind CSS con tema oscuro profesional

---

## Tecnologías Utilizadas

### Backend
- Node.js v18+
- Express 4.18.2
- CORS 2.8.5

### Frontend
- Vue.js 3.4.21
- Vue Router 4.3.0
- Tailwind CSS 3.4.1
- Axios 1.6.7
- Vite 5.1.4

---

## � Instalación

### Prerrequisitos

- Node.js 18.x o superior
- npm (incluido con Node.js)
- Navegador web moderno (Chrome, Firefox, Edge, Safari)


### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/Arreagaaa/LFP_2S2025_202303204.git
cd LFP_2S2025_202303204/Proyecto2
```

### Paso 2: Configurar Backend

```bash
cd backend
npm install
node src/index.js
```

**Salida esperada:**
```
Servidor backend escuchando en http://localhost:3000
```

### Paso 3: Configurar Frontend

Abrir una **nueva terminal** y ejecutar:

```bash
cd frontend
npm install
npm run dev
```

**Salida esperada:**
```
VITE v5.1.4  ready in 500 ms
➜  Local:   http://localhost:5173/
```

### Paso 4: Acceder a la Aplicación

Abrir el navegador en: **http://localhost:5173**

---

## Uso Rápido

### Ejemplo 1: Traducción Básica

1. Escribir código Java en el editor:

```java
public class Ejemplo {
    public static void main(String[] args) {
        int numero = 10;
        System.out.println(numero);
    }
}
```

2. Clic en **TRADUCIR → Generar Traduccion**

3. Código Python generado:

```python
numero = 10
print(numero)
```

### Ejemplo 2: Estructuras de Control

**Java:**
```java
public class Ejemplo {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            if (i > 2) {
                System.out.println(i);
            }
        }
    }
}
```

**Python:**
```python
for i in range(0, 5):
    if i > 2:
        print(i)
```

---

## Estructura del Proyecto

```
Proyecto2/
│
├── backend/                      # Servidor Node.js + Express
│   ├── src/
│   │   ├── index.js             # Punto de entrada del servidor
│   │   ├── lexer/
│   │   │   ├── Lexer.js         # Analizador léxico (AFD)
│   │   │   └── Token.js         # Clase Token
│   │   ├── parser/
│   │   │   └── Parser.js        # Analizador sintáctico
│   │   ├── translator/
│   │   │   └── Translator.js    # Traductor Java → Python
│   │   ├── reports/
│   │   │   └── ReportGenerator.js  # Generador de reportes HTML
│   │   └── utils/
│   │       └── CharacterUtils.js   # Utilidades para caracteres
│   ├── package.json
│   └── README.md
│
├── frontend/                     # Interfaz Vue 3 + Tailwind
│   ├── src/
│   │   ├── main.js              # Punto de entrada Vue
│   │   ├── App.vue              # Componente raíz
│   │   ├── components/
│   │   │   ├── Editor.vue       # Editor de código Java
│   │   │   ├── Output.vue       # Salida Python
│   │   │   ├── MenuBar.vue      # Barra de menú
│   │   │   └── ModalReport.vue  # Modal para reportes
│   │   ├── views/
│   │   │   ├── Home.vue         # Vista principal
│   │   │   └── About.vue        # Página "Acerca de"
│   │   ├── router/
│   │   │   └── index.js         # Configuración de rutas
│   │   └── services/
│   │       └── api.js           # Cliente Axios para API
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── README.md
│
├── docs/                         # Documentación del proyecto
│   ├── MANUAL_TECNICO.md        # Manual técnico completo
│   ├── MANUAL_USUARIO.md        # Manual de usuario con capturas
│   ├── AFD_Diagrama.dot         # Diagrama del AFD en Graphviz
│   └── FLUJO_GENERAL.dot        # Diagrama de flujo del sistema
│
├── Entrada1.java                # Archivo de prueba
└── README.md                    # Este archivo
```

---

## Funcionalidades

### Menú ARCHIVO

- **Nuevo:** Limpia el editor
- **Abrir:** Carga archivos `.java`
- **Guardar:** Guarda código Java
- **Guardar Python Como:** Exporta código Python traducido
- **Salir:** Cierra la aplicación

### Menú TRADUCIR

- **Generar Traducción:** Traduce Java → Python
- **Ver Tokens:** Reporte HTML de tokens reconocidos
- **Ver Errores:** Reportes de errores léxicos y sintácticos
- **Simular Ejecución:** Muestra salidas `print()` del código Python

### Menú AYUDA

- **Acerca de:** Información del proyecto y desarrollador

---

## Subconjunto de Java Soportado

### Tipos de Datos
- `int`, `double`, `char`, `String`, `boolean`

### Operadores
- Aritméticos: `+`, `-`, `*`, `/`
- Relacionales: `==`, `!=`, `>`, `<`, `>=`, `<=`
- Unarios: `++`, `--`

### Estructuras de Control
- `if-else`
- `for`
- `while`

### Otras Características
- Declaraciones y asignaciones
- `System.out.println()`
- Comentarios: `//` y `/* */`

### Estructura Obligatoria

```java
public class NombreClase {
    public static void main(String[] args) {
        // Todo el código debe estar aquí
    }
}
```

---

## Pruebas

### Prueba con Archivo de Entrada

El proyecto incluye `Entrada1.java` como archivo de prueba con múltiples casos:

```bash
# Desde la interfaz web:
1. Abrir la aplicación en http://localhost:5173
2. Clic en ARCHIVO → Abrir
3. Seleccionar "Entrada1.java"
4. Clic en TRADUCIR → Generar Traduccion
5. Revisar código Python generado
6. Clic en TRADUCIR → Ver Errores (para ver errores detectados)
```

### Casos de Prueba Incluidos en Entrada1.java

- Declaraciones con errores léxicos (`&`, `%`, `¿`, `###`, etc.)
- Operaciones aritméticas
- Comparaciones booleanas
- Estructuras if-else anidadas
- Bucles for anidados
- Bucles while
- Incrementos y decrementos
- Múltiples errores léxicos intencionales

### Resultados Esperados

Al analizar `Entrada1.java`, el sistema debe:

1. **Detectar errores léxicos:** `&`, `%`, `¿`, `###`, `^^^`, `Ç`, `Ñ`, `^`, `_____`, `@@@@@@`, `&&&&&`
2. **Generar reporte de tokens:** Para todos los tokens válidos
3. **Generar reporte de errores:** Con ubicación (línea, columna) de cada error
4. **No generar código Python:** Debido a los errores presentes

---

## Documentación

### Manuales Disponibles

1. **[Manual Técnico](docs/MANUAL_TECNICO.md)**
   - AFD con explicación de estados
   - Gramática libre de contexto (BNF)
   - Explicación de producciones
   - Arquitectura del sistema
   - Implementación de componentes

2. **[Manual de Usuario](docs/MANUAL_USUARIO.md)**
   - Guía de instalación paso a paso
   - Instrucciones de uso con ejemplos
   - Resolución de problemas comunes
   - Casos de uso prácticos

### Diagramas

1. **[Diagrama del AFD](docs/AFD_Diagrama.dot)**
   - Autómata con 37 estados
   - Transiciones detalladas
   - Estados de aceptación
   - Formato Graphviz (.dot)

2. **[Diagrama de Flujo General](docs/FLUJO_GENERAL.dot)**
   - Flujo completo de procesamiento
   - Desde entrada hasta salida
   - Proceso de análisis y traducción
   - Formato Graphviz (.dot)

### Visualizar Diagramas .dot

Para convertir archivos `.dot` a imágenes:

```bash
# Instalar Graphviz (si no está instalado)
# Windows: choco install graphviz
# Linux: sudo apt-get install graphviz
# macOS: brew install graphviz

# Generar imagen PNG del AFD
dot -Tpng docs/AFD_Diagrama.dot -o docs/AFD_Diagrama.png

# Generar imagen PNG del Flujo
dot -Tpng docs/FLUJO_GENERAL.dot -o docs/FLUJO_GENERAL.png
```

O usar herramientas online:
- [Graphviz Online](https://dreampuf.github.io/GraphvizOnline/)
- [Edotor](https://edotor.net/)

---

## API Endpoints

### POST `/api/analyze`

Analiza código Java y genera traducción a Python.

**Request:**
```json
{
  "code": "public class Test { ... }"
}
```

**Response (Éxito):**
```json
{
  "success": true,
  "python": "# Código Python traducido\n...",
  "tokens": [...],
  "errors": {
    "lexical": [],
    "syntactic": []
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "python": "",
  "tokens": [...],
  "errors": {
    "lexical": [...],
    "syntactic": [...]
  }
}
```

### GET `/api/report/tokens`

Genera reporte HTML de tokens.

**Query Params:**
- `tokens`: Array de tokens (JSON)

**Response:** HTML con tabla de tokens

### GET `/api/report/errors`

Genera reporte HTML de errores léxicos.

**Query Params:**
- `errors`: Array de errores (JSON)

**Response:** HTML con tabla de errores

### GET `/api/report/syntax`

Genera reporte HTML de errores sintácticos.

**Query Params:**
- `errors`: Array de errores (JSON)

**Response:** HTML con tabla de errores sintácticos

---

## Limitaciones

### No Soportado

- Múltiples clases o métodos
- Herencia y POO
- Arrays (excepto `String[] args` en main)
- Import y packages
- Try-catch y excepciones
- Operadores lógicos (`&&`, `||`, `!`)
- Switch-case
- Do-while
- Break y continue

### Restricciones

- Todo el código debe estar dentro del método `main`
- La clase debe ser `public`
- La firma del método main debe ser exacta: `public static void main(String[] args)`
- Solo se soportan los tipos de datos especificados

---

## Resolución de Problemas

### Problema: Backend no inicia

**Solución:**
```bash
# Verificar que el puerto 3000 no esté en uso
netstat -ano | findstr :3000

# Si está en uso, matar el proceso o cambiar puerto en src/index.js
```

### Problema: Frontend no se conecta al backend

**Solución:**
1. Verificar que el backend esté corriendo en puerto 3000
2. Revisar configuración de CORS en `backend/src/index.js`
3. Limpiar caché del navegador

### Problema: Reportes HTML no se abren

**Solución:**
1. Verificar permisos de pop-ups en el navegador
2. Permitir ventanas emergentes para http://localhost:5173

---

## 📄 Licencia

Este proyecto es parte de un trabajo académico para el curso de Lenguajes Formales y de Programación de la Universidad de San Carlos de Guatemala.

---

## 👨‍💻 Autor

**Christian Javier Rivas Arreaga**  
Carnet: 202303204  
Universidad de San Carlos de Guatemala  
Facultad de Ingeniería  
Ingeniería en Ciencias y Sistemas

---

## 📞 Contacto

- **GitHub:** [Arreagaaa](https://github.com/Arreagaaa)
- **Repositorio:** [LFP_2S2025_202303204](https://github.com/Arreagaaa/LFP_2S2025_202303204)

---

## Agradecimientos

- Universidad de San Carlos de Guatemala
- Facultad de Ingeniería
- Escuela de Ciencias y Sistemas
- Catedráticos y auxiliares del curso Lenguajes Formales y de Programación

---

**Fecha de Elaboración:** Octubre 2025  
**Versión:** 1.0.0  
**Estado:** Completado y funcional
