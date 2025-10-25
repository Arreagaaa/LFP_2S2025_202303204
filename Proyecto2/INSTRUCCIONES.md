# Instrucciones de Ejecucion - JavaBridge

## IMPORTANTE: Como iniciar el proyecto

### Paso 1: Iniciar el Backend

Abrir una terminal (CMD o PowerShell) y ejecutar:

```bash
cd d:\Projects\USAC\LFP\LAB\LFP_2S2025_202303204\Proyecto2\backend
node src/index.js
```

Deberias ver:
```
Servidor corriendo en: http://localhost:3000
API disponible en: http://localhost:3000/api/analyze
Health check: http://localhost:3000/health
```

### Paso 2: Iniciar el Frontend

Abrir OTRA terminal (CMD o PowerShell) y ejecutar:

```bash
cd d:\Projects\USAC\LFP\LAB\LFP_2S2025_202303204\Proyecto2\frontend
npm run dev
```

Deberias ver:
```
VITE ready in X ms

Local: http://localhost:5173/
```

### Paso 3: Abrir en el Navegador

Abrir tu navegador favorito y visitar:
```
http://localhost:5173
```

## Resumen de lo Implementado

### DIA 1 - Analisis Lexico (COMPLETADO ✓)

1. **Analizador Lexico (Lexer.js)**
   - AFD implementado manualmente con estados
   - NO usa expresiones regulares
   - Reconoce todos los tokens de Java
   - Detecta errores lexicos con linea y columna
   
2. **Backend API**
   - Servidor Express en puerto 3000
   - Endpoint POST /api/analyze
   - Endpoint POST /api/report/tokens
   - Endpoint POST /api/report/errors
   
3. **Frontend Basico**
   - Editor de codigo Java
   - Panel de salida Python
   - Menu con opciones (Archivo, Traducir, Ayuda)

### DIA 2 - Parser y Traduccion (COMPLETADO ✓)

1. **Analizador Sintactico (Parser.js)**
   - Parser descendente recursivo manual
   - Verifica estructura: public class ... { main ... }
   - Valida declaraciones de variables
   - Detecta errores sintacticos
   - Construye AST (Arbol Sintactico Abstracto)
   
2. **Traductor (Translator.js)**
   - Recorre el AST
   - Traduce Java a Python
   - Convierte tipos de datos
   - Traduce estructuras de control (if, for, while)
   - Genera codigo Python con indentacion correcta
   
3. **Generador de Reportes (ReportGenerator.js)**
   - Reportes HTML profesionales
   - Reporte de tokens
   - Reporte de errores lexicos
   - Reporte de errores sintacticos

4. **Frontend Completo**
   - Vue Router para navegacion
   - Vista Home (editor principal)
   - Vista About (informacion del proyecto)
   - Diseno dark mode con azul oscuro
   - Sin emojis, solo iconos SVG
   - Interfaz profesional con Tailwind CSS

## Estructura de Archivos

```
Proyecto2/
│
├── backend/
│   ├── src/
│   │   ├── index.js                    ← Servidor Express
│   │   ├── lexer/
│   │   │   ├── Lexer.js               ← Analizador lexico (AFD manual)
│   │   │   └── Token.js               ← Definicion de tokens
│   │   ├── parser/
│   │   │   └── Parser.js              ← Analizador sintactico
│   │   ├── translator/
│   │   │   └── Translator.js          ← Traductor Java → Python
│   │   ├── reports/
│   │   │   └── ReportGenerator.js     ← Reportes HTML
│   │   └── utils/
│   │       └── CharacterUtils.js      ← Utilidades sin regex
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── main.js                     ← Entrada con Vue Router
    │   ├── App.vue                     ← Componente raiz
    │   ├── router/
    │   │   └── index.js                ← Configuracion de rutas
    │   ├── views/
    │   │   ├── Home.vue                ← Vista del editor
    │   │   └── About.vue               ← Vista acerca de
    │   ├── components/
    │   │   ├── MenuBar.vue             ← Menu superior
    │   │   ├── Editor.vue              ← Editor Java
    │   │   └── Output.vue              ← Salida Python
    │   └── services/
    │       └── api.js                  ← Cliente HTTP
    └── package.json
```

## Prueba Rapida

1. Inicia backend y frontend (ver Paso 1 y 2 arriba)

2. En el navegador, escribe este codigo Java:

```java
public class Test {
    public static void main(String[] args) {
        int x = 5;
        int y = 10;
        int suma = x + y;
        System.out.println(suma);
    }
}
```

3. Haz clic en "Analizar"

4. Deberias ver el codigo Python:

```python
# Traducido de Java a Python por JavaBridge
# Carne: 202303204

x = 5
y = 10
suma = x + y
print(suma)
```

## Funcionalidades Implementadas

- [x] Analisis lexico completo (AFD sin regex)
- [x] Analisis sintactico (parser manual)
- [x] Traduccion Java a Python
- [x] Reporte HTML de tokens
- [x] Reporte HTML de errores lexicos
- [x] Reporte HTML de errores sintacticos
- [x] Interfaz web responsive
- [x] Navegacion entre vistas
- [x] Abrir archivos .java
- [x] Guardar archivos .java
- [x] Guardar archivos .py
- [x] Validacion de variables declaradas
- [x] Soporte para if-else
- [x] Soporte para bucles for
- [x] Soporte para bucles while
- [x] Comentarios de linea y bloque
- [x] Todos los tipos de datos Java basicos

## Problemas Comunes

### Error: "Cannot find module"
Solucion:
```bash
cd backend
npm install

cd frontend
npm install
```

### Error: "Port 3000 already in use"
Solucion: Cerrar otras aplicaciones que usen el puerto 3000

### Error: "ENOENT: no such file or directory"
Solucion: Asegurarte de estar en la carpeta correcta antes de ejecutar comandos

### La interfaz no carga
Solucion: 
1. Verificar que el backend este corriendo
2. Verificar que el frontend este corriendo
3. Refrescar el navegador (F5)

## Contacto

Carnet: 202303204  
Curso: Lenguajes Formales y de Programacion  
Proyecto: 2 - Segundo Semestre 2025
