const readline = require("readline");

function mostrarMenu(opciones, titulo = "=== MENÚ PRINCIPAL ===") {
  return new Promise((resolve) => {
    console.log(`\n${titulo}`);
    opciones.forEach((opt, i) => console.log(`${i + 1}. ${opt}`));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("\nElige una opción: ", (resp) => {
      rl.close();
      resolve(parseInt(resp));
    });
  });
}

module.exports = mostrarMenu;
