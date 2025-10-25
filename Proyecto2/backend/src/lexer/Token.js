// Representa un token reconocido por el analizador lexico
export class Token {
  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }

  toString() {
    return `Token(${this.type}, '${this.value}', L${this.line}:C${this.column})`;
  }
}

// Representa un error lexico encontrado durante el analisis
export class LexicalError {
  constructor(char, line, column, description) {
    this.char = char;
    this.line = line;
    this.column = column;
    this.description = description;
  }

  toString() {
    return `Error Lexico: '${this.char}' en L${this.line}:C${this.column} - ${this.description}`;
  }
}

// Tipos de tokens soportados
export const TokenType = {
  // Palabras reservadas
  KEYWORD: "KEYWORD",

  // Identificadores y literales
  IDENTIFIER: "IDENTIFIER",
  INTEGER: "INTEGER",
  DECIMAL: "DECIMAL",
  STRING: "STRING",
  CHAR: "CHAR",

  // Simbolos
  LBRACE: "LBRACE",
  RBRACE: "RBRACE",
  LPAREN: "LPAREN",
  RPAREN: "RPAREN",
  LBRACKET: "LBRACKET",
  RBRACKET: "RBRACKET",
  SEMICOLON: "SEMICOLON",
  COMMA: "COMMA",
  DOT: "DOT",
  ASSIGN: "ASSIGN",
  PLUS: "PLUS",
  MINUS: "MINUS",
  MULTIPLY: "MULTIPLY",
  DIVIDE: "DIVIDE",
  EQUAL: "EQUAL",
  NOT_EQUAL: "NOT_EQUAL",
  GREATER: "GREATER",
  LESS: "LESS",
  GREATER_EQUAL: "GREATER_EQUAL",
  LESS_EQUAL: "LESS_EQUAL",
  INCREMENT: "INCREMENT",
  DECREMENT: "DECREMENT",

  // Especiales
  EOF: "EOF",
  COMMENT: "COMMENT",
};
