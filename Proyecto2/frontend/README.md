# JavaBridge Frontend

Interfaz web para el traductor Java a Python.

## 🚀 Instalación

```bash
cd frontend
npm install
```

## ▶️ Ejecución

### Modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Compilar para producción
```bash
npm run build
```

## 🎨 Características

- **Editor de código**: Área de texto para escribir código Java
- **Salida Python**: Visualización del código traducido
- **Menú completo**: Archivo, Traducir, Ayuda
- **Reportes HTML**: Visualización de tokens y errores
- **Diseño moderno**: Tailwind CSS con gradientes y animaciones

## 🧩 Componentes

- **MenuBar.vue**: Barra de menú con todas las opciones
- **Editor.vue**: Editor de código Java con estadísticas
- **Output.vue**: Visualización de código Python y errores
- **ModalReport.vue**: Modal para mostrar reportes HTML

## 🔌 Conexión con Backend

La aplicación se conecta al backend en `http://localhost:3000/api`

Asegúrate de que el backend esté corriendo antes de usar la aplicación.

## 🛠️ Tecnologías

- Vue.js 3
- Tailwind CSS
- Vite
- Axios
