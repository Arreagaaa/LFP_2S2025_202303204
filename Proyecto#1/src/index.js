class AnalizadorLenguajes {
  constructor() {
    this.tokens = [];
    this.errores = [];
    this.resultado = null;
  }

  mostrarMenu() {
    console.log("\n=== ANALIZADOR LÉXICO Y SINTÁCTICO ===");
    console.log("1. Cargar archivo de entrada");
    console.log("2. Analizar archivo (Lexer + Parser)");
    console.log("3. Generar reporte de tokens");
    console.log("4. Generar reporte de errores");
    console.log("5. Generar reporte completo");
    console.log("6. Mostrar contenido del archivo");
    console.log("7. Salir");
    console.log("======================================");
  }
}

// Inicializar la aplicación
const analizador = new AnalizadorLenguajes();
analizador.ejecutar().catch(console.error);
