<template>
  <div id="app" class="h-screen flex flex-col overflow-hidden">
    <!-- Barra de Menú -->
    <MenuBar
      @nuevo="handleNuevo"
      @abrir="handleAbrir"
      @guardar="handleGuardar"
      @guardar-python="handleGuardarPython"
      @traducir="handleTraducir"
      @ver-tokens="handleVerTokens"
      @ver-errores="handleVerErrores"
      @acerca-de="handleAcercaDe"
      @salir="handleSalir"
    />

    <!-- Área principal dividida -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Editor (izquierda) -->
      <div class="w-1/2 border-r border-gray-300">
        <Editor
          :code="javaCode"
          :filename="currentFilename"
          @update:code="javaCode = $event"
        />
      </div>

      <!-- Output (derecha) -->
      <div class="w-1/2">
        <Output
          :python-code="pythonCode"
          :errors="errors"
          :status="status"
        />
      </div>
    </div>

    <!-- Barra de estado -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 text-xs flex items-center justify-between">
      <span>{{ statusMessage }}</span>
      <span v-if="isAnalyzing" class="flex items-center gap-2">
        <span class="animate-pulse">⏳</span>
        <span>Analizando...</span>
      </span>
      <span v-else>Listo</span>
    </div>

    <!-- Modal de Reporte -->
    <ModalReport
      :show="showModal"
      :title="modalTitle"
      :html-content="modalContent"
      :filename="modalFilename"
      @close="showModal = false"
    />

    <!-- Input file oculto -->
    <input
      ref="fileInput"
      type="file"
      accept=".java"
      style="display: none"
      @change="handleFileSelected"
    />
  </div>
</template>

<script>
import MenuBar from './components/MenuBar.vue'
import Editor from './components/Editor.vue'
import Output from './components/Output.vue'
import ModalReport from './components/ModalReport.vue'
import { apiService } from './services/api.js'

export default {
  name: 'App',
  components: {
    MenuBar,
    Editor,
    Output,
    ModalReport
  },
  data() {
    return {
      javaCode: '',
      pythonCode: '',
      tokens: [],
      errors: [],
      currentFilename: '',
      status: 'Listo',
      statusMessage: 'JavaBridge v1.0 - Traductor Java a Python',
      isAnalyzing: false,
      showModal: false,
      modalTitle: '',
      modalContent: '',
      modalFilename: 'reporte.html'
    }
  },
  methods: {
    // ==================== ARCHIVO ====================
    handleNuevo() {
      if (this.javaCode && !confirm('¿Deseas crear un nuevo archivo? Se perderán los cambios no guardados.')) {
        return;
      }
      this.javaCode = '';
      this.pythonCode = '';
      this.tokens = [];
      this.errors = [];
      this.currentFilename = '';
      this.statusMessage = 'Nuevo archivo creado';
    },

    handleAbrir() {
      this.$refs.fileInput.click();
    },

    handleFileSelected(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.name.endsWith('.java')) {
        alert('❌ Por favor selecciona un archivo .java');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.javaCode = e.target.result;
        this.currentFilename = file.name;
        this.statusMessage = `Archivo cargado: ${file.name}`;
        this.pythonCode = '';
        this.errors = [];
      };
      reader.onerror = () => {
        alert('❌ Error al leer el archivo');
      };
      reader.readAsText(file);

      // Limpiar input
      event.target.value = '';
    },

    handleGuardar() {
      if (!this.javaCode) {
        alert('❌ No hay código para guardar');
        return;
      }

      const blob = new Blob([this.javaCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.currentFilename || 'codigo.java';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.statusMessage = 'Archivo guardado correctamente';
    },

    handleGuardarPython() {
      if (!this.pythonCode) {
        alert('❌ No hay código Python para guardar. Ejecuta primero el análisis.');
        return;
      }

      const blob = new Blob([this.pythonCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = this.currentFilename.replace('.java', '') || 'codigo';
      a.download = `${baseName}.py`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      this.statusMessage = 'Código Python guardado correctamente';
    },

    handleSalir() {
      if (confirm('¿Estás seguro de que deseas salir?')) {
        window.close();
      }
    },

    // ==================== TRADUCIR ====================
    async handleTraducir() {
      if (!this.javaCode.trim()) {
        alert('❌ No hay código para analizar');
        return;
      }

      this.isAnalyzing = true;
      this.statusMessage = 'Analizando código...';
      this.status = 'Analizando...';
      this.pythonCode = '';
      this.errors = [];

      try {
        const result = await apiService.analyze(this.javaCode);

        if (result.success) {
          this.tokens = result.tokens;
          this.errors = result.errors;

          if (result.hasErrors) {
            this.statusMessage = `❌ Se encontraron ${result.errors.length} error(es) léxico(s)`;
            this.status = 'Error';
            this.pythonCode = '';
          } else {
            // Por ahora solo mostramos que el análisis léxico fue exitoso
            // En el Día 2 implementaremos la traducción
            this.pythonCode = '# Análisis léxico exitoso\n# La traducción se implementará en el Día 2\n\n';
            this.pythonCode += `# Tokens reconocidos: ${this.tokens.length}\n`;
            this.pythonCode += `# Sin errores léxicos\n`;
            this.statusMessage = `✅ Análisis completado: ${this.tokens.length} tokens reconocidos`;
            this.status = 'Éxito';
          }
        } else {
          this.statusMessage = '❌ Error en el análisis';
          this.status = 'Error';
        }
      } catch (error) {
        console.error('Error:', error);
        this.statusMessage = '❌ Error de conexión con el servidor';
        this.status = 'Error';
        alert('❌ No se pudo conectar con el backend. Asegúrate de que el servidor esté corriendo en http://localhost:3000');
      } finally {
        this.isAnalyzing = false;
      }
    },

    async handleVerTokens() {
      if (this.tokens.length === 0) {
        alert('❌ No hay tokens para mostrar. Ejecuta primero el análisis.');
        return;
      }

      try {
        this.statusMessage = 'Generando reporte de tokens...';
        const html = await apiService.getTokenReport(this.tokens);
        
        this.modalTitle = '📋 Reporte de Tokens';
        this.modalContent = html;
        this.modalFilename = 'reporte_tokens.html';
        this.showModal = true;
        this.statusMessage = 'Reporte de tokens generado';
      } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al generar el reporte de tokens');
      }
    },

    async handleVerErrores() {
      if (this.errors.length === 0) {
        alert('ℹ️ No hay errores léxicos para mostrar');
        return;
      }

      try {
        this.statusMessage = 'Generando reporte de errores...';
        const html = await apiService.getErrorReport(this.errors);
        
        this.modalTitle = '❌ Reporte de Errores Léxicos';
        this.modalContent = html;
        this.modalFilename = 'reporte_errores.html';
        this.showModal = true;
        this.statusMessage = 'Reporte de errores generado';
      } catch (error) {
        console.error('Error:', error);
        alert('❌ Error al generar el reporte de errores');
      }
    },

    // ==================== AYUDA ====================
    handleAcercaDe() {
      alert(`
╔═══════════════════════════════════╗
║       🌉 JavaBridge v1.0         ║
╚═══════════════════════════════════╝

Traductor de Java a Python
Proyecto 2 - Lenguajes Formales y de Programación

👨‍💻 Desarrollado por: 202303204
🏫 Universidad de San Carlos de Guatemala
📚 Facultad de Ingeniería
💻 Ingeniería en Ciencias y Sistemas

Características:
✅ Analizador léxico manual (sin regex)
✅ Analizador sintáctico manual
✅ Traducción Java → Python
✅ Reportes HTML
✅ Interfaz web moderna

Tecnologías:
- Backend: Node.js + Express
- Frontend: Vue.js + Tailwind CSS
      `.trim());
    }
  }
}
</script>

<style>
#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
</style>
