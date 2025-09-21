class Token {
  constructor(tipo, valor, linea, columna) {
    this.tipo = tipo;
    this.valor = valor;
    this.linea = linea;
    this.columna = columna;
  }

  // Método útil para depuración y logging
  toString() {
    return `Token(${this.tipo}, "${this.valor}", ${this.linea}:${this.columna})`;
  }
}

/**
 * Lexer optimizado para TourneyJS
 * Implementa AFD para reconocer tokens específicos de torneos deportivos
 * Código reutilizable y escalable para futuras extensiones
 */
class Lexer {
  constructor(entrada) {
    this.entrada = entrada;
    this.posicion = 0;
    this.linea = 1;
    this.columna = 1;
    this.tokens = [];
    this.errores = [];

    // Configurar todos los patrones y tipos de tokens
    this.configurarTokensYPatrones();
  }

  /**
   * Configuración centralizada de todos los tokens y patrones
   * Facilita mantenimiento y extensión del analizador
   */
  configurarTokensYPatrones() {
    // Tipos de tokens específicos para TourneyJS
    this.TIPOS_TOKEN = {
      // Secciones principales del archivo de torneo
      SECCION_PRINCIPAL: "SECCION_PRINCIPAL",

      // Palabras reservadas del dominio deportivo
      PALABRA_RESERVADA: "PALABRA_RESERVADA",
      POSICION_JUGADOR: "POSICION_JUGADOR",

      // Identificadores y valores literales
      IDENTIFICADOR: "IDENTIFICADOR",
      CADENA: "CADENA",
      NUMERO: "NUMERO",

      // Operadores y delimitadores estructurales
      DOS_PUNTOS: "DOS_PUNTOS",
      LLAVE_ABIERTA: "LLAVE_ABIERTA",
      LLAVE_CERRADA: "LLAVE_CERRADA",
      CORCHETE_ABIERTO: "CORCHETE_ABIERTO",
      CORCHETE_CERRADO: "CORCHETE_CERRADO",
      COMA: "COMA",
      GUION: "GUION",
      VS: "VS",

      // Tokens especiales del sistema
      COMENTARIO: "COMENTARIO",
      EOF: "EOF",
      ERROR: "ERROR",
    };

    // Palabras reservadas específicas para TourneyJS
    this.palabrasReservadas = new Set([
      "TORNEO",
      "EQUIPOS",
      "ELIMINACION",
      "equipo",
      "jugador",
      "partido",
      "goleador",
      "nombre",
      "equipos",
      "posicion",
      "numero",
      "edad",
      "resultado",
      "goleadores",
      "minuto",
      "cuartos",
      "semifinal",
      "final",
      "vs",
    ]);

    // Posiciones válidas de jugadores
    this.posicionesValidas = new Set([
      "PORTERO",
      "DEFENSA",
      "MEDIOCAMPO",
      "DELANTERO",
    ]);
  }

  caracterActual() {
    if (this.posicion >= this.entrada.length) {
      return null;
    }
    return this.entrada[this.posicion];
  }

  siguienteCaracter() {
    if (this.posicion + 1 >= this.entrada.length) {
      return null;
    }
    return this.entrada[this.posicion + 1];
  }

  avanzar() {
    if (this.posicion < this.entrada.length) {
      if (this.entrada[this.posicion] === "\n") {
        this.linea++;
        this.columna = 1;
      } else {
        this.columna++;
      }
      this.posicion++;
    }
  }

  omitirEspacios() {
    while (this.caracterActual() && /\s/.test(this.caracterActual())) {
      if (this.caracterActual() === "\n") {
        this.agregarToken(this.TIPOS_TOKEN.SALTO_LINEA, "\\n");
      }
      this.avanzar();
    }
  }

  leerNumero() {
    let numero = "";
    let lineaInicio = this.linea;
    let columnaInicio = this.columna;

    while (this.caracterActual() && /\d/.test(this.caracterActual())) {
      numero += this.caracterActual();
      this.avanzar();
    }

    // Manejar números decimales
    if (
      this.caracterActual() === "." &&
      this.siguienteCaracter() &&
      /\d/.test(this.siguienteCaracter())
    ) {
      numero += this.caracterActual();
      this.avanzar();

      while (this.caracterActual() && /\d/.test(this.caracterActual())) {
        numero += this.caracterActual();
        this.avanzar();
      }
    }

    this.tokens.push(
      new Token(this.TIPOS_TOKEN.NUMERO, numero, lineaInicio, columnaInicio)
    );
  }

  leerCadena(delimitador) {
    let cadena = "";
    let lineaInicio = this.linea;
    let columnaInicio = this.columna;

    this.avanzar(); // Saltar el delimitador inicial

    while (this.caracterActual() && this.caracterActual() !== delimitador) {
      if (this.caracterActual() === "\\") {
        this.avanzar(); // Escape character
        if (this.caracterActual()) {
          cadena += "\\" + this.caracterActual();
          this.avanzar();
        }
      } else {
        cadena += this.caracterActual();
        this.avanzar();
      }
    }

    if (this.caracterActual() === delimitador) {
      this.avanzar(); // Saltar el delimitador final
      this.tokens.push(
        new Token(
          this.TIPOS_TOKEN.CADENA,
          `${delimitador}${cadena}${delimitador}`,
          lineaInicio,
          columnaInicio
        )
      );
    } else {
      this.errores.push({
        tipo: "ERROR_LEXICO",
        mensaje: `Cadena no cerrada que inicia en línea ${lineaInicio}, columna ${columnaInicio}`,
        linea: lineaInicio,
        columna: columnaInicio,
      });
    }
  }

  leerIdentificador() {
    let identificador = "";
    let lineaInicio = this.linea;
    let columnaInicio = this.columna;

    while (
      this.caracterActual() &&
      /[a-zA-Z0-9_$]/.test(this.caracterActual())
    ) {
      identificador += this.caracterActual();
      this.avanzar();
    }

    // Determinar el tipo específico de token
    let tipo;
    if (this.palabrasReservadas.has(identificador)) {
      // Verificar si es una sección principal
      if (["TORNEO", "EQUIPOS", "ELIMINACION"].includes(identificador)) {
        tipo = this.TIPOS_TOKEN.SECCION_PRINCIPAL;
      } else {
        tipo = this.TIPOS_TOKEN.PALABRA_RESERVADA;
      }
    } else if (this.posicionesValidas.has(identificador)) {
      tipo = this.TIPOS_TOKEN.POSICION_JUGADOR;
    } else {
      tipo = this.TIPOS_TOKEN.IDENTIFICADOR;
    }

    this.tokens.push(
      new Token(tipo, identificador, lineaInicio, columnaInicio)
    );
  }

  leerComentario() {
    let comentario = "";
    let lineaInicio = this.linea;
    let columnaInicio = this.columna;

    if (this.caracterActual() === "/" && this.siguienteCaracter() === "/") {
      // Comentario de línea
      while (this.caracterActual() && this.caracterActual() !== "\n") {
        comentario += this.caracterActual();
        this.avanzar();
      }
    } else if (
      this.caracterActual() === "/" &&
      this.siguienteCaracter() === "*"
    ) {
      // Comentario de bloque
      comentario += this.caracterActual();
      this.avanzar();
      comentario += this.caracterActual();
      this.avanzar();

      while (this.caracterActual()) {
        if (this.caracterActual() === "*" && this.siguienteCaracter() === "/") {
          comentario += this.caracterActual();
          this.avanzar();
          comentario += this.caracterActual();
          this.avanzar();
          break;
        }
        comentario += this.caracterActual();
        this.avanzar();
      }
    }

    this.tokens.push(
      new Token(
        this.TIPOS_TOKEN.COMENTARIO,
        comentario,
        lineaInicio,
        columnaInicio
      )
    );
  }

  agregarToken(tipo, valor) {
    this.tokens.push(new Token(tipo, valor, this.linea, this.columna));
  }

  tokenizar() {
    while (this.posicion < this.entrada.length) {
      const char = this.caracterActual();
      const lineaActual = this.linea;
      const columnaActual = this.columna;

      // Espacios en blanco
      if (/\s/.test(char)) {
        this.omitirEspacios();
        continue;
      }

      // Números
      if (/\d/.test(char)) {
        this.leerNumero();
        continue;
      }

      // Cadenas
      if (char === '"' || char === "'") {
        this.leerCadena(char);
        continue;
      }

      // Identificadores y palabras reservadas
      if (/[a-zA-Z_$]/.test(char)) {
        this.leerIdentificador();
        continue;
      }

      // Comentarios
      if (
        char === "/" &&
        (this.siguienteCaracter() === "/" || this.siguienteCaracter() === "*")
      ) {
        this.leerComentario();
        continue;
      }

      // Operadores específicos para torneos
      if (char === "v" && this.siguienteCaracter() === "s") {
        this.agregarToken(this.TIPOS_TOKEN.VS, "vs");
        this.avanzar();
        this.avanzar();
        continue;
      }

      // Tokens de un solo carácter específicos para torneos
      switch (char) {
        case "{":
          this.agregarToken(this.TIPOS_TOKEN.LLAVE_ABIERTA, char);
          break;
        case "}":
          this.agregarToken(this.TIPOS_TOKEN.LLAVE_CERRADA, char);
          break;
        case "[":
          this.agregarToken(this.TIPOS_TOKEN.CORCHETE_ABIERTO, char);
          break;
        case "]":
          this.agregarToken(this.TIPOS_TOKEN.CORCHETE_CERRADO, char);
          break;
        case ":":
          this.agregarToken(this.TIPOS_TOKEN.DOS_PUNTOS, char);
          break;
        case ",":
          this.agregarToken(this.TIPOS_TOKEN.COMA, char);
          break;
        case "-":
          this.agregarToken(this.TIPOS_TOKEN.GUION, char);
          break;
        default:
          // Carácter no reconocido - error léxico
          this.errores.push({
            tipo: "Token inválido",
            mensaje: `Carácter no reconocido: '${char}'`,
            lexema: char,
            linea: lineaActual,
            columna: columnaActual,
          });
          this.agregarToken(this.TIPOS_TOKEN.ERROR, char);
      }

      this.avanzar();
    }

    // Agregar token EOF
    this.agregarToken(this.TIPOS_TOKEN.EOF, "");

    return this.tokens;
  }

  // Método para obtener estadísticas de los tokens
  obtenerEstadisticas() {
    const estadisticas = {};

    this.tokens.forEach((token) => {
      if (estadisticas[token.tipo]) {
        estadisticas[token.tipo]++;
      } else {
        estadisticas[token.tipo] = 1;
      }
    });

    return estadisticas;
  }
}

module.exports = Lexer;
