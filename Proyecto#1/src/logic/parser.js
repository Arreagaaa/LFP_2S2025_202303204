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
      goleadores: 0
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
      LISTA: "LISTA"
    };
  }

  // Metodos utilitarios basicos
  tokenActual() {
    return this.posicion < this.tokens.length ? this.tokens[this.posicion] : null;
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
        columna: 0
      });
      return null;
    }

    if (token.tipo !== tipoEsperado) {
      this.errores.push({
        tipo: "ERROR_SINTACTICO", 
        mensaje: `Se esperaba ${tipoEsperado} pero se encontró ${token.tipo}: '${token.valor}'`,
        linea: token.linea,
        columna: token.columna
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
      columna: token?.columna || 0
    };
  }

  omitirEspacios() {
    let iteraciones = 0;
    while (this.tokenActual() && 
           (this.tokenActual().tipo === "ESPACIO_BLANCO" || 
            this.tokenActual().tipo === "SALTO_LINEA" ||
            this.tokenActual().tipo === "COMENTARIO") &&
           iteraciones < 50) {
      iteraciones++;
      this.avanzar();
    }
  }

  // Analizar seccion generica (TORNEO, EQUIPOS, ELIMINACION)
  analizarSeccion(tipoSeccion) {
    if (!this.esperarToken("SECCION_PRINCIPAL")) return null;
    if (!this.esperarToken("DOS_PUNTOS")) return null;
    if (!this.esperarToken("LLAVE_ABIERTA")) return null;

    const nodoSeccion = this.crearNodo(this.TIPOS_NODO[tipoSeccion], tipoSeccion);
    let elementosLeidos = 0;

    while (this.tokenActual() && 
           this.tokenActual().tipo !== "LLAVE_CERRADA" && 
           elementosLeidos < 50) {
      
      this.omitirEspacios();
      if (this.tokenActual() && this.tokenActual().tipo === "LLAVE_CERRADA") {
        break;
      }

      const elemento = this.analizarAtributoSimple();
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
  analizarTorneo() {
    console.log("Iniciando analisis del torneo...");
    this.omitirEspacios();
    
    const programa = this.crearNodo(this.TIPOS_NODO.PROGRAMA, "TourneyJS");
    let seccionesEncontradas = 0;
    const MAX_SECCIONES = 10;

    while (this.tokenActual() && 
           this.tokenActual().tipo !== "EOF" && 
           seccionesEncontradas < MAX_SECCIONES) {
      
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
            seccion = this.analizarSeccion("TORNEO");
            break;
          case "EQUIPOS": 
            seccion = this.analizarSeccion("EQUIPOS");
            break;
          case "ELIMINACION":
            seccion = this.analizarSeccion("ELIMINACION");
            break;
          default:
            this.errores.push({
              tipo: "ERROR_SINTACTICO",
              mensaje: `Seccion no valida: ${token.valor}`,
              linea: token.linea,
              columna: token.columna
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
          columna: token.columna
        });
        this.avanzar();
      }
    }

    console.log(`Analisis completado. Total secciones: ${seccionesEncontradas}`);
    return programa;
  }

  // Analisis de atributos
  analizarAtributoSimple() {
    this.omitirEspacios();
    const nombreToken = this.tokenActual();
    
    if (!nombreToken || 
        (nombreToken.tipo !== "PALABRA_RESERVADA" && nombreToken.tipo !== "IDENTIFICADOR")) {
      return null;
    }

    this.avanzar();
    const nodoAtributo = this.crearNodo(this.TIPOS_NODO.ATRIBUTO, nombreToken.valor);

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

  // Analisis de valores
  analizarValorSimple() {
    this.omitirEspacios();
    const token = this.tokenActual();

    if (!token) return null;

    // Valores directos
    if (token.tipo === "CADENA" || token.tipo === "NUMERO" || token.tipo === "IDENTIFICADOR") {
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

    while (this.tokenActual() && 
           this.tokenActual().tipo !== "CORCHETE_CERRADO" && 
           elementosLeidos < 50) {
      
      this.omitirEspacios();
      if (this.tokenActual() && this.tokenActual().tipo === "CORCHETE_CERRADO") {
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

    while (this.tokenActual() && 
           this.tokenActual().tipo !== "LLAVE_CERRADA" && 
           atributosLeidos < 20) {
      
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

  // Analisis de equipos
  analizarEquipoSimple() {
    const token = this.tokenActual();
    if (!token || token.valor !== "equipo") {
      return null;
    }

    this.avanzar();
    if (!this.esperarToken("DOS_PUNTOS")) return null;

    const nodoEquipo = this.crearNodo(this.TIPOS_NODO.EQUIPO, "equipo");
    
    const valor = this.analizarValorSimple();
    if (valor) {
      nodoEquipo.hijos.push(valor);
    }

    return nodoEquipo;
  }

  // Analisis de fases
  analizarFaseSimple() {
    const token = this.tokenActual();
    if (!token || (token.tipo !== "PALABRA_RESERVADA" && token.tipo !== "IDENTIFICADOR")) {
      return null;
    }

    this.avanzar();
    if (!this.esperarToken("DOS_PUNTOS")) return null;

    const nodoFase = this.crearNodo(this.TIPOS_NODO.FASE, token.valor);
    
    const valor = this.analizarValorSimple();
    if (valor) {
      nodoFase.hijos.push(valor);
    }

    return nodoFase;
  }

  // Método principal de análisis - SEGURO
  analizarTorneo() {
    console.log("Iniciando análisis sintáctico seguro...");
    
    try {
      this.omitirEspacios();
      const programa = this.crearNodo(this.TIPOS_NODO.PROGRAMA, "TourneyJS");
      
      let seccionesEncontradas = 0;
      const MAX_SECCIONES = 5; // Máximo 5 secciones
      
      while (this.tokenActual() && 
             this.tokenActual().tipo !== "EOF" && 
             seccionesEncontradas < MAX_SECCIONES) {
        
        console.log(`Procesando sección ${seccionesEncontradas + 1}...`);
        this.omitirEspacios();
        
        const token = this.tokenActual();
        if (!token || token.tipo === "EOF") {
          break;
        }

        if (token.tipo === "SECCION_PRINCIPAL") {
          let seccion = null;

          switch (token.valor) {
            case "TORNEO":
              seccion = this.analizarSeccionTorneoSimple();
              break;
            case "EQUIPOS":
              seccion = this.analizarSeccionEquiposSimple(); 
              break;
            case "ELIMINACION":
              seccion = this.analizarSeccionEliminacionSimple();
              break;
            default:
              this.errores.push({
                tipo: "ERROR_SINTACTICO",
                mensaje: `Sección no válida: ${token.valor}`,
                linea: token.linea,
                columna: token.columna
              });
              this.avanzar();
          }

          if (seccion) {
            programa.hijos.push(seccion);
            seccionesEncontradas++;
            console.log(`✓ Sección ${token.valor} analizada exitosamente`);
          }
        } else {
          this.errores.push({
            tipo: "ERROR_SINTACTICO",
            mensaje: `Token inesperado: ${token.valor}`,
            linea: token.linea,
            columna: token.columna
          });
          this.avanzar();
        }
      }

      console.log(`Análisis completado. Total secciones: ${seccionesEncontradas}`);
      this.arbolSintactico = programa;
      return programa;
      
    } catch (error) {
      console.error("Error en análisis:", error.message);
      this.errores.push({
        tipo: "ERROR_CRITICO",
        mensaje: `Error crítico: ${error.message}`,
        linea: 0,
        columna: 0
      });
      return null;
    }
  }

  // Metodo parse principal
  parse() {
    console.log("=== INICIANDO ANALISIS SINTACTICO ===");
    
    try {
      const resultado = this.analizarTorneo();
      
      return {
        exito: this.errores.filter(e => e.tipo.includes("ERROR")).length === 0,
        arbol: resultado,
        errores: this.errores,
        estadisticas: this.obtenerEstadisticas()
      };
    } catch (error) {
      console.error("Error critico en parser:", error.message);
      return {
        exito: false,
        arbol: null,
        errores: [...this.errores, {
          tipo: "ERROR_CRITICO",
          mensaje: error.message,
          linea: 0,
          columna: 0
        }]
      };
    }
  }

  obtenerEstadisticas() {
    return {
      ...this.estadisticas,
      totalTokens: this.tokens.length,
      errores: this.errores.length,
      advertencias: this.errores.filter(e => e.tipo.includes("ADVERTENCIA")).length,
      erroresCriticos: this.errores.filter(e => e.tipo.includes("CRITICO")).length,
      analisisExitoso: this.errores.filter(e => e.tipo.includes("ERROR")).length === 0
    };
  }

  obtenerResumenAnalisis() {
    const stats = this.obtenerEstadisticas();
    return {
      resumen: `Analisis ${stats.analisisExitoso ? 'exitoso' : 'con errores'}`,
      detalles: {
        equipos: stats.equipos,
        jugadores: stats.jugadores,
        partidos: stats.partidos,
        goleadores: stats.goleadores
      },
      calidad: {
        errores: stats.errores,
        advertencias: stats.advertencias,
        criticos: stats.erroresCriticos
      }
    };
  }
}

module.exports = Parser;