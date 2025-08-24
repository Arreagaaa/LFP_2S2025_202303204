const FileManager = require("./src/services/FileManeger");
const CallCenter = require("./src/services/CallCenter");
const mostrarMenu = require("./src/utils/menu");

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
        console.table(callCenter.listarHistorial());
        break;
      case 3:
        console.table(callCenter.contarValoraciones());
        break;
      case 4:
        console.table(callCenter.llamadasPorEstrellas());
        break;
      case 5:
        console.table(callCenter.listadoOperadores());
        break;
      case 6:
        console.table(callCenter.listadoClientes());
        break;
      case 7:
        mostrarMenu(
          callCenter.listadoOperadores().map((op, i) => `${op}`),
          "=== SELECCIONE UN OPERADOR ==="
        ).then((indice) => {
          const operadores = callCenter.listadoOperadores();
          const operador = operadores[indice - 1];
          if (operador) {
            console.log(callCenter.rendimientoOperador(operador));
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
