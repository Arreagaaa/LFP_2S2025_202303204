const fs = require("fs");
const path = require("path");

/**
 * Generador de reportes HTML para TourneyJS
 * Crea tablas y reportes según las especificaciones del proyecto
 */
class HtmlReporter {
  constructor() {
    this.outputDir = path.join(__dirname, "..", "output");
    this.ensureOutputDirectory();
  }

  /**
   * Asegura que existe el directorio de salida
   */
  ensureOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Genera el CSS base para todos los reportes
   */
  getBaseCSS() {
    return `
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 2rem;
                color: #333;
                line-height: 1.6;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }

            .header {
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                color: white;
                padding: 3rem 2rem;
                text-align: center;
                position: relative;
            }

            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
                opacity: 0.3;
            }

            .header > * {
                position: relative;
                z-index: 1;
            }

            h1 {
                font-size: 2.5rem;
                font-weight: 700;
                margin-bottom: 0.5rem;
                letter-spacing: -0.02em;
            }

            .subtitle {
                font-size: 1.1rem;
                opacity: 0.9;
                font-weight: 400;
            }

            .content {
                padding: 3rem 2rem;
            }

            h2 {
                color: #1e40af;
                font-size: 1.75rem;
                margin-bottom: 1.5rem;
                padding-bottom: 0.5rem;
                border-bottom: 3px solid #e2e8f0;
            }

            .info-panel {
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                border-left: 4px solid #3b82f6;
            }

            .success-panel {
                background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                border: 1px solid #bbf7d0;
                border-radius: 12px;
                padding: 1.5rem;
                margin-bottom: 2rem;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                border-left: 4px solid #10b981;
                color: #064e3b;
            }

            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .info-item {
                background: white;
                padding: 1.5rem;
                border-radius: 8px;
                border-left: 4px solid #3b82f6;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }

            .info-item strong {
                color: #1e40af;
                font-weight: 600;
                display: block;
                margin-bottom: 0.5rem;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                margin-bottom: 2rem;
            }

            thead {
                background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                color: white;
            }

            th {
                padding: 1rem 1.5rem;
                text-align: left;
                font-weight: 600;
                font-size: 0.9rem;
                letter-spacing: 0.05em;
                text-transform: uppercase;
            }

            td {
                padding: 1rem 1.5rem;
                border-bottom: 1px solid #f1f5f9;
                vertical-align: top;
            }

            tbody tr {
                transition: background-color 0.2s ease;
            }

            tbody tr:hover {
                background-color: #f8fafc;
            }

            tbody tr:last-child td {
                border-bottom: none;
            }

            .error-row {
                background-color: #fef2f2;
                border-left: 4px solid #ef4444;
            }

            .error-row:hover {
                background-color: #fee2e2;
            }

            .type-badge {
                display: inline-block;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.75rem;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }

            .type-palabra-reservada {
                background: #dbeafe;
                color: #1d4ed8;
            }

            .type-identificador {
                background: #d1fae5;
                color: #059669;
            }

            .type-numero {
                background: #fef3c7;
                color: #d97706;
            }

            .type-simbolo {
                background: #f3e8ff;
                color: #7c3aed;
            }

            .type-cadena {
                background: #fce7f3;
                color: #be185d;
            }

            .tournament-bracket {
                background: white;
                border-radius: 12px;
                padding: 2rem;
                margin: 1rem 0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }

            .bracket-round {
                margin-bottom: 2rem;
            }

            .bracket-round h3 {
                color: #1e40af;
                font-size: 1.25rem;
                margin-bottom: 1rem;
                padding-bottom: 0.5rem;
                border-bottom: 2px solid #e2e8f0;
            }

            .bracket-match {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 0.5rem;
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .bracket-match:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
            }

            .match-teams {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .team {
                font-weight: 600;
                color: #1e40af;
            }

            .score {
                background: #1e40af;
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-weight: 600;
                font-size: 0.9rem;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-bottom: 2rem;
            }

            .stat-card {
                background: white;
                border-radius: 12px;
                padding: 2rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                border-top: 4px solid #3b82f6;
            }

            .stat-card h3 {
                color: #1e40af;
                font-size: 1.25rem;
                margin-bottom: 1rem;
            }

            .no-data {
                text-align: center;
                padding: 3rem 2rem;
                color: #64748b;
                font-style: italic;
            }

            .footer {
                background: #f8fafc;
                padding: 2rem;
                text-align: center;
                border-top: 1px solid #e2e8f0;
                color: #64748b;
                font-size: 0.9rem;
            }

            .timestamp {
                color: #94a3b8;
                font-size: 0.9em;
                text-align: center;
                margin-top: 20px;
                font-style: italic;
            }

            @media (max-width: 768px) {
                body {
                    padding: 1rem;
                }

                .header {
                    padding: 2rem 1rem;
                }

                h1 {
                    font-size: 2rem;
                }

                .content {
                    padding: 2rem 1rem;
                }

                .info-grid {
                    grid-template-columns: 1fr;
                }

                table {
                    font-size: 0.9rem;
                }

                th, td {
                    padding: 0.75rem 1rem;
                }

                .match-teams {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .stats-grid {
                    grid-template-columns: 1fr;
                }
            }

            /* Animaciones sutiles */
            .container {
                animation: fadeInUp 0.6s ease-out;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Efectos de scroll */
            html {
                scroll-behavior: smooth;
            }

            /* Mejoras de accesibilidad */
            :focus {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
            }
        </style>
        `;
  }

  /**
   * Genera reporte de errores léxicos en formato HTML
   */
  generarTablaErrores(errores, nombreArchivo = "errores_lexicos.html") {
    const css = this.getBaseCSS();
    const timestamp = new Date().toLocaleString();

    let contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TourneyJS - Reporte de Errores Léxicos</title>
    ${css}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Errores Léxicos</h1>
            <div class="subtitle">Análisis TourneyJS - Reporte de Errores</div>
        </div>
        
        <div class="content">
            <div class="info-panel">
                <strong>Total de errores encontrados:</strong> ${
                  errores.length
                }<br>
                <strong>Generado:</strong> ${timestamp}
            </div>

            ${
              errores.length === 0
                ? `
            <div class="success-panel">
                <strong>Excelente!</strong> No se encontraron errores léxicos en el archivo analizado.
            </div>
            `
                : `
            <h2>Detalle de Errores Encontrados</h2>
            <table>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Lexema</th>
                        <th>Tipo de Error</th>
                        <th>Descripción</th>
                        <th>Línea</th>
                        <th>Columna</th>
                    </tr>
                </thead>
                <tbody>
                    ${errores
                      .map(
                        (error, index) => `
                    <tr class="error-row">
                        <td>${index + 1}</td>
                        <td><code>${this.escapeHtml(
                          error.lexema || error.valor || "N/A"
                        )}</code></td>
                        <td>${error.tipo || "Error léxico"}</td>
                        <td>${this.escapeHtml(
                          error.mensaje ||
                            error.descripcion ||
                            "Error no especificado"
                        )}</td>
                        <td>${error.linea}</td>
                        <td>${error.columna}</td>
                    </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
            `
            }
        </div>

        <div class="footer">
            <div class="timestamp">
                Reporte generado por TourneyJS - ${timestamp}
            </div>
        </div>
    </div>
</body>
</html>
        `;

    const rutaArchivo = path.join(this.outputDir, nombreArchivo);
    fs.writeFileSync(rutaArchivo, contenidoHTML, "utf8");
    return rutaArchivo;
  }

  /**
   * Genera reporte de tokens extraídos en formato HTML
   */
  generarTablaTokens(tokens, nombreArchivo = "tokens_extraidos.html") {
    const css = this.getBaseCSS();
    const timestamp = new Date().toLocaleString();

    // Calcular estadísticas de tokens
    const tiposTokens = {};
    tokens.forEach((token) => {
      tiposTokens[token.tipo] = (tiposTokens[token.tipo] || 0) + 1;
    });

    let contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TourneyJS - Tokens Extraídos</title>
    ${css}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Tokens Extraídos</h1>
            <div class="subtitle">Análisis TourneyJS - Tokens del Lexer</div>
        </div>
        
        <div class="content">
            <div class="success-panel">
                <strong>Análisis léxico exitoso</strong><br>
                <strong>Total de tokens extraídos:</strong> ${tokens.length}<br>
                <strong>Generado:</strong> ${timestamp}
            </div>

            <h2>Estadísticas por Tipo de Token</h2>
            <table>
                <thead>
                    <tr>
                        <th>Tipo de Token</th>
                        <th>Cantidad</th>
                        <th>Porcentaje</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(tiposTokens)
                      .map(
                        ([tipo, cantidad]) => `
                    <tr>
                        <td><strong>${tipo}</strong></td>
                        <td>${cantidad}</td>
                        <td>${((cantidad / tokens.length) * 100).toFixed(
                          1
                        )}%</td>
                    </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>

            <h2>Detalle de Tokens Encontrados</h2>
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
                    ${tokens
                      .map(
                        (token, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td><code>${this.escapeHtml(
                          token.valor.length > 50
                            ? token.valor.substring(0, 50) + "..."
                            : token.valor
                        )}</code></td>
                        <td><span class="type-badge type-${token.tipo
                          .toLowerCase()
                          .replace(/\s+/g, "-")}">${token.tipo}</span></td>
                        <td>${token.linea}</td>
                        <td>${token.columna}</td>
                    </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        </div>

        <div class="footer">
            <div class="timestamp">
                Reporte generado por TourneyJS - ${timestamp}
            </div>
        </div>
    </div>
</body>
</html>
        `;

    const rutaArchivo = path.join(this.outputDir, nombreArchivo);
    fs.writeFileSync(rutaArchivo, contenidoHTML, "utf8");
    return rutaArchivo;
  }

  /**
   * Escapa caracteres HTML para evitar problemas de renderizado
   */
  escapeHtml(texto) {
    if (!texto) return "";
    return texto
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Obtiene la ruta del directorio de salida
   */
  getOutputDirectory() {
    return this.outputDir;
  }

  /**
   * Genera reporte de bracket de eliminación
   */
  generarReporteBracket(
    arbolSintactico,
    nombreArchivo = "bracket_eliminacion.html"
  ) {
    const css = this.getBaseCSS();
    const timestamp = new Date().toLocaleString();

    // Extraer información del bracket desde el AST
    const infoTorneo = this.extraerInformacionTorneo(arbolSintactico);
    const partidos = this.extraerPartidos(arbolSintactico);

    let contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TourneyJS - Bracket de Eliminación</title>
    ${css}
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Bracket de Eliminación</h1>
            <div class="subtitle">Análisis TourneyJS - Torneo de Eliminación</div>
        </div>
        
        <div class="content">
            <div class="info-panel">
                <strong>Torneo:</strong> ${
                  infoTorneo.nombre || "Torneo de Eliminación"
                }<br>
                <strong>Equipos participantes:</strong> ${
                  infoTorneo.equipos || "N/A"
                }<br>
                <strong>Generado:</strong> ${timestamp}
            </div>

            <h2>Avance del Torneo</h2>
            <table>
                <thead>
                    <tr>
                        <th>Fase</th>
                        <th>Partido</th>
                        <th>Resultado</th>
                        <th>Ganador</th>
                    </tr>
                </thead>
                <tbody>
                    ${partidos
                      .map(
                        (partido) => `
                    <tr>
                        <td><strong>${this.formatearFase(
                          partido.fase
                        )}</strong></td>
                        <td>${partido.equipo1} vs ${partido.equipo2}</td>
                        <td><span class="score">${partido.resultado}</span></td>
                        <td class="team ${
                          partido.ganador ? "text-success" : ""
                        }">${partido.ganador || "Pendiente"}</td>
                    </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>

            <h2>Visualización del Bracket</h2>
            ${this.generarVisualizacionBracket(partidos)}
        </div>

        <div class="footer">
            <div class="timestamp">
                Reporte generado por TourneyJS - ${timestamp}
            </div>
        </div>
    </div>
</body>
</html>
        `;

    const rutaArchivo = path.join(this.outputDir, nombreArchivo);
    fs.writeFileSync(rutaArchivo, contenidoHTML, "utf8");
    return rutaArchivo;
  }

  /**
   * Genera reporte de estadísticas por equipo
   */
  generarReporteEstadisticasEquipos(
    arbolSintactico,
    nombreArchivo = "estadisticas_equipos.html"
  ) {
    const css = this.getBaseCSS();
    const timestamp = new Date().toLocaleString();

    const infoTorneo = this.extraerInformacionTorneo(arbolSintactico);
    const equipos = this.calcularEstadisticasEquipos(arbolSintactico);

    let contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TourneyJS - Estadísticas por Equipo</title>
    ${css}
    <style>
        .stats-header {
            background: linear-gradient(135deg, #ff7b7b 0%, #667eea 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .stat-card {
            background-color: #f8f9fa;
            border-left: 4px solid #28a745;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
        }
        .positive { color: #28a745; font-weight: bold; }
        .negative { color: #dc3545; font-weight: bold; }
        .neutral { color: #6c757d; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Estadísticas por Equipo - TourneyJS</h1>
        
        <div class="stats-header">
            <h2 style="margin-top: 0;">${
              infoTorneo.nombre || "Torneo de Eliminación"
            }</h2>
            <p>Análisis detallado del desempeño de cada equipo</p>
            <p><strong>Generado:</strong> ${timestamp}</p>
        </div>

        <h2>Rendimiento por Equipo</h2>
        <table>
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
                ${equipos
                  .map(
                    (equipo) => `
                <tr>
                    <td><strong>${equipo.nombre}</strong></td>
                    <td>${equipo.partidosJugados}</td>
                    <td><span class="positive">${equipo.ganados}</span></td>
                    <td><span class="negative">${equipo.perdidos}</span></td>
                    <td>${equipo.golesFavor}</td>
                    <td>${equipo.golesContra}</td>
                    <td class="${
                      equipo.diferencia > 0
                        ? "positive"
                        : equipo.diferencia < 0
                        ? "negative"
                        : "neutral"
                    }">
                        ${equipo.diferencia > 0 ? "+" : ""}${equipo.diferencia}
                    </td>
                    <td><strong>${equipo.faseAlcanzada}</strong></td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>

        <div class="timestamp">
            Reporte generado por TourneyJS - ${timestamp}
        </div>
    </div>
</body>
</html>
        `;

    const rutaArchivo = path.join(this.outputDir, nombreArchivo);
    fs.writeFileSync(rutaArchivo, contenidoHTML, "utf8");
    return rutaArchivo;
  }

  /**
   * Genera reporte de goleadores
   */
  generarReporteGoleadores(
    arbolSintactico,
    nombreArchivo = "reporte_goleadores.html"
  ) {
    const css = this.getBaseCSS();
    const timestamp = new Date().toLocaleString();

    const infoTorneo = this.extraerInformacionTorneo(arbolSintactico);
    const goleadores = this.extraerGoleadores(arbolSintactico);

    let contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TourneyJS - Ranking de Goleadores</title>
    ${css}
    <style>
        .scorers-header {
            background: linear-gradient(135deg, #ff9a56 0%, #ffad56 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .top-scorer {
            background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
            color: #333;
        }
        .goal-count {
            background-color: #ff6b6b;
            color: white;
            padding: 5px 10px;
            border-radius: 50%;
            font-weight: bold;
            display: inline-block;
            min-width: 30px;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Ranking de Goleadores - TourneyJS</h1>
        
        <div class="scorers-header">
            <h2 style="margin-top: 0;">${
              infoTorneo.nombre || "Torneo de Eliminación"
            }</h2>
            <p>Los jugadores que más goles han anotado en el torneo</p>
            <p><strong>Generado:</strong> ${timestamp}</p>
        </div>

        <h2>Tabla de Goleadores</h2>
        <table>
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
                  .map(
                    (goleador, index) => `
                <tr class="${index === 0 ? "top-scorer" : ""}">
                    <td><strong>${index + 1}</strong></td>
                    <td><strong>${goleador.jugador}</strong></td>
                    <td>${goleador.equipo}</td>
                    <td><span class="goal-count">${goleador.goles}</span></td>
                    <td>${goleador.minutos.join(", ")}</td>
                </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>

        ${
          goleadores.length === 0
            ? `
        <div class="info-panel">
            <strong>Información:</strong> No se encontraron goleadores registrados en el archivo analizado.
        </div>
        `
            : ""
        }

        <div class="timestamp">
            Reporte generado por TourneyJS - ${timestamp}
        </div>
    </div>
</body>
</html>
        `;

    const rutaArchivo = path.join(this.outputDir, nombreArchivo);
    fs.writeFileSync(rutaArchivo, contenidoHTML, "utf8");
    return rutaArchivo;
  }

  /**
   * Genera reporte de información general del torneo
   */
  generarReporteInformacionGeneral(
    arbolSintactico,
    nombreArchivo = "informacion_general.html"
  ) {
    const css = this.getBaseCSS();
    const timestamp = new Date().toLocaleString();

    const estadisticas = this.calcularEstadisticasGenerales(arbolSintactico);

    let contenidoHTML = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TourneyJS - Información General del Torneo</title>
    ${css}
    <style>
        .general-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
        }
        .stat-value {
            background-color: #e3f2fd;
            padding: 5px 10px;
            border-radius: 5px;
            font-weight: bold;
            color: #1976d2;
        }
        .highlight {
            background-color: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Información General del Torneo - TourneyJS</h1>
        
        <div class="general-header">
            <h2 style="margin-top: 0;">${estadisticas.nombreTorneo}</h2>
            <p>Resumen completo con datos estadísticos del torneo</p>
            <p><strong>Generado:</strong> ${timestamp}</p>
        </div>

        <h2>Estadísticas del Torneo</h2>
        <table>
            <thead>
                <tr>
                    <th>Estadística</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Nombre del Torneo</strong></td>
                    <td><span class="stat-value">${
                      estadisticas.nombreTorneo
                    }</span></td>
                </tr>
                <tr>
                    <td><strong>Equipos Participantes</strong></td>
                    <td><span class="stat-value">${
                      estadisticas.equiposParticipantes
                    }</span></td>
                </tr>
                <tr>
                    <td><strong>Total de Jugadores</strong></td>
                    <td><span class="stat-value">${
                      estadisticas.totalJugadores
                    }</span></td>
                </tr>
                <tr>
                    <td><strong>Total de Partidos Programados</strong></td>
                    <td><span class="stat-value">${
                      estadisticas.partidosProgramados
                    }</span></td>
                </tr>
                <tr>
                    <td><strong>Partidos Completados</strong></td>
                    <td><span class="stat-value">${
                      estadisticas.partidosCompletados
                    }</span></td>
                </tr>
                <tr>
                    <td><strong>Total de Goles</strong></td>
                    <td><span class="stat-value">${
                      estadisticas.totalGoles
                    }</span></td>
                </tr>
                <tr>
                    <td><strong>Promedio de Goles por Partido</strong></td>
                    <td><span class="stat-value">${
                      estadisticas.promedioGoles
                    }</span></td>
                </tr>
                <tr>
                    <td><strong>Edad Promedio de Jugadores</strong></td>
                    <td><span class="stat-value">${
                      estadisticas.edadPromedio
                    } años</span></td>
                </tr>
                <tr>
                    <td><strong>Fase Actual</strong></td>
                    <td><span class="stat-value">${
                      estadisticas.faseActual
                    }</span></td>
                </tr>
            </tbody>
        </table>

        <div class="highlight">
            <h3>Datos Destacados</h3>
            <ul>
                <li><strong>Eficiencia ofensiva:</strong> ${
                  estadisticas.promedioGoles
                } goles por partido</li>
                <li><strong>Participación:</strong> ${
                  estadisticas.totalJugadores
                } jugadores en ${estadisticas.equiposParticipantes} equipos</li>
                <li><strong>Progreso:</strong> ${(
                  (estadisticas.partidosCompletados /
                    estadisticas.partidosProgramados) *
                  100
                ).toFixed(1)}% del torneo completado</li>
            </ul>
        </div>

        <div class="timestamp">
            Reporte generado por TourneyJS - ${timestamp}
        </div>
    </div>
</body>
</html>
        `;

    const rutaArchivo = path.join(this.outputDir, nombreArchivo);
    fs.writeFileSync(rutaArchivo, contenidoHTML, "utf8");
    return rutaArchivo;
  }

  // ===== MÉTODOS AUXILIARES PARA PROCESAR EL AST =====

  extraerInformacionTorneo(ast) {
    if (!ast || !ast.hijos) return { nombre: "N/A", equipos: 0 };

    let infoTorneo = { nombre: "N/A", equipos: 0 };

    const buscarTorneo = (nodo) => {
      if (nodo.tipo === "TORNEO") {
        // Buscar nombre y equipos en los hijos
        if (nodo.hijos) {
          nodo.hijos.forEach((hijo) => {
            if (
              hijo.tipo === "ATRIBUTO" &&
              hijo.valor === "nombre" &&
              hijo.hijos &&
              hijo.hijos[0]
            ) {
              infoTorneo.nombre = hijo.hijos[0].valor.replace(/"/g, "");
            }
            if (
              hijo.tipo === "ATRIBUTO" &&
              hijo.valor === "equipos" &&
              hijo.hijos &&
              hijo.hijos[0]
            ) {
              infoTorneo.equipos = parseInt(hijo.hijos[0].valor) || 0;
            }
          });
        }
      }
      if (nodo.hijos) {
        nodo.hijos.forEach(buscarTorneo);
      }
    };

    buscarTorneo(ast);
    return infoTorneo;
  }

  extraerPartidos(ast) {
    if (!ast) return [];

    let partidos = [];

    const buscarPartidos = (nodo, faseActual = "N/A") => {
      if (nodo.tipo === "FASE" && nodo.valor) {
        faseActual = nodo.valor;
      }

      if (nodo.tipo === "PARTIDO") {
        let partido = {
          fase: faseActual,
          equipo1: "N/A",
          equipo2: "N/A",
          resultado: "N/A",
          ganador: null,
        };

        // Extraer equipos del valor del partido que tiene formato "equipo1 vs equipo2"
        if (nodo.valor && nodo.valor.includes(" vs ")) {
          const equipos = nodo.valor.split(" vs ");
          if (equipos.length === 2) {
            partido.equipo1 = equipos[0].replace(/"/g, "").trim();
            partido.equipo2 = equipos[1].replace(/"/g, "").trim();
          }
        }

        // Buscar resultado en los hijos
        if (nodo.hijos) {
          const buscarEnHijos = (hijo) => {
            if (hijo.tipo === "LISTA" && hijo.hijos) {
              hijo.hijos.forEach(buscarEnHijos);
            } else if (
              hijo.tipo === "ATRIBUTO" &&
              hijo.valor === "resultado" &&
              hijo.hijos &&
              hijo.hijos[0]
            ) {
              partido.resultado = hijo.hijos[0].valor.replace(/"/g, "");
              partido.ganador = this.determinarGanador(
                partido.equipo1,
                partido.equipo2,
                partido.resultado
              );
            }
            if (hijo.hijos) {
              hijo.hijos.forEach(buscarEnHijos);
            }
          };
          nodo.hijos.forEach(buscarEnHijos);
        }

        partidos.push(partido);
      }

      if (nodo.hijos) {
        nodo.hijos.forEach((hijo) => buscarPartidos(hijo, faseActual));
      }
    };

    buscarPartidos(ast);
    return partidos;
  }

  extraerGoleadores(ast) {
    if (!ast) return [];

    let goleadores = [];
    let equiposPartidos = new Map(); // Para asociar goleadores con equipos basado en partidos

    const buscarGoleadores = (nodo) => {
      // Extraer información de partidos para saber qué equipos jugaron
      if (nodo.tipo === "PARTIDO" && nodo.valor) {
        let equiposEnPartido = [];
        if (nodo.valor.includes(" vs ")) {
          equiposEnPartido = nodo.valor
            .split(" vs ")
            .map((e) => e.replace(/"/g, "").trim());
        }

        // Buscar goleadores en este partido
        const buscarGoleadoresEnPartido = (partidoNodo) => {
          if (partidoNodo.tipo === "GOLEADOR") {
            let goleador = {
              jugador: "N/A",
              equipo: "N/A",
              goles: 1,
              minutos: [],
            };

            // Extraer nombre del goleador
            if (partidoNodo.valor) {
              goleador.jugador = partidoNodo.valor.replace(/"/g, "");
            }

            // Buscar minuto en los hijos
            if (partidoNodo.hijos) {
              const buscarMinuto = (hijo) => {
                if (
                  hijo.tipo === "ATRIBUTO" &&
                  hijo.valor === "minuto" &&
                  hijo.hijos &&
                  hijo.hijos[0]
                ) {
                  goleador.minutos.push(hijo.hijos[0].valor + "'");
                } else if (hijo.tipo === "LISTA" && hijo.hijos) {
                  hijo.hijos.forEach(buscarMinuto);
                }
                if (hijo.hijos) {
                  hijo.hijos.forEach(buscarMinuto);
                }
              };
              partidoNodo.hijos.forEach(buscarMinuto);
            }

            // Determinar equipo basado en los jugadores registrados en equipos
            goleador.equipo =
              this.determinarEquipoDelGoleador(goleador.jugador, ast) ||
              "Desconocido";

            // Buscar si ya existe este goleador
            const existente = goleadores.find(
              (g) => g.jugador === goleador.jugador
            );
            if (existente) {
              existente.goles++;
              existente.minutos.push(...goleador.minutos);
            } else {
              goleadores.push(goleador);
            }
          }

          if (partidoNodo.hijos) {
            partidoNodo.hijos.forEach(buscarGoleadoresEnPartido);
          }
        };

        buscarGoleadoresEnPartido(nodo);
      }

      if (nodo.hijos) {
        nodo.hijos.forEach(buscarGoleadores);
      }
    };

    buscarGoleadores(ast);

    // Ordenar por número de goles (descendente)
    return goleadores.sort((a, b) => b.goles - a.goles);
  }

  calcularEstadisticasEquipos(ast) {
    const partidos = this.extraerPartidos(ast);
    const equiposInfo = new Map();

    // Obtener todos los equipos del AST primero
    const todosLosEquipos = this.obtenerTodosLosEquipos(ast);
    todosLosEquipos.forEach((equipo) => {
      equiposInfo.set(equipo, {
        nombre: equipo,
        partidosJugados: 0,
        ganados: 0,
        perdidos: 0,
        golesFavor: 0,
        golesContra: 0,
        diferencia: 0,
        faseAlcanzada: "No participó",
      });
    });

    // Inicializar estadísticas para equipos que jugaron partidos
    partidos.forEach((partido) => {
      [partido.equipo1, partido.equipo2].forEach((equipo) => {
        if (!equiposInfo.has(equipo)) {
          equiposInfo.set(equipo, {
            nombre: equipo,
            partidosJugados: 0,
            ganados: 0,
            perdidos: 0,
            golesFavor: 0,
            golesContra: 0,
            diferencia: 0,
            faseAlcanzada: "Eliminado",
          });
        }
      });
    });

    // Calcular estadísticas
    partidos.forEach((partido) => {
      if (partido.resultado !== "N/A") {
        const stats1 = equiposInfo.get(partido.equipo1);
        const stats2 = equiposInfo.get(partido.equipo2);

        stats1.partidosJugados++;
        stats2.partidosJugados++;

        // Parsear resultado
        const resultado = partido.resultado.split("-");
        if (resultado.length === 2) {
          const goles1 = parseInt(resultado[0]) || 0;
          const goles2 = parseInt(resultado[1]) || 0;

          stats1.golesFavor += goles1;
          stats1.golesContra += goles2;
          stats2.golesFavor += goles2;
          stats2.golesContra += goles1;

          if (goles1 > goles2) {
            stats1.ganados++;
            stats2.perdidos++;
            stats1.faseAlcanzada = this.determinarFaseAlcanzada(
              partido.fase,
              true
            );
          } else if (goles2 > goles1) {
            stats2.ganados++;
            stats1.perdidos++;
            stats2.faseAlcanzada = this.determinarFaseAlcanzada(
              partido.fase,
              true
            );
          }
        }
      }
    });

    // Calcular diferencia de goles
    equiposInfo.forEach((stats) => {
      stats.diferencia = stats.golesFavor - stats.golesContra;
    });

    return Array.from(equiposInfo.values()).sort(
      (a, b) => b.ganados - a.ganados
    );
  }

  calcularEstadisticasGenerales(ast) {
    const infoTorneo = this.extraerInformacionTorneo(ast);
    const partidos = this.extraerPartidos(ast);

    let estadisticas = {
      nombreTorneo: infoTorneo.nombre,
      equiposParticipantes: infoTorneo.equipos || this.contarEquipos(ast),
      totalJugadores: this.contarJugadores(ast),
      partidosProgramados: partidos.length,
      partidosCompletados: partidos.filter((p) => p.resultado !== "N/A").length,
      totalGoles: 0,
      promedioGoles: 0,
      edadPromedio: this.calcularEdadPromedio(ast),
      faseActual: this.determinarFaseActual(partidos),
    };

    // Calcular total de goles
    partidos.forEach((partido) => {
      if (partido.resultado !== "N/A") {
        const resultado = partido.resultado.split("-");
        if (resultado.length === 2) {
          estadisticas.totalGoles +=
            (parseInt(resultado[0]) || 0) + (parseInt(resultado[1]) || 0);
        }
      }
    });

    // Calcular promedio de goles
    if (estadisticas.partidosCompletados > 0) {
      estadisticas.promedioGoles = (
        estadisticas.totalGoles / estadisticas.partidosCompletados
      ).toFixed(1);
    }

    return estadisticas;
  }

  // ===== MÉTODOS AUXILIARES ADICIONALES =====

  determinarGanador(equipo1, equipo2, resultado) {
    const scores = resultado.split("-");
    if (scores.length === 2) {
      const goles1 = parseInt(scores[0]) || 0;
      const goles2 = parseInt(scores[1]) || 0;
      return goles1 > goles2 ? equipo1 : goles2 > goles1 ? equipo2 : "Empate";
    }
    return null;
  }

  formatearFase(fase) {
    const fases = {
      cuartos: "Cuartos de Final",
      semifinal: "Semifinal",
      final: "Final",
    };
    return fases[fase] || fase;
  }

  determinarFaseAlcanzada(fase, ganador) {
    if (!ganador) return "Eliminado";
    const fasesOrden = {
      cuartos: "Semifinal",
      semifinal: "Final",
      final: "Campeón",
    };
    return fasesOrden[fase] || "Clasificado";
  }

  determinarFaseActual(partidos) {
    const fases = partidos.map((p) => p.fase).filter((f) => f !== "N/A");
    if (fases.includes("final")) return "Final";
    if (fases.includes("semifinal")) return "Semifinal";
    if (fases.includes("cuartos")) return "Cuartos de Final";
    return "Por comenzar";
  }

  contarEquipos(ast) {
    let count = 0;
    const buscarEquipos = (nodo) => {
      if (nodo.tipo === "EQUIPO") count++;
      if (nodo.hijos) nodo.hijos.forEach(buscarEquipos);
    };
    if (ast) buscarEquipos(ast);
    return count;
  }

  contarJugadores(ast) {
    let count = 0;
    const buscarJugadores = (nodo) => {
      if (nodo.tipo === "JUGADOR") count++;
      if (nodo.hijos) nodo.hijos.forEach(buscarJugadores);
    };
    if (ast) buscarJugadores(ast);
    return count;
  }

  calcularEdadPromedio(ast) {
    let totalEdad = 0;
    let countJugadores = 0;

    const buscarEdades = (nodo) => {
      if (nodo.tipo === "JUGADOR" && nodo.hijos) {
        const buscarEdadEnHijos = (hijo) => {
          if (
            hijo.tipo === "ATRIBUTO" &&
            hijo.valor === "edad" &&
            hijo.hijos &&
            hijo.hijos[0]
          ) {
            const edadValor = parseInt(hijo.hijos[0].valor);
            if (!isNaN(edadValor)) {
              totalEdad += edadValor;
              countJugadores++;
            }
          } else if (hijo.tipo === "LISTA" && hijo.hijos) {
            hijo.hijos.forEach(buscarEdadEnHijos);
          }
          if (hijo.hijos) {
            hijo.hijos.forEach(buscarEdadEnHijos);
          }
        };
        nodo.hijos.forEach(buscarEdadEnHijos);
      }
      if (nodo.hijos) nodo.hijos.forEach(buscarEdades);
    };

    if (ast) buscarEdades(ast);
    return countJugadores > 0
      ? (totalEdad / countJugadores).toFixed(2)
      : "0.00";
  }

  determinarEquipoDelGoleador(nombreGoleador, ast) {
    if (!ast || !nombreGoleador) return null;

    let equipoEncontrado = null;

    const buscarJugadorEnEquipos = (nodo) => {
      if (nodo.tipo === "EQUIPO" && nodo.valor) {
        const nombreEquipo = nodo.valor.replace(/"/g, "");

        // Buscar jugadores en este equipo
        const buscarJugadores = (equipoNodo) => {
          if (equipoNodo.tipo === "JUGADOR" && equipoNodo.valor) {
            const nombreJugador = equipoNodo.valor.replace(/"/g, "");
            if (nombreJugador === nombreGoleador) {
              equipoEncontrado = nombreEquipo;
            }
          }
          if (equipoNodo.hijos) {
            equipoNodo.hijos.forEach(buscarJugadores);
          }
        };

        buscarJugadores(nodo);
      }

      if (nodo.hijos && !equipoEncontrado) {
        nodo.hijos.forEach(buscarJugadorEnEquipos);
      }
    };

    buscarJugadorEnEquipos(ast);
    return equipoEncontrado;
  }

  obtenerTodosLosEquipos(ast) {
    if (!ast) return [];

    let equipos = [];

    const buscarEquipos = (nodo) => {
      if (nodo.tipo === "EQUIPO" && nodo.valor) {
        const nombreEquipo = nodo.valor.replace(/"/g, "");
        if (!equipos.includes(nombreEquipo)) {
          equipos.push(nombreEquipo);
        }
      }
      if (nodo.hijos) {
        nodo.hijos.forEach(buscarEquipos);
      }
    };

    buscarEquipos(ast);
    return equipos;
  }

  generarVisualizacionBracket(partidos) {
    let html = '<div class="bracket-visual">';

    const fases = ["cuartos", "semifinal", "final"];
    fases.forEach((fase) => {
      const partidosFase = partidos.filter((p) => p.fase === fase);
      if (partidosFase.length > 0) {
        html += `<div class="phase-title">${this.formatearFase(fase)}</div>`;
        partidosFase.forEach((partido) => {
          const claseGanador = partido.ganador ? "winner" : "";
          html += `
          <div class="match-result ${claseGanador}">
              <div>
                  <span class="team-name">${partido.equipo1}</span> vs 
                  <span class="team-name">${partido.equipo2}</span>
              </div>
              <div>
                  <span class="score">${partido.resultado}</span>
                  ${
                    partido.ganador
                      ? `<br><small>Ganador: <strong>${partido.ganador}</strong></small>`
                      : ""
                  }
              </div>
          </div>`;
        });
      }
    });

    html += "</div>";
    return html;
  }
}

module.exports = HtmlReporter;
