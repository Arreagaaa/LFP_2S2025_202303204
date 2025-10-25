# JavaBridge Backend

Backend del traductor Java a Python con análisis léxico y sintáctico manual.

## Instalación

```bash
cd backend
npm install
```

## Ejecución

### Modo normal
```bash
npm start
```

### Modo desarrollo (con auto-reload)
```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## API Endpoints

### POST /api/analyze
Analiza código Java y retorna tokens y errores léxicos.

**Request:**
```json
{
  "code": "public class Main { ... }"
}
```

**Response:**
```json
{
  "success": true,
  "tokens": [...],
  "errors": [...],
  "hasErrors": false
}
```

### POST /api/report/tokens
Genera reporte HTML de tokens.

**Request:**
```json
{
  "tokens": [...]
}
```

**Response:** HTML

### POST /api/report/errors
Genera reporte HTML de errores léxicos.

**Request:**
```json
{
  "errors": [...]
}
```

**Response:** HTML

## Estructura

```
backend/
├── src/
│   ├── lexer/
│   │   ├── Token.js         # Definición de tokens
│   │   └── Lexer.js         # Analizador léxico (AFD manual)
│   ├── reports/
│   │   └── ReportGenerator.js  # Generador de reportes HTML
│   └── index.js             # Servidor Express
├── package.json
└── README.md
```

## Analizador Léxico

Implementación manual de un AFD sin uso de expresiones regulares:

- **Estados**: Identificador, Número, Cadena, Carácter, Comentario, Símbolos
- **Transiciones**: Basadas en comparación de caracteres
- **Tokens reconocidos**: Palabras reservadas, identificadores, números, cadenas, símbolos

## Reportes

- **Reporte de Tokens**: Tabla HTML con todos los tokens reconocidos
- **Reporte de Errores**: Lista HTML de errores léxicos encontrados

## Tecnologías

- Node.js
- Express.js
- ES Modules
