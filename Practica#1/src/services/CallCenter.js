class CallCenter {
  constructor() {
    this.llamadas = [];
  }

  cargarLlamadas(llamadas) {
    this.llamadas.push(...llamadas);
  }

  listarHistorial() {
    return this.llamadas.map((l) => ({
      operador: l.operador.nombre,
      cliente: l.cliente.nombre,
      estrellas: l.estrellas,
      valoracion: l.valoracion(),
    }));
  }

  contarValoraciones() {
    let conteo = {};
    this.llamadas.forEach((l) => {
      const val = l.valoracion();
      conteo[val] = (conteo[val] || 0) + 1;
    });
    const total = this.llamadas.length;
    let resultado = {};
    for (let key in conteo) {
      resultado[key] =
        total === 0 ? "0.00%" : ((conteo[key] / total) * 100).toFixed(2) + "%";
    }
    return resultado;
  }

  llamadasPorEstrellas() {
    let conteo = {};
    this.llamadas.forEach((l) => {
      const key = "x".repeat(l.estrellas);
      conteo[key] = (conteo[key] || 0) + 1;
    });
    return conteo;
  }

  listadoOperadores() {
    const operadoresSet = new Set();
    this.llamadas.forEach((l) => operadoresSet.add(l.operador.nombre));
    return Array.from(operadoresSet);
  }

  listadoClientes() {
    const clientesSet = new Set();
    this.llamadas.forEach((l) => clientesSet.add(l.cliente.nombre));
    return Array.from(clientesSet);
  }

  rendimientoOperador(nombreOperador) {
    const totalLlamadas = this.llamadas.length;
    const llamadasAtendidas = this.llamadas.filter(
      (l) => l.operador.nombre === nombreOperador
    ).length;
    const porcentajeAtencion =
      totalLlamadas === 0 ? 0 : (llamadasAtendidas / totalLlamadas) * 100;
    return {
      operador: nombreOperador,
      llamadasAtendidas,
      porcentajeAtencion: porcentajeAtencion.toFixed(2) + "%",
    };
  }

  operadorConMejorValoracion() {
    const valoraciones = {};
    this.llamadas.forEach((l) => {
      if (!valoraciones[l.operador.id]) {
        valoraciones[l.operador.id] = {
          total: 0,
          conteo: 0,
          nombre: l.operador.nombre,
        };
      }
      valoraciones[l.operador.id].total += l.estrellas;
      valoraciones[l.operador.id].conteo++;
    });

    let mejorOperador = null;
    let mejorPromedio = 0;

    for (let id in valoraciones) {
      const promedio = valoraciones[id].total / valoraciones[id].conteo;
      if (promedio > mejorPromedio) {
        mejorPromedio = promedio;
        mejorOperador = valoraciones[id].nombre;
      }
    }

    return { operador: mejorOperador, promedio: mejorPromedio };
  }
}

module.exports = CallCenter;
