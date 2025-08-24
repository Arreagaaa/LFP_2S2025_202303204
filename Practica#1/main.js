const FileManager = require("./src/services/FileManeger");
const CallCenter = require("./src/services/CallCenter");
const mostrarMenu = require("./src/utils/menu");
const HtmlExporter = require("./src/services/HtmlExporter");

const callCenter = new CallCenter();

function main() {
  mostrarMenu([
    "Cargar registros de llamadas",
    "Mostrar historial",
    "Mostrar porcentaje de valoraciones",
    "Mostrar cantidad de llamadas por estrellas",
    "Mostrar listado de operadores",
    "Mostrar listado de clientes",
    "Mostrar rendimiento de un operador",
    "Mostrar operador con mejor valoración",
    "Salir",
  ]).then((opcion) => {
    switch (opcion) {
      case 1:
        const llamadas = FileManager.cargarArchivo("./src/data/llamadas.csv");
        callCenter.cargarLlamadas(llamadas);
        console.log("Registros cargados exitosamente.");
        break;
      case 2:
        const historial = callCenter.listarHistorial();
        console.table(historial);
        HtmlExporter.exportarHistorial(historial);
        break;
      case 3:
        console.table(callCenter.contarValoraciones());
        break;
      case 4:
        console.table(callCenter.llamadasPorEstrellas());
        break;
      case 5:
        const operadores = callCenter.listadoOperadores();
        console.table(operadores);
        HtmlExporter.exportarOperadores(operadores);
        break;
      case 6:
        const clientes = callCenter.listadoClientes();
        console.table(clientes);
        HtmlExporter.exportarClientes(clientes);
        break;
      case 7:
        mostrarMenu(
          callCenter.listadoOperadores().map((op, i) => `${op}`),
          "=== SELECCIONE UN OPERADOR ==="
        ).then((indice) => {
          const operadores = callCenter.listadoOperadores();
          const operador = operadores[indice - 1];
          if (operador) {
            const rendimiento = callCenter.rendimientoOperador(operador);
            console.log(rendimiento);
            HtmlExporter.exportarRendimiento([rendimiento]);
          } else {
            console.log("Operador no encontrado.");
          }
          main();
        });
        return;
      case 8:
        const mejor = callCenter.operadorConMejorValoracion();
        if (mejor.operador) {
          console.log(
            `El operador con mejor valoración es ${
              mejor.operador
            } con un promedio de ${mejor.promedio.toFixed(2)} estrellas.`
          );
        } else {
          console.log("No hay llamadas registradas.");
        }
        break;
      case 9:
        console.log("Saliendo...");
        return;
      default:
        console.log("Opción no válida.");
    }
    main();
  });
}

main();
