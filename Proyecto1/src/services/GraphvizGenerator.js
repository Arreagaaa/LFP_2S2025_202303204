// src/services/GraphvizGenerator.js
// Single clean implementation
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class GraphvizGenerator {
  constructor() {
    this.outputDir = path.join(__dirname, "..", "output");
    if (!fs.existsSync(this.outputDir))
      fs.mkdirSync(this.outputDir, { recursive: true });
  }

  extraerInformacionTorneo(ast) {
    if (!ast || !ast.hijos) return { nombre: "N/A", equipos: 0 };
    let infoTorneo = { nombre: "N/A", equipos: 0 };
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
          });
        }
      }
      if (nodo.hijos) nodo.hijos.forEach(buscarTorneo);
    };
    buscarTorneo(ast);
    return infoTorneo;
  }

  extraerPartidos(ast) {
    if (!ast) return [];
    let partidos = [];
    const buscarPartidos = (nodo, faseActual = "N/A") => {
      if (nodo.tipo === "FASE" && nodo.valor) faseActual = nodo.valor;
      if (nodo.tipo === "PARTIDO") {
        let partido = {
          fase: faseActual,
          equipo1: "N/A",
          equipo2: "N/A",
          resultado: "N/A",
          ganador: null,
        };
        if (nodo.valor && nodo.valor.includes(" vs ")) {
          const equipos = nodo.valor.split(" vs ");
          if (equipos.length >= 2) {
            partido.equipo1 = equipos[0].replace(/"/g, "").trim();
            partido.equipo2 = equipos[1].replace(/"/g, "").trim();
          }
        }
        if (nodo.hijos) {
          const buscarEnDetalles = (detalle) => {
            if (detalle.tipo === "LISTA" && detalle.valor === "detalles") {
              detalle.hijos.forEach((item) => {
                if (
                  item.tipo === "ATRIBUTO" &&
                  item.valor === "resultado" &&
                  item.hijos &&
                  item.hijos[0]
                ) {
                  partido.resultado = item.hijos[0].valor.replace(/"/g, "");
                  partido.ganador = this.determinarGanador(
                    partido.equipo1,
                    partido.equipo2,
                    partido.resultado
                  );
                }
              });
            }
          };
          nodo.hijos.forEach(buscarEnDetalles);
        }
        partidos.push(partido);
      }
      if (nodo.hijos)
        nodo.hijos.forEach((hijo) => buscarPartidos(hijo, faseActual));
    };
    buscarPartidos(ast);
    return partidos;
  }

  extraerEquipos(ast) {
    if (!ast) return [];
    let equipos = [];
    const buscarEquipos = (nodo) => {
      if (nodo.tipo === "EQUIPO" && nodo.valor) {
        const nombreEquipo = nodo.valor.replace(/"/g, "").trim();
        if (nombreEquipo && nombreEquipo !== "N/A") equipos.push(nombreEquipo);
      }
      if (nodo.hijos) nodo.hijos.forEach(buscarEquipos);
    };
    buscarEquipos(ast);
    return [...new Set(equipos)];
  }

  determinarGanador(equipo1, equipo2, resultado) {
    if (!resultado || resultado === "N/A") return null;
    const scores = resultado.split("-");
    if (scores.length === 2) {
      const goles1 = parseInt(scores[0]) || 0;
      const goles2 = parseInt(scores[1]) || 0;
      if (goles1 > goles2) return equipo1;
      if (goles2 > goles1) return equipo2;
      return "Empate";
    }
    return null;
  }

  generarDiagramaTorneo(ast, nombreArchivo = "torneo_bracket.dot") {
    const info = this.extraerInformacionTorneo(ast) || {};
    const partidos = this.extraerPartidos(ast) || [];
    const equipos = this.extraerEquipos(ast) || [];

    const torneo = (info.nombre || "Torneo").replace(/"/g, "");
    const lines = [
      "digraph TorneoBracket {",
      "  rankdir=LR;",
      '  node [shape=box, style="rounded,filled", fillcolor="#f0f8ff"];',
      '  edge [color="#333333"];',
      '  label="' +
        this._escapeDotLabel(torneo + "\\nBracket de Eliminación") +
        '";',
    ];

    equipos.forEach((e, i) => {
      const name = String(e).replace(/"/g, "");
      lines.push(
        "  equipo_" +
          i +
          ' [label="' +
          this._escapeDotLabel(name) +
          '", shape=ellipse, fillcolor="#e8f5e8"];'
      );
    });

    partidos.forEach((p, i) => {
      const color = p.ganador ? "#d4edda" : "#fff3cd";
      const label =
        p.resultado && p.resultado !== "N/A"
          ? p.equipo1 +
            " vs " +
            p.equipo2 +
            "\\n" +
            p.resultado +
            "\\nGanador: " +
            (p.ganador || "N/A")
          : p.equipo1 + " vs " + p.equipo2 + "\\nPendiente";
      lines.push(
        "  partido_" +
          i +
          ' [label="' +
          this._escapeDotLabel(label) +
          '", fillcolor="' +
          color +
          '"];'
      );
    });

    partidos.forEach((p, i) => {
      if (p.equipo1)
        lines.push(
          "  equipo_" +
            (Math.abs(hashString(p.equipo1)) % 32) +
            " -> partido_" +
            i +
            ";"
        );
      if (p.equipo2)
        lines.push(
          "  equipo_" +
            (Math.abs(hashString(p.equipo2)) % 32) +
            " -> partido_" +
            i +
            ";"
        );
    });

    lines.push("}");
    const dot = lines.join("\n");
    const outDot = path.join(this.outputDir, nombreArchivo);
    fs.writeFileSync(outDot, dot, "utf8");

    // Intentar generar PNG
    const pngPath = this._generatePNG(outDot, dot);
    this._writeHtmlViewer(dot, info, pngPath);
    return outDot;
  }

  _generatePNG(dotPath, dotContent) {
    try {
      const pngPath = dotPath.replace(".dot", ".png");
      // Intentar usar dot command para generar PNG
      execSync(`dot -Tpng "${dotPath}" -o "${pngPath}"`, {
        stdio: "ignore",
        timeout: 10000,
      });

      if (fs.existsSync(pngPath)) {
        console.log(`PNG generado exitosamente: ${pngPath}`);
        return pngPath;
      }
    } catch (error) {
      console.log(
        "Graphviz no está disponible en el sistema. Mostrando solo código DOT."
      );
      console.log("Para instalar Graphviz: https://graphviz.org/download/");
    }
    return null;
  }

  _writeHtmlViewer(dotText, info, pngPath = null) {
    const safe = this.escapeHtml(dotText);
    const title = this.escapeHtml(info && info.nombre ? info.nombre : "Torneo");
    const html = [];
    html.push("<!doctype html>");
    html.push('<html lang="es">');
    html.push("<head>");
    html.push('<meta charset="utf-8">');
    html.push(
      '<meta name="viewport" content="width=device-width,initial-scale=1">'
    );
    html.push("<title>Graphviz Viewer</title>");
    html.push(
      "<style>body{font-family:Segoe UI,Roboto,sans-serif;background:#f5f7ff;margin:0;padding:20px}pre{background:#0f1724;color:#e6eef8;padding:12px;border-radius:6px;overflow:auto}.diagram-container{background:white;padding:20px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);margin:20px 0}.diagram-container img{max-width:100%;height:auto;border:1px solid #ddd}.section{margin:20px 0}</style>"
    );
    html.push("</head>");
    html.push("<body>");
    html.push("<h2>Visualizador Graphviz - " + title + "</h2>");

    // Si tenemos PNG, mostrarlo
    if (pngPath && fs.existsSync(pngPath)) {
      const pngFileName = path.basename(pngPath);
      html.push('<div class="diagram-container">');
      html.push("<h3>Diagrama del Torneo</h3>");
      html.push('<img src="' + pngFileName + '" alt="Diagrama del torneo" />');
      html.push("</div>");
    } else {
      html.push('<div class="section">');
      html.push(
        '<p><strong>Nota:</strong> Para ver el diagrama visual, instale Graphviz desde <a href="https://graphviz.org/download/" target="_blank">graphviz.org</a></p>'
      );
      html.push("</div>");
    }

    html.push('<div class="section">');
    html.push("<h3>Código DOT</h3>");
    html.push('<pre id="dot">' + safe + "</pre>");
    html.push(
      '<p><button id="open-online">Abrir en Graphviz Online</button> <button id="copy-dot">Copiar DOT</button></p>'
    );
    html.push("</div>");

    html.push("<script>");
    html.push(
      'document.getElementById("open-online").addEventListener("click",function(){var d=document.getElementById("dot").textContent||"";var url="https://dreampuf.github.io/GraphvizOnline/#"+encodeURIComponent(d);window.open(url,"_blank");});'
    );
    html.push(
      'document.getElementById("copy-dot").addEventListener("click",function(){var d=document.getElementById("dot").textContent||"";if(navigator.clipboard){navigator.clipboard.writeText(d);}else{var t=document.createElement("textarea");t.value=d;document.body.appendChild(t);t.select();document.execCommand("copy");t.remove();}});'
    );
    html.push("</script>");
    html.push("</body>");
    html.push("</html>");

    const out = path.join(this.outputDir, "graphviz_visualizador.html");
    fs.writeFileSync(out, html.join("\n"), "utf8");
    return out;
  }

  getOutputDirectory() {
    return this.outputDir;
  }

  escapeHtml(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  _escapeDotLabel(s) {
    if (!s) return "";
    return String(s).replace(/"/g, "").replace(/\n/g, "\\n");
  }
}

function hashString(str) {
  var h = 0;
  if (!str) return h;
  for (var i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return h;
}

module.exports = GraphvizGenerator;
