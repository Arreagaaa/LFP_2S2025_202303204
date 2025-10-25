// Generador de Reportes HTML
export class ReportGenerator {
    
    // Genera reporte HTML de tokens
    static generateTokenReport(tokens) {
        const validTokens = tokens.filter(t => t.type !== 'EOF');
        
        let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Tokens - JavaBridge</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-card h3 {
            color: #667eea;
            font-size: 2em;
            margin-bottom: 5px;
        }
        .stat-card p {
            color: #666;
            font-size: 0.9em;
        }
        .content {
            padding: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .token-type {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
        }
        .type-keyword {
            background: #e3f2fd;
            color: #1976d2;
        }
        .type-identifier {
            background: #f3e5f5;
            color: #7b1fa2;
        }
        .type-number {
            background: #e8f5e9;
            color: #388e3c;
        }
        .type-string {
            background: #fff3e0;
            color: #f57c00;
        }
        .type-symbol {
            background: #fce4ec;
            color: #c2185b;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Reporte de Tokens</h1>
            <p>Análisis Léxico Exitoso</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <h3>${validTokens.length}</h3>
                <p>Tokens Reconocidos</p>
            </div>
            <div class="stat-card">
                <h3>${validTokens[validTokens.length - 1]?.line || 0}</h3>
                <p>Líneas Analizadas</p>
            </div>
            <div class="stat-card">
                <h3>0</h3>
                <p>Errores Léxicos</p>
            </div>
        </div>
        
        <div class="content">
            <h2>Tabla de Tokens</h2>
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
        `;

        validTokens.forEach((token, index) => {
            const typeClass = this.getTokenClass(token.type);
            html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><span class="token-type ${typeClass}">${token.type}</span></td>
                        <td><code>${this.escapeHtml(token.value)}</code></td>
                        <td>${token.line}</td>
                        <td>${token.column}</td>
                    </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>JavaBridge - Traductor Java a Python | Proyecto 2 LFP</p>
            <p>Generado el ${new Date().toLocaleString('es-GT')}</p>
        </div>
    </div>
</body>
</html>
        `;

        return html;
    }

    // Genera reporte HTML de errores lexicos
    static generateLexicalErrorReport(errors) {
        let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Errores Léxicos - JavaBridge</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #fff5f5;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-card h3 {
            color: #f5576c;
            font-size: 2em;
            margin-bottom: 5px;
        }
        .stat-card p {
            color: #666;
            font-size: 0.9em;
        }
        .content {
            padding: 30px;
        }
        .error-list {
            list-style: none;
        }
        .error-item {
            background: #fff5f5;
            border-left: 4px solid #f5576c;
            padding: 15px 20px;
            margin-bottom: 15px;
            border-radius: 4px;
        }
        .error-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .error-char {
            background: #f5576c;
            color: white;
            padding: 2px 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
        }
        .error-location {
            color: #666;
            font-size: 0.9em;
        }
        .error-description {
            color: #333;
            font-size: 0.95em;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: #f5576c;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
        }
        tr:hover {
            background: #fff5f5;
        }
        .footer {
            background: #fff5f5;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>❌ Errores Léxicos</h1>
            <p>Se encontraron caracteres no reconocidos</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <h3>${errors.length}</h3>
                <p>Errores Encontrados</p>
            </div>
        </div>
        
        <div class="content">
            <h2>Listado de Errores</h2>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Carácter</th>
                        <th>Línea</th>
                        <th>Columna</th>
                        <th>Descripción</th>
                    </tr>
                </thead>
                <tbody>
        `;

        errors.forEach((error, index) => {
            html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><span class="error-char">${this.escapeHtml(error.char)}</span></td>
                        <td>${error.line}</td>
                        <td>${error.column}</td>
                        <td>${error.description}</td>
                    </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>JavaBridge - Traductor Java a Python | Proyecto 2 LFP</p>
            <p>Generado el ${new Date().toLocaleString('es-GT')}</p>
        </div>
    </div>
</body>
</html>
        `;

        return html;
    }

    // Genera reporte HTML de errores sintacticos
    static generateSyntaxErrorReport(errors) {
        let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Errores Sintácticos - JavaBridge</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #fffbf0;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .stat-card h3 {
            color: #fa709a;
            font-size: 2em;
            margin-bottom: 5px;
        }
        .stat-card p {
            color: #666;
            font-size: 0.9em;
        }
        .content {
            padding: 30px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: #fa709a;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 12px 15px;
            border-bottom: 1px solid #eee;
            vertical-align: top;
        }
        tr:hover {
            background: #fffbf0;
        }
        .error-msg {
            color: #c62828;
            font-weight: 500;
        }
        .footer {
            background: #fffbf0;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Errores Sintácticos</h1>
            <p>Se encontraron errores de estructura en el código</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <h3>${errors.length}</h3>
                <p>Errores Sintácticos</p>
            </div>
        </div>
        
        <div class="content">
            <h2>Listado de Errores</h2>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Línea</th>
                        <th>Columna</th>
                        <th>Descripción del Error</th>
                    </tr>
                </thead>
                <tbody>
        `;

        errors.forEach((error, index) => {
            html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${error.line}</td>
                        <td>${error.column}</td>
                        <td class="error-msg">${this.escapeHtml(error.message)}</td>
                    </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>JavaBridge - Traductor Java a Python | Proyecto 2 LFP</p>
            <p>Generado el ${new Date().toLocaleString('es-GT')}</p>
        </div>
    </div>
</body>
</html>
        `;

        return html;
    }

    // Determina la clase CSS segun el tipo de token
    static getTokenClass(type) {
        const keywords = ['PUBLIC', 'CLASS', 'STATIC', 'VOID', 'MAIN', 'STRING', 'ARGS', 
                         'INT', 'DOUBLE', 'CHAR', 'BOOLEAN', 'TRUE', 'FALSE', 
                         'IF', 'ELSE', 'FOR', 'WHILE', 'SYSTEM', 'OUT', 'PRINTLN'];
        const numbers = ['NUMERO_ENTERO', 'NUMERO_DECIMAL'];
        const strings = ['CADENA', 'CARACTER'];

        if (keywords.includes(type)) return 'type-keyword';
        if (type === 'IDENTIFICADOR') return 'type-identifier';
        if (numbers.includes(type)) return 'type-number';
        if (strings.includes(type)) return 'type-string';
        return 'type-symbol';
    }

    // Escapa caracteres HTML
    static escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
}
