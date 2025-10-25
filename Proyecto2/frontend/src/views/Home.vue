<template>
  <div class="h-screen flex flex-col bg-[#0f172a]">
    <MenuBar
      @nuevo="handleNuevo"
      @abrir="handleAbrir"
      @guardar="handleGuardar"
      @guardar-python="handleGuardarPython"
      @traducir="handleTraducir"
      @ver-tokens="handleVerTokens"
      @ver-errores="handleVerErrores"
      @ver-errores-sintacticos="handleVerErroresSintacticos"
      @simular-ejecucion="handleSimularEjecucion"
      @acerca-de="handleAcercaDe"
      @salir="handleSalir"
    />

    <div class="flex-1 flex overflow-hidden p-6 gap-6">
      <div
        class="flex-1 flex flex-col bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden border border-slate-700/50"
      >
        <Editor v-model:code="javaCode" :filename="currentFilename" />
      </div>

      <div
        class="flex-1 flex flex-col bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden border border-slate-700/50"
      >
        <Output :pythonCode="pythonCode" :errors="errors" :status="status" />
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
import MenuBar from "../components/MenuBar.vue";
import Editor from "../components/Editor.vue";
import Output from "../components/Output.vue";
import api from "../services/api.js";

export default {
  name: "Home",
  components: {
    MenuBar,
    Editor,
    Output,
  },
  data() {
    return {
      javaCode: "",
      pythonCode: "",
      errors: [],
      status: "Listo",
      currentFilename: "",
      lastAnalysisResult: null,
    };
  },
  methods: {
    // Nuevo archivo
    handleNuevo() {
      if (
        this.javaCode &&
        !confirm("Se perdera el contenido actual. Continuar?")
      ) {
        return;
      }
      this.javaCode = "";
      this.pythonCode = "";
      this.errors = [];
      this.currentFilename = "";
      this.status = "Listo";
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
        this.pythonCode = "";
        this.errors = [];
        this.status = "Archivo cargado";
      };
      reader.readAsText(file);
      event.target.value = "";
    },

    // Guardar archivo Java
    handleGuardar() {
      if (!this.javaCode) {
        alert("No hay contenido para guardar");
        return;
      }

      const blob = new Blob([this.javaCode], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = this.currentFilename || "codigo.java";
      a.click();
      URL.revokeObjectURL(url);
    },

    // Guardar archivo Python
    handleGuardarPython() {
      if (!this.pythonCode) {
        alert(
          "No hay codigo Python para guardar. Ejecuta el analisis primero."
        );
        return;
      }

      const blob = new Blob([this.pythonCode], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const baseName = this.currentFilename.replace(".java", "") || "codigo";
      a.download = `${baseName}.py`;
      a.click();
      URL.revokeObjectURL(url);
    },

    // Traducir codigo
    async handleTraducir() {
      if (!this.javaCode.trim()) {
        alert("Escribe codigo Java para analizar");
        return;
      }

      this.status = "Analizando...";
      this.errors = [];
      this.pythonCode = "";

      try {
        const result = await api.analyze(this.javaCode);
        this.lastAnalysisResult = result;

        if (result.success) {
          this.pythonCode = result.pythonCode;
          this.status = "Traduccion exitosa";
        } else {
          if (result.phase === "lexical") {
            this.errors = result.lexicalErrors;
            this.status = "Errores lexicos encontrados";
          } else if (result.phase === "syntax") {
            this.errors = result.syntaxErrors.map((e) => ({
              char: e.token || "",
              line: e.line,
              column: e.column,
              description: e.description || e.expected || "Error sintáctico",
            }));
            this.status = "Errores sintacticos encontrados";
          }
        }
      } catch (error) {
        console.error("Error al analizar:", error);
        alert("Error de conexion con el servidor");
        this.status = "Error";
      }
    },

    // Ver reporte de tokens
    async handleVerTokens() {
      if (!this.lastAnalysisResult || !this.lastAnalysisResult.tokens) {
        alert("Ejecuta el analisis primero");
        return;
      }

      try {
        const html = await api.getTokenReport(
          this.lastAnalysisResult.tokens,
          this.lastAnalysisResult.lexicalErrors || []
        );
        const newWindow = window.open("", "_blank");
        newWindow.document.write(html);
        newWindow.document.close();
      } catch (error) {
        console.error("Error al generar reporte:", error);
        alert("Error al generar reporte de tokens");
      }
    },

    // Ver reporte de errores
    async handleVerErrores() {
      if (!this.lastAnalysisResult) {
        alert("Ejecuta el analisis primero");
        return;
      }

      try {
        let html;
        if (
          this.lastAnalysisResult.lexicalErrors &&
          this.lastAnalysisResult.lexicalErrors.length > 0
        ) {
          html = await api.getErrorReport(
            this.lastAnalysisResult.lexicalErrors
          );
        } else {
          alert("No hay errores léxicos para mostrar");
          return;
        }

        const newWindow = window.open("", "_blank");
        newWindow.document.write(html);
        newWindow.document.close();
      } catch (error) {
        console.error("Error al generar reporte:", error);
        alert("Error al generar reporte de errores");
      }
    },

    // Ver reporte de errores sintácticos
    async handleVerErroresSintacticos() {
      if (!this.lastAnalysisResult) {
        alert("Ejecuta el analisis primero");
        return;
      }

      try {
        const syntaxErrors = this.lastAnalysisResult.syntaxErrors || [];
        const html = await api.getSyntaxErrorReport(syntaxErrors);
        const newWindow = window.open("", "_blank");
        newWindow.document.write(html);
        newWindow.document.close();
      } catch (error) {
        console.error("Error al generar reporte:", error);
        alert("Error al generar reporte de errores sintácticos");
      }
    },

    // Simular ejecucion del codigo Python generado
    handleSimularEjecucion() {
      if (!this.pythonCode) {
        alert(
          "No hay codigo Python para ejecutar. Genera la traduccion primero."
        );
        return;
      }

      // Crear ventana modal para mostrar la simulacion
      const modalHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simulador de Ejecucion - JavaBridge</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 { font-size: 2em; margin-bottom: 10px; }
        .content { padding: 30px; }
        .code-section {
            background: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .code-section h3 {
            color: #667eea;
            margin-bottom: 10px;
        }
        pre {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.5;
        }
        .output-section {
            background: #e8f5e9;
            border-left: 4px solid #4caf50;
            padding: 20px;
            border-radius: 5px;
            margin-top: 20px;
        }
        .output-section h3 {
            color: #2e7d32;
            margin-bottom: 10px;
        }
        .output-content {
            background: white;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .info-box {
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .info-box p {
            color: #e65100;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Simulador de Ejecucion</h1>
            <p>Codigo Python Traducido</p>
        </div>
        
        <div class="content">
            <div class="info-box">
                <p><strong>Nota:</strong> Esta es una simulacion del codigo Python generado. Para ejecutarlo realmente, guarda el archivo .py y ejecutalo con Python 3.x en tu sistema.</p>
            </div>

            <div class="code-section">
                <h3>Codigo Python Generado:</h3>
                <pre><code>${this.escapeHtml(this.pythonCode)}</code></pre>
            </div>

            <div class="output-section">
                <h3>Salida Simulada:</h3>
                <div class="output-content">${this.simulateExecution(
                  this.pythonCode
                )}</div>
            </div>
        </div>
    </div>
</body>
</html>
      `;

      const simWindow = window.open("", "_blank", "width=1000,height=800");
      simWindow.document.write(modalHTML);
      simWindow.document.close();
    },

    // Simula la ejecucion del codigo Python (extrae prints)
    simulateExecution(code) {
      const lines = code.split("\n");
      let output = "";

      // Buscar todas las lineas con print()
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith("print(")) {
          // Extraer contenido del print
          const match = trimmed.match(/print\((.*)\)/);
          if (match) {
            let content = match[1].trim();
            // Remover comillas si es string literal
            if (
              (content.startsWith('"') && content.endsWith('"')) ||
              (content.startsWith("'") && content.endsWith("'"))
            ) {
              content = content.slice(1, -1);
            }
            output += content + "\n";
          }
        }
      }

      return output || "(El codigo no genera salida visible con print)";
    },

    // Escapa HTML para prevenir XSS
    escapeHtml(text) {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return String(text).replace(/[&<>"']/g, (m) => map[m]);
    },

    // Acerca de
    handleAcercaDe() {
      this.$router.push("/about");
    },

    // Salir
    handleSalir() {
      if (this.javaCode && !confirm("Seguro que deseas salir?")) {
        return;
      }
      window.close();
    },
  },
};
</script>
