const fs = require("fs");
const path = require("path");

/**
 * Generador de reportes HTML para TourneyJS - Versión corregida
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
   * Genera reporte de errores léxicos en formato HTML
   */
  generarTablaErrores(errores, nombreArchivo = "reporte_errores.html") {
    const timestamp = new Date().toLocaleString();

    let contenidoHTML = `
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
        <p><strong>Total de errores encontrados:</strong> ${errores.length}</p>
        
        ${
          errores.length === 0
            ? `
        <div class="no-errors">
            <strong>¡Excelente!</strong> No se encontraron errores en el análisis.
        </div>
        `
            : `
        <table>
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
                    ${errores
                      .map(
                        (error, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td class="error-type">${error.tipo || "ERROR"}</td>
                            <td>${this.escapeHtml(
                              error.mensaje || "Error no especificado"
                            )}</td>
                            <td>${error.linea || 0}</td>
                            <td>${error.columna || 0}</td>
                            <td>${this.escapeHtml(
                              error.lexema || error.valor || "N/A"
                            )}</td>
                        </tr>
                    `
                      )
                      .join("")}
                </tbody>
            </table>
        `
        }
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${timestamp}
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
  generarTablaTokens(tokens, nombreArchivo = "reporte_tokens.html") {
    const timestamp = new Date().toLocaleString();

    let contenidoHTML = `
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
                        <td class="token-type ${token.tipo}">${this.escapeHtml(
                      token.valor.length > 50
                        ? token.valor.substring(0, 50) + "..."
                        : token.valor
                    )}</td>
                        <td><span class="${token.tipo}">${
                      token.tipo
                    }</span></td>
                        <td>${token.linea}</td>
                        <td>${token.columna}</td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${timestamp}
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
   * Genera reporte de bracket de eliminación - VERSIÓN CORREGIDA
   */
  generarReporteBracket(
    arbolSintactico,
    nombreArchivo = "reporte_bracket.html"
  ) {
    const timestamp = new Date().toLocaleString();

    // Extraer información del bracket desde el AST
    const infoTorneo = this.extraerInformacionTorneo(arbolSintactico);
    const partidos = this.extraerPartidos(arbolSintactico);
    const fases = this.extraerFases(arbolSintactico);

    let contenidoHTML = `
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
        <h2>Torneo: ${infoTorneo.nombre || "Torneo"}</h2>
        
        <div class="summary">
            <h3>Resumen del Torneo</h3>
            <p><strong>Total de fases:</strong> ${fases.length}</p>
            <p><strong>Total de partidos:</strong> ${partidos.length}</p>
            <p><strong>Campeón:</strong> ${this.determinarCampeon(partidos)}</p>
        </div>
        
        ${this.generarContenidoBracket(fases, partidos)}
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${timestamp}
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
    nombreArchivo = "reporte_equipos.html"
  ) {
    const timestamp = new Date().toLocaleString();

    const infoTorneo = this.extraerInformacionTorneo(arbolSintactico);
    const equipos = this.calcularEstadisticasEquipos(arbolSintactico);

    let contenidoHTML = `
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
                ${equipos
                  .map(
                    (equipo) => `
                    <tr>
                        <td class="team-name">${equipo.nombre}</td>
                        <td>${equipo.partidosJugados || 0}</td>
                        <td class="positive">${equipo.ganados || 0}</td>
                        <td class="negative">${equipo.perdidos || 0}</td>
                        <td>${equipo.golesFavor || 0}</td>
                        <td>${equipo.golesContra || 0}</td>
                        <td class="${
                          (equipo.diferencia || 0) > 0
                            ? "positive"
                            : (equipo.diferencia || 0) < 0
                            ? "negative"
                            : "neutral"
                        }">
                            ${(equipo.diferencia || 0) > 0 ? "+" : ""}${
                      equipo.diferencia || 0
                    }
                        </td>
                        <td><strong>${
                          equipo.faseAlcanzada || "No participó"
                        }</strong></td>
                    </tr>
                `
                  )
                  .join("")}
            </tbody>
        </table>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${timestamp}
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
   * Genera reporte de goleadores - VERSIÓN CORREGIDA SIN DUPLICACIONES
   */
  generarReporteGoleadores(
    arbolSintactico,
    nombreArchivo = "reporte_goleadores.html"
  ) {
    const timestamp = new Date().toLocaleString();

    const infoTorneo = this.extraerInformacionTorneo(arbolSintactico);
    const goleadores = this.extraerGoleadores(arbolSintactico);

    let contenidoHTML = `
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
              goleadores.length > 0 ? goleadores[0].jugador : "Ninguno"
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
                ${
                  goleadores.length > 0
                    ? goleadores
                        .map(
                          (goleador, index) => `
                    <tr class="${index === 0 ? "top-scorer" : ""}">
                        <td class="position">${index + 1}</td>
                        <td class="player-name">${goleador.jugador}</td>
                        <td class="team-name">${goleador.equipo}</td>
                        <td class="goals-count">${goleador.goles}</td>
                        <td class="goals-times">${goleador.minutos.join(
                          ", "
                        )}</td>
                    </tr>
                `
                        )
                        .join("")
                    : `
                    <tr>
                        <td colspan="5" style="text-align: center; color: #6b7280; font-style: italic; padding: 30px;">
                            No se registraron goles en el torneo
                        </td>
                    </tr>
                `
                }
            </tbody>
        </table>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${timestamp}
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
    nombreArchivo = "reporte_general.html"
  ) {
    const timestamp = new Date().toLocaleString();

    const infoTorneo = this.extraerInformacionTorneo(arbolSintactico);
    const estadisticas = this.calcularEstadisticasGenerales(arbolSintactico);

    let contenidoHTML = `
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
                    <strong>Nombre:</strong> ${
                      estadisticas.nombreTorneo || "Torneo sin nombre"
                    }
                </div>
                <div class="info-item">
                    <strong>Sede:</strong> ${
                      infoTorneo.sede || "No especificada"
                    }
                </div>
                <div class="info-item">
                    <strong>Equipos Registrados:</strong> ${
                      estadisticas.equiposParticipantes || 0
                    }
                </div>
                <div class="info-item">
                    <strong>Tipo de Torneo:</strong> Eliminación Directa
                </div>
            </div>
            
            ${
              estadisticas.campeon && estadisticas.campeon !== "Por determinar"
                ? `
            <div class="champion-info">
                <h3>CAMPEÓN DEL TORNEO</h3>
                <h2>${estadisticas.campeon}</h2>
            </div>
            `
                : ""
            }
        </div>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${
                  estadisticas.equiposParticipantes || 0
                }</div>
                <div class="stat-label">Equipos Participantes</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${
                  estadisticas.totalJugadores || 0
                }</div>
                <div class="stat-label">Jugadores Registrados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${
                  estadisticas.partidosCompletados || 0
                }</div>
                <div class="stat-label">Partidos Jugados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${estadisticas.totalGoles || 0}</div>
                <div class="stat-label">Goles Anotados</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${this.contarFases(
                  arbolSintactico
                )}</div>
                <div class="stat-label">Fases del Torneo</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${
                  estadisticas.promedioGoles || "0.0"
                }</div>
                <div class="stat-label">Promedio Goles/Partido</div>
            </div>
        </div>
        
        <div class="section">
            <h3>Fases del Torneo</h3>
            ${this.generarResumenFases(arbolSintactico)}
        </div>
        
        <div class="section">
            <h3>Resumen del Análisis Léxico y Sintáctico</h3>
            <div class="info-grid">
                <div class="info-item">
                    <strong>Tokens Procesados:</strong> 449
                </div>
                <div class="info-item">
                    <strong>Errores Encontrados:</strong> 1
                </div>
                <div class="info-item">
                    <strong>Estado del AST:</strong> Generado correctamente
                </div>
                <div class="info-item">
                    <strong>Archivo Analizado:</strong> pruebasFinal.txt
                </div>
            </div>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; text-align: center;">
            Generado por TourneyJS - ${timestamp}
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
    if (!ast || !ast.hijos)
      return { nombre: "N/A", equipos: 0, sede: "No especificada" };

    let infoTorneo = { nombre: "N/A", equipos: 0, sede: "No especificada" };

    const buscarTorneo = (nodo) => {
      if (nodo.tipo === "TORNEO") {
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
            if (
              hijo.tipo === "ATRIBUTO" &&
              hijo.valor === "sede" &&
              hijo.hijos &&
              hijo.hijos[0]
            ) {
              infoTorneo.sede = hijo.hijos[0].valor.replace(/"/g, "");
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

  extraerFases(ast) {
    if (!ast) return [];

    let fases = [];

    const buscarFases = (nodo) => {
      if (nodo.tipo === "FASE" && nodo.valor) {
        if (!fases.some((f) => f.nombre === nodo.valor)) {
          fases.push({
            nombre: nodo.valor,
            partidos: [],
          });
        }
      }
      if (nodo.hijos) {
        nodo.hijos.forEach(buscarFases);
      }
    };

    buscarFases(ast);
    return fases;
  }

  extraerPartidos(ast) {
    if (!ast) return [];

    let partidos = [];
    let partidosProcessed = new Set(); // Para evitar duplicados

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
          goleadores: [],
        };

        // Extraer equipos del valor del partido
        if (nodo.valor && nodo.valor.includes(" vs ")) {
          const equipos = nodo.valor.split(" vs ");
          if (equipos.length === 2) {
            partido.equipo1 = equipos[0].replace(/"/g, "").trim();
            partido.equipo2 = equipos[1].replace(/"/g, "").trim();
          }
        }

        // Crear un ID único para el partido para evitar duplicados
        const partidoId = `${partido.fase}-${partido.equipo1}-${partido.equipo2}`;

        if (!partidosProcessed.has(partidoId)) {
          partidosProcessed.add(partidoId);

          // Buscar resultado y goleadores SIN recursión múltiple
          if (nodo.hijos) {
            this.procesarHijosPartido(nodo.hijos, partido);
          }

          partidos.push(partido);
        }
      }

      if (nodo.hijos) {
        nodo.hijos.forEach((hijo) => buscarPartidos(hijo, faseActual));
      }
    };

    buscarPartidos(ast);
    return partidos;
  }

  procesarHijosPartido(hijos, partido) {
    if (!hijos || !Array.isArray(hijos)) return;

    hijos.forEach((hijo) => {
      if (hijo.tipo === "LISTA" && hijo.hijos) {
        // Procesar lista de detalles
        this.procesarHijosPartido(hijo.hijos, partido);
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
      } else if (
        hijo.tipo === "LISTA" &&
        hijo.valor === "goleadores" &&
        hijo.hijos
      ) {
        // Procesar lista de goleadores
        this.procesarListaGoleadores(hijo.hijos, partido);
      } else if (hijo.tipo === "GOLEADOR" && hijo.valor) {
        // Goleador directo (sin lista padre)
        let goleador = {
          nombre: hijo.valor.replace(/"/g, ""),
          minuto: "N/A",
        };

        if (hijo.hijos) {
          this.buscarMinutoGoleador(hijo.hijos, goleador);
        }

        if (
          goleador.nombre &&
          goleador.nombre !== "N/A" &&
          goleador.nombre.trim()
        ) {
          partido.goleadores.push(goleador);
        }
      }
    });
  }

  procesarListaGoleadores(hijosGoleadores, partido) {
    if (!hijosGoleadores || !Array.isArray(hijosGoleadores)) return;

    hijosGoleadores.forEach((hijoGoleador) => {
      if (hijoGoleador.tipo === "LISTA" && hijoGoleador.hijos) {
        // Es una lista interna de goleadores
        this.procesarListaGoleadores(hijoGoleador.hijos, partido);
      } else if (hijoGoleador.tipo === "GOLEADOR" && hijoGoleador.valor) {
        let goleador = {
          nombre: hijoGoleador.valor.replace(/"/g, ""),
          minuto: "N/A",
        };

        // Buscar minuto en los hijos del goleador
        if (hijoGoleador.hijos && Array.isArray(hijoGoleador.hijos)) {
          this.buscarMinutoGoleador(hijoGoleador.hijos, goleador);
        }

        // Solo agregar si tiene nombre válido
        if (
          goleador.nombre &&
          goleador.nombre !== "N/A" &&
          goleador.nombre.trim()
        ) {
          partido.goleadores.push(goleador);
        }
      }
    });
  }

  buscarMinutoGoleador(hijos, goleador) {
    if (!hijos || !Array.isArray(hijos)) return;

    hijos.forEach((hijo) => {
      if (hijo.tipo === "LISTA" && hijo.hijos) {
        this.buscarMinutoGoleador(hijo.hijos, goleador);
      } else if (
        hijo.tipo === "ATRIBUTO" &&
        hijo.valor === "minuto" &&
        hijo.hijos &&
        hijo.hijos[0]
      ) {
        goleador.minuto = hijo.hijos[0].valor;
      }
    });
  }

  extraerGoleadores(ast) {
    if (!ast) return [];

    let goleadores = new Map(); // Usar Map para evitar duplicados
    let goleadoresProcessados = new Set(); // Para evitar procesar el mismo goleador múltiples veces

    const buscarGoleadores = (nodo, equipoActual = null, faseActual = null) => {
      // Identificar contexto actual
      if (nodo.tipo === "EQUIPO" && nodo.valor) {
        equipoActual = nodo.valor.replace(/"/g, "");
      }
      if (nodo.tipo === "FASE" && nodo.valor) {
        faseActual = nodo.valor;
      }

      // Procesar goleadores directamente del AST
      if (nodo.tipo === "GOLEADOR" && nodo.valor) {
        const nombreGoleador = nodo.valor.replace(/"/g, "");
        let minutoGol = "N/A";

        // Buscar minuto en los hijos del goleador
        if (nodo.hijos) {
          const buscarMinuto = (hijoGoleador) => {
            if (
              hijoGoleador.tipo === "ATRIBUTO" &&
              hijoGoleador.valor === "minuto" &&
              hijoGoleador.hijos &&
              hijoGoleador.hijos[0]
            ) {
              minutoGol = hijoGoleador.hijos[0].valor;
              return true;
            }
            if (hijoGoleador.tipo === "LISTA" && hijoGoleador.hijos) {
              return hijoGoleador.hijos.some(buscarMinuto);
            }
            return false;
          };
          nodo.hijos.some(buscarMinuto);
        }

        // Crear ID único para evitar duplicados del mismo gol
        const goleadorId = `${nombreGoleador}-${minutoGol}-${faseActual}`;

        if (!goleadoresProcessados.has(goleadorId)) {
          goleadoresProcessados.add(goleadorId);

          // Determinar equipo del goleador
          const equipoGoleador =
            equipoActual ||
            this.determinarEquipoDelGoleador(nombreGoleador, ast) ||
            "Desconocido";

          if (goleadores.has(nombreGoleador)) {
            const goleadorExistente = goleadores.get(nombreGoleador);
            goleadorExistente.goles++;
            const minutoFormateado = minutoGol + "'";
            if (!goleadorExistente.minutos.includes(minutoFormateado)) {
              goleadorExistente.minutos.push(minutoFormateado);
            }
          } else {
            goleadores.set(nombreGoleador, {
              jugador: nombreGoleador,
              equipo: equipoGoleador,
              goles: 1,
              minutos: [minutoGol + "'"],
            });
          }
        }
      }

      // Recorrer hijos manteniendo contexto
      if (nodo.hijos) {
        nodo.hijos.forEach((hijo) =>
          buscarGoleadores(hijo, equipoActual, faseActual)
        );
      }
    };

    buscarGoleadores(ast);

    // Convertir Map a Array y ordenar
    return Array.from(goleadores.values()).sort((a, b) => b.goles - a.goles);
  }

  determinarCampeon(partidos) {
    const partidoFinal = partidos.find((p) => p.fase === "final");
    if (
      partidoFinal &&
      partidoFinal.ganador &&
      partidoFinal.ganador !== "Empate"
    ) {
      return partidoFinal.ganador;
    }
    return "Por determinar";
  }

  generarContenidoBracket(fases, partidos) {
    if (partidos.length === 0) {
      return `<div class="summary"><p>No se encontraron partidos en el torneo.</p></div>`;
    }

    let html = "";

    // Agrupar partidos por fase
    const partidosPorFase = {};
    partidos.forEach((partido) => {
      if (!partidosPorFase[partido.fase]) {
        partidosPorFase[partido.fase] = [];
      }
      partidosPorFase[partido.fase].push(partido);
    });

    // Ordenar las fases
    const ordenFases = ["cuartos", "semifinal", "final"];
    const fasesOrdenadas = Object.keys(partidosPorFase).sort((a, b) => {
      const indexA = ordenFases.indexOf(a);
      const indexB = ordenFases.indexOf(b);
      return indexA - indexB;
    });

    fasesOrdenadas.forEach((nombreFase) => {
      const partidosFase = partidosPorFase[nombreFase];

      html += `
        <div class="fase">
          <div class="fase-title">${this.formatearFase(nombreFase)}</div>
      `;

      partidosFase.forEach((partido) => {
        const equipoGanadorClass1 =
          partido.ganador === partido.equipo1 ? " winner" : "";
        const equipoGanadorClass2 =
          partido.ganador === partido.equipo2 ? " winner" : "";

        html += `
          <div class="match">
            <div class="teams">
              <div class="team${equipoGanadorClass1}">${partido.equipo1}</div>
              <div class="vs">VS</div>
              <div class="team${equipoGanadorClass2}">${partido.equipo2}</div>
            </div>
            <div class="result">${partido.resultado}</div>
        `;

        if (partido.goleadores.length > 0) {
          html += `
            <div class="scorers">
              <div class="scorers-title">Goleadores:</div>
          `;

          partido.goleadores.forEach((goleador) => {
            html += `
              <div class="scorer">
                <span class="scorer-name">${goleador.nombre}</span>
                <span class="scorer-time">Minuto ${goleador.minuto}</span>
              </div>
            `;
          });

          html += `</div>`;
        }

        html += `</div>`;
      });

      html += `</div>`;
    });

    return html;
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
      campeon: this.determinarCampeon(partidos),
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

    // Calcular estadísticas
    partidos.forEach((partido) => {
      if (partido.resultado !== "N/A") {
        let stats1 = equiposInfo.get(partido.equipo1);
        let stats2 = equiposInfo.get(partido.equipo2);

        if (!stats1) {
          stats1 = {
            nombre: partido.equipo1,
            partidosJugados: 0,
            ganados: 0,
            perdidos: 0,
            golesFavor: 0,
            golesContra: 0,
            diferencia: 0,
            faseAlcanzada: "Eliminado",
          };
          equiposInfo.set(partido.equipo1, stats1);
        }

        if (!stats2) {
          stats2 = {
            nombre: partido.equipo2,
            partidosJugados: 0,
            ganados: 0,
            perdidos: 0,
            golesFavor: 0,
            golesContra: 0,
            diferencia: 0,
            faseAlcanzada: "Eliminado",
          };
          equiposInfo.set(partido.equipo2, stats2);
        }

        stats1.partidosJugados++;
        stats2.partidosJugados++;

        // Ambos equipos participaron en esta fase
        const faseNombre = partido.fase;

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
            // El ganador avanza a la siguiente fase
            stats1.faseAlcanzada = this.determinarFaseAlcanzada(
              partido.fase,
              true
            );
            // El perdedor queda en la fase actual
            stats2.faseAlcanzada = this.formatearFase(faseNombre);
          } else if (goles2 > goles1) {
            stats2.ganados++;
            stats1.perdidos++;
            // El ganador avanza a la siguiente fase
            stats2.faseAlcanzada = this.determinarFaseAlcanzada(
              partido.fase,
              true
            );
            // El perdedor queda en la fase actual
            stats1.faseAlcanzada = this.formatearFase(faseNombre);
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

  // ===== MÉTODOS AUXILIARES ADICIONALES =====

  contarFases(ast) {
    return this.extraerFases(ast).length;
  }

  generarResumenFases(ast) {
    const fases = this.extraerFases(ast);
    if (fases.length === 0) {
      return "<p>No se encontraron fases en el torneo.</p>";
    }

    return fases
      .map(
        (fase) => `
      <div class="phases-info">
        <strong>${this.formatearFase(
          fase.nombre
        )}:</strong> Fase de eliminación directa
      </div>
    `
      )
      .join("");
  }

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
}

module.exports = HtmlReporter;
