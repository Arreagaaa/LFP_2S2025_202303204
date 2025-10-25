import { Token, LexicalError, TokenType } from "./Token.js";
import { CharacterUtils } from "../utils/CharacterUtils.js";

// Analizador Lexico basado en AFD con estados
export class Lexer {
  // Propiedades privadas
  #input; // Cadena de entrada
  #pos_char; // Posicion del caracter actual
  #buffer; // Buffer para construir tokens
  #char_line; // Linea actual
  #char_col; // Columna actual
  #next_char; // Siguiente caracter a procesar
  #keywords; // Palabras reservadas
  #tokens; // Tokens reconocidos
  #errors; // Errores lexicos

  constructor(input) {
    this.#input = input;
    this.#pos_char = 0;
    this.#buffer = "";
    this.#char_line = 1;
    this.#char_col = 1;
    this.#next_char = "";
    this.#tokens = [];
    this.#errors = [];

    // Definicion de palabras reservadas(JAVA)
    this.#keywords = {
      public: TokenType.KEYWORD,
      class: TokenType.KEYWORD,
      static: TokenType.KEYWORD,
      void: TokenType.KEYWORD,
      main: TokenType.KEYWORD,
      String: TokenType.KEYWORD,
      args: TokenType.KEYWORD,
      int: TokenType.KEYWORD,
      double: TokenType.KEYWORD,
      char: TokenType.KEYWORD,
      boolean: TokenType.KEYWORD,
      true: TokenType.KEYWORD,
      false: TokenType.KEYWORD,
      if: TokenType.KEYWORD,
      else: TokenType.KEYWORD,
      for: TokenType.KEYWORD,
      while: TokenType.KEYWORD,
      System: TokenType.KEYWORD,
      out: TokenType.KEYWORD,
      println: TokenType.KEYWORD,
    };
  }

  // Inicializar el buffer con el caracter actual
  #initBuffer(currentChar) {
    this.#buffer = currentChar;
    this.#char_col++;
    this.#pos_char++;
  }

  // Agregar caracter al buffer y actualizar posicion

  #addCharToBuffer(currentChar) {
    this.#buffer += currentChar;
    this.#char_col++;
    this.#pos_char++;
  }

  // Crear un nuevo token con el buffer actual
  #createToken(type) {
    return new Token(
      type,
      this.#buffer,
      this.#char_line,
      this.#char_col - this.#buffer.length
    );
  }

  // Agregar un error lexico a la lista de errores
  #addError(description) {
    this.#errors.push(
      new LexicalError(
        this.#next_char,
        this.#char_line,
        this.#char_col,
        description
      )
    );
  }

  // Inicia el proceso de tokenizacion
  analyze() {
    let token;

    while ((token = this.nextToken()).type !== TokenType.EOF) {
      this.#tokens.push(token);
    }

    return {
      tokens: this.#tokens,
      errors: this.#errors,
      success: this.#errors.length === 0,
    };
  }

  // Obtener el siguiente token de la entrada
  nextToken = () => this.#S0();

  // Estado inicial del automata finito determinista (AFD)
  #S0() {
    while (this.#pos_char < this.#input.length) {
      this.#next_char = this.#input[this.#pos_char];

      // Reconoce: IDENTIFICADORES y PALABRAS RESERVADAS
      if (CharacterUtils.isLetter(this.#next_char)) {
        this.#initBuffer(this.#next_char);
        return this.#S1();
      }

      // Reconoce: NUMEROS ENTEROS Y DECIMALES
      if (CharacterUtils.isDigit(this.#next_char)) {
        this.#initBuffer(this.#next_char);
        const token = this.#S4();
        if (token) return token;
      }

      // δ(", S0) = S7
      // Reconoce: CADENAS
      if (this.#next_char === '"') {
        this.#initBuffer(this.#next_char);
        return this.#S7();
      }

      //δ(', S0) = S9
      // Reconoce: CARACTERES
      if (this.#next_char === "'") {
        this.#initBuffer(this.#next_char);
        return this.#S9();
      }

      // δ(+, S0) = S12
      // Reconoce: PLUS, INCREMENT
      if (this.#next_char === "+") {
        this.#initBuffer(this.#next_char);
        return this.#S12();
      }

      // δ(-, S0) = S14
      // Reconoce: MINUS, DECREMENT
      if (this.#next_char === "-") {
        this.#initBuffer(this.#next_char);
        return this.#S14();
      }

      // δ(*, S0) = S16
      // Reconoce: MULTIPLY
      if (this.#next_char === "*") {
        this.#initBuffer(this.#next_char);
        return this.#S16();
      }

      // δ(/, S0) = S17
      // Reconoce: DIVIDE, COMENTARIOS
      if (this.#next_char === "/") {
        this.#initBuffer(this.#next_char);
        const result = this.#S17();
        if (result) return result;
      }

      // δ(=, S0) = S21
      // Reconoce: ASSIGN, EQUAL
      if (this.#next_char === "=") {
        this.#initBuffer(this.#next_char);
        return this.#S21();
      }

      // δ(!, S0) = S23
      // Reconoce: NOT_EQUAL
      if (this.#next_char === "!") {
        this.#initBuffer(this.#next_char);
        return this.#S23();
      }

      // δ(>, S0) = S25
      // Reconoce: GREATER, GREATER_EQUAL
      if (this.#next_char === ">") {
        this.#initBuffer(this.#next_char);
        return this.#S25();
      }

      // δ(<, S0) = S27
      // Reconoce: LESS, LESS_EQUAL
      if (this.#next_char === "<") {
        this.#initBuffer(this.#next_char);
        return this.#S27();
      }

      // δ({, S0) = S29
      if (this.#next_char === "{") {
        this.#initBuffer(this.#next_char);
        return this.#S29();
      }

      // δ(}, S0) = S30
      if (this.#next_char === "}") {
        this.#initBuffer(this.#next_char);
        return this.#S30();
      }

      // δ((, S0) = S31
      if (this.#next_char === "(") {
        this.#initBuffer(this.#next_char);
        return this.#S31();
      }

      // δ(), S0) = S32
      if (this.#next_char === ")") {
        this.#initBuffer(this.#next_char);
        return this.#S32();
      }

      // δ([, S0) = S33
      if (this.#next_char === "[") {
        this.#initBuffer(this.#next_char);
        return this.#S33();
      }

      // δ(], S0) = S34
      if (this.#next_char === "]") {
        this.#initBuffer(this.#next_char);
        return this.#S34();
      }

      // δ(;, S0) = S35
      if (this.#next_char === ";") {
        this.#initBuffer(this.#next_char);
        return this.#S35();
      }

      // δ(,, S0) = S36
      if (this.#next_char === ",") {
        this.#initBuffer(this.#next_char);
        return this.#S36();
      }

      // δ(., S0) = S37
      if (this.#next_char === ".") {
        this.#initBuffer(this.#next_char);
        return this.#S37();
      }

      // CARACTERES IGNORADOS

      if (this.#next_char === "" || this.#next_char === " ") {
        this.#char_col++;
      } else if (this.#next_char === "\t") {
        this.#char_col += 4;
      } else if (this.#next_char === "\n") {
        this.#char_col = 1;
        this.#char_line++;
      } else if (this.#next_char === "\r") {
        this.#char_col++;
      }

      // ERROR LEXICO
      else {
        this.#addError("Caracter no reconocido");
        this.#char_col++;
      }

      this.#pos_char++;
    }

    return new Token(TokenType.EOF, "EOF", this.#char_line, this.#char_col);
  }

  // Estado S1: Reconocimiento de IDENTIFICADORES y PALABRAS RESERVADAS
  #S1() {
    while (
      CharacterUtils.isAlphanumeric(
        (this.#next_char = this.#input[this.#pos_char])
      )
    ) {
      this.#addCharToBuffer(this.#next_char);
    }

    // Estado de aceptacion: KEYWORD o IDENTIFIER
    const tokenType = this.#keywords[this.#buffer] || TokenType.IDENTIFIER;

    return this.#createToken(tokenType);
  }

  // Estado S4: Reconocimiento de NUMEROS ENTEROS y DECIMALES
  #S4() {
    while (
      CharacterUtils.isDigit((this.#next_char = this.#input[this.#pos_char]))
    ) {
      this.#addCharToBuffer(this.#next_char);
    }

    // δ(., S4) = S5, si el caracter es un punto decimal
    if (this.#next_char === ".") {
      this.#addCharToBuffer(this.#next_char);
      return this.#S5();
    }

    // Estado de aceptacion: INTEGER
    return this.#createToken(TokenType.INTEGER);
  }

  // Estado S5: Reconocimiento de NUMEROS DECIMALES
  #S5() {
    // Debe haber al menos un digito despues del punto decimal
    if (
      !CharacterUtils.isDigit((this.#next_char = this.#input[this.#pos_char]))
    ) {
      this.#addError(
        "Se esperaba al menos un digito despues del punto decimal"
      );
      return null;
    }

    return this.#S6();
  }

  // Estado S6: Continuacion del reconocimiento de NUMEROS DECIMALES
  #S6() {
    while (
      CharacterUtils.isDigit((this.#next_char = this.#input[this.#pos_char]))
    ) {
      this.#addCharToBuffer(this.#next_char);
    }

    // Verifica si hay un punto decimal adicional (error)
    if (this.#next_char === ".") {
      this.#addError("Numero decimal mal formado: multiples puntos decimales");
      return null;
    }

    return this.#createToken(TokenType.DECIMAL);
  }

  // Estado S7: Reconocimiento de CADENAS(STRING)
  #S7() {
    // δ(cualquier caracter, S7) = S7, mientras no sea " o \n
    while (
      (this.#next_char = this.#input[this.#pos_char]) !== '"' &&
      this.#next_char !== "\n"
    ) {
      this.#addCharToBuffer(this.#next_char);
    }

    // δ(", S7) = S8, si el caracter es una comilla doble (fin de cadena)
    if (this.#next_char === '"') {
      this.#addCharToBuffer(this.#next_char);
      return this.#S8();
    }

    // Error: cadena no cerrada
    this.#addError("Cadena no cerrada");
    return null;
  }

  // Estado S8: Aceptacion de CADENAS(STRING)
  #S8() {
    // Remover las comillas del valor del token
    const value = this.#buffer.substring(1, this.#buffer.length - 1);
    return new Token(
      TokenType.STRING,
      value,
      this.#char_line,
      this.#char_col - this.#buffer.length
    );
  }

  // Estado S9: Reconocimiento de CARACTERES(CHAR)
  #S9() {
    this.#next_char = this.#input[this.#pos_char];

    //Verificar que no sea fin de linea o EOF
    if (this.#next_char === "\n" || this.#next_char === "\0") {
      this.#addError("Carácter no cerrado");
      return null;
    }

    // Agregar el caracter al buffer
    this.#addCharToBuffer(this.#next_char);
    return this.#S10();
  }

  // Estado S10: Continuación del reconocimiento de CARACTERES(CHAR)
  #S10() {
    this.#next_char = this.#input[this.#pos_char];

    // δ(', S10) = S11, si el caracter es una comilla simple (fin de carácter)
    if (this.#next_char === "'") {
      this.#addCharToBuffer(this.#next_char);
      return this.#S11();
    }

    this.#addError("Carácter no cerrado");

    while (this.#next_char !== "'" && this.#next_char !== "\n") {
      this.#addCharToBuffer(this.#next_char);
      this.#next_char = this.#input[this.#pos_char];
    }

    return null;
  }

  // Estado S11: Aceptacion de CARACTERES(CHAR)
  #S11() {
    // Remover las comillas del valor del token
    const value = this.#buffer.substring(1, this.#buffer.length - 1);
    return new Token(
      TokenType.CHAR,
      value,
      this.#char_line,
      this.#char_col - this.#buffer.length
    );
  }

  // Estado S12: Reconocimiento de PLUS(+) e INCREMENT(++)

  #S12() {
    this.#next_char = this.#input[this.#pos_char];

    // δ(+, S12) = S13(incremento)
    if (this.#next_char === "+") {
      this.#addCharToBuffer(this.#next_char);
      return this.#S13();
    }

    // Estado de aceptacion: PLUS
    return this.#createToken(TokenType.PLUS);
  }

  // Estado S13: Aceptacion de INCREMENT(++)

  #S13() {
    return this.#createToken(TokenType.INCREMENT);
  }

  // Estado S14: Reconocimiento de MINUS(-) y DECREMENT(--)
  #S14() {
    this.#next_char = this.#input[this.#pos_char];

    // δ(-, S14) = S15(decremento)
    if (this.#next_char === "-") {
      this.#addCharToBuffer(this.#next_char);
      return this.#S15();
    }

    // Estado de aceptacion: MINUS
    return this.#createToken(TokenType.MINUS);
  }

  // Estado S15: Aceptacion de DECREMENT(--)
  #S15() {
    return this.#createToken(TokenType.DECREMENT);
  }

  // Estado S16: Aceptacion de MULTIPLY(*)
  #S16() {
    return this.#createToken(TokenType.MULTIPLY);
  }

  // Estado S17: Reconocimiento de DIVIDE(/) y COMENTARIOS(//, /* */)
  #S17() {
    this.#next_char = this.#input[this.#pos_char];

    // δ(/, S17) = S18(comentario de línea)
    if (this.#next_char === "/") {
      this.#addCharToBuffer(this.#next_char);
      return this.#S18();
    }

    // δ(*, S17) = S19(comentario de bloque)
    if (this.#next_char === "*") {
      this.#addCharToBuffer(this.#next_char);
      return this.#S19();
    }

    return this.#createToken(TokenType.DIVIDE);
  }

  // Estado S18: Reconocimiento de COMENTARIOS DE LINEA
  #S18() {
    // Consumir hasta el fin de linea
    while (
      (this.#next_char = this.#input[this.#pos_char]) !== "\n" &&
      this.#next_char !== undefined
    ) {
      this.#addCharToBuffer(this.#next_char);
    }

    // Retornar token COMMENT con el contenido completo
    return this.#createToken(TokenType.COMMENT);
  }

  // Estado S19: Reconocimiento de COMENTARIOS DE BLOQUE(/* */)
  #S19() {
    const startLine = this.#char_line;
    const startCol = this.#char_col - 2; // -2 para incluir el /*

    while (this.#pos_char < this.#input.length) {
      this.#next_char = this.#input[this.#pos_char];

      // Posible fin de comentario: '*/'
      if (this.#next_char === "*") {
        const nextPos = this.#pos_char + 1;

        // Mira el siguiente carácter
        if (nextPos < this.#input.length && this.#input[nextPos] === "/") {
          // Encontramos el fin del comentario
          this.#addCharToBuffer("*");
          this.#addCharToBuffer("/");
          // Fin del comentario de bloque - retornar token
          return this.#createToken(TokenType.COMMENT);
        }

        // No era '/', solo agregamos el * y seguimos
        this.#addCharToBuffer(this.#next_char);
        continue;
      }

      // Manejo de fin de línea
      if (this.#next_char === "\n") {
        this.#addCharToBuffer(this.#next_char);
        this.#char_line++;
        this.#char_col = 0; // Se incrementará en addCharToBuffer
        continue;
      }

      // Ignorar retornos de carro (pero no afectar posición)
      if (this.#next_char === "\r") {
        this.#pos_char++;
        continue;
      }

      this.#addCharToBuffer(this.#next_char);
    }

    // Error: comentario de bloque no cerrado
    this.#errors.push(
      new LexicalError(
        "/*",
        startLine,
        startCol,
        "Comentario de bloque no cerrado"
      )
    );
    return null;
  }

  // Estado S21: Reconocimiento de ASSIGN(=) y EQUAL(==)
  #S21() {
    this.#next_char = this.#input[this.#pos_char];

    // δ(=, S21) = S22 (igualdad)
    if (this.#next_char === "=") {
      this.#addCharToBuffer(this.#next_char);
      return this.#S22();
    }

    // Estado de aceptacion: ASSIGN
    return this.#createToken(TokenType.ASSIGN);
  }

  // Estado S22: Aceptacion de EQUAL(==)
  #S22() {
    return this.#createToken(TokenType.EQUAL);
  }

  // Estado S23: Reconocimiento de NOT_EQUAL(!=) o de NOT(!)
  #S23() {
    this.#next_char = this.#input[this.#pos_char];

    // δ(=, S23) = S24 (diferente)
    if (this.#next_char === "=") {
      this.#addCharToBuffer(this.#next_char);
      return this.#S24();
    }

    // Estado de aceptacion: NOT(!) solo no es valido en Java
    this.#addError(
      'Operador "!" no valido en Java. Use "!=" para desigualdad.'
    );
    return null;
  }

  // Estado S24: Aceptacion de NOT_EQUAL(!=)
  #S24() {
    return this.#createToken(TokenType.NOT_EQUAL);
  }

  #S25() {
    this.#next_char = this.#input[this.#pos_char];

    // δ(=, S25) = S26 (mayor o igual)
    if (this.#next_char === "=") {
      this.#addCharToBuffer(this.#next_char);
      return this.#S26();
    }

    // Estado de aceptacion: MAYOR
    return this.#createToken(TokenType.GREATER);
  }

  // Estado S26: Aceptacion de GREATER_EQUAL(>=)
  #S26() {
    return this.#createToken(TokenType.GREATER_EQUAL);
  }

  // Estado S27: Reconocimiento de LESS(<) y LESS_EQUAL(<=)
  #S27() {
    this.#next_char = this.#input[this.#pos_char];

    // δ(<, S27) = S28 (menor o igual)
    if (this.#next_char === "=") {
      this.#addCharToBuffer(this.#next_char);
      return this.#S28();
    }

    // Estado de aceptacion: LESS
    return this.#createToken(TokenType.LESS);
  }

  // Estado S28: Aceptacion de LESS_EQUAL(<=)
  #S28() {
    return this.#createToken(TokenType.LESS_EQUAL);
  }

  // Estado S29: Aceptacion de LLAVE ABIERTA({)
  #S29() {
    return this.#createToken(TokenType.LBRACE);
  }

  // Estado S30: Aceptacion de LLAVE CERRADA(})
  #S30() {
    return this.#createToken(TokenType.RBRACE);
  }

  // Estado S31: Aceptacion de PARENTESIS ABIERTO(()
  #S31() {
    return this.#createToken(TokenType.LPAREN);
  }

  // Estado S32: Aceptacion de PARENTESIS CERRADO())
  #S32() {
    return this.#createToken(TokenType.RPAREN);
  }

  // Estado S33: Aceptacion de CORCHETE ABIERTO([)
  #S33() {
    return this.#createToken(TokenType.LBRACKET);
  }

  // Estado S34: Aceptacion de CORCHETE CERRADO(])
  #S34() {
    return this.#createToken(TokenType.RBRACKET);
  }

  // Estado S35: Aceptacion de PUNTO Y COMA(;)
  #S35() {
    return this.#createToken(TokenType.SEMICOLON);
  }

  // Estado S36: Aceptacion de COMA(,)
  #S36() {
    return this.#createToken(TokenType.COMMA);
  }

  // Estado S37: Aceptacion de PUNTO(.)
  #S37() {
    return this.#createToken(TokenType.DOT);
  }
}
