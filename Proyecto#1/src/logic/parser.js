/**
 * Parser optimizado para TourneyJS
 * Implementa análisis sintáctico descendente recursivo
 * Genera AST (Árbol de Sintaxis Abstracta) para validación y análisis
 */
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.posicion = 0;
    this.errores = [];
    this.arbolSintactico = null;
    this.estadisticas = {
      equipos: 0,
      jugadores: 0,
      partidos: 0,
      goleadores: 0,
    };

    // Configurar estructura y patrones del analizador
    this.configurarParser();
  }

  /**
   * Configuración centralizada del parser
   * Define tipos de nodos y patrones de validación
   */
  configurarParser() {
    // Tipos de nodos del AST para TourneyJS
    this.TIPOS_NODO = {
      // Nodos principales de estructura del torneo
      TORNEO: "TORNEO",
      EQUIPOS: "EQUIPOS",
      ELIMINACION: "ELIMINACION",

      // Nodos de entidades deportivas
      EQUIPO: "EQUIPO",
      JUGADOR: "JUGADOR",
      PARTIDO: "PARTIDO",
      GOLEADOR: "GOLEADOR",

      // Nodos de estructura y datos
      FASE: "FASE",
      ATRIBUTO: "ATRIBUTO",
      VALOR: "VALOR",
      LISTA: "LISTA",

      // Nodos auxiliares
      PROGRAMA: "PROGRAMA",
      SECCION: "SECCION",
    };

    // Atributos válidos por sección
    this.atributosValidos = {
      torneo: new Set(["nombre", "equipos"]),
      equipo: new Set(["nombre", "jugadores"]),
      jugador: new Set(["nombre", "numero", "posicion", "edad"]),
      partido: new Set(["equipos", "resultado", "goleadores"]),
      goleador: new Set(["nombre", "minuto"]),
    };
  }

  /**
   * Métodos utilitarios para navegación de tokens
   * Centralizan la lógica de movimiento y acceso a tokens
   */
  tokenActual() {
    return this.posicion < this.tokens.length
      ? this.tokens[this.posicion]
      : null;
  }

  siguienteToken() {
    return this.posicion + 1 < this.tokens.length
      ? this.tokens[this.posicion + 1]
      : null;
  }

  tokenEnPosicion(offset) {
    const pos = this.posicion + offset;
    return pos < this.tokens.length && pos >= 0 ? this.tokens[pos] : null;
  }

  avanzar() {
    if (this.posicion < this.tokens.length) {
      this.posicion++;
    }
    return this.tokenActual();
  }

  retroceder() {
    if (this.posicion > 0) {
      this.posicion--;
    }
    return this.tokenActual();
  }

  /**
   * Validación de tokens con manejo robusto de errores
   * Incluye información contextual para mejor debugging
   */
  esperarToken(tipoEsperado, contexto = "") {
    const token = this.tokenActual();
    if (!token) {
      this.registrarError(
        "ERROR_SINTACTICO",
        `Se esperaba ${tipoEsperado} pero se llegó al final del archivo${
          contexto ? " en " + contexto : ""
        }`,
        0,
        0
      );
      return null;
    }

    if (token.tipo !== tipoEsperado) {
      this.registrarError(
        "ERROR_SINTACTICO",
        `Se esperaba ${tipoEsperado} pero se encontró ${token.tipo}: '${
          token.valor
        }'${contexto ? " en " + contexto : ""}`,
        token.linea,
        token.columna
      );
      return null;
    }

    this.avanzar();
    return token;
  }

  /**
   * Método centralizado para registro de errores
   * Facilita el mantenimiento y extensión del manejo de errores
   */
  registrarError(tipo, mensaje, linea, columna, severidad = "error") {
    this.errores.push({
      tipo,
      mensaje,
      linea,
      columna,
      severidad,
      posicion: this.posicion,
      contexto: this.obtenerContextoError(),
    });
  }

  obtenerContextoError() {
    const inicio = Math.max(0, this.posicion - 2);
    const fin = Math.min(this.tokens.length, this.posicion + 3);
    return this.tokens
      .slice(inicio, fin)
      .map((t) => t.valor)
      .join(" ");
  }

  /**
   * Fábrica de nodos del AST con información completa
   * Incluye metadatos útiles para análisis y debugging
   */
  crearNodo(tipo, valor = null, hijos = [], atributos = {}) {
    const token = this.tokenActual();
    return {
      tipo,
      valor,
      hijos: Array.isArray(hijos) ? hijos : [hijos],
      atributos,
      // Información de posición en el código fuente
      linea: token?.linea || 0,
      columna: token?.columna || 0,
      // Metadatos para análisis
      id: `${tipo}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      esValido: true,
      errores: [],
    };
  }

  /**
   * Método utilitario para agregar hijos a un nodo existente
   */
  agregarHijo(nodo, hijo) {
    if (nodo && hijo) {
      nodo.hijos.push(hijo);
    }
    return nodo;
  }

  /**
   * Omite tokens que no afectan la sintaxis
   * Mantiene comentarios para posible análisis posterior
   */
  omitirTokensInnecesarios(preservarComentarios = false) {
    const tiposIgnorar = ["ESPACIO_BLANCO", "SALTO_LINEA"];
    if (!preservarComentarios) {
      tiposIgnorar.push("COMENTARIO");
    }

    while (
      this.tokenActual() &&
      tiposIgnorar.includes(this.tokenActual().tipo)
    ) {
      this.avanzar();
    }
  }

  /**
   * Verifica si el token actual es de un tipo específico
   */
  esToken(tipo) {
    const token = this.tokenActual();
    return token && token.tipo === tipo;
  }

  /**
   * Verifica si el token actual tiene un valor específico
   */
  esValor(valor) {
    const token = this.tokenActual();
    return token && token.valor === valor;
  }

  // Análisis del archivo de torneo completo
  analizarTorneo() {
    this.omitirTokensInnecesarios();
    const secciones = [];

    while (this.tokenActual() && this.tokenActual().tipo !== "EOF") {
      this.omitirTokensInnecesarios();

      const token = this.tokenActual();
      if (token && token.tipo === "SECCION_PRINCIPAL") {
        let seccion = null;

        switch (token.valor) {
          case "TORNEO":
            seccion = this.analizarSeccionTorneo();
            break;
          case "EQUIPOS":
            seccion = this.analizarSeccionEquipos();
            break;
          case "ELIMINACION":
            seccion = this.analizarSeccionEliminacion();
            break;
          default:
            this.errores.push({
              tipo: "ERROR_SINTACTICO",
              mensaje: `Sección no reconocida: ${token.valor}`,
              linea: token.linea,
              columna: token.columna,
            });
            this.avanzar();
        }

        if (seccion) {
          secciones.push(seccion);
        }
      } else {
        if (token) {
          this.errores.push({
            tipo: "ERROR_SINTACTICO",
            mensaje: `Se esperaba una sección del torneo (TORNEO, EQUIPOS, ELIMINACION) pero se encontró: ${token.valor}`,
            linea: token.linea,
            columna: token.columna,
          });
        }
        this.avanzar();
      }

      this.omitirTokensInnecesarios();
    }

    return this.crearNodo(this.TIPOS_NODO.TORNEO, "torneo_completo", secciones);
  }

  // Análisis de la sección TORNEO
  analizarSeccionTorneo() {
    const tokenTorneo = this.esperarToken("SECCION_PRINCIPAL"); // TORNEO
    if (!tokenTorneo || tokenTorneo.valor !== "TORNEO") {
      return null;
    }

    this.omitirTokensInnecesarios();
    this.esperarToken("LLAVE_ABIERTA");
    this.omitirTokensInnecesarios();

    const atributos = [];

    while (this.tokenActual() && this.tokenActual().tipo !== "LLAVE_CERRADA") {
      this.omitirTokensInnecesarios();

      if (this.tokenActual() && this.tokenActual().tipo !== "LLAVE_CERRADA") {
        const atributo = this.analizarAtributo();
        if (atributo) {
          atributos.push(atributo);
        }
      }

      this.omitirTokensInnecesarios();

      // Consumir coma opcional
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
        this.omitirTokensInnecesarios();
      }
    }

    this.esperarToken("LLAVE_CERRADA");

    return this.crearNodo(this.TIPOS_NODO.TORNEO, "seccion_torneo", atributos);
  }

  // Análisis de la sección EQUIPOS
  analizarSeccionEquipos() {
    const tokenEquipos = this.esperarToken("SECCION_PRINCIPAL"); // EQUIPOS
    if (!tokenEquipos || tokenEquipos.valor !== "EQUIPOS") {
      return null;
    }

    this.omitirTokensInnecesarios();
    this.esperarToken("LLAVE_ABIERTA");
    this.omitirTokensInnecesarios();

    const equipos = [];

    while (this.tokenActual() && this.tokenActual().tipo !== "LLAVE_CERRADA") {
      this.omitirTokensInnecesarios();

      if (this.tokenActual() && this.tokenActual().valor === "equipo") {
        const equipo = this.analizarEquipo();
        if (equipo) {
          equipos.push(equipo);
        }
      } else if (
        this.tokenActual() &&
        this.tokenActual().tipo !== "LLAVE_CERRADA"
      ) {
        this.errores.push({
          tipo: "ERROR_SINTACTICO",
          mensaje: `Se esperaba 'equipo' pero se encontró: ${
            this.tokenActual().valor
          }`,
          linea: this.tokenActual().linea,
          columna: this.tokenActual().columna,
        });
        this.avanzar();
      }

      this.omitirTokensInnecesarios();
    }

    this.esperarToken("LLAVE_CERRADA");

    return this.crearNodo(this.TIPOS_NODO.EQUIPOS, "seccion_equipos", equipos);
  }

  // Análisis de un equipo individual
  analizarEquipo() {
    this.esperarToken("PALABRA_RESERVADA"); // equipo
    this.omitirTokensInnecesarios();
    this.esperarToken("DOS_PUNTOS");
    this.omitirTokensInnecesarios();

    const nombreEquipo = this.esperarToken("CADENA");
    if (!nombreEquipo) {
      return null;
    }

    this.omitirTokensInnecesarios();
    this.esperarToken("CORCHETE_ABIERTO");
    this.omitirTokensInnecesarios();

    const jugadores = [];

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO"
    ) {
      this.omitirTokensInnecesarios();

      if (this.tokenActual() && this.tokenActual().valor === "jugador") {
        const jugador = this.analizarJugador();
        if (jugador) {
          jugadores.push(jugador);
        }
      } else if (
        this.tokenActual() &&
        this.tokenActual().tipo !== "CORCHETE_CERRADO"
      ) {
        this.errores.push({
          tipo: "ERROR_SINTACTICO",
          mensaje: `Se esperaba 'jugador' pero se encontró: ${
            this.tokenActual().valor
          }`,
          linea: this.tokenActual().linea,
          columna: this.tokenActual().columna,
        });
        this.avanzar();
      }

      this.omitirTokensInnecesarios();

      // Consumir coma opcional
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
        this.omitirTokensInnecesarios();
      }
    }

    this.esperarToken("CORCHETE_CERRADO");

    const nodo = this.crearNodo(
      this.TIPOS_NODO.EQUIPO,
      nombreEquipo.valor,
      jugadores
    );
    return nodo;
  }

  // Análisis de un jugador
  analizarJugador() {
    this.esperarToken("PALABRA_RESERVADA"); // jugador
    this.omitirTokensInnecesarios();
    this.esperarToken("DOS_PUNTOS");
    this.omitirTokensInnecesarios();

    const nombreJugador = this.esperarToken("CADENA");
    if (!nombreJugador) {
      return null;
    }

    this.omitirTokensInnecesarios();
    this.esperarToken("CORCHETE_ABIERTO");
    this.omitirTokensInnecesarios();

    const atributos = [];

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO"
    ) {
      this.omitirTokensInnecesarios();

      if (
        this.tokenActual() &&
        this.tokenActual().tipo !== "CORCHETE_CERRADO"
      ) {
        const atributo = this.analizarAtributo();
        if (atributo) {
          atributos.push(atributo);
        }
      }

      this.omitirTokensInnecesarios();

      // Consumir coma opcional
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
        this.omitirTokensInnecesarios();
      }
    }

    this.esperarToken("CORCHETE_CERRADO");

    const nodo = this.crearNodo(
      this.TIPOS_NODO.JUGADOR,
      nombreJugador.valor,
      atributos
    );
    return nodo;
  }

  // Análisis de atributos (nombre: valor)
  analizarAtributo() {
    const nombreAtributo = this.tokenActual();
    if (
      !nombreAtributo ||
      (nombreAtributo.tipo !== "PALABRA_RESERVADA" &&
        nombreAtributo.tipo !== "IDENTIFICADOR")
    ) {
      this.errores.push({
        tipo: "ERROR_SINTACTICO",
        mensaje: `Se esperaba un nombre de atributo`,
        linea: nombreAtributo?.linea || 0,
        columna: nombreAtributo?.columna || 0,
      });
      return null;
    }

    this.avanzar();
    this.omitirTokensInnecesarios();
    this.esperarToken("DOS_PUNTOS");
    this.omitirTokensInnecesarios();

    let valor = null;
    const tokenValor = this.tokenActual();

    if (tokenValor) {
      if (
        tokenValor.tipo === "CADENA" ||
        tokenValor.tipo === "NUMERO" ||
        tokenValor.tipo === "POSICION_JUGADOR"
      ) {
        valor = tokenValor.valor;
        this.avanzar();
      } else {
        this.errores.push({
          tipo: "ERROR_SINTACTICO",
          mensaje: `Valor de atributo no válido: ${tokenValor.valor}`,
          linea: tokenValor.linea,
          columna: tokenValor.columna,
        });
        this.avanzar();
      }
    }

    const nodo = this.crearNodo(this.TIPOS_NODO.ATRIBUTO, nombreAtributo.valor);
    if (valor) {
      nodo.valor_atributo = valor;
    }
    return nodo;
  }

  // Análisis de la sección ELIMINACION
  analizarSeccionEliminacion() {
    const tokenEliminacion = this.esperarToken("SECCION_PRINCIPAL"); // ELIMINACION
    if (!tokenEliminacion || tokenEliminacion.valor !== "ELIMINACION") {
      return null;
    }

    this.omitirTokensInnecesarios();
    this.esperarToken("LLAVE_ABIERTA");
    this.omitirTokensInnecesarios();

    const fases = [];

    while (this.tokenActual() && this.tokenActual().tipo !== "LLAVE_CERRADA") {
      this.omitirTokensInnecesarios();

      if (
        this.tokenActual() &&
        (this.tokenActual().tipo === "PALABRA_RESERVADA" ||
          this.tokenActual().tipo === "IDENTIFICADOR")
      ) {
        const fase = this.analizarFase();
        if (fase) {
          fases.push(fase);
        }
      } else if (
        this.tokenActual() &&
        this.tokenActual().tipo !== "LLAVE_CERRADA"
      ) {
        this.errores.push({
          tipo: "ERROR_SINTACTICO",
          mensaje: `Se esperaba una fase del torneo pero se encontró: ${
            this.tokenActual().valor
          }`,
          linea: this.tokenActual().linea,
          columna: this.tokenActual().columna,
        });
        this.avanzar();
      }

      this.omitirTokensInnecesarios();

      // Consumir coma opcional
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
        this.omitirTokensInnecesarios();
      }
    }

    this.esperarToken("LLAVE_CERRADA");

    return this.crearNodo(
      this.TIPOS_NODO.ELIMINACION,
      "seccion_eliminacion",
      fases
    );
  }

  // Análisis de una fase del torneo (cuartos, semifinal, final)
  analizarFase() {
    const nombreFase = this.tokenActual();
    this.avanzar();
    this.omitirTokensInnecesarios();
    this.esperarToken("DOS_PUNTOS");
    this.omitirTokensInnecesarios();
    this.esperarToken("CORCHETE_ABIERTO");
    this.omitirTokensInnecesarios();

    const partidos = [];

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO"
    ) {
      this.omitirTokensInnecesarios();

      if (this.tokenActual() && this.tokenActual().valor === "partido") {
        const partido = this.analizarPartido();
        if (partido) {
          partidos.push(partido);
        }
      } else if (
        this.tokenActual() &&
        this.tokenActual().tipo !== "CORCHETE_CERRADO"
      ) {
        this.errores.push({
          tipo: "ERROR_SINTACTICO",
          mensaje: `Se esperaba 'partido' pero se encontró: ${
            this.tokenActual().valor
          }`,
          linea: this.tokenActual().linea,
          columna: this.tokenActual().columna,
        });
        this.avanzar();
      }

      this.omitirTokensInnecesarios();

      // Consumir coma opcional
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
        this.omitirTokensInnecesarios();
      }
    }

    this.esperarToken("CORCHETE_CERRADO");

    const nodo = this.crearNodo(
      this.TIPOS_NODO.FASE,
      nombreFase.valor,
      partidos
    );
    return nodo;
  }

  // Análisis de un partido
  analizarPartido() {
    this.esperarToken("PALABRA_RESERVADA"); // partido
    this.omitirTokensInnecesarios();
    this.esperarToken("DOS_PUNTOS");
    this.omitirTokensInnecesarios();

    const equipo1 = this.esperarToken("CADENA");
    this.omitirTokensInnecesarios();
    this.esperarToken("VS"); // vs
    this.omitirTokensInnecesarios();
    const equipo2 = this.esperarToken("CADENA");

    this.omitirTokensInnecesarios();
    this.esperarToken("CORCHETE_ABIERTO");
    this.omitirTokensInnecesarios();

    const detalles = [];

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO"
    ) {
      this.omitirTokensInnecesarios();

      if (
        this.tokenActual() &&
        this.tokenActual().tipo !== "CORCHETE_CERRADO"
      ) {
        const detalle = this.analizarDetallePartido();
        if (detalle) {
          detalles.push(detalle);
        }
      }

      this.omitirTokensInnecesarios();

      // Consumir coma opcional
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
        this.omitirTokensInnecesarios();
      }
    }

    this.esperarToken("CORCHETE_CERRADO");

    const nodo = this.crearNodo(this.TIPOS_NODO.PARTIDO, "partido");
    nodo.equipo1 = equipo1?.valor;
    nodo.equipo2 = equipo2?.valor;
    nodo.hijos = detalles;
    return nodo;
  }

  // Análisis de detalles del partido (resultado, goleadores)
  analizarDetallePartido() {
    const token = this.tokenActual();

    if (!token) {
      return null;
    }

    if (token.valor === "resultado") {
      return this.analizarResultado();
    } else if (token.valor === "goleadores") {
      return this.analizarGoleadores();
    } else {
      // Podría ser otro atributo
      return this.analizarAtributo();
    }
  }

  // Análisis del resultado del partido
  analizarResultado() {
    this.esperarToken("PALABRA_RESERVADA"); // resultado
    this.omitirTokensInnecesarios();
    this.esperarToken("DOS_PUNTOS");
    this.omitirTokensInnecesarios();

    const resultado = this.esperarToken("CADENA"); // "3-1"

    const nodo = this.crearNodo(this.TIPOS_NODO.ATRIBUTO, "resultado");
    nodo.valor_atributo = resultado?.valor;
    return nodo;
  }

  // Análisis de la lista de goleadores
  analizarGoleadores() {
    this.esperarToken("PALABRA_RESERVADA"); // goleadores
    this.omitirTokensInnecesarios();
    this.esperarToken("DOS_PUNTOS");
    this.omitirTokensInnecesarios();
    this.esperarToken("CORCHETE_ABIERTO");
    this.omitirTokensInnecesarios();

    const goleadores = [];

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO"
    ) {
      this.omitirTokensInnecesarios();

      if (this.tokenActual() && this.tokenActual().valor === "goleador") {
        const goleador = this.analizarGoleador();
        if (goleador) {
          goleadores.push(goleador);
        }
      } else if (
        this.tokenActual() &&
        this.tokenActual().tipo !== "CORCHETE_CERRADO"
      ) {
        this.errores.push({
          tipo: "ERROR_SINTACTICO",
          mensaje: `Se esperaba 'goleador' pero se encontró: ${
            this.tokenActual().valor
          }`,
          linea: this.tokenActual().linea,
          columna: this.tokenActual().columna,
        });
        this.avanzar();
      }

      this.omitirTokensInnecesarios();

      // Consumir coma opcional
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
        this.omitirTokensInnecesarios();
      }
    }

    this.esperarToken("CORCHETE_CERRADO");

    return this.crearNodo(this.TIPOS_NODO.LISTA, "goleadores", goleadores);
  }

  // Análisis de un goleador
  analizarGoleador() {
    this.esperarToken("PALABRA_RESERVADA"); // goleador
    this.omitirTokensInnecesarios();
    this.esperarToken("DOS_PUNTOS");
    this.omitirTokensInnecesarios();

    const nombreGoleador = this.esperarToken("CADENA");

    this.omitirTokensInnecesarios();
    this.esperarToken("CORCHETE_ABIERTO");
    this.omitirTokensInnecesarios();

    const atributos = [];

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO"
    ) {
      this.omitirTokensInnecesarios();

      if (
        this.tokenActual() &&
        this.tokenActual().tipo !== "CORCHETE_CERRADO"
      ) {
        const atributo = this.analizarAtributo();
        if (atributo) {
          atributos.push(atributo);
        }
      }

      this.omitirTokensInnecesarios();

      // Consumir coma opcional
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
        this.omitirTokensInnecesarios();
      }
    }

    this.esperarToken("CORCHETE_CERRADO");

    const nodo = this.crearNodo(
      this.TIPOS_NODO.GOLEADOR,
      nombreGoleador?.valor
    );
    nodo.hijos = atributos;
    return nodo;
  }

  // Análisis de sentencias
  analizarSentencia() {
    this.omitirTokensInnecesarios();
    const token = this.tokenActual();

    if (!token || token.tipo === "EOF") {
      return null;
    }

    // Declaraciones con palabras reservadas
    if (token.tipo === "PALABRA_RESERVADA") {
      switch (token.valor) {
        case "var":
        case "let":
        case "const":
          return this.analizarDeclaracion();
        case "if":
          return this.analizarEstructuraIf();
        case "while":
          return this.analizarEstructuraWhile();
        case "for":
          return this.analizarEstructuraFor();
        case "function":
          return this.analizarDeclaracionFuncion();
        case "return":
          return this.analizarReturn();
        default:
          // Otras palabras reservadas se tratan como expresiones
          return this.analizarExpresion();
      }
    }

    // Bloques de código
    if (token.tipo === "LLAVE_ABIERTA") {
      return this.analizarBloque();
    }

    // Expresiones y asignaciones
    return this.analizarExpresion();
  }

  // Análisis de declaraciones
  analizarDeclaracion() {
    const tipoDeclaracion = this.tokenActual();
    this.avanzar(); // consumir var/let/const

    this.omitirTokensInnecesarios();

    const identificador = this.esperarToken("IDENTIFICADOR");
    if (!identificador) {
      return null;
    }

    let valorInicial = null;
    this.omitirTokensInnecesarios();

    if (
      this.tokenActual() &&
      this.tokenActual().tipo === "OPERADOR_ASIGNACION"
    ) {
      this.avanzar(); // consumir =
      this.omitirTokensInnecesarios();
      valorInicial = this.analizarExpresion();
    }

    // Opcional: punto y coma
    this.omitirTokensInnecesarios();
    if (this.tokenActual() && this.tokenActual().tipo === "PUNTO_Y_COMA") {
      this.avanzar();
    }

    const nodo = this.crearNodo(
      this.TIPOS_NODO.DECLARACION,
      tipoDeclaracion.valor
    );
    nodo.identificador = identificador.valor;
    if (valorInicial) {
      nodo.hijos.push(valorInicial);
    }

    return nodo;
  }

  // Análisis de bloques
  analizarBloque() {
    this.esperarToken("LLAVE_ABIERTA");
    this.omitirTokensInnecesarios();

    const sentencias = [];

    while (this.tokenActual() && this.tokenActual().tipo !== "LLAVE_CERRADA") {
      this.omitirTokensInnecesarios();

      if (this.tokenActual() && this.tokenActual().tipo !== "LLAVE_CERRADA") {
        const sentencia = this.analizarSentencia();
        if (sentencia) {
          sentencias.push(sentencia);
        }
      }

      this.omitirTokensInnecesarios();
    }

    this.esperarToken("LLAVE_CERRADA");

    return this.crearNodo(this.TIPOS_NODO.BLOQUE, "bloque", sentencias);
  }

  // Análisis de expresiones (simplificado)
  analizarExpresion() {
    return this.analizarExpresionLogica();
  }

  analizarExpresionLogica() {
    let izquierdo = this.analizarExpresionRelacional();

    while (
      this.tokenActual() &&
      this.tokenActual().tipo === "OPERADOR_LOGICO" &&
      ["&&", "||"].includes(this.tokenActual().valor)
    ) {
      const operador = this.tokenActual();
      this.avanzar();
      this.omitirTokensInnecesarios();

      const derecho = this.analizarExpresionRelacional();
      izquierdo = this.crearNodo(
        this.TIPOS_NODO.OPERACION_BINARIA,
        operador.valor,
        [izquierdo, derecho]
      );
    }

    return izquierdo;
  }

  analizarExpresionRelacional() {
    let izquierdo = this.analizarExpresionAritmetica();

    while (
      this.tokenActual() &&
      this.tokenActual().tipo === "OPERADOR_RELACIONAL"
    ) {
      const operador = this.tokenActual();
      this.avanzar();
      this.omitirTokensInnecesarios();

      const derecho = this.analizarExpresionAritmetica();
      izquierdo = this.crearNodo(
        this.TIPOS_NODO.OPERACION_BINARIA,
        operador.valor,
        [izquierdo, derecho]
      );
    }

    return izquierdo;
  }

  analizarExpresionAritmetica() {
    let izquierdo = this.analizarTermino();

    while (
      this.tokenActual() &&
      this.tokenActual().tipo === "OPERADOR_ARITMETICO" &&
      ["+", "-"].includes(this.tokenActual().valor)
    ) {
      const operador = this.tokenActual();
      this.avanzar();
      this.omitirTokensInnecesarios();

      const derecho = this.analizarTermino();
      izquierdo = this.crearNodo(
        this.TIPOS_NODO.OPERACION_BINARIA,
        operador.valor,
        [izquierdo, derecho]
      );
    }

    return izquierdo;
  }

  analizarTermino() {
    let izquierdo = this.analizarFactor();

    while (
      this.tokenActual() &&
      this.tokenActual().tipo === "OPERADOR_ARITMETICO" &&
      ["*", "/", "%"].includes(this.tokenActual().valor)
    ) {
      const operador = this.tokenActual();
      this.avanzar();
      this.omitirTokensInnecesarios();

      const derecho = this.analizarFactor();
      izquierdo = this.crearNodo(
        this.TIPOS_NODO.OPERACION_BINARIA,
        operador.valor,
        [izquierdo, derecho]
      );
    }

    return izquierdo;
  }

  analizarFactor() {
    this.omitirTokensInnecesarios();
    const token = this.tokenActual();

    if (!token) {
      this.errores.push({
        tipo: "ERROR_SINTACTICO",
        mensaje: "Se esperaba una expresión",
        linea: 0,
        columna: 0,
      });
      return null;
    }

    // Números
    if (token.tipo === "NUMERO") {
      this.avanzar();
      return this.crearNodo(this.TIPOS_NODO.LITERAL, token.valor);
    }

    // Cadenas
    if (token.tipo === "CADENA") {
      this.avanzar();
      return this.crearNodo(this.TIPOS_NODO.LITERAL, token.valor);
    }

    // Identificadores
    if (token.tipo === "IDENTIFICADOR") {
      this.avanzar();

      // Verificar si es una llamada a función
      this.omitirTokensInnecesarios();
      if (
        this.tokenActual() &&
        this.tokenActual().tipo === "PARENTESIS_ABIERTO"
      ) {
        return this.analizarLlamadaFuncion(token);
      }

      return this.crearNodo(this.TIPOS_NODO.IDENTIFICADOR, token.valor);
    }

    // Palabras reservadas (true, false, null, etc.)
    if (
      token.tipo === "PALABRA_RESERVADA" &&
      ["true", "false", "null", "undefined"].includes(token.valor)
    ) {
      this.avanzar();
      return this.crearNodo(this.TIPOS_NODO.LITERAL, token.valor);
    }

    // Expresiones entre paréntesis
    if (token.tipo === "PARENTESIS_ABIERTO") {
      this.avanzar();
      this.omitirTokensInnecesarios();

      const expresion = this.analizarExpresion();

      this.omitirTokensInnecesarios();
      this.esperarToken("PARENTESIS_CERRADO");

      return expresion;
    }

    // Operadores unarios
    if (
      (token.tipo === "OPERADOR_ARITMETICO" &&
        ["+", "-"].includes(token.valor)) ||
      (token.tipo === "OPERADOR_LOGICO" && token.valor === "!")
    ) {
      this.avanzar();
      this.omitirTokensInnecesarios();

      const operando = this.analizarFactor();
      return this.crearNodo(this.TIPOS_NODO.OPERACION_UNARIA, token.valor, [
        operando,
      ]);
    }

    // Si llegamos aquí, el token no es válido en este contexto
    this.errores.push({
      tipo: "ERROR_SINTACTICO",
      mensaje: `Token inesperado: ${token.tipo} '${token.valor}'`,
      linea: token.linea,
      columna: token.columna,
    });

    this.avanzar(); // Intentar continuar
    return null;
  }

  analizarLlamadaFuncion(nombreFuncion) {
    this.esperarToken("PARENTESIS_ABIERTO");
    this.omitirTokensInnecesarios();

    const argumentos = [];

    if (
      this.tokenActual() &&
      this.tokenActual().tipo !== "PARENTESIS_CERRADO"
    ) {
      argumentos.push(this.analizarExpresion());

      while (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
        this.omitirTokensInnecesarios();
        argumentos.push(this.analizarExpresion());
      }
    }

    this.omitirTokensInnecesarios();
    this.esperarToken("PARENTESIS_CERRADO");

    const nodo = this.crearNodo(
      this.TIPOS_NODO.LLAMADA_FUNCION,
      nombreFuncion.valor,
      argumentos
    );
    return nodo;
  }

  // Estructuras de control simplificadas
  analizarEstructuraIf() {
    this.avanzar(); // consumir 'if'
    this.omitirTokensInnecesarios();

    this.esperarToken("PARENTESIS_ABIERTO");
    this.omitirTokensInnecesarios();

    const condicion = this.analizarExpresion();

    this.omitirTokensInnecesarios();
    this.esperarToken("PARENTESIS_CERRADO");
    this.omitirTokensInnecesarios();

    const cuerpoIf = this.analizarSentencia();

    const nodo = this.crearNodo(this.TIPOS_NODO.ESTRUCTURA_CONTROL, "if", [
      condicion,
      cuerpoIf,
    ]);

    // Verificar else opcional
    this.omitirTokensInnecesarios();
    if (
      this.tokenActual() &&
      this.tokenActual().tipo === "PALABRA_RESERVADA" &&
      this.tokenActual().valor === "else"
    ) {
      this.avanzar();
      this.omitirTokensInnecesarios();
      const cuerpoElse = this.analizarSentencia();
      nodo.hijos.push(cuerpoElse);
    }

    return nodo;
  }

  analizarEstructuraWhile() {
    this.avanzar(); // consumir 'while'
    this.omitirTokensInnecesarios();

    this.esperarToken("PARENTESIS_ABIERTO");
    this.omitirTokensInnecesarios();

    const condicion = this.analizarExpresion();

    this.omitirTokensInnecesarios();
    this.esperarToken("PARENTESIS_CERRADO");
    this.omitirTokensInnecesarios();

    const cuerpo = this.analizarSentencia();

    return this.crearNodo(this.TIPOS_NODO.ESTRUCTURA_CONTROL, "while", [
      condicion,
      cuerpo,
    ]);
  }

  analizarEstructuraFor() {
    // Implementación simplificada del for
    this.avanzar(); // consumir 'for'
    this.omitirTokensInnecesarios();

    this.esperarToken("PARENTESIS_ABIERTO");
    // Por simplicidad, saltamos el contenido del for
    let contadorParentesis = 1;
    while (contadorParentesis > 0 && this.tokenActual()) {
      if (this.tokenActual().tipo === "PARENTESIS_ABIERTO")
        contadorParentesis++;
      if (this.tokenActual().tipo === "PARENTESIS_CERRADO")
        contadorParentesis--;
      this.avanzar();
    }

    this.omitirTokensInnecesarios();
    const cuerpo = this.analizarSentencia();

    return this.crearNodo(this.TIPOS_NODO.ESTRUCTURA_CONTROL, "for", [cuerpo]);
  }

  analizarDeclaracionFuncion() {
    this.avanzar(); // consumir 'function'
    this.omitirTokensInnecesarios();

    const nombre = this.esperarToken("IDENTIFICADOR");

    this.omitirTokensInnecesarios();
    this.esperarToken("PARENTESIS_ABIERTO");

    // Saltar parámetros por simplicidad
    let contadorParentesis = 1;
    while (contadorParentesis > 0 && this.tokenActual()) {
      if (this.tokenActual().tipo === "PARENTESIS_ABIERTO")
        contadorParentesis++;
      if (this.tokenActual().tipo === "PARENTESIS_CERRADO")
        contadorParentesis--;
      this.avanzar();
    }

    this.omitirTokensInnecesarios();
    const cuerpo = this.analizarBloque();

    const nodo = this.crearNodo(this.TIPOS_NODO.DECLARACION, "function", [
      cuerpo,
    ]);
    nodo.identificador = nombre?.valor || "anonima";
    return nodo;
  }

  analizarReturn() {
    this.avanzar(); // consumir 'return'
    this.omitirTokensInnecesarios();

    let valor = null;
    if (
      this.tokenActual() &&
      this.tokenActual().tipo !== "PUNTO_Y_COMA" &&
      this.tokenActual().tipo !== "EOF" &&
      this.tokenActual().tipo !== "LLAVE_CERRADA"
    ) {
      valor = this.analizarExpresion();
    }

    this.omitirTokensInnecesarios();
    if (this.tokenActual() && this.tokenActual().tipo === "PUNTO_Y_COMA") {
      this.avanzar();
    }

    return this.crearNodo(
      this.TIPOS_NODO.SENTENCIA,
      "return",
      valor ? [valor] : []
    );
  }

  // Método principal de análisis para torneos
  analizar() {
    try {
      this.arbolSintactico = this.analizarTorneo();
      return {
        exitoso: this.errores.length === 0,
        arbol: this.arbolSintactico,
        errores: this.errores,
      };
    } catch (error) {
      this.errores.push({
        tipo: "ERROR_CRITICO",
        mensaje: `Error inesperado durante el análisis: ${error.message}`,
        linea: this.tokenActual()?.linea || 0,
        columna: this.tokenActual()?.columna || 0,
      });

      return {
        exitoso: false,
        arbol: null,
        errores: this.errores,
      };
    }
  }

  // Método para obtener estadísticas del análisis
  obtenerEstadisticas() {
    const contarNodos = (nodo) => {
      if (!nodo) return {};

      const estadisticas = {};
      estadisticas[nodo.tipo] = (estadisticas[nodo.tipo] || 0) + 1;

      if (nodo.hijos) {
        nodo.hijos.forEach((hijo) => {
          const estadisticasHijo = contarNodos(hijo);
          Object.keys(estadisticasHijo).forEach((tipo) => {
            estadisticas[tipo] =
              (estadisticas[tipo] || 0) + estadisticasHijo[tipo];
          });
        });
      }

      return estadisticas;
    };

    return contarNodos(this.arbolSintactico);
  }

  /**
   * Analiza la sección ELIMINACION del torneo
   * ELIMINACION { fase: [lista de partidos] }
   */
  analizarSeccionEliminacion() {
    console.log("Analizando sección ELIMINACION...");

    const nodoEliminacion = this.crearNodo(
      this.TIPOS_NODO.ELIMINACION,
      "ELIMINACION"
    );

    // Esperar LLAVE_ABIERTA después de ELIMINACION
    this.esperarToken("LLAVE_ABIERTA");
    this.omitirTokensInnecesarios();

    // Analizar fases de eliminación
    while (this.tokenActual() && this.tokenActual().tipo !== "LLAVE_CERRADA") {
      const fase = this.analizarFaseEliminacion();
      if (fase) {
        nodoEliminacion.hijos.push(fase);
      }
      this.omitirTokensInnecesarios();
    }

    // Esperar LLAVE_CERRADA para cerrar ELIMINACION
    this.esperarToken("LLAVE_CERRADA");

    return nodoEliminacion;
  }

  /**
   * Analiza una fase de eliminación (ejemplo: cuartos_final, semi_final, final)
   * fase: [partido1, partido2, ...]
   */
  analizarFaseEliminacion() {
    if (!this.tokenActual() || this.tokenActual().tipo !== "IDENTIFICADOR") {
      return null;
    }

    const nombreFase = this.tokenActual().valor;
    const nodoFase = this.crearNodo(this.TIPOS_NODO.FASE, nombreFase);

    this.avanzar(); // Consumir nombre de la fase
    this.omitirTokensInnecesarios();

    this.esperarToken("DOS_PUNTOS");
    this.omitirTokensInnecesarios();

    this.esperarToken("CORCHETE_ABIERTO");
    this.omitirTokensInnecesarios();

    // Analizar partidos de la fase
    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO"
    ) {
      const partido = this.analizarPartidoEliminacion();
      if (partido) {
        nodoFase.hijos.push(partido);
      }

      this.omitirTokensInnecesarios();

      // Verificar si hay coma para más partidos
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar(); // Consumir coma
        this.omitirTokensInnecesarios();
      }
    }

    this.esperarToken("CORCHETE_CERRADO");

    return nodoFase;
  }

  /**
   * Analiza un partido de eliminación
   * partido { equipo1: "nombre", equipo2: "nombre", resultado: "goles", goleadores: [...] }
   */
  analizarPartidoEliminacion() {
    if (!this.tokenActual() || this.tokenActual().valor !== "partido") {
      this.errores.push({
        tipo: "ERROR_SINTACTICO",
        mensaje: 'Se esperaba la palabra clave "partido"',
        linea: this.tokenActual()?.linea || 0,
        columna: this.tokenActual()?.columna || 0,
      });
      return null;
    }

    this.avanzar(); // Consumir 'partido'
    const nodoPartido = this.crearNodo(this.TIPOS_NODO.PARTIDO, "partido");

    this.omitirTokensInnecesarios();
    this.esperarToken("LLAVE_ABIERTA");
    this.omitirTokensInnecesarios();

    // Analizar atributos del partido
    while (this.tokenActual() && this.tokenActual().tipo !== "LLAVE_CERRADA") {
      const atributo = this.analizarAtributoPartido();
      if (atributo) {
        nodoPartido.hijos.push(atributo);

        // Extraer información especial para el nodo partido
        if (atributo.valor === "equipo1") {
          nodoPartido.equipo1 = atributo.valor_atributo?.replace(/['"]/g, "");
        } else if (atributo.valor === "equipo2") {
          nodoPartido.equipo2 = atributo.valor_atributo?.replace(/['"]/g, "");
        }
      }

      this.omitirTokensInnecesarios();

      // Verificar si hay coma para más atributos
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar(); // Consumir coma
        this.omitirTokensInnecesarios();
      }
    }

    this.esperarToken("LLAVE_CERRADA");

    return nodoPartido;
  }

  /**
   * Analiza atributos específicos de un partido (equipo1, equipo2, resultado, goleadores)
   */
  analizarAtributoPartido() {
    if (!this.tokenActual() || this.tokenActual().tipo !== "IDENTIFICADOR") {
      return null;
    }

    const nombreAtributo = this.tokenActual().valor;
    const nodoAtributo = this.crearNodo(
      this.TIPOS_NODO.ATRIBUTO,
      nombreAtributo
    );

    this.avanzar(); // Consumir nombre del atributo
    this.omitirTokensInnecesarios();

    this.esperarToken("DOS_PUNTOS");
    this.omitirTokensInnecesarios();

    // Verificar si es una lista (goleadores) o un valor simple
    if (this.tokenActual() && this.tokenActual().tipo === "CORCHETE_ABIERTO") {
      // Es una lista (goleadores)
      const lista = this.analizarListaGoleadores();
      if (lista) {
        nodoAtributo.hijos.push(lista);
      }
    } else {
      // Es un valor simple (equipo1, equipo2, resultado)
      if (
        this.tokenActual() &&
        (this.tokenActual().tipo === "CADENA" ||
          this.tokenActual().tipo === "IDENTIFICADOR")
      ) {
        nodoAtributo.valor_atributo = this.tokenActual().valor;
        this.avanzar();
      } else {
        this.errores.push({
          tipo: "ERROR_SINTACTICO",
          mensaje: `Se esperaba un valor para el atributo "${nombreAtributo}"`,
          linea: this.tokenActual()?.linea || 0,
          columna: this.tokenActual()?.columna || 0,
        });
      }
    }

    return nodoAtributo;
  }

  /**
   * Analiza una lista de goleadores
   * [goleador1 { minuto: 45 }, goleador2 { minuto: 78 }]
   */
  analizarListaGoleadores() {
    const nodoLista = this.crearNodo(this.TIPOS_NODO.LISTA, "goleadores");

    this.esperarToken("CORCHETE_ABIERTO");
    this.omitirTokensInnecesarios();

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO"
    ) {
      const goleador = this.analizarGoleador();
      if (goleador) {
        nodoLista.hijos.push(goleador);
      }

      this.omitirTokensInnecesarios();

      // Verificar si hay coma para más goleadores
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar(); // Consumir coma
        this.omitirTokensInnecesarios();
      }
    }

    this.esperarToken("CORCHETE_CERRADO");

    return nodoLista;
  }

  /**
   * Analiza un goleador individual
   * goleador { minuto: valor }
   */
  analizarGoleador() {
    if (
      !this.tokenActual() ||
      (this.tokenActual().tipo !== "IDENTIFICADOR" &&
        this.tokenActual().tipo !== "CADENA")
    ) {
      return null;
    }

    const nombreGoleador = this.tokenActual().valor;
    const nodoGoleador = this.crearNodo(
      this.TIPOS_NODO.GOLEADOR,
      nombreGoleador
    );

    this.avanzar(); // Consumir nombre del goleador
    this.omitirTokensInnecesarios();

    this.esperarToken("LLAVE_ABIERTA");
    this.omitirTokensInnecesarios();

    // Analizar atributos del goleador (principalmente minuto)
    while (this.tokenActual() && this.tokenActual().tipo !== "LLAVE_CERRADA") {
      const atributo = this.analizarAtributo();
      if (atributo) {
        nodoGoleador.hijos.push(atributo);
      }

      this.omitirTokensInnecesarios();

      // Verificar si hay coma para más atributos
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar(); // Consumir coma
        this.omitirTokensInnecesarios();
      }
    }

    this.esperarToken("LLAVE_CERRADA");

    return nodoGoleador;
  }
}

module.exports = Parser;
