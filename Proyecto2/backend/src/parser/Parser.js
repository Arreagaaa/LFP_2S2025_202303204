// Analizador Sintactico Descendente Recursivo Manual
export class Parser {
  // Propiedades privadas
  #tokens; // Array de tokens del lexer
  #currentPos; // Posicion actual en el array
  #currentToken; // Token que se esta analizando
  #errors; // Errores sintacticos encontrados
  #symbolTable; // Tabla de simbolos (variables declaradas)

  constructor(tokens) {
    // NO filtrar comentarios - los necesitamos para la traducción
    this.#tokens = tokens;
    this.#currentPos = 0;
    this.#currentToken = this.#tokens[0] || {
      type: "EOF",
      value: "",
      line: 0,
      column: 0,
    };
    // Saltar comentarios al inicio
    while (
      this.#currentToken.type === "COMMENT" &&
      this.#currentPos < this.#tokens.length - 1
    ) {
      this.#currentPos++;
      this.#currentToken = this.#tokens[this.#currentPos];
    }
    this.#errors = [];
    this.#symbolTable = new Map(); // identifier -> { type, line, column }
  }

  // Agregar error sintactico
  #addError(message) {
    this.#errors.push({
      line: this.#currentToken.line,
      column: this.#currentToken.column,
      token: this.#currentToken.value || this.#currentToken.type,
      expected: message,
      description: message,
    });
  }

  // Avanzar al siguiente token
  #advance() {
    if (this.#currentPos < this.#tokens.length - 1) {
      this.#currentPos++;
      this.#currentToken = this.#tokens[this.#currentPos];
      // Saltar comentarios automáticamente durante el parsing
      while (
        this.#currentToken.type === "COMMENT" &&
        this.#currentPos < this.#tokens.length - 1
      ) {
        this.#currentPos++;
        this.#currentToken = this.#tokens[this.#currentPos];
      }
    } else {
      this.#currentToken = { type: "EOF", value: "", line: 0, column: 0 };
    }
  }

  // Verificar si el token actual es del tipo esperado (sin consumir)
  #check(expectedType) {
    return this.#currentToken.type === expectedType;
  }

  // Verificar si el token actual tiene el valor esperado (sin consumir)
  #checkValue(expectedValue) {
    return this.#currentToken.value === expectedValue;
  }

  // Consumir token si coincide con el tipo esperado
  #match(expectedType) {
    if (this.#check(expectedType)) {
      const token = this.#currentToken;
      this.#advance();
      return token;
    }
    return null;
  }

  // Consumir token si coincide con el valor esperado
  #matchValue(expectedValue) {
    if (this.#checkValue(expectedValue)) {
      const token = this.#currentToken;
      this.#advance();
      return token;
    }
    return null;
  }

  // Esperar un tipo de token especifico (genera error si no coincide)
  #expect(expectedType, errorMessage) {
    if (this.#check(expectedType)) {
      const token = this.#currentToken;
      this.#advance();
      return token;
    }

    this.#addError(errorMessage || `Se esperaba '${expectedType}'`);
    return null;
  }

  // Esperar un valor especifico (genera error si no coincide)
  #expectValue(expectedValue, errorMessage) {
    if (this.#checkValue(expectedValue)) {
      const token = this.#currentToken;
      this.#advance();
      return token;
    }

    this.#addError(errorMessage || `Se esperaba '${expectedValue}'`);
    return null;
  }

  // Metodo principal de analisis
  parse() {
    try {
      const ast = this.#parseProgram();
      return {
        ast: ast,
        errors: this.#errors,
        symbolTable: Array.from(this.#symbolTable.entries()).map(
          ([name, info]) => ({
            name,
            ...info,
          })
        ),
        success: this.#errors.length === 0,
      };
    } catch (error) {
      this.#addError(`Error inesperado durante el analisis: ${error.message}`);
      return {
        ast: null,
        errors: this.#errors,
        symbolTable: [],
        success: false,
      };
    }
  }

  // <programa> ::= <clase_principal>
  #parseProgram() {
    return this.#parseClassDeclaration();
  }

  // <clase_principal> ::= "public" "class" IDENTIFIER "{" <metodo_main> "}"
  #parseClassDeclaration() {
    // Verificar: public class NombreClase { ... }
    this.#expectValue("public", "Se esperaba 'public' al inicio de la clase");
    this.#expectValue("class", "Se esperaba 'class' despues de 'public'");

    const className = this.#expect(
      "IDENTIFIER",
      "Se esperaba el nombre de la clase"
    );

    this.#expect("LBRACE", "Se esperaba '{' despues del nombre de la clase");

    const mainMethod = this.#parseMainMethod();

    this.#expect("RBRACE", "Se esperaba '}' al final de la clase");

    // Verificar EOF
    if (this.#currentToken.type !== "EOF") {
      this.#addError("Se esperaba el fin del archivo despues de la clase");
    }

    return {
      type: "Program",
      className: className?.value || "Main",
      main: mainMethod,
    };
  }

  // <metodo_main> ::= "public" "static" "void" "main" "(" "String" "[" "]" IDENTIFIER ")" "{" <sentencias> "}"
  #parseMainMethod() {
    // Validar firma exacta: public static void main(String[] args)

    this.#expectValue("public", "Se esperaba 'public' en el metodo main");
    this.#expectValue("static", "Se esperaba 'static' en el metodo main");
    this.#expectValue("void", "Se esperaba 'void' en el metodo main");
    this.#expectValue("main", "Se esperaba 'main' como nombre del metodo");

    this.#expect("LPAREN", "Se esperaba '(' despues de 'main'");

    // Verificar String (puede ser KEYWORD o IDENTIFIER)
    if (!this.#checkValue("String")) {
      this.#addError("Se esperaba 'String' en los argumentos de main");
    } else {
      this.#advance(); // Consumir String
    }

    this.#expect("LBRACKET", "Se esperaba '[' despues de 'String'");
    this.#expect("RBRACKET", "Se esperaba ']' despues de '['");

    // Verificar args (puede ser KEYWORD o IDENTIFIER)
    const argsName = this.#currentToken;
    if (!this.#checkValue("args") && this.#currentToken.type !== "IDENTIFIER") {
      this.#addError("Se esperaba el nombre del parametro (ej: args)");
    } else {
      this.#advance(); // Consumir args
    }

    this.#expect("RPAREN", "Se esperaba ')' despues de los argumentos");

    this.#expect("LBRACE", "Se esperaba '{' al inicio del cuerpo de main");

    const statements = this.#parseStatements();

    this.#expect("RBRACE", "Se esperaba '}' al final del cuerpo de main");

    return {
      type: "MainMethod",
      args: argsName?.value || "args",
      statements: statements,
    };
  }

  // <sentencias> ::= <sentencia> <sentencias> | ε
  #parseStatements() {
    const statements = [];

    while (!this.#check("RBRACE") && !this.#check("EOF")) {
      const stmt = this.#parseStatement();
      if (stmt) {
        statements.push(stmt);
      } else {
        // Si no se pudo parsear, avanzar para evitar loop infinito
        this.#advance();
      }
    }

    return statements;
  }

  // <sentencia> ::= <declaracion> | <asignacion> | <if> | <for> | <while> | <print>
  #parseStatement() {
    // Tipos de datos (declaracion)
    if (this.#isDataType()) {
      return this.#parseDeclaration();
    }

    // Identificador (asignacion)
    if (this.#check("IDENTIFIER")) {
      return this.#parseAssignment();
    }

    // Estructuras de control
    if (this.#checkValue("if")) {
      return this.#parseIfStatement();
    }

    if (this.#checkValue("for")) {
      return this.#parseForStatement();
    }

    if (this.#checkValue("while")) {
      return this.#parseWhileStatement();
    }

    // System.out.println
    if (this.#checkValue("System")) {
      return this.#parsePrintStatement();
    }

    this.#addError(
      `Sentencia no reconocida: '${this.#currentToken.value}' (tipo: ${
        this.#currentToken.type
      })`
    );
    return null;
  }

  // Verificar si el token actual es un tipo de dato
  #isDataType() {
    return ["int", "double", "char", "String", "boolean"].includes(
      this.#currentToken.value
    );
  }

  // <declaracion> ::= <tipo> IDENTIFIER ";" | <tipo> IDENTIFIER "=" <expresion> ";"
  #parseDeclaration() {
    const dataType = this.#currentToken.value; // int, double, char, String, boolean
    this.#advance();

    const identifier = this.#expect(
      "IDENTIFIER",
      "Se esperaba un identificador despues del tipo"
    );

    if (!identifier) {
      return null;
    }

    // Agregar a tabla de simbolos
    if (this.#symbolTable.has(identifier.value)) {
      this.#addError(
        `Variable '${identifier.value}' ya fue declarada anteriormente`
      );
    } else {
      this.#symbolTable.set(identifier.value, {
        type: dataType,
        line: identifier.line,
        column: identifier.column,
      });
    }

    // Verificar si hay asignacion
    if (this.#match("ASSIGN")) {
      const value = this.#parseExpression();
      this.#expect("SEMICOLON", "Se esperaba ';' al final de la declaracion");

      return {
        type: "Declaration",
        dataType: dataType,
        identifier: identifier.value,
        value: value,
        line: identifier.line,
        column: identifier.column,
      };
    }

    this.#expect("SEMICOLON", "Se esperaba ';' al final de la declaracion");

    return {
      type: "Declaration",
      dataType: dataType,
      identifier: identifier.value,
      value: null,
      line: identifier.line,
      column: identifier.column,
    };
  }

  // <asignacion> ::= IDENTIFIER "=" <expresion> ";"
  #parseAssignment() {
    const identifier = this.#currentToken.value;
    const line = this.#currentToken.line;
    const column = this.#currentToken.column;

    // Verificar que la variable este declarada
    if (!this.#symbolTable.has(identifier)) {
      this.#addError(`Variable '${identifier}' no ha sido declarada`);
    }

    this.#advance();

    // Operadores de incremento/decremento: x++, x--
    if (this.#match("INCREMENT")) {
      this.#expect("SEMICOLON", "Se esperaba ';' despues de '++'");
      return {
        type: "Assignment",
        identifier: identifier,
        value: {
          type: "BinaryOp",
          operator: "+",
          left: identifier,
          right: "1",
        },
        line: line,
        column: column,
      };
    }

    if (this.#match("DECREMENT")) {
      this.#expect("SEMICOLON", "Se esperaba ';' despues de '--'");
      return {
        type: "Assignment",
        identifier: identifier,
        value: {
          type: "BinaryOp",
          operator: "-",
          left: identifier,
          right: "1",
        },
        line: line,
        column: column,
      };
    }

    this.#expect("ASSIGN", "Se esperaba '=' en la asignacion");

    const value = this.#parseExpression();

    this.#expect("SEMICOLON", "Se esperaba ';' al final de la asignacion");

    return {
      type: "Assignment",
      identifier: identifier,
      value: value,
      line: line,
      column: column,
    };
  }

  // <expresion> ::= <termino> <expresion_prima>
  // Soporta: +, -, ==, !=, >, <, >=, <=
  #parseExpression() {
    let left = this.#parseTerm();

    while (
      this.#check("PLUS") ||
      this.#check("MINUS") ||
      this.#check("EQUAL") ||
      this.#check("NOT_EQUAL") ||
      this.#check("GREATER") ||
      this.#check("LESS") ||
      this.#check("GREATER_EQUAL") ||
      this.#check("LESS_EQUAL")
    ) {
      const operator = this.#currentToken.value;
      this.#advance();

      const right = this.#parseTerm();

      left = {
        type: "BinaryOp",
        operator: operator,
        left: left,
        right: right,
      };
    }

    return left;
  }

  // <termino> ::= <factor> <termino_prima>
  // Soporta: *, /
  #parseTerm() {
    let left = this.#parseFactor();

    while (this.#check("MULTIPLY") || this.#check("DIVIDE")) {
      const operator = this.#currentToken.value;
      this.#advance();

      const right = this.#parseFactor();

      left = {
        type: "BinaryOp",
        operator: operator,
        left: left,
        right: right,
      };
    }

    return left;
  }

  // <factor> ::= INTEGER | DOUBLE | CHAR | STRING | "true" | "false" | IDENTIFIER | "(" <expresion> ")"
  #parseFactor() {
    // Literales numericos
    if (this.#check("INTEGER")) {
      const value = this.#currentToken.value;
      this.#advance();
      return { type: "Literal", valueType: "int", value: value };
    }

    if (this.#check("DECIMAL")) {
      const value = this.#currentToken.value;
      this.#advance();
      return { type: "Literal", valueType: "double", value: value };
    }

    // Literales de texto
    if (this.#check("CHAR")) {
      const value = this.#currentToken.value;
      this.#advance();
      return { type: "Literal", valueType: "char", value: value };
    }

    if (this.#check("STRING")) {
      const value = this.#currentToken.value;
      this.#advance();
      return { type: "Literal", valueType: "string", value: value };
    }

    // Booleanos
    if (this.#checkValue("true")) {
      this.#advance();
      return { type: "Literal", valueType: "boolean", value: "true" };
    }

    if (this.#checkValue("false")) {
      this.#advance();
      return { type: "Literal", valueType: "boolean", value: "false" };
    }

    // Identificadores (variables)
    if (this.#check("IDENTIFIER")) {
      const identifier = this.#currentToken.value;

      // Verificar que este declarada
      if (!this.#symbolTable.has(identifier)) {
        this.#addError(`Variable '${identifier}' no ha sido declarada`);
      }

      this.#advance();
      return { type: "Identifier", value: identifier };
    }

    // Expresion entre parentesis
    if (this.#check("LPAREN")) {
      this.#advance();
      const expr = this.#parseExpression();
      this.#expect("RPAREN", "Se esperaba ')' para cerrar la expresion");
      return expr;
    }

    this.#addError(
      `Expresion invalida: token inesperado '${this.#currentToken.value}'`
    );
    return { type: "Error", value: this.#currentToken.value };
  }

  // <if_statement> ::= "if" "(" <expresion> ")" "{" <sentencias> "}" [ "else" ( "{" <sentencias> "}" ]
  #parseIfStatement() {
    const startLine = this.#currentToken.line;
    this.#expectValue("if", "Se esperaba 'if'");

    this.#expect("LPAREN", "Se esperaba '(' despues de 'if'");
    const condition = this.#parseExpression();
    this.#expect("RPAREN", "Se esperaba ')' despues de la condicion");

    this.#expect("LBRACE", "Se esperaba '{' despues de la condicion del if");
    const thenBlock = this.#parseStatements();
    this.#expect("RBRACE", "Se esperaba '}' al final del bloque if");

    let elseBlock = null;
    if (this.#matchValue("else")) {
      this.#expect("LBRACE", "Se esperaba '{' despues de 'else'");
      elseBlock = this.#parseStatements();
      this.#expect("RBRACE", "Se esperaba '}' al final del bloque else");
    }

    return {
      type: "IfStatement",
      condition: condition,
      thenBlock: thenBlock,
      elseBlock: elseBlock,
      line: startLine,
    };
  }

  // <for_statement> ::= "for" "(" <declaracion_for> ";" <expresion> ";" <actualizacion_for> ")" "{" <sentencias> "}"
  #parseForStatement() {
    const startLine = this.#currentToken.line;
    this.#expectValue("for", "Se esperaba 'for'");

    this.#expect("LPAREN", "Se esperaba '(' despues de 'for'");

    // Inicializacion: int i = 0
    const init = this.#parseDeclaration();

    // Condicion: i < 10
    const condition = this.#parseExpression();
    this.#expect(
      "SEMICOLON",
      "Se esperaba ';' despues de la condicion del for"
    );

    // Actualizacion: i++
    const update = this.#parseForUpdate();

    this.#expect(
      "RPAREN",
      "Se esperaba ')' despues de la actualizacion del for"
    );

    this.#expect("LBRACE", "Se esperaba '{' al inicio del bloque for");
    const body = this.#parseStatements();
    this.#expect("RBRACE", "Se esperaba '}' al final del bloque for");

    return {
      type: "ForStatement",
      init: init,
      condition: condition,
      update: update,
      body: body,
      line: startLine,
    };
  }

  // <actualizacion_for> ::= IDENTIFIER "++" | IDENTIFIER "--" | IDENTIFIER "=" <expresion>
  #parseForUpdate() {
    const identifier = this.#expect(
      "IDENTIFIER",
      "Se esperaba un identificador en la actualizacion del for"
    );

    if (!identifier) {
      return null;
    }

    if (this.#match("INCREMENT")) {
      return {
        type: "Assignment",
        identifier: identifier.value,
        value: {
          type: "BinaryOp",
          operator: "+",
          left: identifier.value,
          right: "1",
        },
      };
    }

    if (this.#match("DECREMENT")) {
      return {
        type: "Assignment",
        identifier: identifier.value,
        value: {
          type: "BinaryOp",
          operator: "-",
          left: identifier.value,
          right: "1",
        },
      };
    }

    if (this.#match("ASSIGN")) {
      const value = this.#parseExpression();
      return {
        type: "Assignment",
        identifier: identifier.value,
        value: value,
      };
    }

    this.#addError("Se esperaba '++', '--' o '=' en la actualizacion del for");
    return null;
  }

  // <while_statement> ::= "while" "(" <expresion> ")" "{" <sentencias> "}"
  #parseWhileStatement() {
    const startLine = this.#currentToken.line;
    this.#expectValue("while", "Se esperaba 'while'");

    this.#expect("LPAREN", "Se esperaba '(' despues de 'while'");
    const condition = this.#parseExpression();
    this.#expect("RPAREN", "Se esperaba ')' despues de la condicion");

    this.#expect("LBRACE", "Se esperaba '{' al inicio del bloque while");
    const body = this.#parseStatements();
    this.#expect("RBRACE", "Se esperaba '}' al final del bloque while");

    return {
      type: "WhileStatement",
      condition: condition,
      body: body,
      line: startLine,
    };
  }

  // <print_statement> ::= "System" "." "out" "." "println" "(" <expresion> ")" ";"
  #parsePrintStatement() {
    const startLine = this.#currentToken.line;

    this.#expectValue("System", "Se esperaba 'System'");
    this.#expect("DOT", "Se esperaba '.' despues de 'System'");
    this.#expectValue("out", "Se esperaba 'out' despues de 'System.'");
    this.#expect("DOT", "Se esperaba '.' despues de 'out'");
    this.#expectValue("println", "Se esperaba 'println' despues de 'out.'");

    this.#expect("LPAREN", "Se esperaba '(' despues de 'println'");
    const expression = this.#parseExpression();
    this.#expect("RPAREN", "Se esperaba ')' despues de la expresion");

    this.#expect("SEMICOLON", "Se esperaba ';' al final del println");

    return {
      type: "PrintStatement",
      expression: expression,
      line: startLine,
    };
  }
}
