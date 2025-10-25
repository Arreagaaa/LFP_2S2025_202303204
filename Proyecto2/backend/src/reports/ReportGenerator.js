export class ReportGenerator {
  static generateTokenReport(tokens, lexicalErrors = []) {
    const validTokens = tokens.filter((t) => t.type !== "EOF");

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Tokens - JavaBridge</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #0f172a; color: #e2e8f0; padding: 2rem; min-height: 100vh; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 3rem 2rem; border-radius: 1rem; margin-bottom: 2rem; border: 1px solid rgba(148, 163, 184, 0.2); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); }
        .header h1 { font-size: 2.5rem; font-weight: 800; background: linear-gradient(135deg, #60a5fa, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.5rem; }
        .header p { color: #94a3b8; font-size: 1.1rem; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 2rem; border-radius: 1rem; border: 1px solid rgba(148, 163, 184, 0.15); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); text-align: center; transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(59, 130, 246, 0.3); }
        .stat-number { font-size: 3rem; font-weight: 900; background: linear-gradient(135deg, #60a5fa, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.5rem; }
        .stat-label { color: #cbd5e1; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .content { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 2.5rem; border-radius: 1rem; border: 1px solid rgba(148, 163, 184, 0.2); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); }
        .content h2 { font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid rgba(59, 130, 246, 0.3); }
        table { width: 100%; border-collapse: collapse; background: rgba(15, 23, 42, 0.6); border-radius: 0.75rem; overflow: hidden; }
        thead { background: linear-gradient(135deg, #3b82f6, #06b6d4); }
        th { padding: 1rem; text-align: center; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: white; }
        th:nth-child(2) { text-align: left; }
        td { padding: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); text-align: center; color: #e2e8f0; }
        td:nth-child(2) { text-align: left; font-family: 'Consolas', 'Monaco', monospace; color: #60a5fa; font-weight: 600; }
        tbody tr { transition: all 0.2s ease; }
        tbody tr:hover { background: rgba(59, 130, 246, 0.08); transform: translateX(3px); }
        .token-type { display: inline-block; padding: 0.4rem 0.8rem; border-radius: 0.5rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .type-keyword { background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }
        .type-identifier { background: rgba(168, 85, 247, 0.15); color: #d8b4fe; border: 1px solid rgba(168, 85, 247, 0.3); }
        .type-number { background: rgba(34, 197, 94, 0.15); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.3); }
        .type-string { background: rgba(251, 146, 60, 0.15); color: #fdba74; border: 1px solid rgba(251, 146, 60, 0.3); }
        .type-symbol { background: rgba(236, 72, 153, 0.15); color: #f9a8d4; border: 1px solid rgba(236, 72, 153, 0.3); }
        .footer { margin-top: 2rem; padding: 1.5rem; text-align: center; color: #64748b; background: rgba(30, 41, 59, 0.5); border-radius: 1rem; border: 1px solid rgba(148, 163, 184, 0.1); }
        .footer strong { color: #60a5fa; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>REPORTE DE TOKENS</h1>
            <p>Análisis Léxico Completado - JavaBridge Translator</p>
        </div>
        <div class="stats">
            <div class="stat-card"><div class="stat-number">${
              validTokens.length
            }</div><div class="stat-label">Tokens Reconocidos</div></div>
            <div class="stat-card"><div class="stat-number">${
              validTokens[validTokens.length - 1]?.line || 0
            }</div><div class="stat-label">Líneas Analizadas</div></div>
            <div class="stat-card"><div class="stat-number">${
              lexicalErrors.length
            }</div><div class="stat-label">Errores Léxicos</div></div>
        </div>
        <div class="content">
            <h2>TOKENS IDENTIFICADOS</h2>
            <table>
                <thead><tr><th style="width: 8%;">No.</th><th style="width: 30%;">Lexema</th><th style="width: 30%;">Tipo</th><th style="width: 16%;">Línea</th><th style="width: 16%;">Columna</th></tr></thead>
                <tbody>${validTokens
                  .map(
                    (token, index) =>
                      `<tr><td>${index + 1}</td><td>${this.escapeHtml(
                        token.value
                      )}</td><td><span class="token-type ${this.getTypeClass(
                        token.type
                      )}">${token.type}</span></td><td>${token.line}</td><td>${
                        token.column
                      }</td></tr>`
                  )
                  .join("")}</tbody>
            </table>
        </div>
        <div class="footer"><strong>JavaBridge</strong> - Traductor Java a Python | Proyecto 2 LFP<br>Generado: ${new Date().toLocaleString(
          "es-GT"
        )}</div>
    </div>
</body>
</html>`;
  }

  static generateLexicalErrorReport(errors) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Errores Léxicos - JavaBridge</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #0f172a; color: #e2e8f0; padding: 2rem; min-height: 100vh; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 3rem 2rem; border-radius: 1rem; margin-bottom: 2rem; border: 1px solid rgba(239, 68, 68, 0.3); box-shadow: 0 20px 50px rgba(239, 68, 68, 0.2); }
        .header h1 { font-size: 2.5rem; font-weight: 800; background: linear-gradient(135deg, #f87171, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.5rem; }
        .header p { color: #94a3b8; font-size: 1.1rem; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 2rem; border-radius: 1rem; border: 1px solid rgba(239, 68, 68, 0.2); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); text-align: center; transition: transform 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(239, 68, 68, 0.3); }
        .stat-number { font-size: 3rem; font-weight: 900; background: linear-gradient(135deg, #f87171, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.5rem; }
        .stat-label { color: #cbd5e1; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .content { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 2.5rem; border-radius: 1rem; border: 1px solid rgba(148, 163, 184, 0.2); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); }
        .content h2 { font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid rgba(239, 68, 68, 0.3); }
        table { width: 100%; border-collapse: collapse; background: rgba(15, 23, 42, 0.6); border-radius: 0.75rem; overflow: hidden; }
        thead { background: linear-gradient(135deg, #ef4444, #dc2626); }
        th { padding: 1rem; text-align: center; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: white; }
        th:nth-child(3) { text-align: left; }
        td { padding: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); text-align: center; color: #e2e8f0; }
        td:nth-child(2) { font-family: 'Consolas', 'Monaco', monospace; color: #fca5a5; font-weight: 700; }
        td:nth-child(3) { text-align: left; color: #cbd5e1; }
        tbody tr { transition: all 0.2s ease; }
        tbody tr:hover { background: rgba(239, 68, 68, 0.08); transform: translateX(3px); }
        .footer { margin-top: 2rem; padding: 1.5rem; text-align: center; color: #64748b; background: rgba(30, 41, 59, 0.5); border-radius: 1rem; border: 1px solid rgba(148, 163, 184, 0.1); }
        .footer strong { color: #ef4444; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>REPORTE DE ERRORES LÉXICOS</h1>
            <p>Análisis de Errores Léxicos - JavaBridge Translator</p>
        </div>
        <div class="stats">
            <div class="stat-card"><div class="stat-number">${
              errors.length
            }</div><div class="stat-label">Errores Detectados</div></div>
            <div class="stat-card"><div class="stat-number">${
              errors[errors.length - 1]?.line || 0
            }</div><div class="stat-label">Última Línea con Error</div></div>
        </div>
        <div class="content">
            <h2>ERRORES LÉXICOS ENCONTRADOS</h2>
            <table>
                <thead><tr><th style="width: 8%;">No.</th><th style="width: 15%;">Error</th><th style="width: 49%;">Descripción</th><th style="width: 14%;">Línea</th><th style="width: 14%;">Columna</th></tr></thead>
                <tbody>${errors
                  .map(
                    (error, index) =>
                      `<tr><td>${index + 1}</td><td>${this.escapeHtml(
                        error.char
                      )}</td><td>${this.escapeHtml(
                        error.description
                      )}</td><td>${error.line}</td><td>${
                        error.column
                      }</td></tr>`
                  )
                  .join("")}</tbody>
            </table>
        </div>
        <div class="footer"><strong>JavaBridge</strong> - Traductor Java a Python | Proyecto 2 LFP<br>Generado: ${new Date().toLocaleString(
          "es-GT"
        )}</div>
    </div>
</body>
</html>`;
  }

  static generateSyntaxErrorReport(errors) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Errores Sintácticos - JavaBridge</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #0f172a; color: #e2e8f0; padding: 2rem; min-height: 100vh; }
        .container { max-width: 1400px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 3rem 2rem; border-radius: 1rem; margin-bottom: 2rem; border: 1px solid rgba(251, 146, 60, 0.3); box-shadow: 0 20px 50px rgba(251, 146, 60, 0.2); }
        .header h1 { font-size: 2.5rem; font-weight: 800; background: linear-gradient(135deg, #fdba74, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.5rem; }
        .header p { color: #94a3b8; font-size: 1.1rem; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 2rem; border-radius: 1rem; border: 1px solid rgba(251, 146, 60, 0.2); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); text-align: center; transition: transform 0.3s ease; }
        .stat-card:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(251, 146, 60, 0.3); }
        .stat-number { font-size: 3rem; font-weight: 900; background: linear-gradient(135deg, #fdba74, #fb923c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 0.5rem; }
        .stat-label { color: #cbd5e1; font-size: 0.95rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .content { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 2.5rem; border-radius: 1rem; border: 1px solid rgba(148, 163, 184, 0.2); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); }
        .content h2 { font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid rgba(251, 146, 60, 0.3); }
        table { width: 100%; border-collapse: collapse; background: rgba(15, 23, 42, 0.6); border-radius: 0.75rem; overflow: hidden; }
        thead { background: linear-gradient(135deg, #fb923c, #f97316); }
        th { padding: 1rem; text-align: center; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: white; }
        th:nth-child(3) { text-align: left; }
        td { padding: 1rem; border-bottom: 1px solid rgba(148, 163, 184, 0.08); text-align: center; color: #e2e8f0; }
        td:nth-child(2) { font-family: 'Consolas', 'Monaco', monospace; color: #fdba74; font-weight: 700; }
        td:nth-child(3) { text-align: left; color: #cbd5e1; }
        tbody tr { transition: all 0.2s ease; }
        tbody tr:hover { background: rgba(251, 146, 60, 0.08); transform: translateX(3px); }
        .footer { margin-top: 2rem; padding: 1.5rem; text-align: center; color: #64748b; background: rgba(30, 41, 59, 0.5); border-radius: 1rem; border: 1px solid rgba(148, 163, 184, 0.1); }
        .footer strong { color: #fb923c; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>REPORTE DE ERRORES SINTÁCTICOS</h1>
            <p>Análisis de Errores Sintácticos - JavaBridge Translator</p>
        </div>
        <div class="stats">
            <div class="stat-card"><div class="stat-number">${
              errors.length
            }</div><div class="stat-label">Errores Detectados</div></div>
            <div class="stat-card"><div class="stat-number">${
              errors[errors.length - 1]?.line || 0
            }</div><div class="stat-label">Última Línea con Error</div></div>
        </div>
        <div class="content">
            <h2>ERRORES SINTÁCTICOS ENCONTRADOS</h2>
            <table>
                <thead><tr><th style="width: 8%;">No.</th><th style="width: 15%;">Error</th><th style="width: 49%;">Descripción</th><th style="width: 14%;">Línea</th><th style="width: 14%;">Columna</th></tr></thead>
                <tbody>${errors
                  .map(
                    (error, index) =>
                      `<tr><td>${index + 1}</td><td>${this.escapeHtml(
                        error.char || error.token || "N/A"
                      )}</td><td>${this.escapeHtml(
                        error.description
                      )}</td><td>${error.line}</td><td>${
                        error.column
                      }</td></tr>`
                  )
                  .join("")}</tbody>
            </table>
        </div>
        <div class="footer"><strong>JavaBridge</strong> - Traductor Java a Python | Proyecto 2 LFP<br>Generado: ${new Date().toLocaleString(
          "es-GT"
        )}</div>
    </div>
</body>
</html>`;
  }

  static getTypeClass(type) {
    const typeMap = {
      KEYWORD: "type-keyword",
      IDENTIFIER: "type-identifier",
      INTEGER: "type-number",
      FLOAT: "type-number",
      DOUBLE: "type-number",
      STRING: "type-string",
      CHAR: "type-string",
      SYMBOL: "type-symbol",
      OPERATOR: "type-symbol",
      LPAREN: "type-symbol",
      RPAREN: "type-symbol",
      LBRACE: "type-symbol",
      RBRACE: "type-symbol",
      SEMICOLON: "type-symbol",
      COMMA: "type-symbol",
    };
    return typeMap[type] || "type-identifier";
  }

  static escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return String(text).replace(/[&<>"']/g, (m) => map[m]);
  }
}
