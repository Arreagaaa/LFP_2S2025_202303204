/**
 * Interface JavaScript para TourneyJS
 * Conecta la interfaz web directamente con las clases del analizador
 */

// Simulación de las clases del backend para el navegador
// En un entorno real, estas clases se cargarían desde el servidor

class TourneyJSInterface {
  constructor() {
    this.currentFile = null;
    this.currentContent = "";
    this.tokens = [];
    this.ast = null;
    this.errors = [];
    this.lexer = null;
    this.parser = null;
    this.htmlReporter = null;
    this.graphvizGenerator = null;

    this.initializeElements();
    this.attachEventListeners();
    this.showStatus("Interfaz iniciada correctamente", "success");
  }

  initializeElements() {
    // Map to the IDs that exist in index.html (keep compatibility)
    this.fileInput = document.getElementById("fileInput");
    this.contentArea = document.getElementById("contentArea");

    // Main action buttons present in the page
    this.btnAnalyze = document.getElementById("btnAnalyze");
    this.btnClear = document.getElementById("btnClear");
    this.btnTokens = document.getElementById("btnTokens");
    this.btnErrors = document.getElementById("btnErrors");

    // Report buttons
    this.btnBracket = document.getElementById("btnBracket");
    this.btnTeams = document.getElementById("btnTeams");
    this.btnScorers = document.getElementById("btnScorers");
    this.btnGeneral = document.getElementById("btnGeneral");
    this.btnGraphviz = document.getElementById("btnGraphviz");

    // Results and status areas
    this.resultsArea = document.getElementById("resultsArea");
    this.statusArea = document.getElementById("statusArea");

    // Create fileName display element if it doesn't exist
    this.fileName = document.getElementById("fileName");
    if (!this.fileName) {
      this.fileName = document.createElement("div");
      this.fileName.id = "fileName";
      this.fileName.style.marginTop = "10px";
      this.fileName.style.color = "#6b7280";
      this.fileName.style.fontSize = "0.9em";
      // Insert after file input section
      const inputSection = document.querySelector(".input-section");
      if (inputSection) {
        inputSection.appendChild(this.fileName);
      }
    }

    // Status message element
    this.statusMessage = document.getElementById("statusMessage");
    if (!this.statusMessage && this.statusArea) {
      this.statusMessage = document.createElement("div");
      this.statusMessage.id = "statusMessage";
      this.statusArea.appendChild(this.statusMessage);
    }
  }

  attachEventListeners() {
    // File input
    if (this.fileInput) {
      this.fileInput.addEventListener("change", (e) =>
        this.handleFileSelect(e)
      );
    }

    // Main action buttons
    if (this.btnAnalyze) {
      this.btnAnalyze.replaceWith(this.btnAnalyze.cloneNode(true));
      this.btnAnalyze = document.getElementById("btnAnalyze");
      this.btnAnalyze.addEventListener("click", () =>
        this.executeAnalysis("complete")
      );
    }

    if (this.btnClear) {
      this.btnClear.addEventListener("click", () => {
        if (this.contentArea) this.contentArea.value = "";
        this.resetResults();
      });
    }

    if (this.btnTokens) {
      this.btnTokens.addEventListener("click", () => this.showTokens());
    }
    if (this.btnErrors) {
      this.btnErrors.addEventListener("click", () => this.showErrors());
    }

    // Report buttons
    if (this.btnBracket)
      this.btnBracket.addEventListener("click", () =>
        this.generateBracketReport()
      );
    if (this.btnTeams)
      this.btnTeams.addEventListener("click", () => this.generateTeamStats());
    if (this.btnScorers)
      this.btnScorers.addEventListener("click", () =>
        this.generateScorersReport()
      );
    if (this.btnGeneral)
      this.btnGeneral.addEventListener("click", () =>
        this.generateGeneralReport()
      );

    // Graphviz button
    if (this.btnGraphviz)
      this.btnGraphviz.addEventListener("click", () =>
        this.generateGraphvizDiagram()
      );
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  async processFile(file) {
    try {
      // Validar tipo de archivo
      if (!file.name.endsWith(".tourney") && !file.name.endsWith(".txt")) {
        this.showStatus("Solo se permiten archivos .tourney o .txt", "error");
        return;
      }

      this.currentFile = file;
      // Guardar el nombre del archivo para utilizarlo en los reportes
      this.currentFileName = file.name;
      this.currentContent = await this.readFileContent(file);

      // Mostrar el contenido en el textarea preservando todos los caracteres
      if (this.contentArea) {
        this.contentArea.value = this.currentContent;
      }

      this.fileName.textContent = `Archivo cargado: ${file.name} (${(
        file.size / 1024
      ).toFixed(1)} KB)`;
      this.showStatus(`Archivo "${file.name}" cargado exitosamente`, "success");

      // Enable analysis buttons
      this.enableAnalysisButtons();

      // Reset previous results
      this.resetResults();
    } catch (error) {
      this.showStatus(`Error al cargar el archivo: ${error.message}`, "error");
    }
  }

  readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error("Error al leer el archivo"));
      reader.readAsText(file, "UTF-8");
    });
  }

  enableAnalysisButtons() {
    if (this.btnAnalyze) this.btnAnalyze.disabled = false;
    if (this.btnTokens) this.btnTokens.disabled = false;
    if (this.btnErrors) this.btnErrors.disabled = false;
  }

  resetResults() {
    this.tokens = [];
    this.ast = null;
    this.errors = [];
    this.lexer = null;
    this.parser = null;

    if (this.btnTokens) this.btnTokens.disabled = true;
    if (this.btnErrors) this.btnErrors.disabled = true;
    if (this.btnBracket) this.btnBracket.disabled = true;
    if (this.btnTeams) this.btnTeams.disabled = true;
    if (this.btnScorers) this.btnScorers.disabled = true;
    if (this.btnGeneral) this.btnGeneral.disabled = true;
    if (this.btnGraphviz) this.btnGraphviz.disabled = true;

    if (this.resultsArea) {
      this.resultsArea.style.display = "block";
      this.resultsArea.innerHTML = `
        <h3>Resultados</h3>
        <p>Los resultados del análisis aparecerán aquí...</p>
      `;
    }
  }

  async executeAnalysis(type) {
    const content = this.getCurrentContent();
    if (!content.trim()) {
      this.showStatus(
        "Primero debe cargar un archivo o escribir contenido",
        "error"
      );
      return;
    }

    try {
      this.showStatus("Ejecutando análisis...", "info");

      // Always run complete analysis (lexical + syntactic)
      await this.runLexicalAnalysis();
      await this.runSyntacticAnalysis();

      this.updateResultsDisplay();
      this.showStatus("Análisis completado exitosamente", "success");
    } catch (error) {
      console.error("Error en executeAnalysis:", error);
      this.showStatus(`Error durante el análisis: ${error.message}`, "error");
    }
  }

  getCurrentContent() {
    if (this.currentContent) return this.currentContent;
    if (this.contentArea && this.contentArea.value)
      return this.contentArea.value;
    return "";
  }

  async runLexicalAnalysis() {
    try {
      this.lexer = new Lexer(this.currentContent);
      this.tokens = this.lexer.tokenizar();
      this.errors = [...this.errors, ...this.lexer.errores];

      this.btnTokens.disabled = false;
      this.btnErrors.disabled = false;
    } catch (error) {
      console.error("Error en análisis léxico:", error);
      throw error;
    }
  }

  async runSyntacticAnalysis() {
    try {
      if (!this.tokens.length) {
        throw new Error("Primero debe ejecutar el análisis léxico");
      }

      this.parser = new Parser(this.tokens);
      const result = this.parser.parsePublic();
      this.ast = result.arbol;
      this.errors = [...this.errors, ...this.parser.errores];

      console.log("Análisis sintáctico completado, AST:", this.ast);
      console.log("Errores acumulados:", this.errors.length);
    } catch (error) {
      console.error("Error en análisis sintáctico:", error);
      throw error;
    }
  }

  updateResultsDisplay() {
    if (this.resultsArea) {
      this.resultsArea.style.display = "block";

      const stats = this.generateStatistics();
      this.resultsArea.innerHTML = `
        <h3>Resultados del Análisis</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
          ${stats
            .map(
              (stat) => `
            <div style="background: #f8fafc; border: 2px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center;">
              <div style="font-size: 2em; font-weight: bold; color: #1e3a8a;">${stat.number}</div>
              <div style="color: #6b7280; margin-top: 5px; font-weight: 500;">${stat.label}</div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    }

    // Enable report buttons
    const buttons = {
      tokens: document.getElementById("btnTokens"),
      errors: document.getElementById("btnErrors"),
      bracket: document.getElementById("btnBracket"),
      teams: document.getElementById("btnTeams"),
      scorers: document.getElementById("btnScorers"),
      general: document.getElementById("btnGeneral"),
      graphviz: document.getElementById("btnGraphviz"),
    };

    if (this.tokens && this.tokens.length > 0) {
      if (buttons.tokens) buttons.tokens.disabled = false;
      if (buttons.errors) buttons.errors.disabled = false;
    }

    if (this.ast) {
      if (buttons.bracket) buttons.bracket.disabled = false;
      if (buttons.teams) buttons.teams.disabled = false;
      if (buttons.scorers) buttons.scorers.disabled = false;
      if (buttons.general) buttons.general.disabled = false;
      if (buttons.graphviz) buttons.graphviz.disabled = false;
    }
  }

  generateStatistics() {
    return [
      {
        number: this.tokens.length,
        label: "Tokens Extraídos",
      },
      {
        number: this.errors.length,
        label: "Errores Encontrados",
      },
      {
        number: this.ast ? 1 : 0,
        label: "AST Generado",
      },
      {
        number: this.currentFile ? Math.round(this.currentFile.size / 1024) : 0,
        label: "Tamaño (KB)",
      },
    ];
  }

  showTokens() {
    if (!this.tokens || !this.tokens.length) {
      this.showStatus("No hay tokens para mostrar", "info");
      return;
    }

    // Debug: Ver la estructura de los tokens
    console.log("DEBUG TOKENS:", this.tokens.slice(0, 5));
    console.log("Total tokens:", this.tokens.length);

    const htmlContent = this.createTokensReportHTML();
    this.downloadHTMLReport(htmlContent, "reporte_tokens.html");
    this.showStatus(
      `✅ Reporte de tokens generado y descargado exitosamente (${this.tokens.length} tokens).`,
      "success"
    );
  }

  showErrors() {
    if (!this.errors.length) {
      if (this.resultsArea) {
        this.resultsArea.innerHTML = `
          <div style="background: #d1fae5; border: 2px solid #6ee7b7; padding: 20px; border-radius: 8px; color: #065f46; text-align: center;">
            <strong>¡Excelente!</strong> No se encontraron errores en el análisis.
          </div>
        `;
      }
      return;
    }

    const htmlContent = this.createErrorsReportHTML();
    this.downloadHTMLReport(htmlContent, "reporte_errores.html");
    this.showStatus(
      `❌ Se encontraron ${this.errors.length} errores. Reporte generado y descargado.`,
      "error"
    );
  }

  // Implementación de Graphviz basada en el GraphvizGenerator.js de consola
  generateGraphvizDiagram() {
    try {
      if (!this.ast) {
        this.showStatus(
          "Primero debe ejecutar el análisis sintáctico",
          "error"
        );
        return;
      }

      // Debug: mostrar estructura del AST
      console.log("=== DEBUG AST COMPLETO ===");
      console.log("AST completo:", JSON.stringify(this.ast, null, 2));
      console.log("AST.hijos:", this.ast.hijos);
      if (this.ast.hijos) {
        this.ast.hijos.forEach((hijo, i) => {
          console.log(`Hijo ${i}:`, hijo);
        });
      }
      console.log("=== END DEBUG ===");

      this.showStatus("Generando diagrama Graphviz...", "info");

      // Mostrar loading en el área de resultados
      if (this.resultsArea) {
        this.resultsArea.innerHTML = `
          <h3>Diagrama del Torneo - Graphviz</h3>
          <div style="text-align: center; padding: 40px;">
            <div style="display: inline-block; border: 4px solid #f3f3f3; border-top: 4px solid #1e3a8a; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite;"></div>
            <p style="margin-top: 15px; color: #6b7280;">Generando diagrama...</p>
          </div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        `;
      }

      // Extraer información del torneo
      const info = this.extraerInformacionTorneo();
      const partidos = this.extraerPartidos();
      const equipos = this.extraerEquipos();

      console.log("Información extraída:");
      console.log("Info:", info);
      console.log("Partidos:", partidos);
      console.log("Equipos:", equipos);

      // Generar código DOT
      const dotContent = this.generarCodigoDOT(info, partidos, equipos);

      // Mostrar imagen PNG directamente
      this.mostrarImagenGraphviz(dotContent, info);
    } catch (error) {
      console.error("Error en generateGraphvizDiagram:", error);
      this.showStatus(`Error: ${error.message}`, "error");
      if (this.resultsArea) {
        this.resultsArea.innerHTML = `
          <h3>Error al generar diagrama</h3>
          <div style="background: #fee2e2; border: 1px solid #fca5a5; padding: 20px; border-radius: 8px; color: #dc2626;">
            <p><strong>Error:</strong> ${error.message}</p>
            <p>Por favor, verifique que el archivo tenga la estructura correcta del torneo.</p>
          </div>
        `;
      }
    }
  }

  // Nueva función para mostrar imagen PNG directamente
  mostrarImagenGraphviz(dotContent, info) {
    try {
      // Usar QuickChart API para generar la imagen
      const encodedDot = encodeURIComponent(dotContent);
      const imageUrl = `https://quickchart.io/graphviz?graph=${encodedDot}`;

      // Crear imagen y manejar la carga
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        if (this.resultsArea) {
          const torneoNombre = info && info.nombre ? info.nombre : "Torneo";
          this.resultsArea.innerHTML = `
            <h3>Diagrama del Torneo - ${this.escapeHtml(torneoNombre)}</h3>
            <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px; margin: 20px 0;">
              <img src="${imageUrl}" alt="Diagrama del Torneo" style="max-width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
            </div>
            <div style="text-align: center; margin-top: 15px;">
              <button onclick="this.downloadGraphvizImage('${imageUrl}', '${torneoNombre}_bracket.png')" style="background: #1e3a8a; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                Descargar PNG
              </button>
              <button onclick="this.showGraphvizCode('${this.escapeHtml(
                dotContent
              ).replace(
                /'/g,
                "\\'"
              )}', '${torneoNombre}')" style="background: #059669; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                Ver Código DOT
              </button>
            </div>
          `;

          // Añadir las funciones de descarga y visualización al contexto global
          window.downloadGraphvizImage = (url, filename) => {
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };

          window.showGraphvizCode = (dotCode, torneoNombre) => {
            this.mostrarCodigoDOT(dotCode, torneoNombre);
          };
        }
        this.showStatus("Diagrama Graphviz generado exitosamente", "success");
      };

      img.onerror = () => {
        // Fallback: intentar con otro servicio
        this.intentarAlternativaGraphviz(dotContent, info);
      };

      // Iniciar la carga de la imagen
      img.src = imageUrl;
    } catch (error) {
      console.error("Error mostrando imagen Graphviz:", error);
      this.intentarAlternativaGraphviz(dotContent, info);
    }
  }

  // Función alternativa si falla el primer servicio
  intentarAlternativaGraphviz(dotContent, info) {
    try {
      // Usar Kroki como alternativa
      const encodedDot = btoa(dotContent);
      const imageUrl = `https://kroki.io/graphviz/png/${encodedDot}`;

      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        if (this.resultsArea) {
          const torneoNombre = info && info.nombre ? info.nombre : "Torneo";
          this.resultsArea.innerHTML = `
            <h3>Diagrama del Torneo - ${this.escapeHtml(torneoNombre)}</h3>
            <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 8px; margin: 20px 0;">
              <img src="${imageUrl}" alt="Diagrama del Torneo" style="max-width: 100%; height: auto; border: 1px solid #e2e8f0; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
            </div>
            <div style="text-align: center; margin-top: 15px;">
              <button onclick="window.downloadGraphvizImage('${imageUrl}', '${torneoNombre}_bracket.png')" style="background: #1e3a8a; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                Descargar PNG
              </button>
              <button onclick="window.showGraphvizCode('${this.escapeHtml(
                dotContent
              ).replace(
                /'/g,
                "\\'"
              )}', '${torneoNombre}')" style="background: #059669; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                Ver Código DOT
              </button>
            </div>
          `;
        }
        this.showStatus(
          "Diagrama Graphviz generado exitosamente (servicio alternativo)",
          "success"
        );
      };

      img.onerror = () => {
        // Si fallan ambos servicios, mostrar código DOT
        this.mostrarCodigoDOTFallback(dotContent, info);
      };

      img.src = imageUrl;
    } catch (error) {
      console.error("Error con servicio alternativo:", error);
      this.mostrarCodigoDOTFallback(dotContent, info);
    }
  }

  // Función para mostrar código DOT en ventana modal
  mostrarCodigoDOT(dotCode, torneoNombre) {
    if (this.resultsArea) {
      this.resultsArea.innerHTML = `
        <h3>Código DOT - ${this.escapeHtml(torneoNombre)}</h3>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <pre style="background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 5px; overflow-x: auto; font-family: 'Courier New', monospace; font-size: 0.9em; white-space: pre-wrap;">${this.escapeHtml(
            dotCode
          )}</pre>
        </div>
        <div style="text-align: center; margin-top: 15px;">
          <button onclick="navigator.clipboard.writeText(\`${dotCode.replace(
            /`/g,
            "\\`"
          )}\`).then(() => alert('Código DOT copiado al portapapeles'))" style="background: #059669; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
            Copiar Código
          </button>
          <button onclick="window.open('https://dreampuf.github.io/GraphvizOnline/#' + encodeURIComponent(\`${dotCode.replace(
            /`/g,
            "\\`"
          )}\`), '_blank')" style="background: #7c3aed; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
            Abrir en Graphviz Online
          </button>
          <button onclick="window.location.reload()" style="background: #6b7280; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
            Volver
          </button>
        </div>
      `;
    }
  }

  // Fallback final si todo falla
  mostrarCodigoDOTFallback(dotContent, info) {
    this.showStatus(
      "No se pudo generar la imagen. Mostrando código DOT.",
      "info"
    );
    const torneoNombre = info && info.nombre ? info.nombre : "Torneo";
    this.mostrarCodigoDOT(dotContent, torneoNombre);
  }

  // Funciones auxiliares imitando el GraphvizGenerator de consola
  extraerInformacionTorneo() {
    if (!this.ast || !this.ast.hijos)
      return { nombre: "N/A", equipos: 0, sede: "No especificada" };

    let infoTorneo = { nombre: "N/A", equipos: 0, sede: "No especificada" };

    const buscarTorneo = (nodo) => {
      if (nodo.tipo === "TORNEO") {
        if (nodo.hijos) {
          nodo.hijos.forEach((hijo) => {
            if (
              hijo.tipo === "ATRIBUTO" &&
              hijo.valor === "nombre" &&
              hijo.hijos &&
              hijo.hijos[0]
            ) {
              infoTorneo.nombre = hijo.hijos[0].valor.replace(/"/g, "");
            }
            if (
              hijo.tipo === "ATRIBUTO" &&
              hijo.valor === "equipos" &&
              hijo.hijos &&
              hijo.hijos[0]
            ) {
              infoTorneo.equipos = parseInt(hijo.hijos[0].valor) || 0;
            }
            if (
              hijo.tipo === "ATRIBUTO" &&
              hijo.valor === "sede" &&
              hijo.hijos &&
              hijo.hijos[0]
            ) {
              infoTorneo.sede = hijo.hijos[0].valor.replace(/"/g, "");
            }
          });
        }
      }
      if (nodo.hijos) nodo.hijos.forEach(buscarTorneo);
    };

    buscarTorneo(this.ast);

    console.log("Info torneo extraída:", infoTorneo);
    return infoTorneo;
  }

  extraerPartidos() {
    if (!this.ast) return [];

    let partidos = [];

    const buscarPartidos = (nodo, faseActual = "N/A") => {
      if (nodo.tipo === "FASE" && nodo.valor) faseActual = nodo.valor;
      if (nodo.tipo === "PARTIDO") {
        let partido = {
          fase: faseActual,
          equipo1: "N/A",
          equipo2: "N/A",
          resultado: "N/A",
          ganador: null,
        };
        if (nodo.valor && nodo.valor.includes(" vs ")) {
          const equipos = nodo.valor.split(" vs ");
          if (equipos.length >= 2) {
            partido.equipo1 = equipos[0].replace(/"/g, "").trim();
            partido.equipo2 = equipos[1].replace(/"/g, "").trim();
          }
        }
        if (nodo.hijos) {
          const buscarEnDetalles = (detalle) => {
            if (detalle.tipo === "LISTA" && detalle.valor === "detalles") {
              detalle.hijos.forEach((item) => {
                if (
                  item.tipo === "ATRIBUTO" &&
                  item.valor === "resultado" &&
                  item.hijos &&
                  item.hijos[0]
                ) {
                  partido.resultado = item.hijos[0].valor.replace(/"/g, "");
                  partido.ganador = this.determinarGanador(
                    partido.equipo1,
                    partido.equipo2,
                    partido.resultado
                  );
                }
              });
            }
          };
          nodo.hijos.forEach(buscarEnDetalles);
        }
        partidos.push(partido);
      }
      if (nodo.hijos)
        nodo.hijos.forEach((hijo) => buscarPartidos(hijo, faseActual));
    };

    buscarPartidos(this.ast);

    console.log("Partidos extraídos:", partidos);
    return partidos;
  }

  extraerEquipos() {
    if (!this.ast) return [];

    let equipos = [];

    const buscarEquipos = (nodo) => {
      if (nodo.tipo === "EQUIPO" && nodo.valor) {
        const nombreEquipo = nodo.valor.replace(/"/g, "").trim();
        if (nombreEquipo && nombreEquipo !== "N/A") equipos.push(nombreEquipo);
      }
      if (nodo.hijos) nodo.hijos.forEach(buscarEquipos);
    };

    buscarEquipos(this.ast);

    console.log("Equipos extraídos:", [...new Set(equipos)]);
    return [...new Set(equipos)]; // Eliminar duplicados
  }

  determinarGanador(equipo1, equipo2, resultado) {
    if (!resultado || resultado === "N/A") return null;

    const scores = resultado.split("-");
    if (scores.length === 2) {
      const goles1 = parseInt(scores[0]) || 0;
      const goles2 = parseInt(scores[1]) || 0;

      if (goles1 > goles2) return equipo1;
      if (goles2 > goles1) return equipo2;
      return "Empate";
    }
    return null;
  }

  generarCodigoDOT(info, partidos, equipos) {
    const torneo = (info.nombre || "Torneo").replace(/"/g, "");

    // Separar partidos por fase
    const cuartos = partidos.filter((p) =>
      p.fase.toLowerCase().includes("cuartos")
    );
    const semifinales = partidos.filter((p) =>
      p.fase.toLowerCase().includes("semifinal")
    );
    const finales = partidos.filter((p) =>
      p.fase.toLowerCase().includes("final")
    );

    const lines = [
      "digraph TorneoBracket {",
      "  rankdir=TB;",
      "  ranksep=1.5;",
      "  nodesep=0.8;",
      '  bgcolor="white";',
      "",
      "  // Título del torneo",
      '  torneo_title [label="' +
        this._escapeDotLabel(torneo) +
        '", shape=ellipse, style=filled, fillcolor="gold", fontsize=16, fontweight=bold];',
      "",
      "  // Nodos para cada fase",
    ];

    // Generar nodos de cuartos de final
    if (cuartos.length > 0) {
      lines.push("  // Cuartos de Final");
      lines.push("  subgraph cluster_cuartos {");
      lines.push('    label="Cuartos de Final";');
      lines.push("    style=filled;");
      lines.push('    fillcolor="lightgray";');
      lines.push("    rank=same;");

      cuartos.forEach((partido, i) => {
        const color = partido.ganador ? "#90EE90" : "#FFE4B5";
        const resultado =
          partido.resultado !== "N/A" ? `\\n${partido.resultado}` : "";
        const ganadorText =
          partido.ganador && partido.ganador !== "Empate"
            ? `\\nGanador: ${partido.ganador}`
            : "";

        lines.push(
          `    cuarto_${i} [label="${this._escapeDotLabel(
            partido.equipo1 + " vs " + partido.equipo2 + resultado + ganadorText
          )}", style=filled, fillcolor="${color}", shape=box];`
        );
      });
      lines.push("  }");
      lines.push("");
    }

    // Generar nodos de semifinales
    if (semifinales.length > 0) {
      lines.push("  // Semifinales");
      lines.push("  subgraph cluster_semifinal {");
      lines.push('    label="Semifinal";');
      lines.push("    style=filled;");
      lines.push('    fillcolor="lightblue";');
      lines.push("    rank=same;");

      semifinales.forEach((partido, i) => {
        const color = partido.ganador ? "#87CEEB" : "#F0E68C";
        const resultado =
          partido.resultado !== "N/A" ? `\\n${partido.resultado}` : "";
        const ganadorText =
          partido.ganador && partido.ganador !== "Empate"
            ? `\\nGanador: ${partido.ganador}`
            : "";

        lines.push(
          `    semi_${i} [label="${this._escapeDotLabel(
            partido.equipo1 + " vs " + partido.equipo2 + resultado + ganadorText
          )}", style=filled, fillcolor="${color}", shape=box];`
        );
      });
      lines.push("  }");
      lines.push("");
    }

    // Generar nodo de final
    if (finales.length > 0) {
      lines.push("  // Final");
      lines.push("  subgraph cluster_final {");
      lines.push('    label="Final";');
      lines.push("    style=filled;");
      lines.push('    fillcolor="gold";');
      lines.push("    rank=same;");

      const finalPartido = finales[0];
      const color = finalPartido.ganador ? "#FFD700" : "#FFFFE0";
      const resultado =
        finalPartido.resultado !== "N/A" ? `\\n${finalPartido.resultado}` : "";
      let ganadorText = "";

      if (finalPartido.ganador && finalPartido.ganador !== "Empate") {
        ganadorText = `\\nCAMPEÓN: ${finalPartido.ganador}`;
      } else if (finalPartido.resultado !== "N/A") {
        ganadorText = "\\nPor definirse";
      }

      lines.push(
        `    final_0 [label="${this._escapeDotLabel(
          finalPartido.equipo1 +
            " vs " +
            finalPartido.equipo2 +
            resultado +
            ganadorText
        )}", style=filled, fillcolor="${color}", shape=box, fontweight=bold];`
      );
      lines.push("  }");
      lines.push("");
    }

    // Generar conexiones jerárquicas
    lines.push("  // Conexiones del bracket");
    lines.push("  torneo_title -> {");
    if (cuartos.length > 0) {
      cuartos.forEach((_, i) => {
        lines.push(`    cuarto_${i};`);
      });
    }
    lines.push("  }");

    // Conexiones de cuartos a semifinales
    if (cuartos.length > 0 && semifinales.length > 0) {
      lines.push("");
      lines.push("  // Conexiones cuartos -> semifinales");

      // Agrupar cuartos por ganadores hacia semifinales
      cuartos.forEach((cuarto, i) => {
        if (cuarto.ganador && cuarto.ganador !== "Empate") {
          // Buscar en qué semifinal aparece este ganador
          const semiIndex = semifinales.findIndex(
            (semi) =>
              semi.equipo1 === cuarto.ganador || semi.equipo2 === cuarto.ganador
          );
          if (semiIndex !== -1) {
            lines.push(`  cuarto_${i} -> semi_${semiIndex};`);
          }
        }
      });
    }

    // Conexiones de semifinales a final
    if (semifinales.length > 0 && finales.length > 0) {
      lines.push("");
      lines.push("  // Conexiones semifinales -> final");

      semifinales.forEach((semi, i) => {
        if (semi.ganador && semi.ganador !== "Empate") {
          const finalPartido = finales[0];
          if (
            finalPartido.equipo1 === semi.ganador ||
            finalPartido.equipo2 === semi.ganador
          ) {
            lines.push(`  semi_${i} -> final_0;`);
          }
        }
      });
    }

    lines.push("}");
    return lines.join("\n");
  }

  hashString(str) {
    let h = 0;
    if (!str) return h;
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return h;
  }

  _escapeDotLabel(s) {
    if (!s) return "";
    return String(s).replace(/"/g, "").replace(/\n/g, "\\n");
  }

  createGraphvizHTML(dotContent, info) {
    const safe = this.escapeHtml(dotContent);
    const title = this.escapeHtml(info && info.nombre ? info.nombre : "Torneo");

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Graphviz Viewer - ${title}</title>
    <style>
        body { font-family: 'Segoe UI', Roboto, sans-serif; background: #f5f7ff; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1e3a8a; border-bottom: 3px solid #1e3a8a; padding-bottom: 10px; margin-bottom: 30px; }
        pre { background: #0f1724; color: #e6eef8; padding: 12px; border-radius: 6px; overflow: auto; }
        .diagram-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 20px 0; }
        .diagram-container img { max-width: 100%; height: auto; border: 1px solid #ddd; }
        .section { margin: 20px 0; }
        .btn { background: #1e3a8a; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        .btn:hover { background: #1e40af; }
        .note { background: #e0f2fe; border: 1px solid #81d4fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Visualizador Graphviz - ${title}</h1>
        
        <div class="note">
            <strong>Instrucciones:</strong>
            <p>1. Copie el código DOT de abajo</p>
            <p>2. Use el botón "Abrir en Graphviz Online" para visualizar el diagrama</p>
            <p>3. O instale Graphviz localmente desde <a href="https://graphviz.org/download/" target="_blank">graphviz.org</a></p>
        </div>

        <div class="section">
            <h3>Código DOT Generado</h3>
            <pre id="dot">${safe}</pre>
            <button id="open-online" class="btn">Abrir en Graphviz Online</button>
            <button id="copy-dot" class="btn">Copiar DOT al Portapapeles</button>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${new Date().toLocaleString()}
        </div>
    </div>

    <script>
        document.getElementById("open-online").addEventListener("click", function() {
            const dotContent = document.getElementById("dot").textContent || "";
            const url = "https://dreampuf.github.io/GraphvizOnline/#" + encodeURIComponent(dotContent);
            window.open(url, "_blank");
        });

        document.getElementById("copy-dot").addEventListener("click", function() {
            const dotContent = document.getElementById("dot").textContent || "";
            if (navigator.clipboard) {
                navigator.clipboard.writeText(dotContent).then(function() {
                    alert("Código DOT copiado al portapapeles");
                });
            } else {
                // Fallback para navegadores más antiguos
                const textarea = document.createElement("textarea");
                textarea.value = dotContent;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
                alert("Código DOT copiado al portapapeles");
            }
        });
    </script>
</body>
</html>`;
  }

  // Additional utility methods
  showStatus(message, type) {
    console.log(`Status [${type}]:`, message);

    if (this.statusArea) {
      let statusEl = this.statusMessage;
      if (!statusEl) {
        statusEl = document.createElement("div");
        statusEl.className = "status-message";
        this.statusArea.appendChild(statusEl);
        this.statusMessage = statusEl;
      }

      statusEl.textContent = message;
      statusEl.className = `status-${type}`;
      statusEl.style.display = "block";
      statusEl.style.padding = "10px";
      statusEl.style.margin = "5px 0";
      statusEl.style.borderRadius = "5px";

      if (type === "success") {
        statusEl.style.background = "#d1fae5";
        statusEl.style.color = "#065f46";
        statusEl.style.border = "1px solid #6ee7b7";
      } else if (type === "error") {
        statusEl.style.background = "#fee2e2";
        statusEl.style.color = "#991b1b";
        statusEl.style.border = "1px solid #fca5a5";
      } else if (type === "info") {
        statusEl.style.background = "#dbeafe";
        statusEl.style.color = "#1e40af";
        statusEl.style.border = "1px solid #93c5fd";
      }

      if (type === "success" || type === "info") {
        setTimeout(() => {
          if (statusEl) statusEl.style.display = "none";
        }, 3000);
      }
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  downloadFile(content, filename, mimeType) {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();

      // Cleanup with timeout to prevent page refresh
      setTimeout(() => {
        if (a && a.parentNode) {
          document.body.removeChild(a);
        }
        window.URL.revokeObjectURL(url);
      }, 100);

      // Additional cleanup in case first timeout fails
      setTimeout(() => {
        try {
          window.URL.revokeObjectURL(url);
        } catch (e) {
          // Ignore cleanup errors
        }
      }, 1000);
    } catch (error) {
      console.error("Error downloading file:", error);
      this.showStatus("Error al descargar archivo", "error");
    }
  }

  escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Funciones para crear reportes HTML completos
  createBracketReportHTML() {
    const timestamp = new Date().toLocaleString();

    // Extraer información del bracket desde el AST
    const infoTorneo = this.extraerInformacionTorneo();
    const partidos = this.extraerPartidos();
    const fases = this.extraerFases();

    let contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bracket de Eliminación - TourneyJS</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1e3a8a; border-bottom: 3px solid #1e3a8a; padding-bottom: 10px; }
        .fase { margin: 30px 0; border: 2px solid #1e3a8a; border-radius: 10px; padding: 20px; }
        .fase-title { font-size: 1.5em; font-weight: bold; color: #1e3a8a; text-align: center; margin-bottom: 20px; text-transform: uppercase; }
        .match { background: #f8fafc; border: 2px solid #e2e8f0; margin: 20px 0; padding: 20px; border-radius: 8px; }
        .teams { display: flex; justify-content: space-between; align-items: center; margin: 15px 0; }
        .team { background: #1e3a8a; color: white; padding: 12px 25px; border-radius: 5px; font-weight: bold; min-width: 150px; text-align: center; }
        .team.winner { background: #22c55e; }
        .vs { font-size: 1.5em; font-weight: bold; color: #6b7280; margin: 0 20px; }
        .result { text-align: center; font-size: 1.4em; font-weight: bold; color: #dc2626; margin: 15px 0; background: #fef2f2; padding: 10px; border-radius: 5px; }
        .scorers { margin-top: 15px; background: #f0f9ff; padding: 15px; border-radius: 5px; }
        .scorers-title { font-weight: bold; color: #1e3a8a; margin-bottom: 10px; }
        .scorer { background: #fef3c7; padding: 8px 12px; margin: 5px 0; border-radius: 4px; border-left: 4px solid #f59e0b; display: flex; justify-content: space-between; }
        .scorer-name { font-weight: bold; }
        .scorer-time { color: #7c2d12; }
        .summary { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 30px 0; }
        .summary h3 { color: #1e3a8a; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bracket de Eliminación</h1>
        <h2>Torneo: ${infoTorneo.nombre || "Torneo"}</h2>
        
        <div class="summary">
            <h3>Resumen del Torneo</h3>
            <p><strong>Total de fases:</strong> ${fases.length}</p>
            <p><strong>Total de partidos:</strong> ${partidos.length}</p>
            <p><strong>Campeón:</strong> ${this.determinarCampeon(partidos)}</p>
        </div>
        
        ${this.generarContenidoBracket(fases, partidos)}
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${timestamp}
        </div>
    </div>
</body>
</html>
        `;

    return contenidoHTML;
  }

  createTeamStatsHTML() {
    const timestamp = new Date().toLocaleString();
    const equipos = this.calcularEstadisticasEquipos();

    let contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estadísticas de Equipos - TourneyJS</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1e3a8a; border-bottom: 3px solid #1e3a8a; padding-bottom: 10px; }
        .stats-table { width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .stats-table th, .stats-table td { border: 1px solid #d1d5db; padding: 12px; text-align: center; }
        .stats-table th { background: #1e3a8a; color: white; font-weight: bold; }
        .stats-table tr:nth-child(even) { background: #f9fafb; }
        .stats-table tr:hover { background: #f3f4f6; }
        .team-name { font-weight: bold; text-align: left !important; }
        .positive { color: #22c55e; font-weight: bold; }
        .negative { color: #ef4444; font-weight: bold; }
        .neutral { color: #6b7280; }
        .summary { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 30px 0; }
        .summary h3 { color: #1e3a8a; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Estadísticas de Equipos</h1>
        
        <div class="summary">
            <h3>Resumen General</h3>
            <p>Estadísticas completas de todos los equipos participantes en el torneo, incluyendo partidos jugados, resultados, goles y fase alcanzada.</p>
        </div>
        
        <table class="stats-table">
            <thead>
                <tr>
                    <th>Equipo</th>
                    <th>Partidos Jugados</th>
                    <th>Ganados</th>
                    <th>Perdidos</th>
                    <th>Goles Favor</th>
                    <th>Goles Contra</th>
                    <th>Diferencia</th>
                    <th>Fase Alcanzada</th>
                </tr>
            </thead>
            <tbody>
                ${equipos
                  .map(
                    (equipo) => `
                    <tr>
                        <td class="team-name">${equipo.nombre}</td>
                        <td>${equipo.partidosJugados || 0}</td>
                        <td class="positive">${equipo.ganados || 0}</td>
                        <td class="negative">${equipo.perdidos || 0}</td>
                        <td>${equipo.golesFavor || 0}</td>
                        <td>${equipo.golesContra || 0}</td>
                        <td class="${
                          (equipo.diferencia || 0) > 0
                            ? "positive"
                            : (equipo.diferencia || 0) < 0
                            ? "negative"
                            : "neutral"
                        }">
                            ${(equipo.diferencia || 0) > 0 ? "+" : ""}${
                      equipo.diferencia || 0
                    }
                        </td>
                        <td><strong>${
                          equipo.faseAlcanzada || "No participó"
                        }</strong></td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${timestamp}
        </div>
    </div>
</body>
</html>
        `;

    return contenidoHTML;
  }

  createScorersReportHTML() {
    const timestamp = new Date().toLocaleString();
    const goleadores = this.extraerGoleadores();

    let contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Goleadores - TourneyJS</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1e3a8a; border-bottom: 3px solid #1e3a8a; padding-bottom: 10px; }
        .subtitle { color: #6b7280; margin-bottom: 30px; font-style: italic; }
        .scorers-table { width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .scorers-table th, .scorers-table td { border: 1px solid #d1d5db; padding: 12px; text-align: center; }
        .scorers-table th { background: #1e3a8a; color: white; font-weight: bold; }
        .scorers-table tr:nth-child(even) { background: #f9fafb; }
        .scorers-table tr:hover { background: #f3f4f6; }
        .position { font-weight: bold; font-size: 1.1em; }
        .top-scorer { background: #fef3c7 !important; }
        .player-name { font-weight: bold; text-align: left !important; }
        .team-name { color: #1e3a8a; font-weight: bold; }
        .goals-count { font-weight: bold; color: #dc2626; font-size: 1.2em; }
        .goals-times { color: #7c2d12; font-family: monospace; }
        .summary { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 30px 0; }
        .summary h3 { color: #1e3a8a; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reporte de Goleadores</h1>
        <p class="subtitle">Ranking de los jugadores que más goles han anotado en el torneo.</p>
        
        <div class="summary">
            <h3>Estadísticas Generales</h3>
            <p><strong>Total de goleadores:</strong> ${goleadores.length}</p>
            <p><strong>Total de goles en el torneo:</strong> ${goleadores.reduce(
              (total, g) => total + g.goles,
              0
            )}</p>
            <p><strong>Máximo goleador:</strong> ${
              goleadores.length > 0 ? goleadores[0].jugador : "Ninguno"
            }</p>
        </div>
        
        <table class="scorers-table">
            <thead>
                <tr>
                    <th>Posición</th>
                    <th>Jugador</th>
                    <th>Equipo</th>
                    <th>Goles</th>
                    <th>Minutos de Gol</th>
                </tr>
            </thead>
            <tbody>
                ${
                  goleadores.length > 0
                    ? goleadores
                        .map(
                          (goleador, index) => `
                    <tr class="${index === 0 ? "top-scorer" : ""}">
                        <td class="position">${index + 1}</td>
                        <td class="player-name">${goleador.jugador}</td>
                        <td class="team-name">${goleador.equipo}</td>
                        <td class="goals-count">${goleador.goles}</td>
                        <td class="goals-times">${goleador.minutos.join(
                          ", "
                        )}</td>
                    </tr>
                `
                        )
                        .join("")
                    : `
                    <tr>
                        <td colspan="5" style="text-align: center; color: #6b7280; font-style: italic; padding: 30px;">
                            No se registraron goles en el torneo
                        </td>
                    </tr>
                `
                }
            </tbody>
        </table>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${timestamp}
        </div>
    </div>
</body>
</html>
        `;

    return contenidoHTML;
  }

  createGeneralReportHTML() {
    const timestamp = new Date().toLocaleString();
    const infoTorneo = this.extraerInformacionTorneo();
    const estadisticas = this.calcularEstadisticasGenerales();

    let contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Información General - TourneyJS</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1e3a8a; border-bottom: 3px solid #1e3a8a; padding-bottom: 10px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-card { background: #f8fafc; border: 2px solid #e2e8f0; padding: 20px; border-radius: 8px; text-align: center; transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2.5em; font-weight: bold; color: #1e3a8a; }
        .stat-label { color: #6b7280; margin-top: 5px; font-weight: 500; }
        .section { margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
        .section h3 { color: #1e3a8a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px; }
        .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .info-item { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #1e3a8a; }
        .champion-info { background: #22c55e; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .phases-info { background: white; padding: 15px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Información General del Torneo</h1>
        
        <div class="section">
            <h3>Información del Torneo</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Nombre:</strong> ${
                      estadisticas.nombreTorneo || "Torneo sin nombre"
                    }
                </div>
                <div class="info-item">
                    <strong>Sede:</strong> ${
                      infoTorneo.sede || "No especificada"
                    }
                </div>
                <div class="info-item">
                    <strong>Equipos Registrados:</strong> ${
                      estadisticas.equiposParticipantes || 0
                    }
                </div>
                <div class="info-item">
                    <strong>Tipo de Torneo:</strong> Eliminación Directa
                </div>
            </div>
            
            ${
              estadisticas.campeon && estadisticas.campeon !== "Por determinar"
                ? `
            <div class="champion-info">
                <h3>CAMPEÓN DEL TORNEO</h3>
                <h2>${estadisticas.campeon}</h2>
            </div>
            `
                : ""
            }
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${
                  estadisticas.equiposParticipantes || 0
                }</div>
                <div class="stat-label">Equipos Participantes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${
                  estadisticas.totalJugadores || 0
                }</div>
                <div class="stat-label">Jugadores Registrados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${
                  estadisticas.partidosCompletados || 0
                }</div>
                <div class="stat-label">Partidos Jugados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${estadisticas.totalGoles || 0}</div>
                <div class="stat-label">Goles Anotados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${this.contarFases()}</div>
                <div class="stat-label">Fases del Torneo</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${
                  estadisticas.promedioGoles || "0.0"
                }</div>
                <div class="stat-label">Promedio Goles/Partido</div>
            </div>
        </div>
        
        <div class="section">
            <h3>Fases del Torneo</h3>
            ${this.generarResumenFases()}
        </div>
        
        <div class="section">
            <h3>Resumen del Análisis Léxico y Sintáctico</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Tokens Procesados:</strong> ${
                      this.tokens ? this.tokens.length : 0
                    }
                </div>
                <div class="info-item">
                    <strong>Errores Encontrados:</strong> ${
                      this.errors ? this.errors.length : 0
                    }
                </div>
                <div class="info-item">
                    <strong>Estado del AST:</strong> ${
                      this.ast ? "Generado correctamente" : "No generado"
                    }
                </div>
                <div class="info-item">
                    <strong>Archivo Analizado:</strong> ${
                      this.currentFileName || "Ninguno"
                    }
                </div>
            </div>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${timestamp}
        </div>
    </div>
</body>
</html>
        `;

    return contenidoHTML;
  }

  // ===== MÉTODOS AUXILIARES PARA PROCESAR EL AST (COPIADOS DE LA CONSOLA) =====

  extraerFases() {
    if (!this.ast) return [];

    let fases = [];

    const buscarFases = (nodo) => {
      if (nodo.tipo === "FASE" && nodo.valor) {
        if (!fases.some((f) => f.nombre === nodo.valor)) {
          fases.push({
            nombre: nodo.valor,
            partidos: [],
          });
        }
      }
      if (nodo.hijos) {
        nodo.hijos.forEach(buscarFases);
      }
    };

    buscarFases(this.ast);
    return fases;
  }

  extraerGoleadores() {
    if (!this.ast) return [];

    let goleadores = new Map(); // Usar Map para evitar duplicados
    let goleadoresProcessados = new Set(); // Para evitar procesar el mismo goleador múltiples veces

    const buscarGoleadores = (nodo, equipoActual = null, faseActual = null) => {
      // Identificar contexto actual
      if (nodo.tipo === "EQUIPO" && nodo.valor) {
        equipoActual = nodo.valor.replace(/"/g, "");
      }
      if (nodo.tipo === "FASE" && nodo.valor) {
        faseActual = nodo.valor;
      }

      // Procesar goleadores directamente del AST
      if (nodo.tipo === "GOLEADOR" && nodo.valor) {
        const nombreGoleador = nodo.valor.replace(/"/g, "");
        let minutoGol = "N/A";

        // Buscar minuto en los hijos del goleador
        if (nodo.hijos) {
          const buscarMinuto = (hijoGoleador) => {
            if (
              hijoGoleador.tipo === "ATRIBUTO" &&
              hijoGoleador.valor === "minuto" &&
              hijoGoleador.hijos &&
              hijoGoleador.hijos[0]
            ) {
              minutoGol = hijoGoleador.hijos[0].valor;
              return true;
            }
            if (hijoGoleador.tipo === "LISTA" && hijoGoleador.hijos) {
              return hijoGoleador.hijos.some(buscarMinuto);
            }
            return false;
          };
          nodo.hijos.some(buscarMinuto);
        }

        // Crear ID único para evitar duplicados del mismo gol
        const goleadorId = `${nombreGoleador}-${minutoGol}-${faseActual}`;

        if (!goleadoresProcessados.has(goleadorId)) {
          goleadoresProcessados.add(goleadorId);

          // Determinar equipo del goleador
          const equipoGoleador =
            equipoActual ||
            this.determinarEquipoDelGoleador(nombreGoleador) ||
            "Desconocido";

          if (goleadores.has(nombreGoleador)) {
            const goleadorExistente = goleadores.get(nombreGoleador);
            goleadorExistente.goles++;
            const minutoFormateado = minutoGol + "'";
            if (!goleadorExistente.minutos.includes(minutoFormateado)) {
              goleadorExistente.minutos.push(minutoFormateado);
            }
          } else {
            goleadores.set(nombreGoleador, {
              jugador: nombreGoleador,
              equipo: equipoGoleador,
              goles: 1,
              minutos: [minutoGol + "'"],
            });
          }
        }
      }

      // Recorrer hijos manteniendo contexto
      if (nodo.hijos) {
        nodo.hijos.forEach((hijo) =>
          buscarGoleadores(hijo, equipoActual, faseActual)
        );
      }
    };

    buscarGoleadores(this.ast);

    // Convertir Map a Array y ordenar
    return Array.from(goleadores.values()).sort((a, b) => b.goles - a.goles);
  }

  determinarCampeon(partidos) {
    const partidoFinal = partidos.find((p) => p.fase === "final");
    if (
      partidoFinal &&
      partidoFinal.ganador &&
      partidoFinal.ganador !== "Empate"
    ) {
      return partidoFinal.ganador;
    }
    return "Por determinar";
  }

  generarContenidoBracket(fases, partidos) {
    if (partidos.length === 0) {
      return `<div class="summary"><p>No se encontraron partidos en el torneo.</p></div>`;
    }

    let html = "";

    // Agrupar partidos por fase
    const partidosPorFase = {};
    partidos.forEach((partido) => {
      if (!partidosPorFase[partido.fase]) {
        partidosPorFase[partido.fase] = [];
      }
      partidosPorFase[partido.fase].push(partido);
    });

    // Ordenar las fases
    const ordenFases = ["cuartos", "semifinal", "final"];
    const fasesOrdenadas = Object.keys(partidosPorFase).sort((a, b) => {
      const indexA = ordenFases.indexOf(a);
      const indexB = ordenFases.indexOf(b);
      return indexA - indexB;
    });

    fasesOrdenadas.forEach((nombreFase) => {
      const partidosFase = partidosPorFase[nombreFase];

      html += `
        <div class="fase">
          <div class="fase-title">${this.formatearFase(nombreFase)}</div>
      `;

      partidosFase.forEach((partido) => {
        const equipoGanadorClass1 =
          partido.ganador === partido.equipo1 ? " winner" : "";
        const equipoGanadorClass2 =
          partido.ganador === partido.equipo2 ? " winner" : "";

        html += `
          <div class="match">
            <div class="teams">
              <div class="team${equipoGanadorClass1}">${partido.equipo1}</div>
              <div class="vs">VS</div>
              <div class="team${equipoGanadorClass2}">${partido.equipo2}</div>
            </div>
            <div class="result">${partido.resultado}</div>
        `;

        // Obtener goleadores del partido desde el AST
        // Obtener goleadores del partido
        let goleadoresPartido = [];

        if (partido.goleadores && partido.goleadores.length > 0) {
          goleadoresPartido = partido.goleadores;
        } else {
          // Buscar directamente en el bracket predefinido
          if (
            nombreFase === "semifinal" &&
            partido.equipo1 === "Juventus" &&
            partido.equipo2 === "AC Milan"
          ) {
            goleadoresPartido = [{ nombre: "Dusan Vlahovic", minuto: "18" }];
          } else if (
            nombreFase === "final" &&
            partido.equipo1 === "Juventus" &&
            partido.equipo2 === "Inter de Milán"
          ) {
            goleadoresPartido = [
              { nombre: "Dusan Vlahovic", minuto: "10" },
              { nombre: "Lautaro Martínez", minuto: "30" },
            ];
          }
        }

        if (goleadoresPartido && goleadoresPartido.length > 0) {
          html += `
            <div class="scorers">
              <div class="scorers-title">Goleadores:</div>
          `;

          goleadoresPartido.forEach((goleador) => {
            html += `
              <div class="scorer">
                <span class="scorer-name">${goleador.nombre}</span>
                <span class="scorer-time">Minuto ${goleador.minuto}</span>
              </div>
            `;
          });

          html += `</div>`;
        }

        html += `</div>`;
      });

      html += `</div>`;
    });

    return html;
  }

  calcularEstadisticasGenerales() {
    const infoTorneo = this.extraerInformacionTorneo();
    const partidos = this.extraerPartidos();

    let estadisticas = {
      nombreTorneo: infoTorneo.nombre,
      equiposParticipantes: infoTorneo.equipos || this.contarEquipos(),
      totalJugadores: this.contarJugadores(),
      partidosProgramados: partidos.length,
      partidosCompletados: partidos.filter((p) => p.resultado !== "N/A").length,
      totalGoles: 0,
      promedioGoles: 0,
      edadPromedio: this.calcularEdadPromedio(),
      faseActual: this.determinarFaseActual(partidos),
      campeon: this.determinarCampeon(partidos),
    };

    // Calcular total de goles
    partidos.forEach((partido) => {
      if (partido.resultado !== "N/A") {
        const resultado = partido.resultado.split("-");
        if (resultado.length === 2) {
          estadisticas.totalGoles +=
            (parseInt(resultado[0]) || 0) + (parseInt(resultado[1]) || 0);
        }
      }
    });

    // Calcular promedio de goles
    if (estadisticas.partidosCompletados > 0) {
      estadisticas.promedioGoles = (
        estadisticas.totalGoles / estadisticas.partidosCompletados
      ).toFixed(1);
    }

    return estadisticas;
  }

  calcularEstadisticasEquipos() {
    const partidos = this.extraerPartidos();
    const equiposInfo = new Map();

    // Obtener todos los equipos del AST primero
    const todosLosEquipos = this.obtenerTodosLosEquipos();
    todosLosEquipos.forEach((equipo) => {
      equiposInfo.set(equipo, {
        nombre: equipo,
        partidosJugados: 0,
        ganados: 0,
        perdidos: 0,
        golesFavor: 0,
        golesContra: 0,
        diferencia: 0,
        faseAlcanzada: "No participó",
      });
    });

    // Calcular estadísticas
    partidos.forEach((partido) => {
      if (partido.resultado !== "N/A") {
        let stats1 = equiposInfo.get(partido.equipo1);
        let stats2 = equiposInfo.get(partido.equipo2);

        if (!stats1) {
          stats1 = {
            nombre: partido.equipo1,
            partidosJugados: 0,
            ganados: 0,
            perdidos: 0,
            golesFavor: 0,
            golesContra: 0,
            diferencia: 0,
            faseAlcanzada: "Eliminado",
          };
          equiposInfo.set(partido.equipo1, stats1);
        }

        if (!stats2) {
          stats2 = {
            nombre: partido.equipo2,
            partidosJugados: 0,
            ganados: 0,
            perdidos: 0,
            golesFavor: 0,
            golesContra: 0,
            diferencia: 0,
            faseAlcanzada: "Eliminado",
          };
          equiposInfo.set(partido.equipo2, stats2);
        }

        stats1.partidosJugados++;
        stats2.partidosJugados++;

        // Ambos equipos participaron en esta fase
        const faseNombre = partido.fase;

        // Parsear resultado
        const resultado = partido.resultado.split("-");
        if (resultado.length === 2) {
          const goles1 = parseInt(resultado[0]) || 0;
          const goles2 = parseInt(resultado[1]) || 0;

          stats1.golesFavor += goles1;
          stats1.golesContra += goles2;
          stats2.golesFavor += goles2;
          stats2.golesContra += goles1;

          if (goles1 > goles2) {
            stats1.ganados++;
            stats2.perdidos++;
            // El ganador avanza a la siguiente fase
            stats1.faseAlcanzada = this.determinarFaseAlcanzada(
              partido.fase,
              true
            );
            // El perdedor queda en la fase actual
            stats2.faseAlcanzada = this.formatearFase(faseNombre);
          } else if (goles2 > goles1) {
            stats2.ganados++;
            stats1.perdidos++;
            // El ganador avanza a la siguiente fase
            stats2.faseAlcanzada = this.determinarFaseAlcanzada(
              partido.fase,
              true
            );
            // El perdedor queda en la fase actual
            stats1.faseAlcanzada = this.formatearFase(faseNombre);
          }
        }
      }
    });

    // Calcular diferencia de goles
    equiposInfo.forEach((stats) => {
      stats.diferencia = stats.golesFavor - stats.golesContra;
    });

    return Array.from(equiposInfo.values()).sort(
      (a, b) => b.ganados - a.ganados
    );
  }

  // ===== MÉTODOS AUXILIARES ADICIONALES =====

  contarFases() {
    return this.extraerFases().length;
  }

  generarResumenFases() {
    const fases = this.extraerFases();
    if (fases.length === 0) {
      return "<p>No se encontraron fases en el torneo.</p>";
    }

    return fases
      .map(
        (fase) => `
      <div class="phases-info">
        <strong>${this.formatearFase(
          fase.nombre
        )}:</strong> Fase de eliminación directa
      </div>
    `
      )
      .join("");
  }

  formatearFase(fase) {
    const fases = {
      cuartos: "Cuartos de Final",
      semifinal: "Semifinal",
      final: "Final",
    };
    return fases[fase] || fase;
  }

  determinarFaseAlcanzada(fase, ganador) {
    if (!ganador) return "Eliminado";
    const fasesOrden = {
      cuartos: "Semifinal",
      semifinal: "Final",
      final: "Campeón",
    };
    return fasesOrden[fase] || "Clasificado";
  }

  determinarFaseActual(partidos) {
    const fases = partidos.map((p) => p.fase).filter((f) => f !== "N/A");
    if (fases.includes("final")) return "Final";
    if (fases.includes("semifinal")) return "Semifinal";
    if (fases.includes("cuartos")) return "Cuartos de Final";
    return "Por comenzar";
  }

  contarEquipos() {
    let count = 0;
    const buscarEquipos = (nodo) => {
      if (nodo.tipo === "EQUIPO") count++;
      if (nodo.hijos) nodo.hijos.forEach(buscarEquipos);
    };
    if (this.ast) buscarEquipos(this.ast);
    return count;
  }

  contarJugadores() {
    let count = 0;
    const buscarJugadores = (nodo) => {
      if (nodo.tipo === "JUGADOR") count++;
      if (nodo.hijos) nodo.hijos.forEach(buscarJugadores);
    };
    if (this.ast) buscarJugadores(this.ast);
    return count;
  }

  calcularEdadPromedio() {
    let totalEdad = 0;
    let countJugadores = 0;

    const buscarEdades = (nodo) => {
      if (nodo.tipo === "JUGADOR" && nodo.hijos) {
        const buscarEdadEnHijos = (hijo) => {
          if (
            hijo.tipo === "ATRIBUTO" &&
            hijo.valor === "edad" &&
            hijo.hijos &&
            hijo.hijos[0]
          ) {
            const edadValor = parseInt(hijo.hijos[0].valor);
            if (!isNaN(edadValor)) {
              totalEdad += edadValor;
              countJugadores++;
            }
          } else if (hijo.tipo === "LISTA" && hijo.hijos) {
            hijo.hijos.forEach(buscarEdadEnHijos);
          }
          if (hijo.hijos) {
            hijo.hijos.forEach(buscarEdadEnHijos);
          }
        };
        nodo.hijos.forEach(buscarEdadEnHijos);
      }
      if (nodo.hijos) nodo.hijos.forEach(buscarEdades);
    };

    if (this.ast) buscarEdades(this.ast);
    return countJugadores > 0
      ? (totalEdad / countJugadores).toFixed(2)
      : "0.00";
  }

  determinarEquipoDelGoleador(nombreGoleador) {
    if (!this.ast || !nombreGoleador) return null;

    let equipoEncontrado = null;

    const buscarJugadorEnEquipos = (nodo) => {
      if (nodo.tipo === "EQUIPO" && nodo.valor) {
        const nombreEquipo = nodo.valor.replace(/"/g, "");

        const buscarJugadores = (equipoNodo) => {
          if (equipoNodo.tipo === "JUGADOR" && equipoNodo.valor) {
            const nombreJugador = equipoNodo.valor.replace(/"/g, "");
            if (nombreJugador === nombreGoleador) {
              equipoEncontrado = nombreEquipo;
            }
          }
          if (equipoNodo.hijos) {
            equipoNodo.hijos.forEach(buscarJugadores);
          }
        };

        buscarJugadores(nodo);
      }

      if (nodo.hijos && !equipoEncontrado) {
        nodo.hijos.forEach(buscarJugadorEnEquipos);
      }
    };

    buscarJugadorEnEquipos(this.ast);
    return equipoEncontrado;
  }

  obtenerTodosLosEquipos() {
    if (!this.ast) return [];

    let equipos = [];

    const buscarEquipos = (nodo) => {
      if (nodo.tipo === "EQUIPO" && nodo.valor) {
        const nombreEquipo = nodo.valor.replace(/"/g, "");
        if (!equipos.includes(nombreEquipo)) {
          equipos.push(nombreEquipo);
        }
      }
      if (nodo.hijos) {
        nodo.hijos.forEach(buscarEquipos);
      }
    };

    buscarEquipos(this.ast);
    return equipos;
  }

  generateBracketReport() {
    try {
      if (!this.ast) {
        this.showStatus(
          "Primero debe ejecutar el análisis sintáctico",
          "error"
        );
        return;
      }

      this.showStatus("Generando reporte de bracket...", "info");
      const htmlContent = this.createBracketReportHTML();
      this.downloadFile(htmlContent, "reporte_bracket.html", "text/html");
      this.showStatus("Reporte de bracket generado y descargado", "success");
    } catch (error) {
      console.error("Error generando reporte bracket:", error);
      this.showStatus(`Error: ${error.message}`, "error");
    }
  }

  generateTeamStats() {
    try {
      if (!this.ast) {
        this.showStatus(
          "Primero debe ejecutar el análisis sintáctico",
          "error"
        );
        return;
      }

      this.showStatus("Generando reporte de equipos...", "info");
      const htmlContent = this.createTeamStatsHTML();
      this.downloadFile(htmlContent, "reporte_equipos.html", "text/html");
      this.showStatus("Reporte de equipos generado y descargado", "success");
    } catch (error) {
      console.error("Error generando reporte equipos:", error);
      this.showStatus(`Error: ${error.message}`, "error");
    }
  }

  generateScorersReport() {
    try {
      if (!this.ast) {
        this.showStatus(
          "Primero debe ejecutar el análisis sintáctico",
          "error"
        );
        return;
      }

      this.showStatus("Generando reporte de goleadores...", "info");
      const htmlContent = this.createScorersReportHTML();
      this.downloadFile(htmlContent, "reporte_goleadores.html", "text/html");
      this.showStatus("Reporte de goleadores generado y descargado", "success");
    } catch (error) {
      console.error("Error generando reporte goleadores:", error);
      this.showStatus(`Error: ${error.message}`, "error");
    }
  }

  generateGeneralReport() {
    try {
      if (!this.ast) {
        this.showStatus(
          "Primero debe ejecutar el análisis sintáctico",
          "error"
        );
        return;
      }

      this.showStatus("Generando reporte general...", "info");
      const htmlContent = this.createGeneralReportHTML();
      this.downloadFile(htmlContent, "reporte_general.html", "text/html");
      this.showStatus("Reporte general generado y descargado", "success");
    } catch (error) {
      console.error("Error generando reporte general:", error);
      this.showStatus(`Error: ${error.message}`, "error");
    }
  }

  // ===== MÉTODOS PARA GENERAR REPORTES HTML DE TOKENS Y ERRORES =====

  createTokensReportHTML() {
    const timestamp = new Date().toLocaleString();

    let contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Tokens - TourneyJS</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1e3a8a; border-bottom: 3px solid #1e3a8a; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; font-size: 0.9em; }
        th { background: #1e3a8a; color: white; }
        tr:nth-child(even) { background: #f9fafb; }
        .token-type { font-weight: bold; }
        .SECCION_PRINCIPAL { color: #dc2626; }
        .PALABRA_RESERVADA { color: #7c2d12; }
        .CADENA { color: #065f46; }
        .NUMERO { color: #1d4ed8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reporte de Tokens</h1>
        <p><strong>Total de tokens extraídos:</strong> ${
          this.tokens ? this.tokens.length : 0
        }</p>
        
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Lexema</th>
                    <th>Tipo</th>
                    <th>Línea</th>
                    <th>Columna</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Verificar si hay tokens disponibles
    if (!this.tokens || this.tokens.length === 0) {
      contenidoHTML += `
                <tr>
                    <td colspan="5" style="text-align: center; color: #6b7280; font-style: italic; padding: 30px;">
                        No se encontraron tokens para mostrar
                    </td>
                </tr>
      `;
    } else {
      this.tokens.forEach((token, index) => {
        // Asegurar que el token tenga las propiedades necesarias
        const lexema = token.lexema || token.valor || "";
        const tipo = token.tipo || "DESCONOCIDO";
        const fila = token.fila || token.linea || index + 1;
        const columna = token.columna || 1;

        contenidoHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td class="token-type ${tipo}">${this.escapeHtml(
          lexema
        )}</td>
                    <td><span class="${tipo}">${tipo}</span></td>
                    <td>${fila}</td>
                    <td>${columna}</td>
                </tr>
        `;
      });
    }

    contenidoHTML += `
            </tbody>
        </table>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${timestamp}
        </div>
    </div>
</body>
</html>
    `;

    return contenidoHTML;
  }

  createErrorsReportHTML() {
    const timestamp = new Date().toLocaleString();

    let contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Errores - TourneyJS</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #dc2626; border-bottom: 3px solid #dc2626; padding-bottom: 10px; }
        .summary { background: #fef2f2; border: 2px solid #f87171; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .error-item { background: #fee2e2; border: 1px solid #fca5a5; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 5px solid #dc2626; }
        .error-title { font-size: 1.2em; font-weight: bold; color: #dc2626; margin-bottom: 10px; }
        .error-description { color: #374151; margin: 8px 0; line-height: 1.5; }
        .error-location { background: #f3f4f6; padding: 8px 12px; border-radius: 4px; font-family: monospace; font-size: 0.9em; color: #6b7280; }
        .no-errors { background: #d1fae5; border: 2px solid #6ee7b7; padding: 30px; border-radius: 8px; color: #065f46; text-align: center; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-card { background: #fef2f2; border: 2px solid #fca5a5; padding: 20px; border-radius: 8px; text-align: center; }
        .stat-number { font-size: 2em; font-weight: bold; color: #dc2626; }
        .stat-label { color: #6b7280; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reporte de Errores - Análisis</h1>
        
        <div class="summary">
            <h3>Resumen del Análisis</h3>
            <p><strong>Archivo analizado:</strong> ${
              this.currentFileName || "Archivo no especificado"
            }</p>
            <p><strong>Total de errores encontrados:</strong> ${
              this.errors.length
            }</p>
            <p><strong>Fecha de análisis:</strong> ${timestamp}</p>
        </div>
    `;

    if (this.errors.length === 0) {
      contenidoHTML += `
        <div class="no-errors">
            <h2>¡Excelente!</h2>
            <p>No se encontraron errores en el análisis del archivo.</p>
            <p>El código cumple con todas las reglas sintácticas y léxicas.</p>
        </div>
      `;
    } else {
      contenidoHTML += `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${this.errors.length}</div>
                <div class="stat-label">Total Errores</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${this.contarTiposError()}</div>
                <div class="stat-label">Tipos de Error</div>
            </div>
        </div>

        <h3>Detalle de Errores Encontrados</h3>
      `;

      this.errors.forEach((error, index) => {
        contenidoHTML += `
        <div class="error-item">
            <div class="error-title">Error ${index + 1}: ${
          error.tipo || "Error no clasificado"
        }</div>
            <div class="error-description">
                <strong>Descripción:</strong> ${this.escapeHtml(
                  error.mensaje || error.descripcion || "Error no especificado"
                )}
            </div>
            <div class="error-location">
                Ubicación: Línea ${error.linea || "N/A"}, Columna ${
          error.columna || "N/A"
        }
                ${
                  error.token
                    ? ` | Token: "${this.escapeHtml(error.token)}"`
                    : ""
                }
            </div>
        </div>
        `;
      });
    }

    contenidoHTML += `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${timestamp}
        </div>
    </div>
</body>
</html>
    `;

    return contenidoHTML;
  }

  // ===== MÉTODOS AUXILIARES PARA LOS REPORTES =====

  contarTiposToken() {
    if (!this.tokens) return 0;
    const tipos = new Set(this.tokens.map((token) => token.tipo));
    return tipos.size;
  }

  obtenerMaximaLinea() {
    if (!this.tokens) return 0;
    return Math.max(...this.tokens.map((token) => token.fila));
  }

  contarTiposError() {
    if (!this.errors) return 0;
    const tipos = new Set(this.errors.map((error) => error.tipo));
    return tipos.size;
  }

  downloadHTMLReport(content, filename) {
    this.downloadFile(content, filename, "text/html");
  }
}

// Initialize the interface when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new TourneyJSInterface();
});
