const fs = require("fs");
const path = require("path");

class HtmlExporter {
  static generarTabla(datos, columnas, titulo, nombreArchivo) {
    let html = `
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${titulo}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; }
        table { width: 80%; margin: auto; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
        th { background-color: #f4f4f4; }
      </style>
    </head>
    <body>
      <h1>${titulo}</h1>
      <table>
        <thead>
          <tr>${columnas.map((c) => `<th>${c}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${datos
            .map(
              (fila) => `
            <tr>${columnas.map((c) => `<td>${fila[c]}</td>`).join("")}</tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </body>
    </html>
        `;

    const outputDir = path.join(__dirname, "../output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    fs.writeFileSync(path.join(outputDir, nombreArchivo), html, "utf-8");
    console.log(`Archivo ${nombreArchivo} generado en la carpeta output.`);
  }

  static exportarHistorial(historial) {
    this.generarTabla(
      historial,
      ["operador", "cliente", "estrellas", "valoracion"],
      "Historial de Llamadas",
      "historial.html"
    );
  }

  static exportarOperadores(operadores) {
    this.generarTabla(
      operadores,
      ["id", "nombre"],
      "Listado de Operadores",
      "operadores.html"
    );
  }

  static exportarClientes(clientes) {
    this.generarTabla(
      clientes,
      ["id", "nombre"],
      "Listado de Clientes",
      "clientes.html"
    );
  }

  static exportarRendimiento(rendimientos) {
    this.generarTabla(
      rendimientos,
      ["operador", "llamadasAtendidas", "porcentajeAtencion"],
      "Rendimiento de Operadores",
      "rendimiento.html"
    );
  }
}

module.exports = HtmlExporter;
