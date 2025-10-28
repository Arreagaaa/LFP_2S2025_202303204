// Traductor de AST Java a codigo Python
export class Translator {
  // Propiedades privadas
  #ast; // Arbol Sintactico Abstracto
  #tokens; // Tokens del lexer (para comentarios)
  #comments; // Comentarios extraídos
  #pythonCode; // Lineas de codigo Python generadas
  #indentLevel; // Nivel de indentacion actual

  constructor(ast, tokens = []) {
    this.#ast = ast;
    this.#tokens = tokens;
    this.#comments = this.#extractComments(tokens);
    this.#pythonCode = [];
    this.#indentLevel = 0;
  }

  // Extraer comentarios de los tokens
  #extractComments(tokens) {
    return tokens
      .filter((t) => t.type === "COMMENT")
      .map((t) => ({
        line: t.line,
        value: t.value,
        isBlock: t.value.startsWith("/*"),
      }));
  }

  // Convertir comentario Java a Python
  #translateComment(comment) {
    if (comment.startsWith("//")) {
      // Comentario de línea: // texto → # texto
      return comment.replace("//", "#");
    } else if (comment.startsWith("/*") && comment.endsWith("*/")) {
      // Comentario de bloque: /* ... */ → '''...'''
      const content = comment.substring(2, comment.length - 2);
      return `'''${content}'''`;
    }
    return `# ${comment}`;
  }

  // Traducir el AST completo a Python
  translate() {
    if (!this.#ast || !this.#ast.main) {
      return "";
    }

    // Encabezado
    this.#pythonCode.push("# Traducido de Java a Python por JavaBridge");
    this.#pythonCode.push("# Carne: 202303204");
    this.#pythonCode.push("");

    // Traducir el metodo main (incluye comentarios)
    this.#translateMain(this.#ast.main);

    return this.#pythonCode.join("\n");
  }

  // Traducir el metodo main
  #translateMain(mainNode) {
    // Insertar todos los comentarios al inicio del código
    if (this.#comments.length > 0) {
      this.#comments.forEach((c) => {
        this.#pythonCode.push(this.#translateComment(c.value));
      });
      this.#pythonCode.push(""); // Línea en blanco después de comentarios
    }

    // En Python no hay main explicito, directamente ejecutamos el codigo
    if (mainNode.statements && Array.isArray(mainNode.statements)) {
      mainNode.statements.forEach((stmt) => {
        this.#translateStatement(stmt);
      });
    }
  }

  // Traducir una sentencia generica
  #translateStatement(stmt) {
    switch (stmt.type) {
      case "Declaration":
        this.#translateDeclaration(stmt);
        break;
      case "Assignment":
        this.#translateAssignment(stmt);
        break;
      case "IfStatement":
        this.#translateIf(stmt);
        break;
      case "ForStatement":
        this.#translateFor(stmt);
        break;
      case "WhileStatement":
        this.#translateWhile(stmt);
        break;
      case "PrintStatement":
        this.#translatePrint(stmt);
        break;
      default:
        this.#pythonCode.push(
          `${this.#getIndent()}# Sentencia no traducida: ${stmt.type}`
        );
    }
  }

  // Obtener la indentacion actual (4 espacios por nivel)
  #getIndent() {
    return "    ".repeat(this.#indentLevel);
  }

  // Traducir declaracion de variable
  // Java: int x = 5;
  // Python: x = 5
  #translateDeclaration(node) {
    const indent = this.#getIndent();

    if (node.value) {
      // Declaracion con inicializacion
      const value = this.#translateExpression(node.value);
      this.#pythonCode.push(`${indent}${node.identifier} = ${value}`);
    } else {
      // Declaracion sin inicializacion - usar valor por defecto
      let defaultValue;
      switch (node.dataType) {
        case "int":
          defaultValue = "0";
          break;
        case "double":
          defaultValue = "0.0";
          break;
        case "char":
          defaultValue = "' '";
          break;
        case "String":
          defaultValue = '""';
          break;
        case "boolean":
          defaultValue = "False";
          break;
        default:
          defaultValue = "None";
      }
      this.#pythonCode.push(`${indent}${node.identifier} = ${defaultValue}`);
    }
  }

  // Traducir asignacion
  // Java: x = 10;
  // Python: x = 10
  #translateAssignment(node) {
    const indent = this.#getIndent();
    const value = this.#translateExpression(node.value);
    this.#pythonCode.push(`${indent}${node.identifier} = ${value}`);
  }

  // Traducir if-else-elif
  // Java: if (x > 0) { ... } else if (x == 0) { ... } else { ... }
  // Python: if x > 0:\n    ...\nelif x == 0:\n    ...\nelse:\n    ...
  #translateIf(node) {
    const indent = this.#getIndent();
    const condition = this.#translateExpression(node.condition);

    this.#pythonCode.push(`${indent}if ${condition}:`);

    // Bloque then
    this.#indentLevel++;
    if (
      !node.thenBlock ||
      !Array.isArray(node.thenBlock) ||
      node.thenBlock.length === 0
    ) {
      this.#pythonCode.push(`${this.#getIndent()}pass`);
    } else {
      node.thenBlock.forEach((stmt) => this.#translateStatement(stmt));
    }
    this.#indentLevel--;

    // Bloques else if (opcional)
    if (node.elseIfChain && node.elseIfChain.length > 0) {
      node.elseIfChain.forEach((elseIfNode) => {
        const elifCondition = this.#translateExpression(elseIfNode.condition);
        this.#pythonCode.push(`${indent}elif ${elifCondition}:`);

        this.#indentLevel++;
        if (
          !elseIfNode.thenBlock ||
          !Array.isArray(elseIfNode.thenBlock) ||
          elseIfNode.thenBlock.length === 0
        ) {
          this.#pythonCode.push(`${this.#getIndent()}pass`);
        } else {
          elseIfNode.thenBlock.forEach((stmt) =>
            this.#translateStatement(stmt)
          );
        }
        this.#indentLevel--;
      });
    }

    // Bloque else (opcional)
    if (node.elseBlock) {
      this.#pythonCode.push(`${indent}else:`);
      this.#indentLevel++;
      if (!Array.isArray(node.elseBlock) || node.elseBlock.length === 0) {
        this.#pythonCode.push(`${this.#getIndent()}pass`);
      } else {
        node.elseBlock.forEach((stmt) => this.#translateStatement(stmt));
      }
      this.#indentLevel--;
    }
  }

  // Traducir bucle for
  // Java: for (int i = 0; i < 10; i++) { ... }
  // Python: for i in range(0, 10):
  #translateFor(node) {
    const indent = this.#getIndent();

    // Extraer informacion del for
    const varName = node.init.identifier;
    const startValue = this.#translateExpression(node.init.value);

    // Analizar la condicion (asumimos i < N, i <= N, i > N, i >= N)
    let endValue = "0";
    let isReverse = false;

    if (node.condition.type === "BinaryOp") {
      if (node.condition.operator === "<") {
        endValue = this.#translateExpression(node.condition.right);
      } else if (node.condition.operator === "<=") {
        // Si es <=, necesitamos sumar 1 al limite
        const limit = this.#translateExpression(node.condition.right);
        endValue = `${limit} + 1`;
      } else if (node.condition.operator === ">") {
        // Orden inverso
        endValue = this.#translateExpression(node.condition.right);
        isReverse = true;
      } else if (node.condition.operator === ">=") {
        // Orden inverso con inclusión
        const limit = this.#translateExpression(node.condition.right);
        endValue = `${limit} - 1`;
        isReverse = true;
      }
    }

    // Analizar el update (i++, i--, i += n)
    let step = null;
    if (node.update && node.update.value) {
      if (node.update.value.type === "BinaryOp") {
        if (node.update.value.operator === "-") {
          // Es un decremento (i-- o i -= n)
          const rightValue = this.#translateExpression(node.update.value.right);
          if (rightValue === "1") {
            step = "-1";
          } else {
            step = `-${rightValue}`;
          }
          isReverse = true;
        } else if (node.update.value.operator === "+") {
          // Es un incremento (i++ o i += n)
          const rightValue = this.#translateExpression(node.update.value.right);
          if (rightValue !== "1") {
            step = rightValue;
          }
          // Si es "1", dejamos step = null para usar el comportamiento por defecto
        }
      }
    }

    // Generar el for de Python con range()
    if (isReverse && step === null) {
      // Bucle inverso sin step explícito (debe ser -1)
      this.#pythonCode.push(
        `${indent}for ${varName} in range(${startValue}, ${endValue}, -1):`
      );
    } else if (step !== null && step !== "None") {
      // Bucle con step personalizado (solo si step es válido)
      this.#pythonCode.push(
        `${indent}for ${varName} in range(${startValue}, ${endValue}, ${step}):`
      );
    } else {
      // Bucle normal (incremento de 1 por defecto)
      this.#pythonCode.push(
        `${indent}for ${varName} in range(${startValue}, ${endValue}):`
      );
    }

    // Cuerpo del for
    this.#indentLevel++;
    if (!node.body || !Array.isArray(node.body) || node.body.length === 0) {
      this.#pythonCode.push(`${this.#getIndent()}pass`);
    } else {
      node.body.forEach((stmt) => this.#translateStatement(stmt));
    }
    this.#indentLevel--;
  }

  // Traducir bucle while
  // Java: while (x > 0) { ... }
  // Python: while x > 0:
  #translateWhile(node) {
    const indent = this.#getIndent();
    const condition = this.#translateExpression(node.condition);

    this.#pythonCode.push(`${indent}while ${condition}:`);

    // Cuerpo del while
    this.#indentLevel++;
    if (!node.body || !Array.isArray(node.body) || node.body.length === 0) {
      this.#pythonCode.push(`${this.#getIndent()}pass`);
    } else {
      node.body.forEach((stmt) => this.#translateStatement(stmt));
    }
    this.#indentLevel--;
  }

  // Traducir System.out.println
  // Java: System.out.println(x);
  // Python: print(x)
  #translatePrint(node) {
    const indent = this.#getIndent();
    const expression = this.#translateExpression(node.expression);
    this.#pythonCode.push(`${indent}print(${expression})`);
  }

  // Traducir una expresion
  #translateExpression(expr) {
    if (!expr) {
      return "None";
    }

    switch (expr.type) {
      case "Literal":
        return this.#translateLiteral(expr);
      case "Identifier":
        return expr.value;
      case "BinaryOp":
        return this.#translateBinaryOp(expr);
      case "UnaryOp":
        return this.#translateUnaryOp(expr);
      case "GroupedExpression":
        return `(${this.#translateExpression(expr.expression)})`;
      default:
        return "None";
    }
  }

  // Traducir operador unario (!, -, +)
  #translateUnaryOp(node) {
    const operand = this.#translateExpression(node.operand);

    // Traducir operadores unarios de Java a Python
    if (node.operator === "!") {
      return `not ${operand}`;
    } else if (node.operator === "-") {
      return `-${operand}`;
    } else if (node.operator === "+") {
      return `+${operand}`;
    }

    return operand;
  }

  // Traducir un literal
  #translateLiteral(node) {
    switch (node.valueType) {
      case "int":
        return node.value;
      case "double":
        return node.value;
      case "char":
        // En Python, los caracteres son strings de un solo carácter
        // Escapar caracteres especiales si es necesario
        const charValue = node.value
          .replace(/\\/g, "\\\\")
          .replace(/'/g, "\\'")
          .replace(/"/g, '\\"')
          .replace(/\n/g, "\\n")
          .replace(/\t/g, "\\t")
          .replace(/\r/g, "\\r");
        return `'${charValue}'`;
      case "string":
        // Escapar caracteres especiales en strings
        const strValue = node.value
          .replace(/\\/g, "\\\\")
          .replace(/"/g, '\\"')
          .replace(/\n/g, "\\n")
          .replace(/\t/g, "\\t")
          .replace(/\r/g, "\\r");
        return `"${strValue}"`;
      case "boolean":
        // Java: true/false → Python: True/False
        return node.value === "true" ? "True" : "False";
      default:
        return node.value;
    }
  }

  // Traducir operacion binaria
  #translateBinaryOp(node) {
    const left = this.#translateExpression(node.left);
    const right = this.#translateExpression(node.right);
    const operator = node.operator;

    // Operadores lógicos que cambian de Java a Python
    if (operator === "&&") {
      return `${left} and ${right}`;
    } else if (operator === "||") {
      return `${left} or ${right}`;
    } else if (operator === "==") {
      return `${left} == ${right}`;
    } else if (operator === "!=") {
      return `${left} != ${right}`;
    } else {
      // +, -, *, /, >, <, >=, <= son iguales
      return `${left} ${operator} ${right}`;
    }
  }
}
