const fs = require("fs");
const path = require("path");
const readline = require("readline");
const Lexer = require("./logic/lexer");
const Parser = require("./logic/parser");
const HtmlReporter = require("./services/HtmlReporter");
const GraphvizGenerator = require("./services/GraphvizGenerator");

/**
 * Analizador TourneyJS
 * Analisis lexico y sintactico para archivos de torneos deportivos
 */
class AnalizadorTourneyJS {
  constructor() {
    this.tokens = [];
    this.errores = [];
    this.arbolSintactico = null;
    this.archivoActual = null;
    this.contenidoArchivo = "";
    this.lexer = null;
    this.parser = null;
    this.htmlReporter = new HtmlReporter();
    this.graphvizGenerator = new GraphvizGenerator();
  }

  mostrarMenu() {
    console.log("\n=== ANALIZADOR TOURNEYJS ===");
    console.log("1. Cargar archivo .txt");
    console.log("4. Analisis completo (Lexer + Parser)");
    console.log("5. Mostrar Arbol Sintactico (imprimir en consola)");
    console.log("6. Exportar Arbol Sintactico a JSON (src/output/ast.json)");
    console.log("17. Generar todos los reportes");
    console.log("0. Salir");
    console.log("================================");
  }

  obtenerOpcion(callback) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Seleccione una opcion (0, 1, 4, 17): ", (respuesta) => {
      rl.close();
      callback(parseInt(respuesta));
    });
  }

  reiniciarAnalisis() {
    this.tokens = [];
    this.errores = [];
    this.arbolSintactico = null;
    this.lexer = null;
    this.parser = null;
  }

  listarArchivosEntrada() {
    const inputDir = path.join(__dirname, "input");
    try {
      const archivos = fs
        .readdirSync(inputDir)
        .filter(
          (archivo) => archivo.endsWith(".tourney") || archivo.endsWith(".txt")
        );

      if (archivos.length === 0) {
        console.log("No hay archivos .tourney en la carpeta input/");
        return [];
      }

      console.log("\nArchivos TourneyJS disponibles:");
      archivos.forEach((archivo, index) => {
        console.log(`${index + 1}. ${archivo}`);
      });
      return archivos;
    } catch (error) {
      console.log("Error al leer la carpeta input:", error.message);
      return [];
    }
  }

  cargarArchivo() {
    const archivos = this.listarArchivosEntrada();
    if (archivos.length === 0) {
      console.log(
        "Coloque archivos .txt en la carpeta input/ para analizarlos."
      );
      return;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Ingrese el número del archivo a cargar: ", (respuesta) => {
      rl.close();
      const indice = parseInt(respuesta) - 1;

      if (indice >= 0 && indice < archivos.length) {
        const nombreArchivo = archivos[indice];
        const rutaArchivo = path.join(__dirname, "input", nombreArchivo);

        try {
          this.contenidoArchivo = fs.readFileSync(rutaArchivo, "utf8");
          this.archivoActual = nombreArchivo;
          console.log(`Archivo '${nombreArchivo}' cargado exitosamente.`);
          console.log(`Tamaño: ${this.contenidoArchivo.length} caracteres`);

          this.reiniciarAnalisis();

          this.continuarMenu();
        } catch (error) {
          console.log("Error al leer el archivo:", error.message);
          this.continuarMenu();
        }
      } else {
        console.log("Opción no válida.");
        this.continuarMenu();
      }
    });
  }

  ejecutarLexer() {
    if (!this.contenidoArchivo) {
      console.log("Primero debe cargar un archivo.");
      this.continuarMenu();
      return;
    }

    console.log("\n=== EJECUTANDO ANALISIS LEXICO ===");

    try {
      this.lexer = new Lexer(this.contenidoArchivo);
      this.tokens = this.lexer.tokenizar();
      this.errores = [...this.lexer.errores];

      console.log(`Analisis lexico completado.`);
      console.log(`Tokens encontrados: ${this.tokens.length}`);
      console.log(`Errores lexicos: ${this.lexer.errores.length}`);

      if (this.lexer.errores.length > 0) {
        console.log(
          "Se encontraron errores lexicos. Use la opcion 7 para verlos."
        );
      }
    } catch (error) {
      console.log("Error durante el analisis lexico:", error.message);
    }

    this.continuarMenu();
  }

  ejecutarParser() {
    if (!this.tokens || this.tokens.length === 0) {
      console.log("Primero debe ejecutar el analisis lexico.");
      this.continuarMenu();
      return;
    }

    console.log("\n=== EJECUTANDO ANALISIS SINTACTICO ===");

    try {
      this.parser = new Parser(this.tokens);
      const resultado = this.parser.parsePublic();

      this.arbolSintactico = resultado.arbol;
      this.errores = [...this.errores, ...this.parser.errores];

      console.log(`Analisis sintactico completado.`);
      console.log(`Errores sintacticos: ${this.parser.errores.length}`);
      console.log(`Analisis exitoso: ${resultado.exito ? "Si" : "No"}`);

      if (this.parser.errores.length > 0) {
        console.log(
          "Se encontraron errores sintacticos. Use la opcion 7 para verlos."
        );
      }

      if (this.arbolSintactico) {
        console.log("Arbol sintactico generado exitosamente.");
      }
    } catch (error) {
      console.log("Error durante el analisis sintactico:", error.message);
    }

    this.continuarMenu();
  }

  analisisCompleto() {
    if (!this.contenidoArchivo) {
      console.log("Primero debe cargar un archivo.");
      this.continuarMenu();
      return;
    }

    console.log("\n=== EJECUTANDO ANALISIS COMPLETO ===");

    // Ejecutar lexer
    try {
      this.lexer = new Lexer(this.contenidoArchivo);
      this.tokens = this.lexer.tokenizar();
      console.log(`Analisis lexico: ${this.tokens.length} tokens`);
    } catch (error) {
      console.log("Error en analisis lexico:", error.message);
      this.continuarMenu();
      return;
    }

    // Ejecutar parser
    try {
      this.parser = new Parser(this.tokens);
      const resultado = this.parser.parsePublic();
      this.arbolSintactico = resultado.arbol;
      this.errores = [...this.lexer.errores, ...this.parser.errores];

      console.log(
        `Analisis sintactico: ${resultado.exito ? "exitoso" : "con errores"}`
      );
    } catch (error) {
      console.log("Error en analisis sintactico:", error.message);
    }

    console.log("\n=== RESUMEN DEL ANALISIS ===");
    console.log(`Archivo: ${this.archivoActual}`);
    console.log(`Tokens: ${this.tokens.length}`);
    console.log(`Errores totales: ${this.errores.length}`);

    this.continuarMenu();
  }

  mostrarTokens() {
    if (!this.tokens || this.tokens.length === 0) {
      console.log(
        "No hay tokens para mostrar. Ejecute primero el analisis lexico."
      );
      this.continuarMenu();
      return;
    }

    console.log("\n=== TOKENS GENERADOS ===");
    console.log(`Total de tokens: ${this.tokens.length}\n`);

    // Mostrar estadisticas por tipo usando console.table
    if (this.lexer) {
      const estadisticas = this.lexer.obtenerEstadisticas();
      console.log("Estadisticas por tipo:");
      console.table(estadisticas);
    }

    // Mostrar primeros tokens en formato tabla
    console.log("\nPrimeros tokens encontrados:");
    const tokensParaTabla = this.tokens.slice(0, 15).map((token, index) => ({
      "#": index + 1,
      Tipo: token.tipo,
      Valor:
        token.valor.length > 30
          ? token.valor.substring(0, 30) + "..."
          : token.valor,
      Linea: token.linea,
      Columna: token.columna,
    }));

    console.table(tokensParaTabla);

    if (this.tokens.length > 15) {
      console.log(`\n...y ${this.tokens.length - 15} tokens mas.`);
    }

    this.continuarMenu();
  }

  mostrarArbolSintactico() {
    if (!this.arbolSintactico) {
      console.log(
        "No hay arbol sintactico para mostrar. Ejecute primero el analisis sintactico."
      );
      this.continuarMenu();
      return;
    }

    console.log("\n=== ARBOL SINTACTICO ===");
    this.imprimirNodo(this.arbolSintactico, 0);

    if (this.parser) {
      const resumen = this.parser.obtenerResumenAnalisis();
      console.log("\n=== RESUMEN DEL ANALISIS ===");
      console.log(`Estado: ${resumen.resumen}`);
      console.log("\nEntidades encontradas:");
      console.table(resumen.detalles);
    }

    this.continuarMenu();
  }

  imprimirNodo(nodo, nivel) {
    const indentacion = "  ".repeat(nivel);
    const info = nodo.valor ? `${nodo.tipo}: "${nodo.valor}"` : nodo.tipo;
    console.log(`${indentacion}${info} (${nodo.linea}:${nodo.columna})`);

    if (nodo.hijos && nodo.hijos.length > 0) {
      nodo.hijos.forEach((hijo) => {
        this.imprimirNodo(hijo, nivel + 1);
      });
    }
  }

  mostrarErrores() {
    if (!this.errores || this.errores.length === 0) {
      console.log("No se encontraron errores.");
      this.continuarMenu();
      return;
    }

    console.log("\n=== ERRORES ENCONTRADOS ===");
    console.log(`Total de errores: ${this.errores.length}\n`);

    // Mostrar errores en formato tabla
    const erroresParaTabla = this.errores.map((error, index) => ({
      "#": index + 1,
      Linea: error.linea,
      Columna: error.columna,
      Tipo: error.tipo,
      Mensaje:
        error.mensaje.length > 50
          ? error.mensaje.substring(0, 50) + "..."
          : error.mensaje,
    }));

    console.table(erroresParaTabla);

    this.continuarMenu();
  }

  mostrarEstadisticas() {
    if (!this.lexer && !this.parser) {
      console.log(
        "No hay estadisticas disponibles. Ejecute primero un analisis."
      );
      this.continuarMenu();
      return;
    }

    console.log("\n=== ESTADISTICAS DEL ANALISIS ===");

    // Mostrar informacion general del archivo
    const infoArchivo = {
      Archivo: this.archivoActual || "N/A",
      "Tamaño (caracteres)": this.contenidoArchivo.length,
      "Total de lineas": this.contenidoArchivo.split("\n").length,
    };
    console.table(infoArchivo);

    // Mostrar estadisticas lexicas en tabla
    if (this.lexer) {
      console.log("\nEstadisticas lexicas:");
      const statsLexer = this.lexer.obtenerEstadisticas();
      console.table(statsLexer);
    }

    // Mostrar estadisticas sintacticas en tabla
    if (this.parser) {
      console.log("\nEstadisticas sintacticas:");
      const statsParser = this.parser.obtenerEstadisticas();
      const sintacticasTabla = {
        "Total de tokens procesados": statsParser.totalTokens,
        "Errores encontrados": statsParser.errores,
        "Analisis exitoso": statsParser.analisisExitoso ? "Si" : "No",
        "Equipos encontrados": statsParser.equipos || 0,
        "Jugadores encontrados": statsParser.jugadores || 0,
        "Partidos encontrados": statsParser.partidos || 0,
      };
      console.table(sintacticasTabla);
    }

    this.continuarMenu();
  }

  mostrarContenidoArchivo() {
    if (!this.contenidoArchivo) {
      console.log("No hay archivo cargado.");
      this.continuarMenu();
      return;
    }

    console.log(`\n=== CONTENIDO DE ${this.archivoActual} ===`);
    const lineas = this.contenidoArchivo.split("\n");
    lineas.forEach((linea, index) => {
      console.log(`${(index + 1).toString().padStart(3, " ")}: ${linea}`);
    });
    console.log(`\nTotal de lineas: ${lineas.length}`);

    this.continuarMenu();
  }

  // ===== MÉTODOS DE REPORTES HTML =====

  generarReporteErroresHtml() {
    if (!this.lexer && !this.parser) {
      console.log("Primero debe ejecutar un analisis para generar errores.");
      this.continuarMenu();
      return;
    }

    console.log("\n=== GENERANDO REPORTE DE ERRORES LÉXICOS (HTML) ===");

    try {
      const rutaArchivo = this.htmlReporter.generarTablaErrores(this.errores);
      console.log(`Reporte generado exitosamente:`);
      console.log(`Archivo: ${rutaArchivo}`);
      console.log(`Total de errores: ${this.errores.length}`);
    } catch (error) {
      console.log("Error al generar reporte:", error.message);
    }

    this.continuarMenu();
  }

  generarReporteTokensHtml() {
    if (!this.tokens || this.tokens.length === 0) {
      console.log(
        "Primero debe ejecutar el analisis lexico para generar tokens."
      );
      this.continuarMenu();
      return;
    }

    console.log("\n=== GENERANDO REPORTE DE TOKENS EXTRAÍDOS (HTML) ===");

    try {
      const rutaArchivo = this.htmlReporter.generarTablaTokens(this.tokens);
      console.log(`Reporte generado exitosamente:`);
      console.log(`Archivo: ${rutaArchivo}`);
      console.log(`Total de tokens: ${this.tokens.length}`);
    } catch (error) {
      console.log("Error al generar reporte:", error.message);
    }

    this.continuarMenu();
  }

  generarReporteBracket() {
    if (!this.arbolSintactico) {
      console.log("Primero debe ejecutar el analisis sintactico completo.");
      this.continuarMenu();
      return;
    }

    console.log("\n=== GENERANDO REPORTE DE BRACKET DE ELIMINACIÓN (HTML) ===");

    try {
      const rutaArchivo = this.htmlReporter.generarReporteBracket(
        this.arbolSintactico
      );
      console.log(`Reporte generado exitosamente:`);
      console.log(`Archivo: ${rutaArchivo}`);
      console.log(`Bracket de eliminación completo`);
    } catch (error) {
      console.log("Error al generar reporte:", error.message);
    }

    this.continuarMenu();
  }

  generarReporteEstadisticasEquipos() {
    if (!this.arbolSintactico) {
      console.log("Primero debe ejecutar el analisis sintactico completo.");
      this.continuarMenu();
      return;
    }

    console.log(
      "\n=== GENERANDO REPORTE DE ESTADÍSTICAS POR EQUIPO (HTML) ==="
    );

    try {
      const rutaArchivo = this.htmlReporter.generarReporteEstadisticasEquipos(
        this.arbolSintactico
      );
      console.log(`Reporte generado exitosamente:`);
      console.log(`Archivo: ${rutaArchivo}`);
      console.log(`Estadísticas detalladas por equipo`);
    } catch (error) {
      console.log("Error al generar reporte:", error.message);
    }

    this.continuarMenu();
  }

  generarReporteGoleadores() {
    if (!this.arbolSintactico) {
      console.log("Primero debe ejecutar el analisis sintactico completo.");
      this.continuarMenu();
      return;
    }

    console.log("\n=== GENERANDO REPORTE DE GOLEADORES (HTML) ===");

    try {
      const rutaArchivo = this.htmlReporter.generarReporteGoleadores(
        this.arbolSintactico
      );
      console.log(`Reporte generado exitosamente:`);
      console.log(`Archivo: ${rutaArchivo}`);
      console.log(`Ranking de goleadores completo`);
    } catch (error) {
      console.log("Error al generar reporte:", error.message);
    }

    this.continuarMenu();
  }

  generarReporteInformacionGeneral() {
    if (!this.arbolSintactico) {
      console.log("Primero debe ejecutar el analisis sintactico completo.");
      this.continuarMenu();
      return;
    }

    console.log("\n=== GENERANDO REPORTE DE INFORMACIÓN GENERAL (HTML) ===");

    try {
      const rutaArchivo = this.htmlReporter.generarReporteInformacionGeneral(
        this.arbolSintactico
      );
      console.log(`Reporte generado exitosamente:`);
      console.log(`Archivo: ${rutaArchivo}`);
      console.log(`Información general del torneo`);
    } catch (error) {
      console.log("Error al generar reporte:", error.message);
    }

    this.continuarMenu();
  }

  generarDiagramaGraphviz() {
    if (!this.arbolSintactico) {
      console.log("Primero debe ejecutar el analisis sintactico completo.");
      this.continuarMenu();
      return;
    }

    console.log("\n=== GENERANDO DIAGRAMA GRAPHVIZ DEL TORNEO ===");

    try {
      const rutaArchivo = this.graphvizGenerator.generarDiagramaTorneo(
        this.arbolSintactico
      );
      console.log(`Diagrama generado exitosamente:`);
      console.log(`Archivo: ${rutaArchivo}`);
      console.log(`Archivo DOT para Graphviz`);
      console.log(`Visualizador HTML también creado`);
      console.log("\nPara ver el diagrama:");
      console.log("1. Visite: https://dreampuf.github.io/GraphvizOnline/");
      console.log("2. Copie el contenido del archivo .dot");
      console.log("3. Pegue en el editor online y genere");
    } catch (error) {
      console.log("Error al generar diagrama:", error.message);
    }

    this.continuarMenu();
  }

  generarTodosLosReportes() {
    if (!this.lexer || !this.tokens || this.tokens.length === 0) {
      console.log("Primero debe ejecutar el analisis completo.");
      this.continuarMenu();
      return;
    }

    console.log("\n=== GENERANDO TODOS LOS REPORTES ===");

    try {
      console.log("Generando reporte de errores léxicos...");
      this.htmlReporter.generarTablaErrores(this.errores);

      console.log("Generando reporte de tokens extraídos...");
      this.htmlReporter.generarTablaTokens(this.tokens);

      if (this.arbolSintactico) {
        console.log("Generando reporte de bracket de eliminación...");
        this.htmlReporter.generarReporteBracket(this.arbolSintactico);

        console.log("Generando reporte de estadísticas por equipo...");
        this.htmlReporter.generarReporteEstadisticasEquipos(
          this.arbolSintactico
        );

        console.log("Generando reporte de goleadores...");
        this.htmlReporter.generarReporteGoleadores(this.arbolSintactico);

        console.log("Generando reporte de información general...");
        this.htmlReporter.generarReporteInformacionGeneral(
          this.arbolSintactico
        );

        console.log("Generando diagrama Graphviz...");
        this.graphvizGenerator.generarDiagramaTorneo(this.arbolSintactico);
      }

      console.log("\nTodos los reportes generados exitosamente");
      console.log(`Ubicación: ${this.htmlReporter.getOutputDirectory()}`);
      console.log("\nReportes generados:");
      console.log("- Errores léxicos (HTML)");
      console.log("- Tokens extraídos (HTML)");
      if (this.arbolSintactico) {
        console.log("- Bracket de eliminación (HTML)");
        console.log("- Estadísticas por equipo (HTML)");
        console.log("- Ranking de goleadores (HTML)");
        console.log("- Información general (HTML)");
        console.log("- Diagrama Graphviz (DOT + HTML)");
      }
    } catch (error) {
      console.log("Error al generar reportes:", error.message);
    }

    this.continuarMenu();
  }

  continuarMenu() {
    console.log("\nPresione Enter para continuar...");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question("", () => {
      rl.close();
      this.ejecutar();
    });
  }

  ejecutar() {
    this.mostrarMenu();
    this.obtenerOpcion((opcion) => {
      switch (opcion) {
        case 1:
          this.cargarArchivo();
          break;
        case 4:
          this.analisisCompleto();
          break;
        case 5:
          this.mostrarArbolSintactico();
          break;
        case 6:
          this.exportarArbolJson();
          break;
        case 17:
          this.generarTodosLosReportes();
          break;
        case 0:
          console.log("Hasta luego!");
          process.exit(0);
          break;
        default:
          console.log(
            "Opcion no valida. Solo se permiten opciones 0, 1, 4 y 17."
          );
          this.continuarMenu();
      }
    });
  }

  // Exportar el AST a un archivo JSON en la carpeta output/
  exportarArbolJson() {
    if (!this.arbolSintactico) {
      console.log(
        "No hay arbol sintactico para exportar. Ejecute primero el analisis sintactico."
      );
      this.continuarMenu();
      return;
    }

    try {
      const outputDir = path.join(__dirname, "output");
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const rutaSalida = path.join(outputDir, "ast.json");
      fs.writeFileSync(rutaSalida, JSON.stringify(this.arbolSintactico, null, 2), "utf8");
      console.log("AST exportado exitosamente:");
      console.log(`Archivo: ${rutaSalida}`);
    } catch (error) {
      console.log("Error al exportar AST:", error.message);
    }

    this.continuarMenu();
  }
}

// Inicializar y ejecutar
console.log("Bienvenido al Analizador TourneyJS");
console.log("Version simplificada para analisis lexico y sintactico");

const analizador = new AnalizadorTourneyJS();
analizador.ejecutar();
