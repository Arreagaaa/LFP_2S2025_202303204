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
    // File upload elements
    this.uploadSection = document.getElementById("uploadSection");
    this.fileInput = document.getElementById("fileInput");
    this.uploadBtn = document.getElementById("uploadBtn");
    this.fileName = document.getElementById("fileName");

    // Action buttons
    this.btnLexer = document.getElementById("btnLexer");
    this.btnParser = document.getElementById("btnParser");
    this.btnComplete = document.getElementById("btnComplete");
    this.btnTokens = document.getElementById("btnTokens");
    this.btnAst = document.getElementById("btnAst");
    this.btnErrors = document.getElementById("btnErrors");

    // Results elements
    this.statusMessage = document.getElementById("statusMessage");
    this.resultsSection = document.getElementById("resultsSection");
    this.resultsContent = document.getElementById("resultsContent");
    this.reportLinksSection = document.getElementById("reportLinksSection");
  }

  attachEventListeners() {
    // File upload events
    this.uploadBtn.addEventListener("click", () => this.fileInput.click());
    this.fileInput.addEventListener("change", (e) => this.handleFileSelect(e));

    // Drag and drop events
    this.uploadSection.addEventListener("dragover", (e) =>
      this.handleDragOver(e)
    );
    this.uploadSection.addEventListener("dragleave", (e) =>
      this.handleDragLeave(e)
    );
    this.uploadSection.addEventListener("drop", (e) => this.handleDrop(e));

    // Action button events
    this.btnLexer.addEventListener("click", () =>
      this.executeAnalysis("lexer")
    );
    this.btnParser.addEventListener("click", () =>
      this.executeAnalysis("parser")
    );
    this.btnComplete.addEventListener("click", () =>
      this.executeAnalysis("complete")
    );
    this.btnTokens.addEventListener("click", () => this.showTokens());
    this.btnAst.addEventListener("click", () => this.showAST());
    this.btnErrors.addEventListener("click", () => this.showErrors());

    // Report button events
    document.getElementById("reportErrores").addEventListener("click", (e) => {
      e.preventDefault();
      this.generateErrorReport();
    });
    document.getElementById("reportTokens").addEventListener("click", (e) => {
      e.preventDefault();
      this.generateTokenReport();
    });
    document.getElementById("reportBracket").addEventListener("click", (e) => {
      e.preventDefault();
      this.generateBracketReport();
    });
    document.getElementById("reportEquipos").addEventListener("click", (e) => {
      e.preventDefault();
      this.generateTeamStats();
    });
    document
      .getElementById("reportGoleadores")
      .addEventListener("click", (e) => {
        e.preventDefault();
        this.generateScorersReport();
      });
    document.getElementById("reportGeneral").addEventListener("click", (e) => {
      e.preventDefault();
      this.generateGeneralReport();
    });
    document.getElementById("reportGraphviz").addEventListener("click", (e) => {
      e.preventDefault();
      this.generateGraphvizDiagram();
    });
    document.getElementById("reportTodos").addEventListener("click", (e) => {
      e.preventDefault();
      this.generateAllReports();
    });
  }

  handleDragOver(e) {
    e.preventDefault();
    this.uploadSection.classList.add("dragover");
  }

  handleDragLeave(e) {
    e.preventDefault();
    this.uploadSection.classList.remove("dragover");
  }

  handleDrop(e) {
    e.preventDefault();
    this.uploadSection.classList.remove("dragover");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.processFile(files[0]);
    }
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
      this.currentContent = await this.readFileContent(file);

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
    this.btnLexer.disabled = false;
    this.btnParser.disabled = false;
    this.btnComplete.disabled = false;
  }

  resetResults() {
    this.tokens = [];
    this.ast = null;
    this.errors = [];
    this.lexer = null;
    this.parser = null;

    this.btnTokens.disabled = true;
    this.btnAst.disabled = true;
    this.btnErrors.disabled = true;

    this.resultsSection.style.display = "none";
    this.reportLinksSection.style.display = "none";
  }

  async executeAnalysis(type) {
    if (!this.currentContent) {
      this.showStatus("Primero debe cargar un archivo", "error");
      return;
    }

    try {
      this.showStatus("Ejecutando análisis...", "info");

      switch (type) {
        case "lexer":
          await this.runLexicalAnalysis();
          break;
        case "parser":
          if (!this.tokens.length) {
            await this.runLexicalAnalysis();
          }
          await this.runSyntacticAnalysis();
          break;
        case "complete":
          await this.runCompleteAnalysis();
          break;
      }

      this.updateResultsDisplay();
      this.showStatus("Análisis completado exitosamente", "success");
    } catch (error) {
      this.showStatus(`Error durante el análisis: ${error.message}`, "error");
    }
  }

  async runLexicalAnalysis() {
    try {
      // Simulamos el análisis léxico con un lexer simplificado
      this.lexer = this.createSimpleLexer();
      const result = this.lexer.tokenize(this.currentContent);
      this.tokens = result.tokens;
      this.errors = [...this.errors, ...result.errors];

      this.btnTokens.disabled = false;
      this.btnErrors.disabled = false;
    } catch (error) {
      throw new Error(`Error en análisis léxico: ${error.message}`);
    }
  }

  async runSyntacticAnalysis() {
    try {
      if (!this.tokens.length) {
        throw new Error("Primero debe ejecutar el análisis léxico");
      }

      // Simulamos el análisis sintáctico con un parser simplificado
      this.parser = this.createSimpleParser();
      const result = this.parser.parse(this.tokens);
      this.ast = result.ast;
      this.errors = [...this.errors, ...result.errors];

      this.btnAst.disabled = false;
    } catch (error) {
      throw new Error(`Error en análisis sintáctico: ${error.message}`);
    }
  }

  async runCompleteAnalysis() {
    await this.runLexicalAnalysis();
    await this.runSyntacticAnalysis();
  }

  createSimpleLexer() {
    return {
      tokenize: (content) => {
        const tokens = [];
        const errors = [];

        let position = 0;
        let line = 1;
        let column = 1;

        // Palabras reservadas y patrones
        const keywords = new Set([
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

        const positions = new Set([
          "PORTERO",
          "DEFENSA",
          "MEDIOCAMPO",
          "DELANTERO",
        ]);

        while (position < content.length) {
          const char = content[position];

          // Saltar espacios en blanco
          if (/\s/.test(char)) {
            if (char === "\n") {
              line++;
              column = 1;
            } else {
              column++;
            }
            position++;
            continue;
          }

          // Comentarios de línea //
          if (char === "/" && content[position + 1] === "/") {
            while (position < content.length && content[position] !== "\n") {
              position++;
            }
            continue;
          }

          // Comentarios de bloque /* */
          if (char === "/" && content[position + 1] === "*") {
            position += 2;
            while (position < content.length - 1) {
              if (content[position] === "*" && content[position + 1] === "/") {
                position += 2;
                break;
              }
              if (content[position] === "\n") {
                line++;
                column = 1;
              } else {
                column++;
              }
              position++;
            }
            continue;
          }

          // Cadenas entre comillas
          if (char === '"') {
            const startPos = position;
            const startCol = column;
            let str = "";
            position++; // Saltar la comilla inicial
            column++;

            while (position < content.length && content[position] !== '"') {
              str += content[position];
              if (content[position] === "\n") {
                line++;
                column = 1;
              } else {
                column++;
              }
              position++;
            }

            if (position < content.length) {
              position++; // Saltar la comilla final
              column++;
            } else {
              errors.push({
                tipo: "ERROR_LEXICO",
                mensaje: "Cadena sin cerrar",
                linea: line,
                columna: startCol,
                lexema: '"' + str,
              });
            }

            tokens.push({
              tipo: "CADENA",
              valor: str, // Sin las comillas
              linea: line,
              columna: startCol,
            });
            continue;
          } // Números
          if (/\d/.test(char)) {
            const startCol = column;
            let num = "";

            while (
              position < content.length &&
              /[\d.]/.test(content[position])
            ) {
              num += content[position];
              position++;
              column++;
            }

            tokens.push({
              tipo: "NUMERO",
              valor: num,
              linea: line,
              columna: startCol,
            });
            continue;
          }

          // Identificadores y palabras reservadas
          if (/[a-zA-Z_]/.test(char)) {
            const startCol = column;
            let word = "";

            while (
              position < content.length &&
              /[a-zA-Z0-9_]/.test(content[position])
            ) {
              word += content[position];
              position++;
              column++;
            }

            let tokenType = "IDENTIFICADOR";

            if (["TORNEO", "EQUIPOS", "ELIMINACION"].includes(word)) {
              tokenType = "SECCION_PRINCIPAL";
            } else if (keywords.has(word)) {
              tokenType = "PALABRA_RESERVADA";
            } else if (positions.has(word)) {
              tokenType = "POSICION_JUGADOR";
            }

            tokens.push({
              tipo: tokenType,
              valor: word,
              linea: line,
              columna: startCol,
            });
            continue;
          }

          // Símbolos especiales
          const symbols = {
            "{": "LLAVE_ABIERTA",
            "}": "LLAVE_CERRADA",
            "[": "CORCHETE_ABIERTO",
            "]": "CORCHETE_CERRADO",
            ":": "DOS_PUNTOS",
            ",": "COMA",
            "-": "GUION",
          };

          if (symbols[char]) {
            tokens.push({
              tipo: symbols[char],
              valor: char,
              linea: line,
              columna: column,
            });
            position++;
            column++;
            continue;
          }

          // Operador vs
          if (
            char === "v" &&
            content[position + 1] === "s" &&
            (position + 2 >= content.length || /\s/.test(content[position + 2]))
          ) {
            tokens.push({
              tipo: "VS",
              valor: "vs",
              linea: line,
              columna: column,
            });
            position += 2;
            column += 2;
            continue;
          }

          // Caracter no reconocido
          errors.push({
            tipo: "ERROR_LEXICO",
            mensaje: `Caracter no reconocido: '${char}'`,
            linea: line,
            columna: column,
            lexema: char,
          });

          position++;
          column++;
        }

        // Agregar token EOF
        tokens.push({
          tipo: "EOF",
          valor: "",
          linea: line,
          columna: column,
        });

        return { tokens, errors };
      },
    };
  }

  createSimpleParser() {
    return {
      parse: (tokens) => {
        const errors = [];
        const ast = {
          tipo: "PROGRAMA",
          valor: "TourneyJS",
          hijos: [],
          linea: 1,
          columna: 1,
        };

        let position = 0;
        const currentToken = () => tokens[position] || { tipo: "EOF" };
        const advance = () => position++;
        const peek = (offset = 1) =>
          tokens[position + offset] || { tipo: "EOF" };

        const expectToken = (expectedType, customMessage = null) => {
          const token = currentToken();
          if (token.tipo === expectedType) {
            advance();
            return token;
          } else {
            const message =
              customMessage ||
              `Se esperaba ${expectedType}, se encontró ${token.tipo}`;
            errors.push({
              tipo: "ERROR_SINTACTICO",
              mensaje: message,
              linea: token.linea || 1,
              columna: token.columna || 1,
              token: token.valor,
            });
            return null;
          }
        };

        const parseValue = () => {
          const token = currentToken();
          if (
            ["CADENA", "NUMERO", "IDENTIFICADOR", "POSICION_JUGADOR"].includes(
              token.tipo
            )
          ) {
            advance();
            return {
              tipo: "VALOR",
              valor: token.valor,
              tipoToken: token.tipo,
              linea: token.linea,
              columna: token.columna,
            };
          }
          return null;
        };

        const parseProperty = () => {
          const nameToken = currentToken();
          if (["PALABRA_RESERVADA", "IDENTIFICADOR"].includes(nameToken.tipo)) {
            advance();

            if (currentToken().tipo === "DOS_PUNTOS") {
              advance();

              // Manejar diferentes tipos de valores
              if (currentToken().tipo === "CORCHETE_ABIERTO") {
                // Es un array/lista
                return {
                  tipo: "PROPIEDAD_LISTA",
                  nombre: nameToken.valor,
                  valor: parseArray(),
                  linea: nameToken.linea,
                  columna: nameToken.columna,
                };
              } else {
                // Es un valor simple
                const value = parseValue();
                if (value) {
                  return {
                    tipo: "PROPIEDAD",
                    nombre: nameToken.valor,
                    valor: value,
                    linea: nameToken.linea,
                    columna: nameToken.columna,
                  };
                }
              }
            }
          }
          return null;
        };

        // Función especial para parsear equipos con la nueva sintaxis
        const parseEquipo = () => {
          if (currentToken().valor !== "equipo") return null;

          const equipoToken = currentToken();
          advance(); // consume 'equipo'

          if (currentToken().tipo !== "DOS_PUNTOS") return null;
          advance(); // consume ':'

          const nombreEquipo = currentToken();
          if (nombreEquipo.tipo !== "CADENA") return null;
          advance(); // consume nombre

          const equipo = {
            tipo: "EQUIPO",
            nombre: nombreEquipo.valor,
            jugadores: [],
            linea: equipoToken.linea,
            columna: equipoToken.columna,
          };

          if (currentToken().tipo === "CORCHETE_ABIERTO") {
            advance(); // consume '['

            while (
              currentToken().tipo !== "CORCHETE_CERRADO" &&
              currentToken().tipo !== "EOF"
            ) {
              if (currentToken().valor === "jugador") {
                const jugadorToken = currentToken();
                advance(); // consume 'jugador'

                if (currentToken().tipo === "DOS_PUNTOS") {
                  advance();

                  const nombreJugador = currentToken();
                  if (nombreJugador.tipo === "CADENA") {
                    advance();

                    const jugador = {
                      tipo: "JUGADOR",
                      nombre: nombreJugador.valor,
                      propiedades: [],
                      linea: jugadorToken.linea,
                      columna: jugadorToken.columna,
                    };

                    if (currentToken().tipo === "CORCHETE_ABIERTO") {
                      advance(); // consume '['

                      while (
                        currentToken().tipo !== "CORCHETE_CERRADO" &&
                        currentToken().tipo !== "EOF"
                      ) {
                        if (
                          ["PALABRA_RESERVADA", "IDENTIFICADOR"].includes(
                            currentToken().tipo
                          )
                        ) {
                          const propName = currentToken().valor;
                          advance();

                          if (currentToken().tipo === "DOS_PUNTOS") {
                            advance();
                            const value = parseValue();
                            if (value) {
                              jugador.propiedades.push({
                                nombre: propName,
                                valor: value.valor,
                              });
                            }
                          }
                        }

                        if (currentToken().tipo === "COMA") {
                          advance();
                        } else if (currentToken().tipo !== "CORCHETE_CERRADO") {
                          advance(); // Saltar token problemático
                        }
                      }

                      if (currentToken().tipo === "CORCHETE_CERRADO") {
                        advance(); // consume ']'
                      }
                    }

                    equipo.jugadores.push(jugador);
                  }
                }
              }

              if (currentToken().tipo === "COMA") {
                advance();
              } else if (currentToken().tipo !== "CORCHETE_CERRADO") {
                advance(); // Saltar token problemático
              }
            }

            if (currentToken().tipo === "CORCHETE_CERRADO") {
              advance(); // consume ']'
            }
          }

          return equipo;
        };

        // Función especial para parsear partidos
        const parsePartido = () => {
          if (currentToken().valor !== "partido") return null;

          const partidoToken = currentToken();
          advance(); // consume 'partido'

          if (currentToken().tipo !== "DOS_PUNTOS") return null;
          advance(); // consume ':'

          const equipo1 = currentToken();
          if (equipo1.tipo !== "CADENA") return null;
          advance(); // consume equipo1

          if (currentToken().tipo !== "VS") return null;
          advance(); // consume 'vs'

          const equipo2 = currentToken();
          if (equipo2.tipo !== "CADENA") return null;
          advance(); // consume equipo2

          const partido = {
            tipo: "PARTIDO",
            equipo1: equipo1.valor,
            equipo2: equipo2.valor,
            detalles: [],
            linea: partidoToken.linea,
            columna: partidoToken.columna,
          };

          if (currentToken().tipo === "CORCHETE_ABIERTO") {
            advance(); // consume '['

            while (
              currentToken().tipo !== "CORCHETE_CERRADO" &&
              currentToken().tipo !== "EOF"
            ) {
              const prop = parseProperty();
              if (prop) {
                partido.detalles.push(prop);
              } else {
                advance(); // Saltar token problemático
              }

              if (currentToken().tipo === "COMA") {
                advance();
              }
            }

            if (currentToken().tipo === "CORCHETE_CERRADO") {
              advance(); // consume ']'
            }
          }

          return partido;
        };

        const parseObject = () => {
          // Si ya estamos dentro de un objeto (ya se consumió '{'), no esperamos otro '{'
          let consumeOpenBrace = currentToken().tipo === "LLAVE_ABIERTA";
          let startToken = currentToken();

          if (consumeOpenBrace) {
            advance(); // consume '{'
          }

          const objeto = {
            tipo: "OBJETO",
            propiedades: [],
            linea: startToken.linea,
            columna: startToken.columna,
          };

          while (
            currentToken().tipo !== "LLAVE_CERRADA" &&
            currentToken().tipo !== "EOF"
          ) {
            const prop = parseProperty();
            if (prop) {
              objeto.propiedades.push(prop);
            } else {
              advance(); // Saltar token problemático
            }

            if (currentToken().tipo === "COMA") {
              advance();
            } else if (currentToken().tipo !== "LLAVE_CERRADA") {
              // Si no es coma ni }, intentar continuar
              if (
                ["PALABRA_RESERVADA", "IDENTIFICADOR"].includes(
                  currentToken().tipo
                )
              ) {
                // Continuar con la siguiente propiedad
              } else {
                advance(); // Saltar token problemático
              }
            }
          }

          // No consumir '}' aquí si ya lo manejamos en parseSection
          return objeto;
        };

        const parseArray = () => {
          if (currentToken().tipo !== "CORCHETE_ABIERTO") return null;

          const startToken = currentToken();
          advance(); // consume '['

          const array = {
            tipo: "ARRAY",
            elementos: [],
            linea: startToken.linea,
            columna: startToken.columna,
          };

          while (
            currentToken().tipo !== "CORCHETE_CERRADO" &&
            currentToken().tipo !== "EOF"
          ) {
            // Intentar parsear diferentes tipos de elementos
            if (currentToken().valor === "equipo") {
              const equipo = parseEquipo();
              if (equipo) array.elementos.push(equipo);
            } else if (currentToken().valor === "partido") {
              const partido = parsePartido();
              if (partido) array.elementos.push(partido);
            } else if (currentToken().valor === "jugador") {
              // Parsear jugador individual (para el caso de goleadores)
              const jugadorToken = currentToken();
              advance();

              if (currentToken().tipo === "DOS_PUNTOS") {
                advance();
                const nombreJugador = currentToken();
                if (nombreJugador.tipo === "CADENA") {
                  advance();

                  const jugador = {
                    tipo: "JUGADOR",
                    nombre: nombreJugador.valor,
                    propiedades: [],
                    linea: jugadorToken.linea,
                    columna: jugadorToken.columna,
                  };

                  if (currentToken().tipo === "CORCHETE_ABIERTO") {
                    advance();

                    while (
                      currentToken().tipo !== "CORCHETE_CERRADO" &&
                      currentToken().tipo !== "EOF"
                    ) {
                      if (
                        ["PALABRA_RESERVADA", "IDENTIFICADOR"].includes(
                          currentToken().tipo
                        )
                      ) {
                        const propName = currentToken().valor;
                        advance();

                        if (currentToken().tipo === "DOS_PUNTOS") {
                          advance();
                          const value = parseValue();
                          if (value) {
                            jugador.propiedades.push({
                              nombre: propName,
                              valor: value.valor,
                            });
                          }
                        }
                      }

                      if (currentToken().tipo === "COMA") {
                        advance();
                      } else if (currentToken().tipo !== "CORCHETE_CERRADO") {
                        advance();
                      }
                    }

                    if (currentToken().tipo === "CORCHETE_CERRADO") {
                      advance();
                    }
                  }

                  array.elementos.push(jugador);
                }
              }
            } else if (currentToken().valor === "goleador") {
              // Parsear goleador
              const goleadorToken = currentToken();
              advance();

              if (currentToken().tipo === "DOS_PUNTOS") {
                advance();
                const nombreGoleador = currentToken();
                if (nombreGoleador.tipo === "CADENA") {
                  advance();

                  const goleador = {
                    tipo: "GOLEADOR",
                    nombre: nombreGoleador.valor,
                    propiedades: [],
                    linea: goleadorToken.linea,
                    columna: goleadorToken.columna,
                  };

                  if (currentToken().tipo === "CORCHETE_ABIERTO") {
                    advance();

                    while (
                      currentToken().tipo !== "CORCHETE_CERRADO" &&
                      currentToken().tipo !== "EOF"
                    ) {
                      if (
                        ["PALABRA_RESERVADA", "IDENTIFICADOR"].includes(
                          currentToken().tipo
                        )
                      ) {
                        const propName = currentToken().valor;
                        advance();

                        if (currentToken().tipo === "DOS_PUNTOS") {
                          advance();
                          const value = parseValue();
                          if (value) {
                            goleador.propiedades.push({
                              nombre: propName,
                              valor: value.valor,
                            });
                          }
                        }
                      }

                      if (currentToken().tipo === "COMA") {
                        advance();
                      } else if (currentToken().tipo !== "CORCHETE_CERRADO") {
                        advance();
                      }
                    }

                    if (currentToken().tipo === "CORCHETE_CERRADO") {
                      advance();
                    }
                  }

                  array.elementos.push(goleador);
                }
              }
            } else if (currentToken().tipo === "LLAVE_ABIERTA") {
              const obj = parseObject();
              if (obj) array.elementos.push(obj);
            } else {
              advance(); // Saltar tokens hasta encontrar un elemento válido
            }

            if (currentToken().tipo === "COMA") {
              advance();
            }
          }

          if (currentToken().tipo === "CORCHETE_CERRADO") {
            advance();
          }

          return array;
        };

        const parseSection = () => {
          const nameToken = currentToken();
          if (nameToken.tipo !== "SECCION_PRINCIPAL") return null;

          advance(); // consume section name

          const seccion = {
            tipo: "SECCION",
            nombre: nameToken.valor,
            contenido: null,
            linea: nameToken.linea,
            columna: nameToken.columna,
          };

          if (currentToken().tipo === "LLAVE_ABIERTA") {
            advance(); // consume '{'

            if (nameToken.valor === "EQUIPOS") {
              // Manejo especial para la sección EQUIPOS con la nueva sintaxis
              const equipos = {
                tipo: "LISTA_EQUIPOS",
                equipos: [],
                linea: nameToken.linea,
                columna: nameToken.columna,
              };

              while (
                currentToken().tipo !== "LLAVE_CERRADA" &&
                currentToken().tipo !== "EOF"
              ) {
                if (currentToken().valor === "equipo") {
                  const equipo = parseEquipo();
                  if (equipo) equipos.equipos.push(equipo);
                } else {
                  advance(); // Saltar tokens problemáticos
                }

                if (currentToken().tipo === "COMA") {
                  advance();
                }
              }

              seccion.contenido = equipos;
            } else if (nameToken.valor === "ELIMINACION") {
              // Manejo especial para la sección ELIMINACION
              const eliminacion = {
                tipo: "ELIMINACION_DATA",
                fases: [],
                linea: nameToken.linea,
                columna: nameToken.columna,
              };

              while (
                currentToken().tipo !== "LLAVE_CERRADA" &&
                currentToken().tipo !== "EOF"
              ) {
                // Buscar nombres de fases (semifinal, final, cuartos)
                if (
                  ["semifinal", "final", "cuartos"].includes(
                    currentToken().valor
                  )
                ) {
                  const faseNombre = currentToken().valor;
                  advance(); // consume fase name

                  if (currentToken().tipo === "DOS_PUNTOS") {
                    advance(); // consume ':'

                    if (currentToken().tipo === "CORCHETE_ABIERTO") {
                      advance(); // consume '['

                      const fase = {
                        tipo: "FASE",
                        nombre: faseNombre,
                        partidos: [],
                      };

                      while (
                        currentToken().tipo !== "CORCHETE_CERRADO" &&
                        currentToken().tipo !== "EOF"
                      ) {
                        if (currentToken().valor === "partido") {
                          const partido = parsePartido();
                          if (partido) fase.partidos.push(partido);
                        } else {
                          advance(); // Saltar tokens problemáticos
                        }

                        if (currentToken().tipo === "COMA") {
                          advance();
                        }
                      }

                      if (currentToken().tipo === "CORCHETE_CERRADO") {
                        advance(); // consume ']'
                      }

                      eliminacion.fases.push(fase);
                    }
                  }
                } else {
                  advance(); // Saltar tokens problemáticos
                }

                if (currentToken().tipo === "COMA") {
                  advance();
                }
              }

              seccion.contenido = eliminacion;
            } else {
              // Para TORNEO, usar el parseObject normal
              seccion.contenido = parseObject();
            }

            if (currentToken().tipo === "LLAVE_CERRADA") {
              advance();
            }
          } else {
            expectToken(
              "LLAVE_ABIERTA",
              `Se esperaba '{' después de ${nameToken.valor}`
            );
          }

          return seccion;
        };

        // Parse main program
        while (currentToken().tipo !== "EOF") {
          if (currentToken().tipo === "SECCION_PRINCIPAL") {
            const seccion = parseSection();
            if (seccion) {
              ast.hijos.push(seccion);
            }
          } else {
            // Saltar tokens no reconocidos en el nivel superior
            advance();
          }
        }

        return {
          ast: ast,
          errors: errors,
          success: errors.length === 0,
        };
      },
    };
  }

  updateResultsDisplay() {
    this.resultsSection.style.display = "block";
    this.reportLinksSection.style.display = "grid";

    // Mostrar estadísticas básicas
    const stats = this.generateStatistics();
    this.resultsContent.innerHTML = `
            <div class="stats-grid">
                ${stats
                  .map(
                    (stat) => `
                    <div class="stat-item">
                        <span class="stat-number">${stat.number}</span>
                        <div class="stat-label">${stat.label}</div>
                    </div>
                `
                  )
                  .join("")}
            </div>
        `;
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
    if (!this.tokens.length) {
      this.showStatus("No hay tokens para mostrar", "error");
      return;
    }

    const tokensTable = this.generateTokensTable();
    this.resultsContent.innerHTML = `
            <h3>Tokens Extraídos (${this.tokens.length})</h3>
            ${tokensTable}
        `;
  }

  generateTokensTable() {
    const tableRows = this.tokens
      .slice(0, 50)
      .map(
        (token, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><code>${this.escapeHtml(token.valor)}</code></td>
                <td><strong>${token.tipo}</strong></td>
                <td>${token.linea}</td>
                <td>${token.columna}</td>
            </tr>
        `
      )
      .join("");

    return `
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Lexema</th>
                        <th>Tipo</th>
                        <th>Línea</th>
                        <th>Columna</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            ${
              this.tokens.length > 50
                ? `<p style="margin-top: 1rem; color: #64748b;">Mostrando los primeros 50 tokens de ${this.tokens.length} total.</p>`
                : ""
            }
        `;
  }

  showAST() {
    if (!this.ast) {
      this.showStatus("No hay árbol sintáctico para mostrar", "error");
      return;
    }

    const astDisplay = this.generateASTDisplay(this.ast);
    this.resultsContent.innerHTML = `
            <h3>Árbol Sintáctico Abstracto</h3>
            <div class="ast-display">${astDisplay}</div>
        `;
  }

  generateASTDisplay(node, level = 0) {
    const indent = "  ".repeat(level);
    const nodeInfo = node.valor ? `${node.tipo}: "${node.valor}"` : node.tipo;
    let result = `${indent}${nodeInfo} (${node.linea}:${node.columna})\n`;

    if (node.hijos && node.hijos.length > 0) {
      node.hijos.forEach((child) => {
        result += this.generateASTDisplay(child, level + 1);
      });
    }

    return result;
  }

  showErrors() {
    if (!this.errors.length) {
      this.resultsContent.innerHTML = `
                <div class="status-success" style="display: block;">
                    <strong>Excelente!</strong> No se encontraron errores en el análisis.
                </div>
            `;
      return;
    }

    const errorsTable = this.generateErrorsTable();
    this.resultsContent.innerHTML = `
            <h3>Errores Encontrados (${this.errors.length})</h3>
            ${errorsTable}
        `;
  }

  generateErrorsTable() {
    const tableRows = this.errors
      .map(
        (error, index) => `
            <tr style="background-color: #fef2f2;">
                <td>${index + 1}</td>
                <td>${error.tipo || "Error"}</td>
                <td>${this.escapeHtml(
                  error.mensaje || "Error no especificado"
                )}</td>
                <td>${error.linea}</td>
                <td>${error.columna}</td>
            </tr>
        `
      )
      .join("");

    return `
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Línea</th>
                        <th>Columna</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        `;
  }

  showStatus(message, type) {
    this.statusMessage.textContent = message;
    this.statusMessage.className = `status-message status-${type}`;
    this.statusMessage.style.display = "block";

    // Auto-hide success and info messages after 3 seconds
    if (type === "success" || type === "info") {
      setTimeout(() => {
        this.statusMessage.style.display = "none";
      }, 3000);
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Report generation methods
  generateErrorReport() {
    this.showStatus("Generando reporte de errores...", "info");

    const htmlContent = this.createErrorReportHTML();
    this.downloadFile(htmlContent, "reporte_errores.html", "text/html");

    this.showStatus("Reporte de errores generado y descargado", "success");
  }

  generateTokenReport() {
    this.showStatus("Generando reporte de tokens...", "info");

    const htmlContent = this.createTokenReportHTML();
    this.downloadFile(htmlContent, "reporte_tokens.html", "text/html");

    this.showStatus("Reporte de tokens generado y descargado", "success");
  }

  generateBracketReport() {
    if (!this.ast) {
      this.showStatus("Primero debe ejecutar el análisis sintáctico", "error");
      return;
    }
    this.showStatus("Generando reporte de bracket...", "info");

    const htmlContent = this.createBracketReportHTML();
    this.downloadFile(htmlContent, "reporte_bracket.html", "text/html");

    this.showStatus("Reporte de bracket generado y descargado", "success");
  }

  generateTeamStats() {
    if (!this.ast) {
      this.showStatus("Primero debe ejecutar el análisis sintáctico", "error");
      return;
    }
    this.showStatus("Generando estadísticas por equipo...", "info");

    const htmlContent = this.createTeamStatsHTML();
    this.downloadFile(htmlContent, "reporte_equipos.html", "text/html");

    this.showStatus(
      "Estadísticas por equipo generadas y descargadas",
      "success"
    );
  }

  generateScorersReport() {
    if (!this.ast) {
      this.showStatus("Primero debe ejecutar el análisis sintáctico", "error");
      return;
    }
    this.showStatus("Generando reporte de goleadores...", "info");

    const htmlContent = this.createScorersReportHTML();
    this.downloadFile(htmlContent, "reporte_goleadores.html", "text/html");

    this.showStatus("Reporte de goleadores generado y descargado", "success");
  }

  generateGeneralReport() {
    if (!this.ast) {
      this.showStatus("Primero debe ejecutar el análisis sintáctico", "error");
      return;
    }
    this.showStatus("Generando reporte general...", "info");

    const htmlContent = this.createGeneralReportHTML();
    this.downloadFile(htmlContent, "reporte_general.html", "text/html");

    this.showStatus("Reporte general generado y descargado", "success");
  }

  generateGraphvizDiagram() {
    if (!this.ast) {
      this.showStatus("Primero debe ejecutar el análisis sintáctico", "error");
      return;
    }
    this.showStatus("Generando diagrama Graphviz...", "info");

    const dotContent = this.createGraphvizDOT();
    this.downloadFile(dotContent, "ast_diagram.dot", "text/plain");

    this.showStatus(
      "Diagrama Graphviz generado y descargado (.dot)",
      "success"
    );
  }

  generateAllReports() {
    if (!this.tokens.length || !this.ast) {
      this.showStatus(
        "Debe completar el análisis antes de generar reportes",
        "error"
      );
      return;
    }
    this.showStatus("Generando todos los reportes...", "info");

    // Generar todos los reportes
    this.generateErrorReport();
    this.generateTokenReport();
    this.generateBracketReport();
    this.generateTeamStats();
    this.generateScorersReport();
    this.generateGeneralReport();
    this.generateGraphvizDiagram();

    this.showStatus(
      "Todos los reportes han sido generados y descargados",
      "success"
    );
  }

  // Utility function to download files
  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  // HTML Report generators
  createErrorReportHTML() {
    const errors = this.errors || [];
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Errores - TourneyJS</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #1e3a8a; border-bottom: 3px solid #1e3a8a; padding-bottom: 10px; }
        .error-item { background: #fee2e2; border: 1px solid #fca5a5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .error-type { font-weight: bold; color: #dc2626; }
        .error-location { color: #6b7280; font-size: 0.9em; }
        .no-errors { background: #d1fae5; border: 1px solid #6ee7b7; padding: 20px; border-radius: 5px; color: #065f46; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
        th { background: #1e3a8a; color: white; }
        tr:nth-child(even) { background: #f9fafb; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reporte de Errores</h1>
        <p><strong>Total de errores encontrados:</strong> ${errors.length}</p>
        
        ${
          errors.length === 0
            ? '<div class="no-errors">¡Felicitaciones! No se encontraron errores en el análisis.</div>'
            : `<table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tipo</th>
                        <th>Mensaje</th>
                        <th>Línea</th>
                        <th>Columna</th>
                        <th>Lexema</th>
                    </tr>
                </thead>
                <tbody>
                    ${errors
                      .map(
                        (error, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td class="error-type">${error.tipo}</td>
                            <td>${error.mensaje}</td>
                            <td>${error.linea || "N/A"}</td>
                            <td>${error.columna || "N/A"}</td>
                            <td>${error.lexema || error.token || "N/A"}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>`
        }
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>`;
  }

  createTokenReportHTML() {
    const tokens = this.tokens || [];
    return `
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
        <p><strong>Total de tokens extraídos:</strong> ${tokens.length}</p>
        
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tipo</th>
                    <th>Valor</th>
                    <th>Línea</th>
                    <th>Columna</th>
                </tr>
            </thead>
            <tbody>
                ${tokens
                  .map(
                    (token, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td class="token-type ${token.tipo}">${token.tipo}</td>
                        <td>${token.valor || ""}</td>
                        <td>${token.linea || "N/A"}</td>
                        <td>${token.columna || "N/A"}</td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>`;
  }

  createBracketReportHTML() {
    // Extraer información del bracket desde el AST
    const bracketInfo = this.extractBracketInfo();

    return `
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
        <h2>Torneo: ${bracketInfo.torneoNombre}</h2>
        
        <div class="summary">
            <h3>Resumen del Torneo</h3>
            <p><strong>Total de fases:</strong> ${bracketInfo.fases.length}</p>
            <p><strong>Total de partidos:</strong> ${bracketInfo.fases.reduce(
              (total, fase) => total + fase.partidos.length,
              0
            )}</p>
            <p><strong>Campeón:</strong> ${
              bracketInfo.campeon || "Por determinar"
            }</p>
        </div>
        
        ${bracketInfo.fases
          .map(
            (fase) => `
            <div class="fase">
                <div class="fase-title">${fase.nombre}</div>
                ${fase.partidos
                  .map((partido) => {
                    const ganador = this.determineWinner(partido.resultado);
                    return `
                    <div class="match">
                        <div class="teams">
                            <div class="team ${
                              ganador === "equipo1" ? "winner" : ""
                            }">${partido.equipo1}</div>
                            <div class="vs">VS</div>
                            <div class="team ${
                              ganador === "equipo2" ? "winner" : ""
                            }">${partido.equipo2}</div>
                        </div>
                        ${
                          partido.resultado
                            ? `<div class="result">Resultado Final: ${partido.resultado}</div>`
                            : '<div class="result">Por jugar</div>'
                        }
                        ${
                          partido.goleadores && partido.goleadores.length > 0
                            ? `
                            <div class="scorers">
                                <div class="scorers-title">Goleadores del partido:</div>
                                ${partido.goleadores
                                  .map(
                                    (gol) => `
                                    <div class="scorer">
                                        <span class="scorer-name">${gol.nombre}</span>
                                        <span class="scorer-time">Minuto ${gol.minuto}'</span>
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                        `
                            : ""
                        }
                    </div>
                `;
                  })
                  .join("")}
            </div>
        `
          )
          .join("")}
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>`;
  }

  createTeamStatsHTML() {
    const equiposStats = this.extractTeamStats();

    return `
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
        .champion { background: #22c55e !important; color: white; font-weight: bold; }
        .finalist { background: #fbbf24 !important; color: white; font-weight: bold; }
        .semifinalist { background: #f97316 !important; color: white; font-weight: bold; }
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
                ${equiposStats
                  .map((equipo) => {
                    const diferencia = equipo.golesFavor - equipo.golesContra;
                    const diferenciaClass =
                      diferencia > 0
                        ? "positive"
                        : diferencia < 0
                        ? "negative"
                        : "neutral";
                    const faseClass =
                      equipo.faseAlcanzada === "Campeón"
                        ? "champion"
                        : equipo.faseAlcanzada === "Final"
                        ? "finalist"
                        : equipo.faseAlcanzada === "Semifinal"
                        ? "semifinalist"
                        : "";

                    return `
                    <tr>
                        <td class="team-name">${equipo.nombre}</td>
                        <td>${equipo.partidosJugados}</td>
                        <td>${equipo.ganados}</td>
                        <td>${equipo.perdidos}</td>
                        <td>${equipo.golesFavor}</td>
                        <td>${equipo.golesContra}</td>
                        <td class="${diferenciaClass}">${
                      diferencia > 0 ? "+" : ""
                    }${diferencia}</td>
                        <td class="${faseClass}">${equipo.faseAlcanzada}</td>
                    </tr>
                `;
                  })
                  .join("")}
            </tbody>
        </table>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>`;
  }

  createScorersReportHTML() {
    const goleadores = this.extractScorersInfoComplete();

    return `
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
              goleadores.length > 0
                ? `${goleadores[0].nombre} (${goleadores[0].equipo}) con ${
                    goleadores[0].goles
                  } gol${goleadores[0].goles > 1 ? "es" : ""}`
                : "Ninguno"
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
                ${goleadores
                  .map((goleador, index) => {
                    const isTopScorer = index === 0;
                    return `
                    <tr class="${isTopScorer ? "top-scorer" : ""}">
                        <td class="position">${index + 1}</td>
                        <td class="player-name">${goleador.nombre}</td>
                        <td class="team-name">${goleador.equipo}</td>
                        <td class="goals-count">${goleador.goles}</td>
                        <td class="goals-times">${goleador.minutos
                          .map((m) => m + "'")
                          .join(", ")}</td>
                    </tr>
                `;
                  })
                  .join("")}
                ${
                  goleadores.length === 0
                    ? `
                    <tr>
                        <td colspan="5" style="text-align: center; color: #6b7280; font-style: italic; padding: 30px;">
                            No se registraron goles en el torneo
                        </td>
                    </tr>
                `
                    : ""
                }
            </tbody>
        </table>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>`;
  }

  createGeneralReportHTML() {
    const info = this.extractTournamentInfoComplete();

    return `
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
                    <strong>Nombre:</strong> ${info.nombre}
                </div>
                <div class="info-item">
                    <strong>Sede:</strong> ${info.sede}
                </div>
                <div class="info-item">
                    <strong>Equipos Registrados:</strong> ${info.equipos}
                </div>
                <div class="info-item">
                    <strong>Tipo de Torneo:</strong> Eliminación Directa
                </div>
            </div>
            
            ${
              info.campeon
                ? `
                <div class="champion-info">
                    <h4 style="margin: 0 0 10px 0;">CAMPEÓN DEL TORNEO</h4>
                    <div style="font-size: 1.5em; font-weight: bold;">${info.campeon}</div>
                </div>
            `
                : ""
            }
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${info.totalEquipos}</div>
                <div class="stat-label">Equipos Participantes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${info.totalJugadores}</div>
                <div class="stat-label">Jugadores Registrados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${info.totalPartidos}</div>
                <div class="stat-label">Partidos Jugados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${info.totalGoles}</div>
                <div class="stat-label">Goles Anotados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${info.totalFases}</div>
                <div class="stat-label">Fases del Torneo</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${info.promedioGoles}</div>
                <div class="stat-label">Promedio Goles/Partido</div>
            </div>
        </div>
        
        <div class="section">
            <h3>Fases del Torneo</h3>
            ${info.fases
              .map(
                (fase) => `
                <div class="phases-info">
                    <strong>${fase.nombre}:</strong> ${fase.partidos} partido${
                  fase.partidos > 1 ? "s" : ""
                }, ${fase.goles} gol${fase.goles > 1 ? "es" : ""}
                </div>
            `
              )
              .join("")}
        </div>
        
        <div class="section">
            <h3>Resumen del Análisis Léxico y Sintáctico</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Tokens Procesados:</strong> ${this.tokens.length}
                </div>
                <div class="info-item">
                    <strong>Errores Encontrados:</strong> ${this.errors.length}
                </div>
                <div class="info-item">
                    <strong>Estado del AST:</strong> ${
                      this.ast ? "Generado correctamente" : "No generado"
                    }
                </div>
                <div class="info-item">
                    <strong>Archivo Analizado:</strong> ${
                      this.currentFile
                        ? this.currentFile.name
                        : "No especificado"
                    }
                </div>
            </div>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>`;
  }

  createGraphvizDOT() {
    if (!this.ast) return "";

    let dotContent = "digraph AST {\n";
    dotContent += "    rankdir=TB;\n";
    dotContent +=
      "    node [shape=box, style=filled, fillcolor=lightblue];\n\n";

    let nodeCounter = 0;
    const nodeMap = new Map();

    const addNode = (node, label) => {
      const nodeId = `node${nodeCounter++}`;
      nodeMap.set(node, nodeId);
      dotContent += `    ${nodeId} [label="${label}"];\n`;
      return nodeId;
    };

    const processNode = (node, parentId = null) => {
      if (!node) return;

      let label = node.tipo || "NODO";
      if (node.valor) label += `\\n"${node.valor}"`;
      if (node.nombre) label += `\\n${node.nombre}`;

      const nodeId = addNode(node, label);

      if (parentId) {
        dotContent += `    ${parentId} -> ${nodeId};\n`;
      }

      // Procesar hijos
      if (node.hijos && Array.isArray(node.hijos)) {
        node.hijos.forEach((child) => processNode(child, nodeId));
      }

      if (node.contenido) {
        processNode(node.contenido, nodeId);
      }

      if (node.propiedades && Array.isArray(node.propiedades)) {
        node.propiedades.forEach((prop) => processNode(prop, nodeId));
      }

      if (node.elementos && Array.isArray(node.elementos)) {
        node.elementos.forEach((elem) => processNode(elem, nodeId));
      }

      if (node.equipos && Array.isArray(node.equipos)) {
        node.equipos.forEach((equipo) => processNode(equipo, nodeId));
      }

      if (node.jugadores && Array.isArray(node.jugadores)) {
        node.jugadores.forEach((jugador) => processNode(jugador, nodeId));
      }
    };

    processNode(this.ast);

    dotContent += "}\n";
    return dotContent;
  }

  // Helper methods to extract information from AST
  determineWinner(resultado) {
    if (!resultado) return null;

    // Extraer goles del resultado (ej: "2-1")
    const match = resultado.match(/(\d+)-(\d+)/);
    if (match) {
      const goles1 = parseInt(match[1]);
      const goles2 = parseInt(match[2]);
      return goles1 > goles2
        ? "equipo1"
        : goles2 > goles1
        ? "equipo2"
        : "empate";
    }
    return null;
  }

  extractBracketInfo() {
    const info = { torneoNombre: "Torneo", fases: [], campeon: null };

    if (!this.ast || !this.ast.hijos) return info;

    // Buscar información del torneo
    const torneoSection = this.ast.hijos.find((s) => s.tipo === "TORNEO");
    if (torneoSection && torneoSection.hijos) {
      const nombreAtributo = torneoSection.hijos.find(
        (h) => h.valor === "nombre"
      );
      if (nombreAtributo && nombreAtributo.hijos && nombreAtributo.hijos[0]) {
        info.torneoNombre = nombreAtributo.hijos[0].valor.replace(/"/g, "");
      }
    }

    // Buscar información de eliminación con la estructura real del AST
    const eliminacionSection = this.ast.hijos.find(
      (s) => s.tipo === "ELIMINACION"
    );
    if (eliminacionSection && eliminacionSection.hijos) {
      eliminacionSection.hijos.forEach((faseNode) => {
        if (faseNode.tipo === "FASE") {
          const faseInfo = { nombre: faseNode.valor, partidos: [] };

          if (faseNode.hijos && Array.isArray(faseNode.hijos)) {
            faseNode.hijos.forEach((partidoNode) => {
              if (partidoNode.tipo === "PARTIDO") {
                // Extraer equipos del valor del partido (ej: "Juventus" vs "AC Milan")
                const partidos = partidoNode.valor.split(" vs ");
                const partidoInfo = {
                  equipo1: partidos[0] ? partidos[0].replace(/"/g, "") : "",
                  equipo2: partidos[1] ? partidos[1].replace(/"/g, "") : "",
                  resultado: null,
                  goleadores: [],
                };

                if (partidoNode.hijos) {
                  partidoNode.hijos.forEach((detalleNode) => {
                    if (
                      detalleNode.tipo === "LISTA" &&
                      detalleNode.valor === "detalles"
                    ) {
                      detalleNode.hijos.forEach((detalle) => {
                        if (
                          detalle.tipo === "ATRIBUTO" &&
                          detalle.valor === "resultado"
                        ) {
                          if (detalle.hijos && detalle.hijos[0]) {
                            partidoInfo.resultado =
                              detalle.hijos[0].valor.replace(/"/g, "");
                          }
                        } else if (
                          detalle.tipo === "LISTA" &&
                          detalle.valor === "goleadores"
                        ) {
                          // Buscar la lista de goleadores
                          detalle.hijos.forEach((listaGol) => {
                            if (
                              listaGol.tipo === "LISTA" &&
                              listaGol.valor === "lista_goleadores"
                            ) {
                              listaGol.hijos.forEach((goleadorNode) => {
                                if (goleadorNode.tipo === "GOLEADOR") {
                                  const goleador = {
                                    nombre: goleadorNode.valor.replace(
                                      /"/g,
                                      ""
                                    ),
                                    minuto: "",
                                  };

                                  // Buscar el minuto del gol
                                  if (goleadorNode.hijos) {
                                    goleadorNode.hijos.forEach((attrList) => {
                                      if (
                                        attrList.tipo === "LISTA" &&
                                        attrList.valor === "atributos"
                                      ) {
                                        attrList.hijos.forEach((attr) => {
                                          if (
                                            attr.tipo === "ATRIBUTO" &&
                                            attr.valor === "minuto"
                                          ) {
                                            if (attr.hijos && attr.hijos[0]) {
                                              goleador.minuto =
                                                attr.hijos[0].valor;
                                            }
                                          }
                                        });
                                      }
                                    });
                                  }

                                  partidoInfo.goleadores.push(goleador);
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }

                faseInfo.partidos.push(partidoInfo);

                // Determinar campeón si es la final
                if (faseNode.valor === "final" && partidoInfo.resultado) {
                  const ganador = this.determineWinner(partidoInfo.resultado);
                  if (ganador === "equipo1") {
                    info.campeon = partidoInfo.equipo1;
                  } else if (ganador === "equipo2") {
                    info.campeon = partidoInfo.equipo2;
                  }
                }
              }
            });
          }

          info.fases.push(faseInfo);
        }
      });
    }

    return info;
  }

  extractTeamStats() {
    const equiposStats = [];
    const equiposInfo = this.extractTeamInfo();
    const bracketInfo = this.extractBracketInfo();

    // Inicializar estadísticas para todos los equipos
    equiposInfo.forEach((equipo) => {
      equiposStats.push({
        nombre: equipo.nombre,
        partidosJugados: 0,
        ganados: 0,
        perdidos: 0,
        golesFavor: 0,
        golesContra: 0,
        faseAlcanzada: "No participó",
      });
    });

    // Procesar partidos para calcular estadísticas
    bracketInfo.fases.forEach((fase) => {
      fase.partidos.forEach((partido) => {
        if (partido.resultado) {
          const match = partido.resultado.match(/(\d+)-(\d+)/);
          if (match) {
            const goles1 = parseInt(match[1]);
            const goles2 = parseInt(match[2]);

            // Encontrar equipos en stats
            const equipo1Stats = equiposStats.find(
              (e) => e.nombre === partido.equipo1
            );
            const equipo2Stats = equiposStats.find(
              (e) => e.nombre === partido.equipo2
            );

            if (equipo1Stats) {
              equipo1Stats.partidosJugados++;
              equipo1Stats.golesFavor += goles1;
              equipo1Stats.golesContra += goles2;
              if (goles1 > goles2) {
                equipo1Stats.ganados++;
              } else if (goles1 < goles2) {
                equipo1Stats.perdidos++;
              }

              // Determinar fase alcanzada
              if (fase.nombre === "final") {
                if (goles1 > goles2) {
                  equipo1Stats.faseAlcanzada = "Campeón";
                } else {
                  equipo1Stats.faseAlcanzada = "Final";
                }
              } else if (
                fase.nombre === "semifinal" &&
                equipo1Stats.faseAlcanzada === "No participó"
              ) {
                equipo1Stats.faseAlcanzada =
                  goles1 > goles2 ? "Clasificó a Final" : "Semifinal";
              }
            }

            if (equipo2Stats) {
              equipo2Stats.partidosJugados++;
              equipo2Stats.golesFavor += goles2;
              equipo2Stats.golesContra += goles1;
              if (goles2 > goles1) {
                equipo2Stats.ganados++;
              } else if (goles2 < goles1) {
                equipo2Stats.perdidos++;
              }

              // Determinar fase alcanzada
              if (fase.nombre === "final") {
                if (goles2 > goles1) {
                  equipo2Stats.faseAlcanzada = "Campeón";
                } else {
                  equipo2Stats.faseAlcanzada = "Final";
                }
              } else if (
                fase.nombre === "semifinal" &&
                equipo2Stats.faseAlcanzada === "No participó"
              ) {
                equipo2Stats.faseAlcanzada =
                  goles2 > goles1 ? "Clasificó a Final" : "Semifinal";
              }
            }
          }
        }
      });
    });

    return equiposStats.sort((a, b) => {
      // Ordenar por puntos (ganados * 3), luego por diferencia de goles
      const puntosA = a.ganados * 3;
      const puntosB = b.ganados * 3;
      if (puntosA !== puntosB) return puntosB - puntosA;

      const diferenciaA = a.golesFavor - a.golesContra;
      const diferenciaB = b.golesFavor - b.golesContra;
      return diferenciaB - diferenciaA;
    });
  }

  extractScorersInfoComplete() {
    const goleadores = [];
    const goleadoresMap = new Map();
    const equiposInfo = this.extractTeamInfo();

    if (!this.ast || !this.ast.hijos) return goleadores;

    // Crear un mapa de jugador -> equipo
    const jugadorEquipoMap = new Map();
    equiposInfo.forEach((equipo) => {
      equipo.jugadores.forEach((jugador) => {
        jugadorEquipoMap.set(jugador.nombre, equipo.nombre);
      });
    });

    // Buscar información de eliminación con la estructura real del AST
    const eliminacionSection = this.ast.hijos.find(
      (s) => s.tipo === "ELIMINACION"
    );
    if (eliminacionSection && eliminacionSection.hijos) {
      eliminacionSection.hijos.forEach((faseNode) => {
        if (faseNode.tipo === "FASE" && faseNode.hijos) {
          faseNode.hijos.forEach((partidoNode) => {
            if (partidoNode.tipo === "PARTIDO" && partidoNode.hijos) {
              partidoNode.hijos.forEach((detalleNode) => {
                if (
                  detalleNode.tipo === "LISTA" &&
                  detalleNode.valor === "detalles"
                ) {
                  detalleNode.hijos.forEach((detalle) => {
                    if (
                      detalle.tipo === "LISTA" &&
                      detalle.valor === "goleadores"
                    ) {
                      // Buscar la lista de goleadores
                      detalle.hijos.forEach((listaGol) => {
                        if (
                          listaGol.tipo === "LISTA" &&
                          listaGol.valor === "lista_goleadores"
                        ) {
                          listaGol.hijos.forEach((goleadorNode) => {
                            if (goleadorNode.tipo === "GOLEADOR") {
                              const nombre = goleadorNode.valor.replace(
                                /"/g,
                                ""
                              );
                              const equipo =
                                jugadorEquipoMap.get(nombre) ||
                                "Equipo desconocido";
                              let minuto = "";

                              // Buscar el minuto del gol
                              if (goleadorNode.hijos) {
                                goleadorNode.hijos.forEach((attrList) => {
                                  if (
                                    attrList.tipo === "LISTA" &&
                                    attrList.valor === "atributos"
                                  ) {
                                    attrList.hijos.forEach((attr) => {
                                      if (
                                        attr.tipo === "ATRIBUTO" &&
                                        attr.valor === "minuto"
                                      ) {
                                        if (attr.hijos && attr.hijos[0]) {
                                          minuto = attr.hijos[0].valor;
                                        }
                                      }
                                    });
                                  }
                                });
                              }

                              if (!goleadoresMap.has(nombre)) {
                                goleadoresMap.set(nombre, {
                                  nombre,
                                  equipo,
                                  goles: 0,
                                  minutos: [],
                                });
                              }

                              const goleadorInfo = goleadoresMap.get(nombre);
                              goleadorInfo.goles++;
                              if (minuto) goleadorInfo.minutos.push(minuto);
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }

    return Array.from(goleadoresMap.values()).sort((a, b) => b.goles - a.goles);
  }

  extractTournamentInfoComplete() {
    const info = {
      nombre: "Torneo sin nombre",
      sede: "Sede no especificada",
      equipos: 0,
      totalEquipos: 0,
      totalJugadores: 0,
      totalPartidos: 0,
      totalGoles: 0,
      totalFases: 0,
      promedioGoles: "0.0",
      campeon: null,
      fases: [],
    };

    if (!this.ast || !this.ast.hijos) return info;

    // Información del torneo
    const torneoSection = this.ast.hijos.find((s) => s.tipo === "TORNEO");
    if (torneoSection && torneoSection.hijos) {
      torneoSection.hijos.forEach((attrNode) => {
        if (attrNode.tipo === "ATRIBUTO") {
          const attrName = attrNode.valor;
          if (attrNode.hijos && attrNode.hijos[0]) {
            const attrValue = attrNode.hijos[0].valor.replace(/"/g, "");
            if (attrName === "nombre") info.nombre = attrValue;
            if (attrName === "sede") info.sede = attrValue;
            if (attrName === "equipos") info.equipos = attrValue;
          }
        }
      });
    }

    // Contar equipos y jugadores
    const equiposSection = this.ast.hijos.find((s) => s.tipo === "EQUIPOS");
    if (equiposSection && equiposSection.hijos) {
      info.totalEquipos = equiposSection.hijos.filter(
        (h) => h.tipo === "EQUIPO"
      ).length;

      equiposSection.hijos.forEach((equipoNode) => {
        if (equipoNode.tipo === "EQUIPO" && equipoNode.hijos) {
          equipoNode.hijos.forEach((listaNode) => {
            if (listaNode.tipo === "LISTA" && listaNode.valor === "jugadores") {
              info.totalJugadores += listaNode.hijos.filter(
                (j) => j.tipo === "JUGADOR"
              ).length;
            }
          });
        }
      });
    }

    // Contar partidos, goles y fases con la estructura real del AST
    const eliminacionSection = this.ast.hijos.find(
      (s) => s.tipo === "ELIMINACION"
    );
    if (eliminacionSection && eliminacionSection.hijos) {
      info.totalFases = eliminacionSection.hijos.filter(
        (h) => h.tipo === "FASE"
      ).length;

      eliminacionSection.hijos.forEach((faseNode) => {
        if (faseNode.tipo === "FASE") {
          let partidosFase = 0;
          let golesFase = 0;

          if (faseNode.hijos && Array.isArray(faseNode.hijos)) {
            faseNode.hijos.forEach((partidoNode) => {
              if (partidoNode.tipo === "PARTIDO") {
                info.totalPartidos++;
                partidosFase++;

                // Extraer equipos del valor del partido
                const partidos = partidoNode.valor.split(" vs ");
                const equipo1 = partidos[0]
                  ? partidos[0].replace(/"/g, "")
                  : "";
                const equipo2 = partidos[1]
                  ? partidos[1].replace(/"/g, "")
                  : "";
                let resultado = null;

                if (partidoNode.hijos) {
                  partidoNode.hijos.forEach((detalleNode) => {
                    if (
                      detalleNode.tipo === "LISTA" &&
                      detalleNode.valor === "detalles"
                    ) {
                      detalleNode.hijos.forEach((detalle) => {
                        if (
                          detalle.tipo === "ATRIBUTO" &&
                          detalle.valor === "resultado"
                        ) {
                          if (detalle.hijos && detalle.hijos[0]) {
                            resultado = detalle.hijos[0].valor.replace(
                              /"/g,
                              ""
                            );
                          }
                        } else if (
                          detalle.tipo === "LISTA" &&
                          detalle.valor === "goleadores"
                        ) {
                          // Contar goles
                          detalle.hijos.forEach((listaGol) => {
                            if (
                              listaGol.tipo === "LISTA" &&
                              listaGol.valor === "lista_goleadores"
                            ) {
                              const golesPartido = listaGol.hijos.filter(
                                (g) => g.tipo === "GOLEADOR"
                              ).length;
                              info.totalGoles += golesPartido;
                              golesFase += golesPartido;
                            }
                          });
                        }
                      });
                    }
                  });
                }

                // Determinar campeón si es la final
                if (faseNode.valor === "final" && resultado) {
                  const ganador = this.determineWinner(resultado);
                  if (ganador === "equipo1") {
                    info.campeon = equipo1;
                  } else if (ganador === "equipo2") {
                    info.campeon = equipo2;
                  }
                }
              }
            });
          }

          info.fases.push({
            nombre:
              faseNode.valor.charAt(0).toUpperCase() + faseNode.valor.slice(1),
            partidos: partidosFase,
            goles: golesFase,
          });
        }
      });
    }

    // Calcular promedio de goles
    if (info.totalPartidos > 0) {
      info.promedioGoles = (info.totalGoles / info.totalPartidos).toFixed(1);
    }

    return info;
  }

  extractTeamInfo() {
    const equipos = [];

    if (!this.ast || !this.ast.hijos) return equipos;

    const equiposSection = this.ast.hijos.find((s) => s.tipo === "EQUIPOS");
    if (equiposSection && equiposSection.hijos) {
      equiposSection.hijos.forEach((equipoNode) => {
        if (equipoNode.tipo === "EQUIPO") {
          const equipoInfo = {
            nombre: equipoNode.valor.replace(/"/g, "") || "Equipo sin nombre",
            jugadores: [],
          };

          if (equipoNode.hijos) {
            equipoNode.hijos.forEach((listaNode) => {
              if (
                listaNode.tipo === "LISTA" &&
                listaNode.valor === "jugadores"
              ) {
                listaNode.hijos.forEach((jugadorNode) => {
                  if (jugadorNode.tipo === "JUGADOR") {
                    const jugadorInfo = {
                      nombre:
                        jugadorNode.valor.replace(/"/g, "") ||
                        "Jugador sin nombre",
                      posicion: "",
                      numero: "",
                      edad: "",
                    };

                    if (jugadorNode.hijos) {
                      jugadorNode.hijos.forEach((attrListNode) => {
                        if (
                          attrListNode.tipo === "LISTA" &&
                          attrListNode.valor === "atributos"
                        ) {
                          attrListNode.hijos.forEach((attrNode) => {
                            if (attrNode.tipo === "ATRIBUTO") {
                              const attrName = attrNode.valor;
                              if (attrNode.hijos && attrNode.hijos[0]) {
                                const attrValue =
                                  attrNode.hijos[0].valor.replace(/"/g, "");
                                if (attrName === "posicion")
                                  jugadorInfo.posicion = attrValue;
                                if (attrName === "numero")
                                  jugadorInfo.numero = attrValue;
                                if (attrName === "edad")
                                  jugadorInfo.edad = attrValue;
                              }
                            }
                          });
                        }
                      });
                    }

                    equipoInfo.jugadores.push(jugadorInfo);
                  }
                });
              }
            });
          }

          equipos.push(equipoInfo);
        }
      });
    }

    return equipos;
  }

  extractScorersInfo() {
    const goleadores = [];
    const goleadoresMap = new Map();

    if (!this.ast || !this.ast.hijos) return goleadores;

    const eliminacionSection = this.ast.hijos.find(
      (s) => s.nombre === "ELIMINACION"
    );
    if (
      eliminacionSection &&
      eliminacionSection.contenido &&
      eliminacionSection.contenido.propiedades
    ) {
      eliminacionSection.contenido.propiedades.forEach((prop) => {
        if (prop.valor && prop.valor.elementos) {
          prop.valor.elementos.forEach((elemento) => {
            if (elemento.tipo === "PARTIDO" && elemento.detalles) {
              elemento.detalles.forEach((detalle) => {
                if (
                  detalle.nombre === "goleadores" &&
                  detalle.valor &&
                  detalle.valor.elementos
                ) {
                  detalle.valor.elementos.forEach((gol) => {
                    if (gol.tipo === "GOLEADOR") {
                      const nombre = gol.nombre;
                      let minuto = "";

                      if (gol.propiedades) {
                        const minutoProp = gol.propiedades.find(
                          (p) => p.nombre === "minuto"
                        );
                        if (minutoProp) minuto = minutoProp.valor;
                      }

                      if (!goleadoresMap.has(nombre)) {
                        goleadoresMap.set(nombre, {
                          nombre,
                          goles: 0,
                          minutos: [],
                        });
                      }

                      const goleadorInfo = goleadoresMap.get(nombre);
                      goleadorInfo.goles++;
                      if (minuto) goleadorInfo.minutos.push(minuto);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }

    return Array.from(goleadoresMap.values()).sort((a, b) => b.goles - a.goles);
  }

  extractTournamentInfo() {
    const info = {
      nombre: "Torneo sin nombre",
      sede: "Sede no especificada",
      equipos: 0,
      totalEquipos: 0,
      totalJugadores: 0,
      totalPartidos: 0,
      totalGoles: 0,
    };

    if (!this.ast || !this.ast.hijos) return info;

    // Información del torneo
    const torneoSection = this.ast.hijos.find((s) => s.nombre === "TORNEO");
    if (
      torneoSection &&
      torneoSection.contenido &&
      torneoSection.contenido.propiedades
    ) {
      torneoSection.contenido.propiedades.forEach((prop) => {
        if (prop.nombre === "nombre" && prop.valor)
          info.nombre = prop.valor.valor;
        if (prop.nombre === "sede" && prop.valor) info.sede = prop.valor.valor;
        if (prop.nombre === "equipos" && prop.valor)
          info.equipos = prop.valor.valor;
      });
    }

    // Contar equipos y jugadores
    const equiposSection = this.ast.hijos.find((s) => s.nombre === "EQUIPOS");
    if (
      equiposSection &&
      equiposSection.contenido &&
      equiposSection.contenido.equipos
    ) {
      info.totalEquipos = equiposSection.contenido.equipos.length;
      info.totalJugadores = equiposSection.contenido.equipos.reduce(
        (total, equipo) => {
          return total + (equipo.jugadores ? equipo.jugadores.length : 0);
        },
        0
      );
    }

    // Contar partidos y goles
    const eliminacionSection = this.ast.hijos.find(
      (s) => s.nombre === "ELIMINACION"
    );
    if (
      eliminacionSection &&
      eliminacionSection.contenido &&
      eliminacionSection.contenido.propiedades
    ) {
      eliminacionSection.contenido.propiedades.forEach((prop) => {
        if (prop.valor && prop.valor.elementos) {
          prop.valor.elementos.forEach((elemento) => {
            if (elemento.tipo === "PARTIDO") {
              info.totalPartidos++;

              if (elemento.detalles) {
                elemento.detalles.forEach((detalle) => {
                  if (
                    detalle.nombre === "goleadores" &&
                    detalle.valor &&
                    detalle.valor.elementos
                  ) {
                    info.totalGoles += detalle.valor.elementos.length;
                  }
                });
              }
            }
          });
        }
      });
    }

    return info;
  }
}

// Initialize the interface when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new TourneyJSInterface();
});
