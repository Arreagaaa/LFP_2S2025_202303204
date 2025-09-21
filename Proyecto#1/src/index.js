const fs = require("fs");
const path = require("path");
const readline = require("readline");
const Lexer = require("./logic/lexer");
const Parser = require("./logic/parser");

/**
 * Analizador optimizado de TourneyJS
 * Enfocado en análisis léxico y sintáctico sin componentes gráficos
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
  }

  mostrarMenu() {
    console.log("\n=== ANALIZADOR TOURNEYJS - OPTIMIZADO ===");
    console.log("1. Cargar archivo .tourney");
    console.log("2. Ejecutar análisis léxico (Lexer)");
    console.log("3. Ejecutar análisis sintáctico (Parser)");
    console.log("4. Análisis completo (Lexer + Parser)");
    console.log("5. Mostrar tokens generados");
    console.log("6. Mostrar árbol sintáctico");
    console.log("7. Mostrar errores encontrados");
    console.log("8. Mostrar estadísticas del análisis");
    console.log("9. Mostrar contenido del archivo actual");
    console.log("0. Salir");
    console.log("==========================================");
  }

  async obtenerOpcion() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question("Seleccione una opción (0-9): ", (respuesta) => {
        rl.close();
        resolve(parseInt(respuesta));
      });
    });
  }

  /**
   * Lista archivos .tourney disponibles en la carpeta input
   */
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

  /**
   * Carga un archivo de torneo para análisis
   */
  async cargarArchivo() {
    const archivos = this.listarArchivosEntrada();
    if (archivos.length === 0) {
      console.log(
        "Coloque archivos .tourney en la carpeta input/ para analizarlos."
      );
      return false;
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question("Ingrese el número del archivo a cargar: ", (respuesta) => {
        rl.close();
        const indice = parseInt(respuesta) - 1;

        if (indice >= 0 && indice < archivos.length) {
          const nombreArchivo = archivos[indice];
          const rutaArchivo = path.join(__dirname, "input", nombreArchivo);

          try {
            this.contenidoArchivo = fs.readFileSync(rutaArchivo, "utf8");
            this.archivoActual = nombreArchivo;
            console.log(`✓ Archivo '${nombreArchivo}' cargado exitosamente.`);
            console.log(`  Tamaño: ${this.contenidoArchivo.length} caracteres`);

            // Reiniciar análisis previos
            this.tokens = [];
            this.errores = [];
            this.arbolSintactico = null;
            this.lexer = null;
            this.parser = null;

            resolve(true);
          } catch (error) {
            console.log("Error al leer el archivo:", error.message);
            resolve(false);
          }
        } else {
          console.log("Opción no válida.");
          resolve(false);
        }
      });
    });
  }

  /**
   * Ejecuta solo el análisis léxico
   */
  ejecutarLexer() {
    if (!this.contenidoArchivo) {
      console.log("⚠️  Primero debe cargar un archivo.");
      return false;
    }

    console.log("\n=== EJECUTANDO ANÁLISIS LÉXICO ===");

    try {
      this.lexer = new Lexer(this.contenidoArchivo);
      this.tokens = this.lexer.tokenizar();
      this.errores = [...this.lexer.errores];

      console.log(`✓ Análisis léxico completado.`);
      console.log(`  Tokens encontrados: ${this.tokens.length}`);
      console.log(`  Errores léxicos: ${this.lexer.errores.length}`);

      if (this.lexer.errores.length > 0) {
        console.log(
          "⚠️  Se encontraron errores léxicos. Use la opción 7 para verlos."
        );
      }

      return true;
    } catch (error) {
      console.log("Error durante el análisis léxico:", error.message);
      return false;
    }
  }

  /**
   * Ejecuta solo el análisis sintáctico
   */
  ejecutarParser() {
    if (!this.tokens || this.tokens.length === 0) {
      console.log("⚠️  Primero debe ejecutar el análisis léxico.");
      return false;
    }

    console.log("\n=== EJECUTANDO ANÁLISIS SINTÁCTICO ===");

    try {
      this.parser = new Parser(this.tokens);
      this.arbolSintactico = this.parser.analizarTorneo();
      this.errores = [...this.errores, ...this.parser.errores];

      console.log(`✓ Análisis sintáctico completado.`);
      console.log(`  Errores sintácticos: ${this.parser.errores.length}`);

      if (this.parser.errores.length > 0) {
        console.log(
          "⚠️  Se encontraron errores sintácticos. Use la opción 7 para verlos."
        );
      }

      if (this.arbolSintactico) {
        console.log("✓ Árbol sintáctico generado exitosamente.");
      }

      return true;
    } catch (error) {
      console.log("Error durante el análisis sintáctico:", error.message);
      return false;
    }
  }

  /**
   * Ejecuta análisis completo (léxico + sintáctico)
   */
  analisisCompleto() {
    if (!this.contenidoArchivo) {
      console.log("⚠️  Primero debe cargar un archivo.");
      return false;
    }

    console.log("\n=== EJECUTANDO ANÁLISIS COMPLETO ===");

    const lexerExitoso = this.ejecutarLexer();
    if (!lexerExitoso) {
      console.log("❌ El análisis léxico falló. No se puede continuar.");
      return false;
    }

    const parserExitoso = this.ejecutarParser();

    console.log("\n=== RESUMEN DEL ANÁLISIS ===");
    console.log(`Archivo: ${this.archivoActual}`);
    console.log(`Tokens: ${this.tokens.length}`);
    console.log(`Errores totales: ${this.errores.length}`);

    if (this.parser) {
      const stats = this.parser.obtenerEstadisticas();
      console.log(`Análisis exitoso: ${stats.analisisExitoso ? "✓" : "❌"}`);
    }

    return lexerExitoso && parserExitoso;
  }

  /**
   * Muestra los tokens generados
   */
  mostrarTokens() {
    if (!this.tokens || this.tokens.length === 0) {
      console.log(
        "⚠️  No hay tokens para mostrar. Ejecute primero el análisis léxico."
      );
      return;
    }

    console.log("\n=== TOKENS GENERADOS ===");
    console.log(`Total de tokens: ${this.tokens.length}\n`);

    // Mostrar estadísticas por tipo
    if (this.lexer) {
      const estadisticas = this.lexer.obtenerEstadisticas();
      console.log("Estadísticas por tipo:");
      Object.entries(estadisticas).forEach(([tipo, cantidad]) => {
        console.log(`  ${tipo}: ${cantidad}`);
      });
      console.log();
    }

    // Mostrar primeros 20 tokens
    console.log("Primeros tokens encontrados:");
    this.tokens.slice(0, 20).forEach((token, index) => {
      console.log(
        `${(index + 1).toString().padStart(2, " ")}. ${token.toString()}`
      );
    });

    if (this.tokens.length > 20) {
      console.log(`... y ${this.tokens.length - 20} tokens más.`);
    }
  }

  /**
   * Muestra el árbol sintáctico
   */
  mostrarArbolSintactico() {
    if (!this.arbolSintactico) {
      console.log(
        "⚠️  No hay árbol sintáctico para mostrar. Ejecute primero el análisis sintáctico."
      );
      return;
    }

    console.log("\n=== ÁRBOL SINTÁCTICO ===");
    this.imprimirNodo(this.arbolSintactico, 0);

    if (this.parser) {
      const resumen = this.parser.obtenerResumenAnalisis();
      console.log("\n=== RESUMEN DEL ANÁLISIS ===");
      console.log(`Estado: ${resumen.resumen}`);
      console.log("Entidades encontradas:");
      Object.entries(resumen.detalles).forEach(([tipo, cantidad]) => {
        console.log(`  ${tipo}: ${cantidad}`);
      });
    }
  }

  /**
   * Función auxiliar para imprimir nodos del AST
   */
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

  /**
   * Muestra errores encontrados
   */
  mostrarErrores() {
    if (!this.errores || this.errores.length === 0) {
      console.log("✓ No se encontraron errores.");
      return;
    }

    console.log("\n=== ERRORES ENCONTRADOS ===");
    console.log(`Total de errores: ${this.errores.length}\n`);

    // Agrupar errores por tipo
    const errorPorTipo = {};
    this.errores.forEach((error) => {
      if (!errorPorTipo[error.tipo]) {
        errorPorTipo[error.tipo] = [];
      }
      errorPorTipo[error.tipo].push(error);
    });

    Object.entries(errorPorTipo).forEach(([tipo, errores]) => {
      console.log(`${tipo} (${errores.length}):`);
      errores.forEach((error, index) => {
        console.log(
          `  ${index + 1}. [${error.linea}:${error.columna}] ${error.mensaje}`
        );
        if (error.contexto) {
          console.log(`     Contexto: "${error.contexto}"`);
        }
      });
      console.log();
    });
  }

  /**
   * Muestra estadísticas del análisis
   */
  mostrarEstadisticas() {
    if (!this.lexer && !this.parser) {
      console.log(
        "⚠️  No hay estadísticas disponibles. Ejecute primero un análisis."
      );
      return;
    }

    console.log("\n=== ESTADÍSTICAS DEL ANÁLISIS ===");
    console.log(`Archivo: ${this.archivoActual}`);
    console.log(`Tamaño: ${this.contenidoArchivo.length} caracteres`);

    if (this.lexer) {
      console.log("\nEstadísticas léxicas:");
      const statsLexer = this.lexer.obtenerEstadisticas();
      Object.entries(statsLexer).forEach(([tipo, cantidad]) => {
        console.log(`  ${tipo}: ${cantidad}`);
      });
    }

    if (this.parser) {
      console.log("\nEstadísticas sintácticas:");
      const statsParser = this.parser.obtenerEstadisticas();
      console.log(`  Total de tokens procesados: ${statsParser.totalTokens}`);
      console.log(`  Errores: ${statsParser.errores}`);
      console.log(`  Advertencias: ${statsParser.advertencias}`);
      console.log(
        `  Análisis exitoso: ${statsParser.analisisExitoso ? "Sí" : "No"}`
      );

      if (statsParser.equipos > 0 || statsParser.jugadores > 0) {
        console.log("\nEntidades del torneo:");
        console.log(`  Equipos: ${statsParser.equipos}`);
        console.log(`  Jugadores: ${statsParser.jugadores}`);
        console.log(`  Partidos: ${statsParser.partidos}`);
        console.log(`  Goleadores: ${statsParser.goleadores}`);
      }
    }
  }

  /**
   * Muestra el contenido del archivo actual
   */
  mostrarContenidoArchivo() {
    if (!this.contenidoArchivo) {
      console.log("⚠️  No hay archivo cargado.");
      return;
    }

    console.log(`\n=== CONTENIDO DE ${this.archivoActual} ===`);
    const lineas = this.contenidoArchivo.split("\n");
    lineas.forEach((linea, index) => {
      console.log(`${(index + 1).toString().padStart(3, " ")}: ${linea}`);
    });
    console.log(`\nTotal de líneas: ${lineas.length}`);
  }

  /**
   * Bucle principal del programa
   */
  async ejecutar() {
    console.log("🎯 Bienvenido al Analizador TourneyJS Optimizado");
    console.log("   Enfocado en análisis léxico y sintáctico");

    let continuar = true;
    while (continuar) {
      this.mostrarMenu();
      const opcion = await this.obtenerOpcion();

      switch (opcion) {
        case 1:
          await this.cargarArchivo();
          break;
        case 2:
          this.ejecutarLexer();
          break;
        case 3:
          this.ejecutarParser();
          break;
        case 4:
          this.analisisCompleto();
          break;
        case 5:
          this.mostrarTokens();
          break;
        case 6:
          this.mostrarArbolSintactico();
          break;
        case 7:
          this.mostrarErrores();
          break;
        case 8:
          this.mostrarEstadisticas();
          break;
        case 9:
          this.mostrarContenidoArchivo();
          break;
        case 0:
          console.log("¡Hasta luego! 👋");
          continuar = false;
          break;
        default:
          console.log("❌ Opción no válida. Intente de nuevo.");
      }

      if (continuar) {
        console.log("\nPresione Enter para continuar...");
        await new Promise((resolve) => {
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          rl.question("", () => {
            rl.close();
            resolve();
          });
        });
      }
    }
  }
}

// Ejecutar el programa
const analizador = new AnalizadorTourneyJS();
analizador.ejecutar().catch(console.error);
