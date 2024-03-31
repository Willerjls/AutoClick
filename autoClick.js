const robot = require("robotjs");
const mouseEvents = require("global-mouse-events");
const prompt = require("prompt-sync")();

let tempo;
let intervalo;
let PosX;
let PosY;

async function autoClick() {
  async function time() {
    const T = prompt(`Digite por quanto segundos o autoClick ficara ativado: `);
    tempo = T;
  }

  async function interval() {
    const I = prompt(`Digite o intervalo entre os cliques: `);
    intervalo = I;
  }

  async function position() {
    return new Promise((resolve, reject) => {
      console.log("Clique onde você deseja que seja o autoClick: ");
      // Registre um ouvinte para o evento de clique do mouse
      mouseEvents.once("mouseup", (event) => {
        PosX = event.x;
        PosY = event.y;
        travarMouse = prompt(
          `Deseja travar o mouse nas posições definidas? (S/N): `
        );
        resolve();
      });
    });
  }

  async function confirm() {
    console.log(
      `O tempo foi definido para: \x1b[34m${tempo}s.\x1b[0m\nO intervalo entre cliques foi definido para: \x1b[34m${intervalo}.\x1b[0m\nPosições do mouse definidas para: \x1b[34mX${PosX}.\x1b[0m, \x1b[34mY${PosY}.\x1b[0m\nTravar mouse: \x1b[34m${
        travarMouse.toUpperCase() === "S" ? "SIM" : "NÃO"
      }.\x1b[0m`
    );
    const resposta = prompt(`Os valores estão corretos? (S/N): `);

    if (resposta === "s" || resposta === "S") {
      // Iniciar a execução do autoClick
      play();
    } else if (resposta === "n" || resposta === "N") {
      mostrarMenu();
    }
  }

  async function mostrarMenu() {
    console.log("Escolha qual opção deseja alterar");
    console.log("1. Tempo");
    console.log("2. Intervalo");
    console.log("3. Posição");
    console.log("4. Tudo");
    console.log("5. Confirmar e Executar");

    const opcao = prompt("Digite o número da opção desejada: ");
    switch (opcao) {
      case "1":
        await time();
        confirm();
        break;
      case "2":
        await interval();
        confirm();
        break;
      case "3":
        await position();
        confirm();
        break;
      case "4":
        autoClick();
        break;
      case "5":
        await confirm();
        break;
      default:
        console.log("Opção inválida. Tente novamente.");
        mostrarMenu();
    }
  }

  // Função para realizar cliques automáticos
  play = () => {
    if (travarMouse === "s" || travarMouse === "S") {
      // Define um intervalo para o clique automático
      setInterval(() => {
        robot.moveMouse(PosX, PosY); // Move o mouse para a coordenada

        robot.mouseClick(); // Simula um clique na posição atual do cursor
      }, intervalo);
    } else if (travarMouse === "n" || travarMouse === "N") {
      // Define um intervalo para o clique automático
      setInterval(() => {
        robot.mouseClick(); // Simula um clique na posição atual do cursor
      }, intervalo);
    } else {
      console.log("Opção inválida. Tente Novamente.");
      play();
    }
    // Temporizador
    setTimeout(() => {
      clearInterval(intervalo);
      process.exit(); // Termina a execução do programa
    }, tempo * 1000);
  };

  await time();
  await interval();
  await position();
  await confirm();
}

autoClick();
