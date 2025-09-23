/**
 * Parser para TourneyJS
 * Analisis sintactico de archivos de torneos deportivos
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

    // Tipos de nodos del AST
    this.TIPOS_NODO = {
      PROGRAMA: "PROGRAMA",
      TORNEO: "TORNEO",
      EQUIPOS: "EQUIPOS",
      ELIMINACION: "ELIMINACION",
      EQUIPO: "EQUIPO",
      JUGADOR: "JUGADOR",
      PARTIDO: "PARTIDO",
      GOLEADOR: "GOLEADOR",
      ATRIBUTO: "ATRIBUTO",
      VALOR: "VALOR",
      LISTA: "LISTA",
      SECCION: "SECCION",
      PROPIEDAD: "PROPIEDAD",
      FASE: "FASE",
    };
  }

  // Metodos utilitarios basicos
  tokenActual() {
    return this.posicion < this.tokens.length
      ? this.tokens[this.posicion]
      : null;
  }

  avanzar() {
    if (this.posicion < this.tokens.length) {
      this.posicion++;
    }
  }

  esperarToken(tipoEsperado) {
    const token = this.tokenActual();
    if (!token) {
      this.errores.push({
        tipo: "ERROR_SINTACTICO",
        mensaje: `Se esperaba ${tipoEsperado} pero llegó al final`,
        linea: 0,
        columna: 0,
      });
      return null;
    }

    if (token.tipo !== tipoEsperado) {
      this.errores.push({
        tipo: "ERROR_SINTACTICO",
        mensaje: `Se esperaba ${tipoEsperado} pero se encontró ${token.tipo}: '${token.valor}'`,
        linea: token.linea,
        columna: token.columna,
      });
      return null;
    }

    this.avanzar();
    return token;
  }

  crearNodo(tipo, valor = null, hijos = []) {
    const token = this.tokenActual();
    return {
      tipo,
      valor,
      hijos: Array.isArray(hijos) ? hijos : [],
      linea: token?.linea || 0,
      columna: token?.columna || 0,
    };
  }

  omitirEspacios() {
    let iteraciones = 0;
    while (
      this.tokenActual() &&
      (this.tokenActual().tipo === "ESPACIO_BLANCO" ||
        this.tokenActual().tipo === "SALTO_LINEA" ||
        this.tokenActual().tipo === "COMENTARIO") &&
      iteraciones < 50
    ) {
      iteraciones++;
      this.avanzar();
    }
  }

  // Analizar seccion generica (TORNEO, EQUIPOS, ELIMINACION)
  analizarSeccion(tipoSeccion) {
    if (!this.esperarToken("SECCION_PRINCIPAL")) return null;
    if (!this.esperarToken("DOS_PUNTOS")) return null;
    if (!this.esperarToken("LLAVE_ABIERTA")) return null;

    const nodoSeccion = this.crearNodo(
      this.TIPOS_NODO[tipoSeccion],
      tipoSeccion
    );
    let elementosLeidos = 0;

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "LLAVE_CERRADA" &&
      elementosLeidos < 50
    ) {
      this.omitirEspacios();
      if (this.tokenActual() && this.tokenActual().tipo === "LLAVE_CERRADA") {
        break;
      }

      let elemento = null;

      // Manejar diferentes tipos de contenido segun la seccion
      if (tipoSeccion === "TORNEO") {
        elemento = this.analizarAtributoSimple();
      } else if (tipoSeccion === "EQUIPOS") {
        elemento = this.analizarEquipo();
      } else if (tipoSeccion === "ELIMINACION") {
        elemento = this.analizarFase();
      } else {
        elemento = this.analizarAtributoSimple();
      }

      if (elemento) {
        nodoSeccion.hijos.push(elemento);
        elementosLeidos++;
        if (tipoSeccion === "EQUIPOS") this.estadisticas.equipos++;
      } else {
        this.avanzar();
      }
    }

    if (!this.esperarToken("LLAVE_CERRADA")) return null;
    return nodoSeccion;
  }

  // Analisis principal
  parse() {
    console.log("Iniciando analisis del torneo...");
    this.omitirEspacios();

    const programa = this.crearNodo(this.TIPOS_NODO.PROGRAMA, "TourneyJS");
    let seccionesEncontradas = 0;
    const MAX_SECCIONES = 10;

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "EOF" &&
      seccionesEncontradas < MAX_SECCIONES
    ) {
      this.omitirEspacios();
      const token = this.tokenActual();

      if (!token || token.tipo === "EOF") {
        break;
      }

      if (token.tipo === "SECCION_PRINCIPAL") {
        console.log(`Analizando seccion: ${token.valor}`);
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
              mensaje: `Seccion no valida: ${token.valor}`,
              linea: token.linea,
              columna: token.columna,
            });
            this.avanzar();
        }

        if (seccion) {
          programa.hijos.push(seccion);
          seccionesEncontradas++;
        }
      } else {
        this.errores.push({
          tipo: "ERROR_SINTACTICO",
          mensaje: `Token inesperado: ${token.valor}`,
          linea: token.linea,
          columna: token.columna,
        });
        this.avanzar();
      }
    }

    console.log(
      `Analisis completado. Total secciones: ${seccionesEncontradas}`
    );
    return programa;
  }

  // Metodos para analizar secciones especificas
  analizarSeccionTorneo() {
    console.log("Analizando seccion TORNEO");
    this.avanzar(); // Saltar el token TORNEO

    if (!this.esperarToken("LLAVE_ABIERTA")) {
      return null;
    }

    const seccion = this.crearNodo(this.TIPOS_NODO.TORNEO, "TORNEO");

    while (this.tokenActual() && this.tokenActual().tipo !== "LLAVE_CERRADA") {
      this.omitirEspacios();

      const token = this.tokenActual();
      if (!token) break;

      if (token.tipo === "LLAVE_CERRADA") break;

      // Parsear propiedades simples como nombre: "valor", equipos: 8
      if (
        token.tipo === "IDENTIFICADOR" ||
        token.tipo === "PALABRA_RESERVADA"
      ) {
        const propiedad = this.analizarPropiedad();
        if (propiedad) {
          seccion.hijos.push(propiedad);
        }
      } else {
        this.avanzar();
      }
    }

    this.esperarToken("LLAVE_CERRADA");
    return seccion;
  }

  analizarSeccionEquipos() {
    console.log("Analizando seccion EQUIPOS");
    this.avanzar(); // Saltar el token EQUIPOS

    if (!this.esperarToken("LLAVE_ABIERTA")) {
      return null;
    }

    const seccion = this.crearNodo(this.TIPOS_NODO.EQUIPOS, "EQUIPOS");

    while (this.tokenActual() && this.tokenActual().tipo !== "LLAVE_CERRADA") {
      this.omitirEspacios();

      const token = this.tokenActual();
      if (!token || token.tipo === "LLAVE_CERRADA") break;

      // Buscar equipos
      if (token.tipo === "PALABRA_RESERVADA" && token.valor === "equipo") {
        const equipo = this.analizarEquipo();
        if (equipo) {
          seccion.hijos.push(equipo);
        }
      } else {
        this.avanzar();
      }
    }

    this.esperarToken("LLAVE_CERRADA");
    return seccion;
  }

  analizarSeccionEliminacion() {
    console.log("Analizando seccion ELIMINACION");
    this.avanzar(); // Saltar el token ELIMINACION

    if (!this.esperarToken("LLAVE_ABIERTA")) {
      return null;
    }

    const seccion = this.crearNodo(this.TIPOS_NODO.ELIMINACION, "ELIMINACION");

    while (this.tokenActual() && this.tokenActual().tipo !== "LLAVE_CERRADA") {
      this.omitirEspacios();

      const token = this.tokenActual();
      if (!token || token.tipo === "LLAVE_CERRADA") break;

      // Buscar fases (cuartos, semifinal, final)
      if (token.tipo === "PALABRA_RESERVADA") {
        const fase = this.analizarFase();
        if (fase) {
          seccion.hijos.push(fase);
        }
      } else {
        this.avanzar();
      }
    }

    this.esperarToken("LLAVE_CERRADA");
    return seccion;
  }

  // Metodo para analizar propiedades simples
  analizarPropiedad() {
    const token = this.tokenActual();
    if (!token) return null;

    const nombre = token.valor;
    this.avanzar();

    if (!this.esperarToken("DOS_PUNTOS")) return null;

    const valorToken = this.tokenActual();
    if (!valorToken) return null;

    const propiedad = this.crearNodo(this.TIPOS_NODO.ATRIBUTO, nombre);
    const valor = this.crearNodo(this.TIPOS_NODO.VALOR, valorToken.valor);
    propiedad.hijos.push(valor);

    this.avanzar();

    // Opcional: saltar coma
    if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
      this.avanzar();
    }

    return propiedad;
  }

  // Analisis de atributos
  analizarAtributoSimple() {
    this.omitirEspacios();
    const nombreToken = this.tokenActual();

    if (
      !nombreToken ||
      (nombreToken.tipo !== "PALABRA_RESERVADA" &&
        nombreToken.tipo !== "IDENTIFICADOR")
    ) {
      return null;
    }

    this.avanzar();
    const nodoAtributo = this.crearNodo(
      this.TIPOS_NODO.ATRIBUTO,
      nombreToken.valor
    );

    if (!this.esperarToken("DOS_PUNTOS")) return null;

    const valor = this.analizarValorSimple();
    if (valor) {
      nodoAtributo.hijos.push(valor);
    }

    // Coma opcional
    if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
      this.avanzar();
    }

    return nodoAtributo;
  }

  // Analizar equipo complejo: equipo: "nombre" [jugadores...]
  analizarEquipo() {
    this.omitirEspacios();
    const token = this.tokenActual();

    if (!token || token.valor !== "equipo") {
      return null;
    }

    this.avanzar(); // consumir "equipo"
    if (!this.esperarToken("DOS_PUNTOS")) return null;

    // Leer nombre del equipo
    const nombreToken = this.tokenActual();
    if (!nombreToken || nombreToken.tipo !== "CADENA") {
      this.errores.push({
        tipo: "ERROR_SINTACTICO",
        mensaje: "Se esperaba nombre del equipo",
        linea: nombreToken?.linea || 0,
        columna: nombreToken?.columna || 0,
      });
      return null;
    }
    this.avanzar();

    const nodoEquipo = this.crearNodo(
      this.TIPOS_NODO.EQUIPO,
      nombreToken.valor
    );

    // Leer lista de jugadores [...]
    if (this.tokenActual() && this.tokenActual().tipo === "CORCHETE_ABIERTO") {
      const listaJugadores = this.analizarListaJugadores();
      if (listaJugadores) {
        nodoEquipo.hijos.push(listaJugadores);
      }
    }

    // Coma opcional
    if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
      this.avanzar();
    }

    return nodoEquipo;
  }

  // Analizar lista de jugadores
  analizarListaJugadores() {
    if (!this.esperarToken("CORCHETE_ABIERTO")) return null;

    const nodoLista = this.crearNodo(this.TIPOS_NODO.LISTA, "jugadores");
    let jugadoresLeidos = 0;

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO" &&
      jugadoresLeidos < 30
    ) {
      this.omitirEspacios();
      if (
        this.tokenActual() &&
        this.tokenActual().tipo === "CORCHETE_CERRADO"
      ) {
        break;
      }

      const jugador = this.analizarJugador();
      if (jugador) {
        nodoLista.hijos.push(jugador);
        jugadoresLeidos++;
        this.estadisticas.jugadores++;
      } else {
        this.avanzar();
      }

      // Coma opcional entre jugadores
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
      }
    }

    if (!this.esperarToken("CORCHETE_CERRADO")) return null;
    return nodoLista;
  }

  // Analizar jugador: jugador: "nombre" [atributos...]
  analizarJugador() {
    this.omitirEspacios();
    const token = this.tokenActual();

    if (!token || token.valor !== "jugador") {
      return null;
    }

    this.avanzar(); // consumir "jugador"
    if (!this.esperarToken("DOS_PUNTOS")) return null;

    // Leer nombre del jugador
    const nombreToken = this.tokenActual();
    if (!nombreToken || nombreToken.tipo !== "CADENA") {
      return null;
    }
    this.avanzar();

    const nodoJugador = this.crearNodo(
      this.TIPOS_NODO.JUGADOR,
      nombreToken.valor
    );

    // Leer atributos del jugador [...]
    if (this.tokenActual() && this.tokenActual().tipo === "CORCHETE_ABIERTO") {
      const atributos = this.analizarAtributosJugador();
      if (atributos) {
        nodoJugador.hijos.push(atributos);
      }
    }

    return nodoJugador;
  }

  // Analizar atributos de jugador [posicion: "X", numero: Y, edad: Z]
  analizarAtributosJugador() {
    if (!this.esperarToken("CORCHETE_ABIERTO")) return null;

    const nodoAtributos = this.crearNodo(this.TIPOS_NODO.LISTA, "atributos");
    let atributosLeidos = 0;

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO" &&
      atributosLeidos < 10
    ) {
      this.omitirEspacios();
      if (
        this.tokenActual() &&
        this.tokenActual().tipo === "CORCHETE_CERRADO"
      ) {
        break;
      }

      const atributo = this.analizarAtributoSimple();
      if (atributo) {
        nodoAtributos.hijos.push(atributo);
        atributosLeidos++;
      } else {
        this.avanzar();
      }
    }

    if (!this.esperarToken("CORCHETE_CERRADO")) return null;
    return nodoAtributos;
  }

  // Analizar fase de eliminacion
  analizarFase() {
    this.omitirEspacios();
    const token = this.tokenActual();

    if (
      !token ||
      (token.tipo !== "PALABRA_RESERVADA" && token.tipo !== "IDENTIFICADOR")
    ) {
      return null;
    }

    this.avanzar(); // consumir nombre de la fase
    if (!this.esperarToken("DOS_PUNTOS")) return null;

    const nodoFase = this.crearNodo(this.TIPOS_NODO.FASE, token.valor);

    // Leer lista de partidos
    if (this.tokenActual() && this.tokenActual().tipo === "CORCHETE_ABIERTO") {
      const partidos = this.analizarListaPartidos();
      if (partidos && partidos.hijos) {
        // Agregar los partidos directamente como hijos de la fase
        nodoFase.hijos.push(...partidos.hijos);
      }
    }

    // Coma opcional
    if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
      this.avanzar();
    }

    return nodoFase;
  }

  // Analizar lista de partidos
  analizarListaPartidos() {
    if (!this.esperarToken("CORCHETE_ABIERTO")) return null;

    const nodoLista = this.crearNodo(this.TIPOS_NODO.LISTA, "partidos");
    let partidosLeidos = 0;

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO" &&
      partidosLeidos < 20
    ) {
      this.omitirEspacios();
      if (
        this.tokenActual() &&
        this.tokenActual().tipo === "CORCHETE_CERRADO"
      ) {
        break;
      }

      const partido = this.analizarPartido();
      if (partido) {
        nodoLista.hijos.push(partido);
        partidosLeidos++;
        this.estadisticas.partidos++;
      } else {
        this.avanzar();
      }

      // Coma opcional
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
      }
    }

    if (!this.esperarToken("CORCHETE_CERRADO")) return null;
    return nodoLista;
  }

  // Analizar partido: partido: "equipo1" vs "equipo2" [resultado, goleadores]
  analizarPartido() {
    this.omitirEspacios();
    const token = this.tokenActual();

    if (!token || token.valor !== "partido") {
      return null;
    }

    this.avanzar(); // consumir "partido"
    if (!this.esperarToken("DOS_PUNTOS")) return null;

    // Leer equipo1
    const equipo1Token = this.tokenActual();
    if (!equipo1Token || equipo1Token.tipo !== "CADENA") {
      return null;
    }
    this.avanzar();

    // Leer "vs"
    if (!this.esperarToken("VS")) return null;

    // Leer equipo2
    const equipo2Token = this.tokenActual();
    if (!equipo2Token || equipo2Token.tipo !== "CADENA") {
      return null;
    }
    this.avanzar();

    const nodoPartido = this.crearNodo(
      this.TIPOS_NODO.PARTIDO,
      `${equipo1Token.valor} vs ${equipo2Token.valor}`
    );

    // Leer detalles del partido [...]
    if (this.tokenActual() && this.tokenActual().tipo === "CORCHETE_ABIERTO") {
      const detalles = this.analizarDetallesPartido();
      if (detalles) {
        nodoPartido.hijos.push(detalles);
      }
    }

    return nodoPartido;
  }

  // Analizar detalles del partido [resultado: "X-Y", goleadores: [...]]
  analizarDetallesPartido() {
    if (!this.esperarToken("CORCHETE_ABIERTO")) return null;

    const nodoDetalles = this.crearNodo(this.TIPOS_NODO.LISTA, "detalles");
    let detallesLeidos = 0;

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO" &&
      detallesLeidos < 10
    ) {
      this.omitirEspacios();
      if (
        this.tokenActual() &&
        this.tokenActual().tipo === "CORCHETE_CERRADO"
      ) {
        break;
      }

      const detalle = this.analizarDetallePartido();
      if (detalle) {
        nodoDetalles.hijos.push(detalle);
        detallesLeidos++;
      } else {
        this.avanzar();
      }
    }

    if (!this.esperarToken("CORCHETE_CERRADO")) return null;
    return nodoDetalles;
  }

  // Analizar detalle especifico del partido (resultado o goleadores)
  analizarDetallePartido() {
    this.omitirEspacios();
    const token = this.tokenActual();

    if (!token) return null;

    if (token.valor === "resultado") {
      return this.analizarAtributoSimple();
    } else if (token.valor === "goleadores") {
      this.avanzar();
      if (!this.esperarToken("DOS_PUNTOS")) return null;

      const nodoGoleadores = this.crearNodo(
        this.TIPOS_NODO.LISTA,
        "goleadores"
      );

      if (
        this.tokenActual() &&
        this.tokenActual().tipo === "CORCHETE_ABIERTO"
      ) {
        const listaGoleadores = this.analizarListaGoleadores();
        if (listaGoleadores) {
          nodoGoleadores.hijos.push(listaGoleadores);
        }
      }

      return nodoGoleadores;
    }

    return this.analizarAtributoSimple();
  }

  // Analizar lista de goleadores
  analizarListaGoleadores() {
    if (!this.esperarToken("CORCHETE_ABIERTO")) return null;

    const nodoLista = this.crearNodo(this.TIPOS_NODO.LISTA, "lista_goleadores");
    let goleadoresLeidos = 0;

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO" &&
      goleadoresLeidos < 20
    ) {
      this.omitirEspacios();
      if (
        this.tokenActual() &&
        this.tokenActual().tipo === "CORCHETE_CERRADO"
      ) {
        break;
      }

      const goleador = this.analizarGoleador();
      if (goleador) {
        nodoLista.hijos.push(goleador);
        goleadoresLeidos++;
        this.estadisticas.goleadores++;
      } else {
        this.avanzar();
      }

      // Coma opcional
      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
      }
    }

    if (!this.esperarToken("CORCHETE_CERRADO")) return null;
    return nodoLista;
  }

  // Analizar goleador: goleador: "nombre" [minuto: X]
  analizarGoleador() {
    this.omitirEspacios();
    const token = this.tokenActual();

    if (!token || token.valor !== "goleador") {
      return null;
    }

    this.avanzar(); // consumir "goleador"
    if (!this.esperarToken("DOS_PUNTOS")) return null;

    // Leer nombre del goleador
    const nombreToken = this.tokenActual();
    if (!nombreToken || nombreToken.tipo !== "CADENA") {
      return null;
    }
    this.avanzar();

    const nodoGoleador = this.crearNodo(
      this.TIPOS_NODO.GOLEADOR,
      nombreToken.valor
    );

    // Leer atributos del goleador [minuto: X]
    if (this.tokenActual() && this.tokenActual().tipo === "CORCHETE_ABIERTO") {
      const atributos = this.analizarAtributosJugador(); // reutilizar el mismo metodo
      if (atributos) {
        nodoGoleador.hijos.push(atributos);
      }
    }

    return nodoGoleador;
  }

  // Analisis de valores
  analizarValorSimple() {
    this.omitirEspacios();
    const token = this.tokenActual();

    if (!token) return null;

    // Valores directos
    if (
      token.tipo === "CADENA" ||
      token.tipo === "NUMERO" ||
      token.tipo === "IDENTIFICADOR"
    ) {
      this.avanzar();
      return this.crearNodo(this.TIPOS_NODO.VALOR, token.valor);
    }

    // Listas simples
    if (token.tipo === "CORCHETE_ABIERTO") {
      return this.analizarListaSimple();
    }

    // Objetos simples
    if (token.tipo === "LLAVE_ABIERTA") {
      return this.analizarObjetoSimple();
    }

    return null;
  }

  // Lista simple
  analizarListaSimple() {
    if (!this.esperarToken("CORCHETE_ABIERTO")) return null;

    const nodoLista = this.crearNodo(this.TIPOS_NODO.LISTA, "[]");
    let elementosLeidos = 0;

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "CORCHETE_CERRADO" &&
      elementosLeidos < 50
    ) {
      this.omitirEspacios();
      if (
        this.tokenActual() &&
        this.tokenActual().tipo === "CORCHETE_CERRADO"
      ) {
        break;
      }

      const valor = this.analizarValorSimple();
      if (valor) {
        nodoLista.hijos.push(valor);
        elementosLeidos++;
      } else {
        this.avanzar();
      }

      if (this.tokenActual() && this.tokenActual().tipo === "COMA") {
        this.avanzar();
      }
    }

    if (!this.esperarToken("CORCHETE_CERRADO")) return null;
    return nodoLista;
  }

  // Objeto simple
  analizarObjetoSimple() {
    if (!this.esperarToken("LLAVE_ABIERTA")) return null;

    const nodoObjeto = this.crearNodo(this.TIPOS_NODO.EQUIPO, "{}");
    let atributosLeidos = 0;

    while (
      this.tokenActual() &&
      this.tokenActual().tipo !== "LLAVE_CERRADA" &&
      atributosLeidos < 20
    ) {
      this.omitirEspacios();
      if (this.tokenActual() && this.tokenActual().tipo === "LLAVE_CERRADA") {
        break;
      }

      const atributo = this.analizarAtributoSimple();
      if (atributo) {
        nodoObjeto.hijos.push(atributo);
        atributosLeidos++;
      } else {
        this.avanzar();
      }
    }

    if (!this.esperarToken("LLAVE_CERRADA")) return null;
    return nodoObjeto;
  }

  // Metodo parse principal
  parsePublic() {
    console.log("=== INICIANDO ANALISIS SINTACTICO ===");

    try {
      const resultado = this.parse();

      return {
        exito:
          this.errores.filter((e) => e.tipo.includes("ERROR")).length === 0,
        arbol: resultado,
        errores: this.errores,
        estadisticas: this.obtenerEstadisticas(),
      };
    } catch (error) {
      console.error("Error critico en parser:", error.message);
      return {
        exito: false,
        arbol: null,
        errores: [
          ...this.errores,
          {
            tipo: "ERROR_CRITICO",
            mensaje: error.message,
            linea: 0,
            columna: 0,
          },
        ],
      };
    }
  }

  obtenerEstadisticas() {
    return {
      ...this.estadisticas,
      totalTokens: this.tokens.length,
      errores: this.errores.length,
      advertencias: this.errores.filter((e) => e.tipo.includes("ADVERTENCIA"))
        .length,
      erroresCriticos: this.errores.filter((e) => e.tipo.includes("CRITICO"))
        .length,
      analisisExitoso:
        this.errores.filter((e) => e.tipo.includes("ERROR")).length === 0,
    };
  }

  obtenerResumenAnalisis() {
    const stats = this.obtenerEstadisticas();
    return {
      resumen: `Analisis ${stats.analisisExitoso ? "exitoso" : "con errores"}`,
      detalles: {
        equipos: stats.equipos,
        jugadores: stats.jugadores,
        partidos: stats.partidos,
        goleadores: stats.goleadores,
      },
      calidad: {
        errores: stats.errores,
        advertencias: stats.advertencias,
        criticos: stats.erroresCriticos,
      },
    };
  }
}

// Exportación para Node.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = Parser;
}

// Exportación para navegador
if (typeof window !== "undefined") {
  window.Parser = Parser;
}
