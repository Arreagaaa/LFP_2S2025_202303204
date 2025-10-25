// Generador de Reportes HTML
export class ReportGenerator {
  // Genera reporte HTML de tokens
  static generateTokenReport(tokens, lexicalErrors = []) {
    const validTokens = tokens.filter((t) => t.type !== "EOF");

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
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f172a;
            min-height: 100vh;
            padding: 40px 20px;
            position: relative;
            overflow-x: hidden;
        }
        body::before {
            content: '';
            position: fixed;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
            animation: gradientShift 15s ease infinite;
            z-index: 0;
        }
        @keyframes gradientShift {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(5%, -5%) rotate(120deg); }
            66% { transform: translate(-5%, 5%) rotate(240deg); }
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        .header {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            color: white;
            padding: 50px 40px;
            border-radius: 24px;
            margin-bottom: 40px;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6),
                        0 10px 30px rgba(59, 130, 246, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(148, 163, 184, 0.2);
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6, #3b82f6);
            background-size: 200% 100%;
            animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        .header h1 {
            font-size: 3em;
            margin-bottom: 12px;
            font-weight: 800;
            background: linear-gradient(135deg, #60a5fa, #06b6d4, #3b82f6);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientFlow 4s ease infinite;
            letter-spacing: -1px;
        }
        @keyframes gradientFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .header p {
            font-size: 1.2em;
            color: #94a3b8;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 28px;
            margin-bottom: 40px;
        }
        .stat-card {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5),
                        0 5px 20px rgba(59, 130, 246, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            text-align: center;
            border: 1px solid rgba(148, 163, 184, 0.15);
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
            transition: left 0.6s;
        }
        .stat-card:hover::before {
            left: 100%;
        }
        .stat-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.7),
                        0 10px 40px rgba(59, 130, 246, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15);
            border-color: rgba(59, 130, 246, 0.4);
        }
        .stat-card h3 {
            background: linear-gradient(135deg, #60a5fa, #06b6d4, #8b5cf6);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 3.5em;
            margin-bottom: 12px;
            font-weight: 900;
            animation: gradientFlow 3s ease infinite;
            line-height: 1;
        }
        .stat-card p {
            color: #cbd5e1;
            font-size: 1.05em;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            opacity: 0.9;
        }
        .content {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 50px;
            border-radius: 24px;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6),
                        0 10px 30px rgba(59, 130, 246, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(148, 163, 184, 0.2);
        }
        .content h2 {
            color: white;
            font-size: 2em;
            margin-bottom: 30px;
            font-weight: 800;
            letter-spacing: -0.5px;
            position: relative;
            padding-bottom: 15px;
        }
        .content h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, #3b82f6, #06b6d4);
            border-radius: 2px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: rgba(15, 23, 42, 0.6);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
            table-layout: fixed;
        }
        th {
            background: linear-gradient(135deg, #3b82f6, #06b6d4);
            color: white;
            padding: 18px 20px;
            text-align: center;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.8em;
            letter-spacing: 1.5px;
            position: sticky;
            top: 0;
            z-index: 10;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        th:nth-child(1) { width: 8%; }
        th:nth-child(2) { width: 20%; }
        th:nth-child(3) { width: 44%; }
        th:nth-child(4) { width: 14%; }
        th:nth-child(5) { width: 14%; }
        td {
            padding: 18px 20px;
            border-bottom: 1px solid rgba(148, 163, 184, 0.08);
            color: #e2e8f0;
            font-size: 0.95em;
            vertical-align: middle;
            text-align: center;
        }
        td:nth-child(3) {
            text-align: left;
            word-break: break-all;
        }
        code {
            font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
            background: rgba(15, 23, 42, 0.4);
            padding: 4px 8px;
            border-radius: 8px;
            display: inline-block;
            color: #e2e8f0;
            word-break: break-word;
        }
        tbody tr {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }
        tbody tr::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: linear-gradient(135deg, #3b82f6, #06b6d4);
            transform: scaleY(0);
            transition: transform 0.3s ease;
        }
        tbody tr:hover::before {
            transform: scaleY(1);
        }
        tbody tr:hover {
            background: rgba(59, 130, 246, 0.08);
            transform: translateX(4px);
        }
        tbody tr:hover td {
            color: #f1f5f9;
        }
        .token-type {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: 700;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
        }
        .token-type:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .type-keyword {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
            color: #fca5a5;
            border: 1.5px solid rgba(239, 68, 68, 0.4);
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
        }
        .type-identifier {
            background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.2));
            color: #d8b4fe;
            border: 1.5px solid rgba(168, 85, 247, 0.4);
            box-shadow: 0 2px 8px rgba(168, 85, 247, 0.3);
        }
        .type-number {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2));
            color: #86efac;
            border: 1.5px solid rgba(34, 197, 94, 0.4);
            box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
        }
        .type-string {
            background: linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(249, 115, 22, 0.2));
            color: #fdba74;
            border: 1.5px solid rgba(251, 146, 60, 0.4);
            box-shadow: 0 2px 8px rgba(251, 146, 60, 0.3);
        }
        .type-symbol {
            background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.2));
            color: #f9a8d4;
            border: 1.5px solid rgba(236, 72, 153, 0.4);
            box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
        }
        .type-comment {
            background: linear-gradient(135deg, rgba(100, 116, 139, 0.2), rgba(71, 85, 105, 0.2));
            color: #cbd5e1;
            border: 1.5px solid rgba(100, 116, 139, 0.4);
            box-shadow: 0 2px 8px rgba(100, 116, 139, 0.3);
        }
        .footer {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 30px;
            text-align: center;
            color: #94a3b8;
            font-size: 0.95em;
            border-radius: 24px;
            margin-top: 40px;
            border: 1px solid rgba(148, 163, 184, 0.2);
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .footer p {
            margin: 5px 0;
            font-weight: 500;
        }
        .footer p:first-child {
            font-weight: 700;
            background: linear-gradient(135deg, #60a5fa, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 1.05em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reporte de Tokens</h1>
            <p>Analisis Lexico Exitoso</p>
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
                <h3>${lexicalErrors.length}</h3>
                <p>Errores Léxicos</p>
            </div>
        </div>
        
        <div class="content">
            <h2>Tabla de Tokens</h2>
            <table>
                <colgroup>
                    <col style="width:8%">
                    <col style="width:20%">
                    <col style="width:44%">
                    <col style="width:14%">
                    <col style="width:14%">
                </colgroup>
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
                        <td><span class="token-type ${typeClass}">${
        token.type
      }</span></td>
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
            <p>Generado el ${new Date().toLocaleString("es-GT")}</p>
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
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0f172a;
            min-height: 100vh;
            padding: 40px 20px;
            position: relative;
            overflow-x: hidden;
        }
        body::before {
            content: '';
            position: fixed;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.15) 0%, transparent 50%),
                        radial-gradient(circle at 20% 80%, rgba(185, 28, 28, 0.1) 0%, transparent 50%);
            animation: gradientShift 15s ease infinite;
            z-index: 0;
        }
        @keyframes gradientShift {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(5%, -5%) rotate(120deg); }
            66% { transform: translate(-5%, 5%) rotate(240deg); }
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        .header {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            color: white;
            padding: 50px 40px;
            border-radius: 24px;
            margin-bottom: 40px;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6),
                        0 10px 30px rgba(239, 68, 68, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(148, 163, 184, 0.2);
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #ef4444, #dc2626, #b91c1c, #ef4444);
            background-size: 200% 100%;
            animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        .header h1 {
            font-size: 3em;
            margin-bottom: 12px;
            font-weight: 800;
            background: linear-gradient(135deg, #fca5a5, #ef4444, #dc2626);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: gradientFlow 4s ease infinite;
            letter-spacing: -1px;
        }
        @keyframes gradientFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }
        .header p {
            font-size: 1.2em;
            color: #94a3b8;
            font-weight: 500;
            letter-spacing: 0.5px;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 28px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5),
                        0 5px 20px rgba(239, 68, 68, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            text-align: center;
            border: 1px solid rgba(239, 68, 68, 0.2);
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.1), transparent);
            transition: left 0.6s;
        }
        .stat-card:hover::before {
            left: 100%;
        }
        .stat-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.7),
                        0 10px 40px rgba(239, 68, 68, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15);
            border-color: rgba(239, 68, 68, 0.5);
        }
        .stat-card h3 {
            background: linear-gradient(135deg, #fca5a5, #ef4444, #dc2626);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 3.5em;
            margin-bottom: 12px;
            font-weight: 900;
            animation: gradientFlow 3s ease infinite;
            line-height: 1;
        }
        .stat-card p {
            color: #cbd5e1;
            font-size: 1.05em;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            opacity: 0.9;
        }
        .content {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 50px;
            border-radius: 24px;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6),
                        0 10px 30px rgba(239, 68, 68, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(148, 163, 184, 0.2);
        }
        .content h2 {
            color: white;
            font-size: 2em;
            margin-bottom: 30px;
            font-weight: 800;
            letter-spacing: -0.5px;
            position: relative;
            padding-bottom: 15px;
        }
        .content h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, #ef4444, #dc2626);
            border-radius: 2px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: rgba(15, 23, 42, 0.6);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
            table-layout: fixed;
        }
        th {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 18px 20px;
            text-align: center;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.8em;
            letter-spacing: 1.5px;
            position: sticky;
            top: 0;
            z-index: 10;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        th:nth-child(1) { width: 8%; }
        th:nth-child(2) { width: 15%; }
        th:nth-child(3) { width: 12%; }
        th:nth-child(4) { width: 15%; }
        th:nth-child(5) { width: 50%; }
        td {
            padding: 18px 20px;
            border-bottom: 1px solid rgba(148, 163, 184, 0.08);
            color: #e2e8f0;
            font-size: 0.95em;
            vertical-align: middle;
            text-align: center;
        }
        td:nth-child(5) {
            text-align: left;
            word-break: break-word;
        }
        tbody tr {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }
        tbody tr::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            transform: scaleY(0);
            transition: transform 0.3s ease;
        }
        tbody tr:hover::before {
            transform: scaleY(1);
        }
        tbody tr:hover {
            background: rgba(239, 68, 68, 0.08);
            transform: translateX(4px);
        }
        tbody tr:hover td {
            color: #f1f5f9;
        }
        .error-char {
            display: inline-block;
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.25));
            color: #fca5a5;
            padding: 8px 16px;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-weight: 800;
            border: 1.5px solid rgba(239, 68, 68, 0.5);
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
            transition: all 0.3s ease;
        }
        .error-char:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
        }
        .footer {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 30px;
            text-align: center;
            color: #94a3b8;
            font-size: 0.95em;
            border-radius: 24px;
            margin-top: 40px;
            border: 1px solid rgba(148, 163, 184, 0.2);
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .footer p {
            margin: 5px 0;
            font-weight: 500;
        }
        .footer p:first-child {
            font-weight: 700;
            background: linear-gradient(135deg, #fca5a5, #ef4444);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 1.05em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Errores Lexicos</h1>
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
                <colgroup>
                    <col style="width:8%">
                    <col style="width:15%">
                    <col style="width:12%">
                    <col style="width:15%">
                    <col style="width:50%">
                </colgroup>
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
                        <td><span class="error-char">${this.escapeHtml(
                          error.char
                        )}</span></td>
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
            <p>Generado el ${new Date().toLocaleString("es-GT")}</p>
        </div>
    </div>
</body>
</html>
        `;

    return html;
  }

  // Genera reporte HTML de errores sintacticos
  static generateSyntaxErrorReport(errors) {
    const hasErrors = errors && errors.length > 0;
    const headerTitle = hasErrors ? "Errores Sintacticos" : "Analisis Sintactico Exitoso";
    const headerSubtitle = hasErrors 
      ? "Se encontraron errores de estructura en el codigo" 
      : "No se encontraron errores sintacticos en el codigo";
    const headerGradient = hasErrors 
      ? "linear-gradient(135deg, #f59e0b, #d97706)" 
      : "linear-gradient(135deg, #10b981, #059669)";
    const statBorderColor = hasErrors 
      ? "rgba(245, 158, 11, 0.2)" 
      : "rgba(16, 185, 129, 0.2)";

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
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        .header {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white;
            padding: 40px;
            border-radius: 16px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(148, 163, 184, 0.2);
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            font-weight: 700;
            background: ${headerGradient};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .header p {
            font-size: 1.1em;
            opacity: 0.8;
            color: #94a3b8;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 24px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 40px;
            border-radius: 24px;
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5),
                        0 5px 20px rgba(245, 158, 11, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            text-align: center;
            border: 1px solid ${statBorderColor};
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.1), transparent);
            transition: left 0.6s;
        }
        .stat-card:hover::before {
            left: 100%;
        }
        .stat-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.7),
                        0 10px 40px rgba(245, 158, 11, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15);
            border-color: rgba(245, 158, 11, 0.5);
        }
        .stat-card h3 {
            background: linear-gradient(135deg, #fbbf24, #f59e0b, #d97706);
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 3.5em;
            margin-bottom: 12px;
            font-weight: 900;
            animation: gradientFlow 3s ease infinite;
            line-height: 1;
        }
        .stat-card p {
            color: #cbd5e1;
            font-size: 1.05em;
            font-weight: 600;
            letter-spacing: 1px;
            text-transform: uppercase;
            opacity: 0.9;
        }
        .content {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 50px;
            border-radius: 24px;
            box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6),
                        0 10px 30px rgba(245, 158, 11, 0.2),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(148, 163, 184, 0.2);
        }
        .content h2 {
            color: white;
            font-size: 2em;
            margin-bottom: 30px;
            font-weight: 800;
            letter-spacing: -0.5px;
            position: relative;
            padding-bottom: 15px;
        }
        .content h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 80px;
            height: 4px;
            background: linear-gradient(90deg, #f59e0b, #d97706);
            border-radius: 2px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: rgba(15, 23, 42, 0.6);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.3);
            table-layout: fixed;
        }
        th {
            background: linear-gradient(135deg, #f59e0b, #d97706);
            color: white;
            padding: 18px 20px;
            text-align: center;
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.8em;
            letter-spacing: 1.5px;
            position: sticky;
            top: 0;
            z-index: 10;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        th:nth-child(1) { width: 8%; }
        th:nth-child(2) { width: 12%; }
        th:nth-child(3) { width: 15%; }
        th:nth-child(4) { width: 65%; }
        td {
            padding: 18px 20px;
            border-bottom: 1px solid rgba(148, 163, 184, 0.08);
            color: #e2e8f0;
            font-size: 0.95em;
            vertical-align: middle;
            text-align: center;
        }
        td:nth-child(4) {
            text-align: left;
        }
        tbody tr {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }
        tbody tr::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: linear-gradient(135deg, #f59e0b, #d97706);
            transform: scaleY(0);
            transition: transform 0.3s ease;
        }
        tbody tr:hover::before {
            transform: scaleY(1);
        }
        tbody tr:hover {
            background: rgba(245, 158, 11, 0.08);
            transform: translateX(4px);
        }
        tbody tr:hover td {
            color: #f1f5f9;
        }
        .error-msg {
            color: #fbbf24;
            font-weight: 600;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        .footer {
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 30px;
            text-align: center;
            color: #94a3b8;
            font-size: 0.95em;
            border-radius: 24px;
            margin-top: 40px;
            border: 1px solid rgba(148, 163, 184, 0.2);
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.5),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        .footer p {
            margin: 5px 0;
            font-weight: 500;
        }
        .footer p:first-child {
            font-weight: 700;
            background: linear-gradient(135deg, #fbbf24, #f59e0b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-size: 1.05em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${headerTitle}</h1>
            <p>${headerSubtitle}</p>
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
                <colgroup>
                    <col style="width:8%">
                    <col style="width:12%">
                    <col style="width:15%">
                    <col style="width:65%">
                </colgroup>
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

    if (hasErrors) {
      errors.forEach((error, index) => {
        html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${error.line}</td>
                        <td>${error.column}</td>
                        <td class="error-msg">${this.escapeHtml(
                          error.message || error.description || "Error sintáctico"
                        )}</td>
                    </tr>
            `;
      });
    } else {
      html += `
                    <tr>
                        <td colspan="4" style="text-align: center; padding: 40px; color: #10b981; font-weight: 600;">
                            No se encontraron errores sintacticos en el codigo analizado
                        </td>
                    </tr>
            `;
    }

    html += `
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>JavaBridge - Traductor Java a Python | Proyecto 2 LFP</p>
            <p>Generado el ${new Date().toLocaleString("es-GT")}</p>
        </div>
    </div>
</body>
</html>
        `;

    return html;
  }

  // Determina la clase CSS segun el tipo de token
  static getTokenClass(type) {
    const keywords = [
      "KEYWORD",
      "PUBLIC",
      "CLASS",
      "STATIC",
      "VOID",
      "MAIN",
      "STRING",
      "ARGS",
      "INT",
      "DOUBLE",
      "CHAR",
      "BOOLEAN",
      "TRUE",
      "FALSE",
      "IF",
      "ELSE",
      "FOR",
      "WHILE",
      "SYSTEM",
      "OUT",
      "PRINTLN",
    ];
    const numbers = ["INTEGER", "DECIMAL", "NUMERO_ENTERO", "NUMERO_DECIMAL"];
    const strings = ["STRING", "CHAR", "CADENA", "CARACTER"];

    if (type === "COMMENT") return "type-comment";
    if (keywords.includes(type)) return "type-keyword";
    if (type === "IDENTIFIER" || type === "IDENTIFICADOR") return "type-identifier";
    if (numbers.includes(type)) return "type-number";
    if (strings.includes(type)) return "type-string";
    return "type-symbol";
  }

  // Escapa caracteres HTML
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
