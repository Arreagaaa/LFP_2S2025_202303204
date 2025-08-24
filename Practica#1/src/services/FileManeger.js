const fs = require("fs");
const path = require("path");
const Operador = require("../models/Operador");
const Cliente = require("../models/Cliente");
const Llamada = require("../models/Llamada");

class FileManager {
  static cargarArchivo(path) {
    const contenido = fs.readFileSync(path, "utf-8").trim().split("\n");
    const llamadas = [];

    for (let linea of contenido) {
      const [idOperador, nombreOperador, estrellas, idCliente, nombreCliente] =
        linea.split(",");
      const operador = new Operador(
        parseInt(idOperador),
        nombreOperador.trim()
      );
      const cliente = new Cliente(parseInt(idCliente), nombreCliente.trim());
      const estrellasNum = estrellas.split("x").length - 1;
      llamadas.push(new Llamada(operador, cliente, estrellasNum));
    }

    return llamadas;
  }
}

module.exports = FileManager;
