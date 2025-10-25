<template>
  <div class="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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

    <div class="flex-1 flex overflow-hidden p-4 gap-4">
      <div class="flex-1 flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden">
        <Editor
          v-model:code="javaCode"
          :filename="currentFilename"
        />
      </div>

      <div class="flex-1 flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden">
        <Output
          :pythonCode="pythonCode"
          :errors="errors"
          :status="status"
        />
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".java"
      style="display: none"
      @change="handleFileSelect"
    />
  </div>
</template>

<script>
import MenuBar from '../components/MenuBar.vue';
import Editor from '../components/Editor.vue';
import Output from '../components/Output.vue';
import api from '../services/api.js';

export default {
  name: 'Home',
  components: {
    MenuBar,
    Editor,
    Output
  },
  data() {
    return {
      javaCode: '',
      pythonCode: '',
      errors: [],
      status: 'Listo',
      currentFilename: '',
      lastAnalysisResult: null
    };
  },
  methods: {
    // Nuevo archivo
    handleNuevo() {
      if (this.javaCode && !confirm('Se perdera el contenido actual. Continuar?')) {
        return;
      }
      this.javaCode = '';
      this.pythonCode = '';
      this.errors = [];
      this.currentFilename = '';
      this.status = 'Listo';
    },

    // Abrir archivo
    handleAbrir() {
      this.$refs.fileInput.click();
    },

    handleFileSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.javaCode = e.target.result;
        this.currentFilename = file.name;
        this.pythonCode = '';
        this.errors = [];
        this.status = 'Archivo cargado';
      };
      reader.readAsText(file);
      event.target.value = '';
    },

    // Guardar archivo Java
    handleGuardar() {
      if (!this.javaCode) {
        alert('No hay contenido para guardar');
        return;
      }

      const blob = new Blob([this.javaCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.currentFilename || 'codigo.java';
      a.click();
      URL.revokeObjectURL(url);
    },

    // Guardar archivo Python
    handleGuardarPython() {
      if (!this.pythonCode) {
        alert('No hay codigo Python para guardar. Ejecuta el analisis primero.');
        return;
      }

      const blob = new Blob([this.pythonCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = this.currentFilename.replace('.java', '') || 'codigo';
      a.download = `${baseName}.py`;
      a.click();
      URL.revokeObjectURL(url);
    },

    // Traducir codigo
    async handleTraducir() {
      if (!this.javaCode.trim()) {
        alert('Escribe codigo Java para analizar');
        return;
      }

      this.status = 'Analizando...';
      this.errors = [];
      this.pythonCode = '';

      try {
        const result = await api.analyze(this.javaCode);
        this.lastAnalysisResult = result;

        if (result.success) {
          this.pythonCode = result.pythonCode;
          this.status = 'Traduccion exitosa';
        } else {
          if (result.phase === 'lexical') {
            this.errors = result.lexicalErrors;
            this.status = 'Errores lexicos encontrados';
          } else if (result.phase === 'syntax') {
            this.errors = result.syntaxErrors.map(e => ({
              char: e.token || '',
              line: e.line,
              column: e.column,
              description: e.expected || e.description
            }));
            this.status = 'Errores sintacticos encontrados';
          }
        }
      } catch (error) {
        console.error('Error al analizar:', error);
        alert('Error de conexion con el servidor');
        this.status = 'Error';
      }
    },

    // Ver reporte de tokens
    async handleVerTokens() {
      if (!this.lastAnalysisResult || !this.lastAnalysisResult.tokens) {
        alert('Ejecuta el analisis primero');
        return;
      }

      try {
        const html = await api.getTokenReport(this.lastAnalysisResult.tokens);
        const newWindow = window.open('', '_blank');
        newWindow.document.write(html);
        newWindow.document.close();
      } catch (error) {
        console.error('Error al generar reporte:', error);
        alert('Error al generar reporte de tokens');
      }
    },

    // Ver reporte de errores
    async handleVerErrores() {
      if (!this.lastAnalysisResult) {
        alert('Ejecuta el analisis primero');
        return;
      }

      try {
        let html;
        if (this.lastAnalysisResult.lexicalErrors && this.lastAnalysisResult.lexicalErrors.length > 0) {
          html = await api.getErrorReport(this.lastAnalysisResult.lexicalErrors);
        } else if (this.lastAnalysisResult.syntaxErrors && this.lastAnalysisResult.syntaxErrors.length > 0) {
          html = await api.getSyntaxErrorReport(this.lastAnalysisResult.syntaxErrors);
        } else {
          alert('No hay errores para mostrar');
          return;
        }

        const newWindow = window.open('', '_blank');
        newWindow.document.write(html);
        newWindow.document.close();
      } catch (error) {
        console.error('Error al generar reporte:', error);
        alert('Error al generar reporte de errores');
      }
    },

    // Acerca de
    handleAcercaDe() {
      this.$router.push('/about');
    },

    // Salir
    handleSalir() {
      if (this.javaCode && !confirm('Seguro que deseas salir?')) {
        return;
      }
      window.close();
    }
  }
};
</script>
