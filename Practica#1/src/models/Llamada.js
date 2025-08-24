class Llamada {
  constructor(operador, cliente, estrellas) {
    this.operador = operador;
    this.cliente = cliente;
    this.estrellas = estrellas;
  }

  valoracion() {
    if (this.estrellas === 4 || this.estrellas === 5) {
      return "Buena";
    } else if (this.estrellas === 2 || this.estrellas === 3) {
      return "Media";
    } else {
      return "Mala";
    }
  }
}

module.exports = Llamada;
